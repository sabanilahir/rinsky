import React, { useState } from 'react';
import { 
  Tag, 
  Search, 
  Plus, 
  Edit2, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { SnackMenuItem, SnackCategory, Order } from '../types/order';
import { formatRupiah, formatDateIndo } from '../utils/whatsapp';

interface MenuPriceViewProps {
  pricelist: SnackMenuItem[];
  onUpdatePricelist: (list: SnackMenuItem[]) => void;
  orders: Order[];
  selectedDate: string;
}

export const MenuPriceView: React.FC<MenuPriceViewProps> = ({
  pricelist,
  onUpdatePricelist,
  orders,
  selectedDate
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // New snack state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<SnackCategory>('asin');
  const [newPrice, setNewPrice] = useState<number>(4000);
  const [newAliases, setNewAliases] = useState('');

  // Daily Omset Calculations
  const dayOrders = orders.filter(o => o.orderDate === selectedDate);
  const totalDayOmset = dayOrders.reduce((acc, o) => acc + o.totalPrice, 0);
  const totalPaid = dayOrders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((acc, o) => acc + o.totalPrice, 0);
  const totalUnpaid = totalDayOmset - totalPaid;

  const allOrdersOmset = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  const startEditPrice = (item: SnackMenuItem) => {
    setEditingId(item.id);
    setEditPrice(item.price);
  };

  const saveEditPrice = (itemId: string) => {
    const updated = pricelist.map(it => (it.id === itemId ? { ...it, price: editPrice } : it));
    onUpdatePricelist(updated);
    setEditingId(null);
  };

  const handleAddNewItem = () => {
    if (!newName.trim()) return;
    const aliasesList = newAliases
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(Boolean);
    if (!aliasesList.includes(newName.trim().toLowerCase())) {
      aliasesList.unshift(newName.trim().toLowerCase());
    }

    const newItem: SnackMenuItem = {
      id: `snack-custom-${Date.now()}`,
      name: newName.trim(),
      category: newCat,
      price: newPrice,
      aliases: aliasesList
    };

    onUpdatePricelist([...pricelist, newItem]);
    setNewName('');
    setNewPrice(4000);
    setNewAliases('');
    setShowAddModal(false);
  };

  const filteredItems = pricelist.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.aliases.some(a => a.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Omset Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-xl text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ringkasan Omset Harian</h3>
              <p className="text-[11px] text-slate-400">{formatDateIndo(selectedDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Omset Hari Ini</span>
            <span className="font-mono font-extrabold text-amber-400 text-lg">
              {formatRupiah(totalDayOmset)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-emerald-400 block text-[10px] uppercase font-bold">Uang Masuk (Lunas)</span>
            <span className="font-mono font-bold text-white text-sm">{formatRupiah(totalPaid)}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="text-rose-400 block text-[10px] uppercase font-bold">Piutang (Belum Bayar)</span>
            <span className="font-mono font-bold text-white text-sm">{formatRupiah(totalUnpaid)}</span>
          </div>
        </div>

        <div className="mt-2 text-right text-[11px] text-slate-400">
          Akumulasi semua tanggal: <span className="text-white font-mono font-bold">{formatRupiah(allOrdersOmset)}</span>
        </div>
      </div>

      {/* Header Pricelist & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Pricelist Aneka Kue</h3>
          <p className="text-xs text-slate-500">Master harga resmi @rinsky_id</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kue atau alias (contoh: pastel, sosol)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'asin', label: 'Snack Asin' },
            { id: 'manis', label: 'Snack Manis' },
            { id: 'tradisional', label: 'Tradisional' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricelist Cards */}
      <div className="space-y-2">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md capitalize">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.aliases.slice(0, 3).map((a, aIdx) => (
                  <span key={aIdx} className="text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-1 rounded">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {editingId === item.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-20 text-xs font-mono font-bold p-1 rounded border border-amber-500 text-right"
                  />
                  <button
                    onClick={() => saveEditPrice(item.id)}
                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {formatRupiah(item.price)}
                  </span>
                  <button
                    onClick={() => startEditPrice(item)}
                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                    title="Ubah Harga"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Snack Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-xl border border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Tambah Menu Baru</h4>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nama Kue</label>
              <input
                type="text"
                placeholder="Contoh: Risol Rogout Pedas"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kategori</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as SnackCategory)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="asin">Snack Asin</option>
                  <option value="manis">Snack Manis</option>
                  <option value="tradisional">Tradisional</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Alias Singkatan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="misal: rogout pedas, rogut"
                value={newAliases}
                onChange={e => setNewAliases(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddNewItem}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-xs"
              >
                Simpan Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
