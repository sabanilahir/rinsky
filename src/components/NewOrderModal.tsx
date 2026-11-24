import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  MapPin, 
  User, 
  Tag, 
  ShoppingBag 
} from 'lucide-react';
import { Order, OrderItem, PaymentStatus, OrderStatus, SnackMenuItem, SnackCategory } from '../types/order';
import { formatRupiah } from '../utils/whatsapp';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (order: Order) => void;
  editOrder?: Order | null;
  defaultDate: string;
  pricelist: SnackMenuItem[];
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSaveOrder,
  editOrder,
  defaultDate,
  pricelist
}) => {
  const [orderDate, setOrderDate] = useState(defaultDate);
  const [deliveryTime, setDeliveryTime] = useState('06:00');
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('UNPAID');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('PENDING');
  const [notes, setNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState<SnackCategory>('asin');

  useEffect(() => {
    if (editOrder) {
      setOrderDate(editOrder.orderDate);
      setDeliveryTime(editOrder.deliveryTime);
      setCustomerName(editOrder.customerName);
      setLocation(editOrder.location);
      setItems(editOrder.items);
      setTotalPrice(editOrder.totalPrice);
      setPaymentStatus(editOrder.paymentStatus);
      setOrderStatus(editOrder.orderStatus);
      setNotes(editOrder.notes || '');
    } else {
      setOrderDate(defaultDate);
      setDeliveryTime('06:00');
      setCustomerName('');
      setLocation('');
      setItems([]);
      setTotalPrice(0);
      setPaymentStatus('UNPAID');
      setOrderStatus('PENDING');
      setNotes('');
    }
  }, [editOrder, defaultDate, isOpen]);

  // Recalculate total if items change
  const calculatedTotal = items.reduce((acc, it) => acc + it.totalPrice, 0);

  const addItemFromMenu = (menuItem: SnackMenuItem) => {
    const existingIdx = items.findIndex(it => it.name === menuItem.name && !it.packageGroup);
    if (existingIdx >= 0) {
      const updated = [...items];
      updated[existingIdx].qty += 5;
      updated[existingIdx].totalPrice = updated[existingIdx].qty * updated[existingIdx].pricePerUnit;
      setItems(updated);
      setTotalPrice(updated.reduce((a, b) => a + b.totalPrice, 0));
    } else {
      const newItem: OrderItem = {
        id: `it-${Date.now()}-${items.length + 1}`,
        name: menuItem.name,
        qty: 5,
        pricePerUnit: menuItem.price,
        totalPrice: 5 * menuItem.price
      };
      const updated = [...items, newItem];
      setItems(updated);
      setTotalPrice(updated.reduce((a, b) => a + b.totalPrice, 0));
    }
  };

  const updateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      const updated = items.filter((_, idx) => idx !== index);
      setItems(updated);
      setTotalPrice(updated.reduce((a, b) => a + b.totalPrice, 0));
      return;
    }
    const updated = [...items];
    updated[index].qty = newQty;
    updated[index].totalPrice = newQty * updated[index].pricePerUnit;
    setItems(updated);
    setTotalPrice(updated.reduce((a, b) => a + b.totalPrice, 0));
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    setTotalPrice(updated.reduce((a, b) => a + b.totalPrice, 0));
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      alert('Mohon isi nama pemesan');
      return;
    }

    const orderToSave: Order = {
      id: editOrder ? editOrder.id : `ord-${Date.now()}`,
      orderDate,
      deliveryTime,
      customerName: customerName.trim(),
      location: location.trim() || '-',
      items,
      totalPrice: totalPrice > 0 ? totalPrice : calculatedTotal,
      paymentStatus,
      orderStatus,
      notes: notes.trim(),
      createdAt: editOrder ? editOrder.createdAt : new Date().toISOString()
    };

    onSaveOrder(orderToSave);
    onClose();
  };

  if (!isOpen) return null;

  const filteredPricelist = pricelist.filter(it => it.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-100 max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editOrder ? 'Edit Pesanan' : 'Tambah Pesanan Baru'}
              </h3>
              <p className="text-xs text-slate-500">Isi detail pesanan pelanggan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal</label>
              <input
                type="date"
                value={orderDate}
                onChange={e => setOrderDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Jam Kirim</label>
              <input
                type="text"
                placeholder="06:00"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-center"
              />
            </div>
          </div>

          {/* Nama & Lokasi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nama Pemesan</label>
              <input
                type="text"
                placeholder="misal: Diaz"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Lokasi / Alamat</label>
              <input
                type="text"
                placeholder="misal: Al Amanah"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Quick Menu Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Pilih Menu @rinsky_id (+5 pcs)</span>
              <div className="flex gap-1 text-[10px]">
                {(['asin', 'manis', 'tradisional'] as SnackCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 rounded-full capitalize font-semibold ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {filteredPricelist.map(snack => (
                <button
                  key={snack.id}
                  onClick={() => addItemFromMenu(snack)}
                  className="flex items-center gap-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 px-2 py-1 rounded-lg text-xs font-medium text-slate-800 transition-all active:scale-95"
                >
                  <Plus className="w-3 h-3 text-amber-600" />
                  <span>{snack.name}</span>
                  <span className="text-[10px] text-slate-400">@{formatRupiah(snack.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items Table */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Rincian Item Pesanan ({items.length})
            </span>

            {items.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-3 bg-slate-50 rounded-xl">
                Belum ada kue dipilih. Klik menu di atas.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{it.name}</div>
                      <div className="text-[10px] text-slate-400">@{formatRupiah(it.pricePerUnit)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateItemQty(idx, it.qty - 5)}
                          className="font-bold text-slate-500 hover:text-slate-800 px-1"
                        >
                          -5
                        </button>
                        <span className="font-mono font-bold text-amber-700 min-w-[28px] text-center">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => updateItemQty(idx, it.qty + 5)}
                          className="font-bold text-slate-500 hover:text-slate-800 px-1"
                        >
                          +5
                        </button>
                      </div>

                      <span className="font-mono font-semibold text-slate-700 min-w-[65px] text-right">
                        {formatRupiah(it.totalPrice)}
                      </span>

                      <button
                        onClick={() => removeItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Price & Payment Status */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Total Tagihan (Rp)
              </label>
              <input
                type="number"
                value={totalPrice}
                onChange={e => setTotalPrice(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
              <span className="text-[10px] text-slate-400">Kalkulasi: {formatRupiah(calculatedTotal)}</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Status Pembayaran</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="UNPAID">🔴 Belum Bayar</option>
                <option value="DP">🟡 DP (Uang Muka)</option>
                <option value="PAID">🟢 Lunas</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Catatan Khusus</label>
            <input
              type="text"
              placeholder="misal: 1 dus isi 5 ketan, risol, talam / cabe dipisah"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{editOrder ? 'Simpan Perubahan' : 'Buat Pesanan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
