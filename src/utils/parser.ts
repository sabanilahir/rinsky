import { Order, OrderItem, SnackMenuItem } from '../types/order';
import { matchSnackItem } from './matcher';

// Helper to format date "Selasa, 24 November" to "2026-11-24"
export function parseDateHeader(text: string, referenceYear = 2026): string | null {
  const monthMap: Record<string, string> = {
    januari: '01', jan: '01',
    februari: '02', feb: '02',
    maret: '03', mar: '03',
    april: '04', apr: '04',
    mei: '05', may: '05',
    juni: '06', jun: '06',
    juli: '07', jul: '07',
    agustus: '08', agu: '08', ags: '08',
    september: '09', sep: '09',
    oktober: '10', okt: '10',
    november: '11', nov: '11',
    desember: '12', des: '12'
  };

  const clean = text.toLowerCase();
  const dayMatch = clean.match(/(\d{1,2})\s+([a-z]+)/);
  if (dayMatch) {
    const day = dayMatch[1].padStart(2, '0');
    const monthStr = dayMatch[2];
    const month = monthMap[monthStr];
    if (month) {
      return `${referenceYear}-${month}-${day}`;
    }
  }
  return null;
}

// Normalize time: "jam 6" -> "06:00", "jam 6.30" -> "06:30", "jam 19" -> "19:00"
export function normalizeTime(raw: string): string {
  const clean = raw.toLowerCase().replace('jam', '').trim();
  const parts = clean.split(/[.:]/);
  let hours = parseInt(parts[0], 10);
  let minutes = parts[1] ? parseInt(parts[1], 10) : 0;

  if (isNaN(hours)) return '06:00';
  if (isNaN(minutes)) minutes = 0;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Normalize price text: "20k" -> 20000, "390k" -> 390000, "160.000" -> 160000
export function parsePriceText(raw: string): number {
  let clean = raw.toLowerCase().replace(/rp|\s|=/g, '').trim();
  if (clean.endsWith('k')) {
    const num = parseFloat(clean.replace('k', ''));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  clean = clean.replace(/\./g, '');
  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

export function parseRawOrdersText(
  rawText: string,
  pricelist: SnackMenuItem[],
  defaultDate = '2026-11-24'
): Order[] {
  const lines = rawText.split('\n').map(l => l.trim());
  const parsedOrders: Order[] = [];

  let currentDate = defaultDate;
  let currentOrder: Partial<Order> | null = null;
  let currentItems: OrderItem[] = [];
  let currentPackageGroup: string | undefined = undefined;
  let rawOrderBuffer: string[] = [];

  const finishCurrentOrder = () => {
    if (currentOrder && currentOrder.customerName) {
      // Calculate total item price
      const calculatedTotal = currentItems.reduce((acc, it) => acc + it.totalPrice, 0);
      const finalPrice = currentOrder.totalPrice && currentOrder.totalPrice > 0 
        ? currentOrder.totalPrice 
        : calculatedTotal;

      parsedOrders.push({
        id: `ord-${Date.now()}-${parsedOrders.length + 1}`,
        orderDate: currentOrder.orderDate || currentDate,
        deliveryTime: currentOrder.deliveryTime || '06:00',
        customerName: currentOrder.customerName,
        location: currentOrder.location || '-',
        items: [...currentItems],
        totalPrice: finalPrice,
        paymentStatus: currentOrder.paymentStatus || (currentOrder.totalPrice ? 'PAID' : 'UNPAID'),
        orderStatus: 'PENDING',
        notes: currentOrder.notes,
        rawText: rawOrderBuffer.join('\n'),
        createdAt: new Date().toISOString()
      });
    }
    currentOrder = null;
    currentItems = [];
    currentPackageGroup = undefined;
    rawOrderBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      // Empty line may end a package group or separate orders
      if (currentPackageGroup) {
        currentPackageGroup = undefined;
      }
      continue;
    }

    // Check if line is a Date Header (e.g. "Selasa, 24 November" or "Rabu, 25 November")
    const detectedDate = parseDateHeader(line);
    if (detectedDate) {
      finishCurrentOrder();
      currentDate = detectedDate;
      continue;
    }

    // Check if line is an Order Header e.g.:
    // "1.Diaz Al Amanah jam 6= 20k"
    // "2.Lutfiah Gis jam 11= 390k"
    // "1.Kiran panser jam 6.30"
    // "2.Rully jam 6"
    // "3.Yoland CGV jam 6.30=40k"
    const headerRegex = /^(\d+[\.\)]\s*)?([A-Za-z0-9\s]+?)\s+(jam\s*\d+(?:[\.:]\d+)?)(?:\s*=\s*([0-9\.,kK]+))?/i;
    const headerMatch = line.match(headerRegex);

    if (headerMatch) {
      finishCurrentOrder();
      rawOrderBuffer.push(line);

      const rawNameLoc = headerMatch[2].trim();
      const rawTime = headerMatch[3].trim();
      const rawPrice = headerMatch[4]?.trim();

      // Split name and location: first word is customer name, rest is location
      const nameParts = rawNameLoc.split(/\s+/);
      const customerName = nameParts[0] || 'Pelanggan';
      const location = nameParts.slice(1).join(' ') || '-';

      const deliveryTime = normalizeTime(rawTime);
      const totalPrice = rawPrice ? parsePriceText(rawPrice) : 0;

      currentOrder = {
        orderDate: currentDate,
        customerName,
        location,
        deliveryTime,
        totalPrice,
        paymentStatus: totalPrice > 0 ? 'PAID' : 'UNPAID'
      };
      continue;
    }

    if (!currentOrder) {
      // If we don't have an active order header yet, skip or treat as free text
      continue;
    }

    rawOrderBuffer.push(line);

    // Check package indicator line e.g. "1 dus" or "2 dus"
    const packageGroupMatch = line.match(/^(\d+\s*dus|snack\s*box|box)/i);
    if (packageGroupMatch) {
      currentPackageGroup = packageGroupMatch[0];
      continue;
    }

    // Check inline package e.g. "Kue nampan ( 15 martabak, 15 ketan srundeng)"
    const nampanMatch = line.match(/kue\s*nampan\s*\(\s*(.*?)\s*\)/i);
    if (nampanMatch) {
      const innerItems = nampanMatch[1].split(',');
      for (const rawSubItem of innerItems) {
        parseAndAddItem(rawSubItem.trim(), pricelist, currentItems, 'Kue nampan');
      }
      continue;
    }

    // Standard item line e.g. "Pastel 5", "Ragout 25", "Talam 20 klo buat", "Brownis milo 80"
    parseAndAddItem(line, pricelist, currentItems, currentPackageGroup);
  }

  finishCurrentOrder();
  return parsedOrders;
}

function parseAndAddItem(
  line: string,
  pricelist: SnackMenuItem[],
  itemsList: OrderItem[],
  packageGroup?: string
) {
  // Matches "Pastel 5" or "15 martabak" or "Talam 20 klo buat"
  // Format 1: [Text] [Number] [Optional Note] -> e.g. "Pastel 25" or "Talam 20 klo buat"
  // Format 2: [Number] [Text] -> e.g. "15 martabak"
  let itemName = '';
  let qty = 1;
  let customNote: string | undefined;

  const fmt1 = line.match(/^([A-Za-z\s]+?)\s+(\d+)(?:\s+(.*))?$/);
  const fmt2 = line.match(/^(\d+)\s+([A-Za-z\s]+)(?:\s+(.*))?$/);

  if (fmt1) {
    itemName = fmt1[1].trim();
    qty = parseInt(fmt1[2], 10);
    customNote = fmt1[3]?.trim();
  } else if (fmt2) {
    qty = parseInt(fmt2[1], 10);
    itemName = fmt2[2].trim();
    customNote = fmt2[3]?.trim();
  } else {
    // Just text
    itemName = line;
    qty = 1;
  }

  const { item, detectedNote } = matchSnackItem(itemName, pricelist);
  const finalName = item ? item.name : itemName;
  const unitPrice = item ? item.price : 4000;
  const note = customNote || detectedNote;

  itemsList.push({
    id: `item-${Date.now()}-${itemsList.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
    name: finalName,
    qty: isNaN(qty) ? 1 : qty,
    pricePerUnit: unitPrice,
    totalPrice: (isNaN(qty) ? 1 : qty) * unitPrice,
    packageGroup,
    note
  });
}
