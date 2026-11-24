import React from 'react';
import { 
  CalendarClock, 
  ChefHat, 
  ClipboardPaste, 
  Tag, 
  Plus, 
  RotateCcw 
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'orders' | 'kitchen' | 'paste' | 'menu';
  setActiveTab: (tab: 'orders' | 'kitchen' | 'paste' | 'menu') => void;
  onOpenNewOrder: () => void;
  onOpenSmartPaste: () => void;
  onResetData: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  onOpenSmartPaste,
  onResetData,
  ordersCount
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-amber-100 shadow-xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-slate-800 text-base leading-tight">Rinsky Pesanan</h1>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded-full">
                  @rinsky_id
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Kue & Snack Box Pencatatan</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetData}
              title="Reset ke Contoh"
              className="p-2 text-slate-400 hover:text-slate-600 active:scale-95 transition-all rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSmartPaste}
              className="flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-amber-600" />
              <span>Paste WA</span>
            </button>
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-4 h-15">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'orders' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <CalendarClock className="w-5 h-5" />
              {ordersCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Jadwal</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'kitchen' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-[10px]">Dapur</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'paste' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardPaste className="w-5 h-5" />
            <span className="text-[10px]">Smart Paste</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'menu' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span className="text-[10px]">Pricelist</span>
          </button>
        </div>
      </nav>
    </>
  );
};
