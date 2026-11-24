import { Order, KitchenItemBreakdown } from '../types/order';

export function formatRupiah(amount: number): string {
  return 'Rp ' + (amount || 0).toLocaleString('id-ID');
}

export function formatDateIndo(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = months[parseInt(m, 10) - 1] || m;
    const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[dateObj.getDay()];
    return `${dayName}, ${parseInt(d, 10)} ${monthName} ${y}`;
  } catch (e) {
    return dateStr;
  }
}

export function getInvoiceNumber(order: Order): string {
  if (order.invoiceNumber) return order.invoiceNumber;
  const cleanDate = (order.orderDate || '2026-11-24').replace(/-/g, '').slice(2);
  const suffix = (order.id || '001').replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase() || '001';
  return `INV/${cleanDate}/RSK-${suffix}`;
}

// 1. WhatsApp Text for Kitchen Summary
export function generateKitchenSummaryText(
  dateStr: string,
  breakdown: KitchenItemBreakdown[]
): string {
  const formattedDate = formatDateIndo(dateStr);
  let text = `*👨‍🍳 REKAP PRODUKSI DAPUR @rinsky_id*\n`;
  text += `📅 *${formattedDate}*\n`;
  text += `───────────────────\n`;
  text += `*TOTAL KUE HARUS DIBUAT:*\n\n`;

  let totalAllPieces = 0;
  breakdown.forEach((item, idx) => {
    totalAllPieces += item.totalQty;
    text += `${idx + 1}. *${item.name}*: ${item.totalQty} pcs\n`;
    item.orders.forEach(ord => {
      let sub = `   • Jam ${ord.time} - ${ord.customerName} (${ord.qty} pcs)`;
      if (ord.packageGroup) sub += ` [${ord.packageGroup}]`;
      if (ord.note) sub += ` (${ord.note})`;
      text += `${sub}\n`;
    });
    text += `\n`;
  });

  text += `───────────────────\n`;
  text += `*Total Seluruh Kue:* ${totalAllPieces} pcs\n`;
  text += `Semangat produksi! ✨`;
  return text;
}

// 2. WhatsApp Text for Delivery Schedule
export function generateDeliveryScheduleText(
  dateStr: string,
  orders: Order[]
): string {
  const formattedDate = formatDateIndo(dateStr);
  const sorted = [...orders].sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

  let text = `*🛵 JADWAL PENGIRIMAN @rinsky_id*\n`;
  text += `📅 *${formattedDate}*\n`;
  text += `───────────────────\n\n`;

  sorted.forEach((ord, i) => {
    const payStatus = ord.paymentStatus === 'PAID' 
      ? '✅ Lunas' 
      : ord.paymentStatus === 'DP' 
      ? `🟡 DP (${formatRupiah(ord.paidAmount || 0)})` 
      : '🔴 Belum Bayar';

    text += `${i + 1}. *⏰ Jam ${ord.deliveryTime}* - *${ord.customerName}*\n`;
    text += `   📍 Lokasi: ${ord.location}\n`;
    ord.items.forEach(it => {
      let line = `   • ${it.qty}x ${it.name}`;
      if (it.packageGroup) line += ` [${it.packageGroup}]`;
      if (it.note) line += ` (${it.note})`;
      text += `${line}\n`;
    });
    text += `   💰 Total: ${formatRupiah(ord.totalPrice)} [${payStatus}]\n`;
    if (ord.notes) text += `   📝 Ket: ${ord.notes}\n`;
    text += `\n`;
  });

  text += `───────────────────\n`;
  text += `Total Pesanan: ${sorted.length} pengiriman\n`;
  return text;
}

// 3. WhatsApp Text for Official Customer Invoice / Nota
export function generateCustomerReceiptText(order: Order): string {
  const formattedDate = formatDateIndo(order.orderDate);
  const invNumber = getInvoiceNumber(order);
  
  let payBadge = '🔴 BELUM DIBAYAR';
  let payDetail = '';
  
  if (order.paymentStatus === 'PAID') {
    payBadge = '🟢 SUDAH LUNAS ✅';
    if (order.paymentMethod) payDetail = `Metode Pembayaran: ${order.paymentMethod}\n`;
  } else if (order.paymentStatus === 'DP') {
    const dp = order.paidAmount || 0;
    const remaining = Math.max(0, order.totalPrice - dp);
    payBadge = '🟡 UANG MUKA (DP)';
    payDetail = `Sudah Dibayar (DP): ${formatRupiah(dp)}\nSisa Tagihan Pelunasan: *${formatRupiah(remaining)}*\n`;
  } else {
    payDetail = `Mohon konfirmasi jika sudah melakukan pembayaran ya Kak.\n`;
  }

  let text = `*FAKTUR / INVOICE RESMI @rinsky_id*\n`;
  text += `No. Faktur: *${invNumber}*\n`;
  text += `───────────────────\n\n`;
  text += `Kepada: *${order.customerName}*\n`;
  text += `📅 Tanggal Acara: ${formattedDate}\n`;
  text += `⏰ Waktu Kirim/Ambil: ${order.deliveryTime} WIB\n`;
  text += `📍 Lokasi/Alamat: ${order.location}\n\n`;
  text += `*Rincian Pesanan:*\n`;

  order.items.forEach((it, idx) => {
    let line = `${idx + 1}. ${it.name}`;
    if (it.packageGroup) line += ` [${it.packageGroup}]`;
    if (it.note) line += ` (${it.note})`;
    line += `\n   ${it.qty} pcs x ${formatRupiah(it.pricePerUnit)} = ${formatRupiah(it.totalPrice)}`;
    text += `${line}\n`;
  });

  text += `───────────────────\n`;
  text += `*TOTAL TAGIHAN: ${formatRupiah(order.totalPrice)}*\n`;
  text += `*STATUS: ${payBadge}*\n`;
  if (payDetail) text += `${payDetail}`;
  if (order.notes) text += `Catatan: ${order.notes}\n`;
  text += `───────────────────\n`;
  text += `Terima kasih atas kepercayaannya memesan di *@rinsky_id*! 🙏❤️\n`;
  text += `_Rinsky Snack & Cake_`;
  return text;
}

// Open WhatsApp
export function openWhatsApp(text: string, phone = ''): void {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const target = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const url = target
    ? `https://wa.me/${target}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
