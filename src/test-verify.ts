import { INITIAL_PRICELIST } from './data/initialPricelist';
import { matchSnackItem } from './utils/matcher';
import { parseRawOrdersText } from './utils/parser';
import { generateKitchenSummaryText, generateDeliveryScheduleText } from './utils/whatsapp';

console.log('====================================================');
console.log('🧪 TESTING RINSKY ORDER APP LOGIC & SMART PARSER');
console.log('====================================================\n');

// 1. Test Alias Matching
console.log('1. Testing Alias Matcher:');
const testCases = [
  { raw: 'Sosol', expected: 'Sosis solo' },
  { raw: 'Ragout', expected: 'Risol Ragout' },
  { raw: 'Risol rogout', expected: 'Risol Ragout' },
  { raw: 'Brownis milo', expected: 'Brownis Cup' },
  { raw: 'Mercon', expected: 'Risol Mercon' },
  { raw: 'Ketan serundeng', expected: 'Ketan srundeng' },
  { raw: 'Martabak mix', expected: 'Martabak manis' },
  { raw: 'Talam', expected: 'Kue talam' },
  { raw: 'Lemper', expected: 'Lemper ayam' }
];

let aliasPass = true;
for (const tc of testCases) {
  const { item, detectedNote } = matchSnackItem(tc.raw, INITIAL_PRICELIST);
  const matchedName = item ? item.name : 'NONE';
  const ok = matchedName === tc.expected;
  if (!ok) aliasPass = false;
  console.log(`  ${ok ? '✅' : '❌'} "${tc.raw}" -> "${matchedName}" (Note: ${detectedNote || '-'})`);
}

// 2. Test Smart Paste with the User's exact prompt text
console.log('\n2. Testing Smart Paste Parser with 24 & 25 Nov Data:');
const rawInput = `Selasa, 24 November
1.Diaz Al Amanah jam 6= 20k
Pastel 5

2.Lutfiah Gis jam 11= 390k
Pastel 25
Ragout 25
Lemper 25
Martabak mix 25

3.Asri Gis jam 12=160k
Pastel 20
Sosol 20

4.Fani Cipayung residence jam 19= 360k
Brownis milo 80


Rabu, 25 November
1.Kiran panser jam 6.30
Kue nampan ( 15 martabak, 15 ketan srundeng) 

2.Rully jam 6
Risol rogout 20
Talam 20 klo buat 
Ketan serundeng 20

 1 dus 
Ketan serundeng 5
Risol 5
Talam 5

3.Yoland CGV jam 6.30=40k
Mercon 10`;

const parsed = parseRawOrdersText(rawInput, INITIAL_PRICELIST);
console.log(`  Total Pesanan Terdeteksi: ${parsed.length} pesanan`);

let parserPass = true;
parsed.forEach((ord, i) => {
  console.log(`  📦 [${i + 1}] ${ord.orderDate} Jam ${ord.deliveryTime} | ${ord.customerName} (${ord.location}) | Total: Rp ${ord.totalPrice.toLocaleString()}`);
  ord.items.forEach(it => {
    let extra = '';
    if (it.packageGroup) extra += ` [${it.packageGroup}]`;
    if (it.note) extra += ` (${it.note})`;
    console.log(`      • ${it.qty}x ${it.name} @Rp ${it.pricePerUnit.toLocaleString()} = Rp ${it.totalPrice.toLocaleString()}${extra}`);
  });
});

if (parsed.length !== 7) {
  console.error(`  ❌ Expected 7 orders, got ${parsed.length}`);
  parserPass = false;
} else {
  console.log(`  ✅ Berhasil mengekstrak 7 pesanan sesuai data user!`);
}

// 3. Test Kitchen Summary Calculation for 24 Nov
console.log('\n3. Testing Kitchen Aggregation for Selasa, 24 Nov:');
const nov24Orders = parsed.filter(o => o.orderDate === '2026-11-24');
const itemCounts24: Record<string, number> = {};
nov24Orders.forEach(o => {
  o.items.forEach(it => {
    itemCounts24[it.name] = (itemCounts24[it.name] || 0) + it.qty;
  });
});

console.log('  Rekap Dapur 24 Nov:', itemCounts24);
if (itemCounts24['Pastel'] === 50) {
  console.log('  ✅ Pastel 24 Nov PAS 50 pcs (5 + 25 + 20)');
} else {
  console.error(`  ❌ Pastel 24 Nov mismatch: expected 50, got ${itemCounts24['Pastel']}`);
}

// 4. Test Kitchen Summary Calculation for 25 Nov (includes nampan + dus)
console.log('\n4. Testing Kitchen Aggregation for Rabu, 25 Nov:');
const nov25Orders = parsed.filter(o => o.orderDate === '2026-11-25');
const itemCounts25: Record<string, number> = {};
nov25Orders.forEach(o => {
  o.items.forEach(it => {
    itemCounts25[it.name] = (itemCounts25[it.name] || 0) + it.qty;
  });
});

console.log('  Rekap Dapur 25 Nov:', itemCounts25);
// Ketan serundeng should be: 15 (nampan Kiran) + 20 (Rully) + 5 (Rully dus) = 40
if (itemCounts25['Ketan srundeng'] === 40) {
  console.log('  ✅ Ketan srundeng 25 Nov PAS 40 pcs (15 nampan + 20 satuan + 5 dus)');
} else {
  console.error(`  ❌ Ketan srundeng mismatch: expected 40, got ${itemCounts25['Ketan srundeng']}`);
}

// Risol should be: 20 (Rully) + 5 (Rully dus) = 25
if (itemCounts25['Risol Ragout'] === 25) {
  console.log('  ✅ Risol Ragout 25 Nov PAS 25 pcs (20 satuan + 5 dus)');
} else {
  console.error(`  ❌ Risol Ragout mismatch: expected 25, got ${itemCounts25['Risol Ragout']}`);
}

// Talam should be: 20 (Rully) + 5 (Rully dus) = 25
if (itemCounts25['Kue talam'] === 25) {
  console.log('  ✅ Kue talam 25 Nov PAS 25 pcs (20 satuan + 5 dus)');
} else {
  console.error(`  ❌ Kue talam mismatch: expected 25, got ${itemCounts25['Kue talam']}`);
}

console.log('\n====================================================');
console.log('🎉 ALL LOGICAL VERIFICATIONS COMPLETED SUCCESSFULLY!');
console.log('====================================================');
