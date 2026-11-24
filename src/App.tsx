import React, { useState, useEffect } from 'react';
import { 
  Order, 
  SnackMenuItem, 
  OrderStatus, 
  PaymentStatus 
} from './types/order';
import { 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredPricelist, 
  saveStoredPricelist, 
  resetAllData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DateSelector } from './components/DateSelector';
import { OrderCard } from './components/OrderCard';
import { KitchenView } from './components/KitchenView';
import { SmartPasteModal } from './components/SmartPasteModal';
import { NewOrderModal } from './components/NewOrderModal';
import { MenuPriceView } from './components/MenuPriceView';
import { InvoiceModal } from './components/InvoiceModal';
import { CalendarClock, Plus, Sparkles, ChefHat } from 'lucide-react';
import { formatDateIndo } from './utils/whatsapp';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pricelist, setPricelist] = useState<SnackMenuItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-24');
  const [activeTab, setActiveTab] = useState<'orders' | 'kitchen' | 'paste' | 'menu'>('orders');

  // Modals
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Initialize data from localStorage or fallback
  useEffect(() => {
    setOrders(getStoredOrders());
    setPricelist(getStoredPricelist());
  }, []);

  // Update storage whenever orders change
  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  const handleUpdatePricelist = (newList: SnackMenuItem[]) => {
    setPricelist(newList);
    saveStoredPricelist(newList);
  };

  const handleSaveOrder = (order: Order) => {
    const existingIdx = orders.findIndex(o => o.id === order.id);
    let updated: Order[];
    if (existingIdx >= 0) {
      updated = [...orders];
      updated[existingIdx] = order;
    } else {
      updated = [order, ...orders];
    }
    handleUpdateOrders(updated);
    setSelectedDate(order.orderDate);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Yakin ingin menghapus pesanan ini?')) {
      const updated = orders.filter(o => o.id !== orderId);
      handleUpdateOrders(updated);
      if (invoiceOrder?.id === orderId) {
        setInvoiceOrder(null);
      }
    }
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => (o.id === orderId ? { ...o, orderStatus: status } : o));
    handleUpdateOrders(updated);
  };

  const handleUpdatePayment = (orderId: string, payment: PaymentStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: payment,
          paidAmount: payment === 'PAID' ? o.totalPrice : payment === 'UNPAID' ? 0 : o.paidAmount,
          paidAt: payment === 'PAID' ? new Date().toISOString() : undefined
        };
      }
      return o;
    });
    handleUpdateOrders(updated);
    if (invoiceOrder?.id === orderId) {
      setInvoiceOrder(updated.find(o => o.id === orderId) || null);
    }
  };

  const handleDetailedPaymentUpdate = (
    orderId: string,
    status: PaymentStatus,
    paidAmount?: number,
    paymentMethod?: string
  ) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: status,
          paidAmount: status === 'PAID' ? o.totalPrice : status === 'UNPAID' ? 0 : paidAmount,
          paymentMethod,
          paidAt: status === 'PAID' ? new Date().toISOString() : undefined
        };
      }
      return o;
    });
    handleUpdateOrders(updated);
    if (invoiceOrder?.id === orderId) {
      setInvoiceOrder(updated.find(o => o.id === orderId) || null);
    }
  };

  const handleImportOrders = (newOrders: Order[]) => {
    const updated = [...newOrders, ...orders];
    handleUpdateOrders(updated);
    if (newOrders.length > 0) {
      setSelectedDate(newOrders[0].orderDate);
      setActiveTab('orders');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset semua data ke contoh awal 24 & 25 November?')) {
      resetAllData();
      setOrders(getStoredOrders());
      setPricelist(getStoredPricelist());
      setSelectedDate('2026-11-24');
    }
  };

  // Filter orders for the selected date, sorted by delivery time
  const dayOrders = orders
    .filter(o => o.orderDate === selectedDate)
    .sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

  const availableDates = Array.from(new Set(orders.map(o => o.orderDate)));

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile Screen Shell */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen flex flex-col shadow-xl relative border-x border-slate-200">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewOrder={() => {
            setEditingOrder(null);
            setIsNewOrderOpen(true);
          }}
          onOpenSmartPaste={() => setIsSmartPasteOpen(true)}
          onResetData={handleResetData}
          ordersCount={dayOrders.length}
        />

        {/* Date Selector bar (visible on 'orders' and 'kitchen' tabs) */}
        {(activeTab === 'orders' || activeTab === 'kitchen') && (
          <DateSelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            availableDates={availableDates}
          />
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {/* TAB 1: ORDERS TIMELINE */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Jadwal Pengiriman</h2>
                  <p className="text-[11px] text-slate-500">
                    {dayOrders.length} pesanan pada {formatDateIndo(selectedDate)}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('kitchen')}
                  className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold active:scale-95 transition-all"
                >
                  <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lihat Rekap Dapur</span>
                </button>
              </div>

              {dayOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 mt-2">
                  <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">Tidak ada jadwal pesanan</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Belum ada pesanan untuk tanggal ini
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setIsSmartPasteOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Paste WA</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingOrder(null);
                        setIsNewOrderOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Manual</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onUpdatePayment={handleUpdatePayment}
                      onDelete={handleDeleteOrder}
                      onEdit={order => {
                        setEditingOrder(order);
                        setIsNewOrderOpen(true);
                      }}
                      onOpenInvoice={order => setInvoiceOrder(order)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KITCHEN SUMMARY */}
          {activeTab === 'kitchen' && (
            <KitchenView selectedDate={selectedDate} orders={dayOrders} />
          )}

          {/* TAB 3: SMART PASTE TAB */}
          {activeTab === 'paste' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Pencatat Kilat (Smart Paste)</h2>
                <p className="text-xs text-slate-500">
                  Salin teks pesanan dari WhatsApp / grup chat, lalu tempel untuk diproses otomatis.
                </p>
              </div>

              <button
                onClick={() => setIsSmartPasteOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold p-3.5 rounded-xl text-xs shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buka Kolom Paste Teks</span>
              </button>

              <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                <span className="font-bold text-amber-900 block">💡 Format yang Didukung:</span>
                <p className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-amber-100">
                  Selasa, 24 November<br />
                  1.Diaz Al Amanah jam 6= 20k<br />
                  Pastel 5<br />
                  <br />
                  2.Lutfiah Gis jam 11= 390k<br />
                  Pastel 25<br />
                  Ragout 25<br />
                  Lemper 25<br />
                  Martabak mix 25
                </p>
                <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-1">
                  <li>Nama kue singkatan (contoh: <i>sosol</i>, <i>mercon</i>, <i>ragout</i>) otomatis dicocokkan ke daftar menu resmi.</li>
                  <li>Paket seperti <i>Kue nampan (...)</i> dan <i>1 dus</i> otomatis dihitung ke rekap dapur.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: PRICELIST & OMSET */}
          {activeTab === 'menu' && (
            <MenuPriceView
              pricelist={pricelist}
              onUpdatePricelist={handleUpdatePricelist}
              orders={orders}
              selectedDate={selectedDate}
            />
          )}
        </main>

        {/* Modals */}
        <SmartPasteModal
          isOpen={isSmartPasteOpen}
          onClose={() => setIsSmartPasteOpen(false)}
          onImportOrders={handleImportOrders}
          pricelist={pricelist}
          currentDate={selectedDate}
        />

        <NewOrderModal
          isOpen={isNewOrderOpen}
          onClose={() => {
            setIsNewOrderOpen(false);
            setEditingOrder(null);
          }}
          onSaveOrder={handleSaveOrder}
          editOrder={editingOrder}
          defaultDate={selectedDate}
          pricelist={pricelist}
        />

        {/* Invoice Modal */}
        <InvoiceModal
          order={invoiceOrder}
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
          onUpdatePayment={handleDetailedPaymentUpdate}
        />
      </div>
    </div>
  );
};

export default App;
