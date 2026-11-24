import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  CircleDashed, 
  Share2, 
  Trash2, 
  Edit3,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../types/order';
import { formatRupiah, generateCustomerReceiptText, openWhatsApp } from '../utils/whatsapp';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePayment: (orderId: string, payment: PaymentStatus) => void;
  onDelete: (orderId: string) => void;
  onEdit: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onUpdatePayment,
  onDelete,
  onEdit,
  onOpenInvoice
}) => {
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_PRODUCTION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'READY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'Belum Dibuat';
      case 'IN_PRODUCTION': return 'Sedang Dibuat';
      case 'READY': return 'Siap Antar';
      case 'COMPLETED': return 'Selesai';
      default: return status;
    }
  };

  const cycleStatus = () => {
    const sequence: OrderStatus[] = ['PENDING', 'IN_PRODUCTION', 'READY', 'COMPLETED'];
    const nextIdx = (sequence.indexOf(order.orderStatus) + 1) % sequence.length;
    onUpdateStatus(order.id, sequence[nextIdx]);
  };

  const cyclePayment = () => {
    const sequence: PaymentStatus[] = ['UNPAID', 'DP', 'PAID'];
    const nextIdx = (sequence.indexOf(order.paymentStatus) + 1) % sequence.length;
    onUpdatePayment(order.id, sequence[nextIdx]);
  };

  const handleCopyReceipt = () => {
    const text = generateCustomerReceiptText(order);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = generateCustomerReceiptText(order);
    openWhatsApp(text);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow">
      {/* Top Header: Time, Name, Location */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2.5">
          <div className="flex flex-col items-center justify-center bg-amber-500 text-white rounded-xl px-2.5 py-1.5 min-w-[58px] shadow-xs">
            <Clock className="w-3.5 h-3.5 mb-0.5 opacity-90" />
            <span className="font-bold text-xs tracking-wide">{order.deliveryTime}</span>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {order.customerName}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate max-w-[150px]">{order.location || 'Lokasi tidak ada'}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenInvoice(order)}
            title="Buka Faktur / Invoice Resmi"
            className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg text-xs font-bold active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Faktur</span>
          </button>
          <button
            onClick={handleShareWA}
            title="Kirim ke WhatsApp"
            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(order)}
            title="Edit Pesanan"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(order.id)}
            title="Hapus Pesanan"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 space-y-1.5">
        {order.items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md min-w-[24px] text-center">
                {it.qty}x
              </span>
              <span className="font-medium text-slate-800">{it.name}</span>
              {it.packageGroup && (
                <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded-full">
                  {it.packageGroup}
                </span>
              )}
              {it.note && (
                <span className="text-[10px] bg-slate-200 text-slate-600 italic px-1.5 py-0.5 rounded-full">
                  {it.note}
                </span>
              )}
            </div>
            <span className="text-slate-500 font-mono">
              {formatRupiah(it.totalPrice)}
            </span>
          </div>
        ))}

        {order.notes && (
          <div className="pt-1.5 mt-1 border-t border-slate-200/60 text-[11px] text-slate-600 italic">
            📝 {order.notes}
          </div>
        )}
      </div>

      {/* Footer: Price, Payment Pill, Status Pill */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Tagihan</div>
          <div className="text-base font-extrabold text-slate-900 font-mono">
            {formatRupiah(order.totalPrice)}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Payment Status Pill */}
          <button
            onClick={cyclePayment}
            title="Klik untuk ubah status bayar (Belum -> DP -> Lunas)"
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-transform active:scale-95 ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : order.paymentStatus === 'DP'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {order.paymentStatus === 'PAID' 
              ? '🟢 Lunas' 
              : order.paymentStatus === 'DP' 
              ? `🟡 DP` 
              : '🔴 Belum Bayar'}
          </button>

          {/* Order Progress Status Pill */}
          <button
            onClick={cycleStatus}
            title="Klik untuk ubah status pengerjaan"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-transform active:scale-95 ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus === 'COMPLETED' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <CircleDashed className="w-3.5 h-3.5 animate-spin-slow" />
            )}
            <span>{getStatusLabel(order.orderStatus)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
