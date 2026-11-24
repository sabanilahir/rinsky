import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Order, PaymentStatus } from '../types/order';
import { 
  formatRupiah, 
  formatDateIndo, 
  getInvoiceNumber, 
  generateCustomerReceiptText, 
  openWhatsApp 
} from '../utils/whatsapp';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePayment: (
    orderId: string, 
    status: PaymentStatus, 
    paidAmount?: number, 
    paymentMethod?: string
  ) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdatePayment
}) => {
  const [copied, setCopied] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(order?.paymentStatus || 'UNPAID');
  const [dpAmount, setDpAmount] = useState<number>(order?.paidAmount || 0);
  const [method, setMethod] = useState<string>(order?.paymentMethod || 'Transfer Bank');

  if (!isOpen || !order) return null;

  const invNumber = getInvoiceNumber(order);
  const remaining = status === 'DP' 
    ? Math.max(0, order.totalPrice - (dpAmount || 0)) 
    : status === 'PAID' ? 0 : order.totalPrice;

  const handleSavePaymentStatus = (newStatus: PaymentStatus) => {
    let finalPaid = 0;
    if (newStatus === 'PAID') {
      finalPaid = order.totalPrice;
    } else if (newStatus === 'DP') {
      finalPaid = dpAmount > 0 ? dpAmount : Math.round(order.totalPrice / 2);
    }

    onUpdatePayment(order.id, newStatus, finalPaid, method);
    setStatus(newStatus);
    setEditingPayment(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 max-h-[95vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md font-mono">
              INVOICE
            </span>
            <span className="text-xs font-medium text-slate-300">{invNumber}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Cetak Faktur / Simpan PDF"
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={handleShareWA}
              title="Kirim ke WhatsApp"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim WA</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 print:p-0 print:m-0" id="printable-invoice">
          {/* Invoice Header */}
          <div className="border-b-2 border-slate-900 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-base flex items-center justify-center">
                    R
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                      RINSKY SNACK & CAKE
                    </h2>
                    <span className="text-[11px] font-semibold text-amber-700 block">
                      @rinsky_id
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Kue Basah • Snack Box • Kue Nampan • Catering
                </p>
              </div>

              {/* Status Stamp */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  FAKTUR PENJUALAN
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 block">
                  {invNumber}
                </span>

                <div className="mt-1">
                  {order.paymentStatus === 'PAID' ? (
                    <span className="inline-block border-2 border-emerald-600 text-emerald-700 font-extrabold text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider transform rotate-[-3deg] bg-emerald-50">
                      LUNAS ✅
                    </span>
                  ) : order.paymentStatus === 'DP' ? (
                    <span className="inline-block border-2 border-amber-600 text-amber-700 font-extrabold text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider transform rotate-[-3deg] bg-amber-50">
                      DP (UANG MUKA)
                    </span>
                  ) : (
                    <span className="inline-block border-2 border-rose-600 text-rose-700 font-extrabold text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider transform rotate-[-3deg] bg-rose-50">
                      BELUM DIBAYAR
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pelanggan</span>
              <span className="font-bold text-slate-900 text-sm">{order.customerName}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">
                📍 {order.location || 'Lokasi tidak ada'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Jadwal Pengiriman</span>
              <span className="font-semibold text-slate-800 text-[11px] block">
                {formatDateIndo(order.orderDate)}
              </span>
              <span className="font-mono font-bold text-amber-700 text-xs mt-0.5 block">
                ⏰ Jam {order.deliveryTime} WIB
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Rincian Pesanan
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5 text-left">Item Kue</th>
                    <th className="py-2 px-1 text-center w-12">Qty</th>
                    <th className="py-2 px-2 text-right w-18">Harga</th>
                    <th className="py-2 px-2.5 text-right w-22">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2.5 font-medium">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{it.name}</span>
                          {it.packageGroup && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.2 rounded">
                              {it.packageGroup}
                            </span>
                          )}
                          {it.note && (
                            <span className="text-[9px] bg-slate-100 text-slate-500 italic px-1 rounded">
                              {it.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-1 text-center font-bold text-slate-900 font-mono">
                        {it.qty}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-500 font-mono">
                        {formatRupiah(it.pricePerUnit)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-slate-900 font-mono">
                        {formatRupiah(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Payment Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Subtotal Item:</span>
              <span className="font-mono">{formatRupiah(order.totalPrice)}</span>
            </div>

            {order.paymentStatus === 'DP' && (
              <>
                <div className="flex justify-between items-center text-amber-700 font-medium">
                  <span>Sudah Dibayar (DP):</span>
                  <span className="font-mono">-{formatRupiah(order.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-rose-700 font-bold border-t border-slate-200 pt-1">
                  <span>Sisa Pelunasan:</span>
                  <span className="font-mono text-sm">{formatRupiah(remaining)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-1.5">
              <span>TOTAL TAGIHAN:</span>
              <span className="font-mono text-base text-amber-700">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>

            {order.notes && (
              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                Catatan: {order.notes}
              </div>
            )}
          </div>

          {/* Quick Payment Status Box (Interactive - Hidden in Print) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2.5 print:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                Update Status Pembayaran Pesanan Ini:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSavePaymentStatus('UNPAID')}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  order.paymentStatus === 'UNPAID'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                }`}
              >
                🔴 Belum Bayar
              </button>

              <button
                onClick={() => {
                  setEditingPayment(true);
                  handleSavePaymentStatus('DP');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  order.paymentStatus === 'DP'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                🟡 Bayar DP
              </button>

              <button
                onClick={() => handleSavePaymentStatus('PAID')}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                🟢 LUNAS
              </button>
            </div>

            {/* If DP is selected, show input for DP Amount */}
            {order.paymentStatus === 'DP' && (
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-amber-900 font-semibold">Nominal DP (Rp):</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={dpAmount || (order.paidAmount || 0)}
                    onChange={e => setDpAmount(Number(e.target.value))}
                    className="w-24 text-xs font-mono font-bold p-1.5 rounded-lg border border-amber-300 bg-white text-right"
                  />
                  <button
                    onClick={() => onUpdatePayment(order.id, 'DP', dpAmount, method)}
                    className="bg-amber-600 text-white p-1.5 rounded-lg font-bold text-xs"
                    title="Simpan DP"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs print:hidden">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold p-1.5 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Nota'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl active:scale-95 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
