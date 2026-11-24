import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  CheckCircle2, 
  Circle, 
  Share2, 
  Copy, 
  Check, 
  Truck,
  Sparkles 
} from 'lucide-react';
import { Order, KitchenItemBreakdown } from '../types/order';
import { 
  formatDateIndo, 
  generateKitchenSummaryText, 
  generateDeliveryScheduleText, 
  openWhatsApp 
} from '../utils/whatsapp';
import { getStoredKitchenChecks, saveStoredKitchenChecks } from '../utils/storage';

interface KitchenViewProps {
  selectedDate: string;
  orders: Order[];
}

export const KitchenView: React.FC<KitchenViewProps> = ({ selectedDate, orders }) => {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [copiedKitchen, setCopiedKitchen] = useState(false);
  const [copiedDelivery, setCopiedDelivery] = useState(false);

  useEffect(() => {
    setChecks(getStoredKitchenChecks(selectedDate));
  }, [selectedDate]);

  // Aggregate orders into KitchenItemBreakdown
  const itemMap: Record<string, KitchenItemBreakdown> = {};

  orders.forEach(ord => {
    ord.items.forEach(it => {
      const key = it.name;
      if (!itemMap[key]) {
        itemMap[key] = {
          name: it.name,
          totalQty: 0,
          completed: false,
          orders: []
        };
      }
      itemMap[key].totalQty += it.qty;
      itemMap[key].orders.push({
        orderId: ord.id,
        customerName: ord.customerName,
        time: ord.deliveryTime,
        location: ord.location,
        qty: it.qty,
        packageGroup: it.packageGroup,
        note: it.note
      });
    });
  });

  const breakdowns: KitchenItemBreakdown[] = Object.values(itemMap).sort(
    (a, b) => b.totalQty - a.totalQty
  );

  const totalAllPieces = breakdowns.reduce((acc, curr) => acc + curr.totalQty, 0);
  const completedCount = breakdowns.filter(b => !!checks[b.name]).length;

  const toggleCheck = (name: string) => {
    const updated = { ...checks, [name]: !checks[name] };
    setChecks(updated);
    saveStoredKitchenChecks(selectedDate, updated);
  };

  const handleShareKitchenWA = () => {
    const text = generateKitchenSummaryText(selectedDate, breakdowns);
    openWhatsApp(text);
  };

  const handleCopyKitchen = () => {
    const text = generateKitchenSummaryText(selectedDate, breakdowns);
    navigator.clipboard.writeText(text);
    setCopiedKitchen(true);
    setTimeout(() => setCopiedKitchen(false), 2000);
  };

  const handleShareDeliveryWA = () => {
    const text = generateDeliveryScheduleText(selectedDate, orders);
    openWhatsApp(text);
  };

  const handleCopyDelivery = () => {
    const text = generateDeliveryScheduleText(selectedDate, orders);
    navigator.clipboard.writeText(text);
    setCopiedDelivery(true);
    setTimeout(() => setCopiedDelivery(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Rekap Produksi Dapur</h2>
              <p className="text-amber-100 text-xs">{formatDateIndo(selectedDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">{totalAllPieces}</span>
            <span className="text-xs text-amber-100 block">Total Pcs Kue</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="flex justify-between text-xs text-amber-100 mb-1">
            <span>Progress Masak / Siap</span>
            <span>{completedCount} dari {breakdowns.length} jenis selesai</span>
          </div>
          <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${breakdowns.length > 0 ? (completedCount / breakdowns.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleShareKitchenWA}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Kirim Rekap ke WA Dapur</span>
        </button>

        <button
          onClick={handleShareDeliveryWA}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Kirim Jadwal ke Kurir</span>
        </button>
      </div>

      {/* Copy Buttons */}
      <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
        <button
          onClick={handleCopyKitchen}
          className="flex items-center gap-1 hover:text-slate-800"
        >
          {copiedKitchen ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKitchen ? 'Tersalin' : 'Salin Rekap'}</span>
        </button>
        <span>•</span>
        <button
          onClick={handleCopyDelivery}
          className="flex items-center gap-1 hover:text-slate-800"
        >
          {copiedDelivery ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedDelivery ? 'Tersalin' : 'Salin Jadwal Kurir'}</span>
        </button>
      </div>

      {/* Items Breakdown List */}
      {breakdowns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
          <ChefHat className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600">Belum ada pesanan pada tanggal ini</p>
          <p className="text-xs text-slate-400 mt-1">Gunakan Smart Paste atau klik tombol Tambah di atas</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {breakdowns.map((item, idx) => {
            const isDone = !!checks[item.name];

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50/30 opacity-75' 
                    : 'border-slate-200 hover:border-amber-300 shadow-xs'
                } p-3.5`}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleCheck(item.name)}
                    className="flex items-center gap-2.5 text-left flex-1"
                  >
                    <div className="text-emerald-600 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.orders.length} pesanan customer
                      </p>
                    </div>
                  </button>

                  <div className="text-right">
                    <span className="inline-block bg-amber-100 text-amber-900 font-extrabold text-base px-2.5 py-0.5 rounded-xl font-mono">
                      {item.totalQty} <span className="text-xs font-normal">pcs</span>
                    </span>
                  </div>
                </div>

                {/* Sub breakdown of orders */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                  {item.orders.map((ord, oIdx) => (
                    <div key={oIdx} className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-amber-600 font-mono">Jam {ord.time}</span>
                        <span>- {ord.customerName}</span>
                        {ord.packageGroup && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-medium">
                            {ord.packageGroup}
                          </span>
                        )}
                        {ord.note && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 italic px-1.5 py-0.2 rounded">
                            {ord.note}
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-slate-800 font-mono">{ord.qty} pcs</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
