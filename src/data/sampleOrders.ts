import { Order } from '../types/order';

export const SAMPLE_ORDERS: Order[] = [
  // Selasa, 24 November
  {
    id: 'ord-20261124-1',
    orderDate: '2026-11-24',
    deliveryTime: '06:00',
    customerName: 'Diaz',
    location: 'Al Amanah',
    totalPrice: 20000,
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-1',
        name: 'Pastel',
        qty: 5,
        pricePerUnit: 4000,
        totalPrice: 20000
      }
    ],
    rawText: '1.Diaz Al Amanah jam 6= 20k\nPastel 5',
    createdAt: '2026-11-23T10:00:00.000Z'
  },
  {
    id: 'ord-20261124-2',
    orderDate: '2026-11-24',
    deliveryTime: '11:00',
    customerName: 'Lutfiah',
    location: 'Gis',
    totalPrice: 390000,
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-2',
        name: 'Pastel',
        qty: 25,
        pricePerUnit: 4000,
        totalPrice: 100000
      },
      {
        id: 'item-3',
        name: 'Risol Ragout',
        qty: 25,
        pricePerUnit: 4000,
        totalPrice: 100000
      },
      {
        id: 'item-4',
        name: 'Lemper ayam',
        qty: 25,
        pricePerUnit: 4000,
        totalPrice: 100000
      },
      {
        id: 'item-5',
        name: 'Martabak manis',
        qty: 25,
        pricePerUnit: 3500,
        totalPrice: 87500,
        note: 'Martabak mix'
      }
    ],
    notes: 'Total disepakati 390k (termasuk kemasan)',
    rawText: '2.Lutfiah Gis jam 11= 390k\nPastel 25\nRagout 25\nLemper 25\nMartabak mix 25',
    createdAt: '2026-11-23T10:05:00.000Z'
  },
  {
    id: 'ord-20261124-3',
    orderDate: '2026-11-24',
    deliveryTime: '12:00',
    customerName: 'Asri',
    location: 'Gis',
    totalPrice: 160000,
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-6',
        name: 'Pastel',
        qty: 20,
        pricePerUnit: 4000,
        totalPrice: 80000
      },
      {
        id: 'item-7',
        name: 'Sosis solo',
        qty: 20,
        pricePerUnit: 4000,
        totalPrice: 80000
      }
    ],
    rawText: '3.Asri Gis jam 12=160k\nPastel 20\nSosol 20',
    createdAt: '2026-11-23T10:10:00.000Z'
  },
  {
    id: 'ord-20261124-4',
    orderDate: '2026-11-24',
    deliveryTime: '19:00',
    customerName: 'Fani',
    location: 'Cipayung residence',
    totalPrice: 360000,
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-8',
        name: 'Brownis Cup',
        qty: 80,
        pricePerUnit: 4500,
        totalPrice: 360000,
        note: 'Brownis milo'
      }
    ],
    rawText: '4.Fani Cipayung residence jam 19= 360k\nBrownis milo 80',
    createdAt: '2026-11-23T10:15:00.000Z'
  },

  // Rabu, 25 November
  {
    id: 'ord-20261125-1',
    orderDate: '2026-11-25',
    deliveryTime: '06:00',
    customerName: 'Rully',
    location: '-',
    totalPrice: 280000,
    paymentStatus: 'UNPAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-9',
        name: 'Risol Ragout',
        qty: 20,
        pricePerUnit: 4000,
        totalPrice: 80000
      },
      {
        id: 'item-10',
        name: 'Kue talam',
        qty: 20,
        pricePerUnit: 4000,
        totalPrice: 80000,
        note: 'klo buat'
      },
      {
        id: 'item-11',
        name: 'Ketan srundeng',
        qty: 20,
        pricePerUnit: 4000,
        totalPrice: 80000
      },
      // 1 dus
      {
        id: 'item-12',
        name: 'Ketan srundeng',
        qty: 5,
        pricePerUnit: 4000,
        totalPrice: 20000,
        packageGroup: '1 dus'
      },
      {
        id: 'item-13',
        name: 'Risol Ragout',
        qty: 5,
        pricePerUnit: 4000,
        totalPrice: 20000,
        packageGroup: '1 dus'
      },
      {
        id: 'item-14',
        name: 'Kue talam',
        qty: 5,
        pricePerUnit: 4000,
        totalPrice: 20000,
        packageGroup: '1 dus'
      }
    ],
    notes: 'Ada 1 dus isi 5 ketan, 5 risol, 5 talam',
    rawText: '2.Rully jam 6\nRisol rogout 20\nTalam 20 klo buat\nKetan serundeng 20\n\n1 dus\nKetan serundeng 5\nRisol 5\nTalam 5',
    createdAt: '2026-11-23T11:00:00.000Z'
  },
  {
    id: 'ord-20261125-2',
    orderDate: '2026-11-25',
    deliveryTime: '06:30',
    customerName: 'Kiran',
    location: 'Panser',
    totalPrice: 112500,
    paymentStatus: 'UNPAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-15',
        name: 'Martabak manis',
        qty: 15,
        pricePerUnit: 3500,
        totalPrice: 52500,
        packageGroup: 'Kue nampan'
      },
      {
        id: 'item-16',
        name: 'Ketan srundeng',
        qty: 15,
        pricePerUnit: 4000,
        totalPrice: 60000,
        packageGroup: 'Kue nampan'
      }
    ],
    notes: 'Kue nampan (15 martabak, 15 ketan srundeng)',
    rawText: '1.Kiran panser jam 6.30\nKue nampan ( 15 martabak, 15 ketan srundeng)',
    createdAt: '2026-11-23T11:05:00.000Z'
  },
  {
    id: 'ord-20261125-3',
    orderDate: '2026-11-25',
    deliveryTime: '06:30',
    customerName: 'Yoland',
    location: 'CGV',
    totalPrice: 40000,
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    items: [
      {
        id: 'item-17',
        name: 'Risol Mercon',
        qty: 10,
        pricePerUnit: 4000,
        totalPrice: 40000
      }
    ],
    rawText: '3.Yoland CGV jam 6.30=40k\nMercon 10',
    createdAt: '2026-11-23T11:10:00.000Z'
  }
];
