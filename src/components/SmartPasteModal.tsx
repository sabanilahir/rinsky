import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ClipboardPaste, 
  Clock, 
  MapPin, 
  DollarSign 
} from 'lucide-react';
import { Order, SnackMenuItem } from '../types/order';
import { parseRawOrdersText } from '../utils/parser';
import { formatRupiah } from '../utils/whatsapp';

interface SmartPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportOrders: (newOrders: Order[]) => void;
  pricelist: SnackMenuItem[];
  currentDate: string;
}

export const SmartPasteModal: React.FC<SmartPasteModalProps> = ({
  isOpen,
  onClose,
  onImportOrders,
  pricelist,
  currentDate
}) => {
  const [text, setText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Order[]>([]);
  const [hasParsed, setHasParsed] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!text.trim()) return;
    const results = parseRawOrdersText(text, pricelist, currentDate);
    setParsedPreview(results);
    setHasParsed(true);
  };

  const handleSave = () => {
    if (parsedPreview.length === 0) return;
    onImportOrders(parsedPreview);
    setText('');
    setParsedPreview([]);
    setHasParsed(false);
    onClose();
  };

  const loadExampleText = () => {
    setText(`Selasa, 24 November
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
Brownis milo 80`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-100 max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Smart Paste Pesanan</h3>
              <p className="text-xs text-slate-500">Salin chat WhatsApp lalu tempel di sini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Tempel teks pesanan Anda:</span>
            <button
              onClick={loadExampleText}
              className="text-amber-600 hover:text-amber-700 font-semibold underline"
            >
              Coba Contoh Teks
            </button>
          </div>

          <textarea
            rows={7}
            value={text}
            onChange={e => {
              setText(e.target.value);
              setHasParsed(false);
            }}
            placeholder={`Contoh format:\nSelasa, 24 November\n1.Diaz Al Amanah jam 6= 20k\nPastel 5\n\n2.Lutfiah Gis jam 11= 390k\nPastel 25\nRagout 25\nLemper 25`}
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50"
          />

          <button
            onClick={handleParse}
            disabled={!text.trim()}
            className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analisis & Ekstrak Pesanan</span>
          </button>

          {/* Results Preview */}
          {hasParsed && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800">
                  Hasil Deteksi ({parsedPreview.length} Pesanan):
                </span>
                {parsedPreview.length === 0 && (
                  <span className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Format tidak dikenali
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {parsedPreview.map((p, idx) => (
                  <div key={idx} className="bg-amber-50/50 rounded-xl border border-amber-200 p-2.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                          {p.deliveryTime}
                        </span>
                        <span>{p.customerName}</span>
                        <span className="text-[11px] text-slate-500 font-normal">({p.location})</span>
                      </div>
                      <span className="font-mono text-amber-700">{formatRupiah(p.totalPrice)}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5 pl-1">
                      {p.items.map((it, itIdx) => (
                        <div key={itIdx} className="flex justify-between">
                          <span>
                            • {it.qty}x {it.name}
                            {it.packageGroup && ` [${it.packageGroup}]`}
                            {it.note && ` (${it.note})`}
                          </span>
                          <span className="text-slate-400">{formatRupiah(it.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            disabled={parsedPreview.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-xs active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Simpan ke Jadwal ({parsedPreview.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
