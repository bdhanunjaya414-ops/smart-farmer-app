import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, MapPin, Phone, User as UserIcon, Tag, Package, Search, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MarketItem, Language, translations } from '../../types';

interface MarketplaceProps {
  user: User;
  lang: Language;
}

export default function Marketplace({ user, lang }: MarketplaceProps) {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    pricePerKg: '',
    location: user.village,
    contact: user.mobile
  });

  const t = translations[lang];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, farmerId: user.id })
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchItems();
        setFormData({
          cropName: '',
          quantity: '',
          pricePerKg: '',
          location: user.village,
          contact: user.mobile
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for crops to buy..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 font-medium shadow-sm"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Sell Your Crop
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-80 rounded-3xl border border-stone-100 animate-pulse"></div>
          ))
        ) : items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col"
          >
            <div className="aspect-[16/10] bg-stone-100 relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${item.cropName}/600/400`} 
                alt={item.cropName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  Fresh Stock
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-black text-stone-900 tracking-tight">{item.cropName}</h4>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600 tracking-tight">₹{item.pricePerKg}</p>
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">per kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Quantity</p>
                  <p className="text-stone-800 font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-stone-300" /> {item.quantity}
                  </p>
                </div>
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Farmer</p>
                  <p className="text-stone-800 font-bold flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-stone-300" /> Verified
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                <a 
                  href={`tel:${item.contact}`}
                  className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Contact Farmer
                </a>
                <button className="p-2 bg-stone-50 text-stone-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">List Your Crop</h3>
                  <p className="text-emerald-100 text-sm font-medium opacity-80">Reach thousands of buyers directly.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Crop Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sona Masuri Rice"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 500 kg"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Price per kg (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 45"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    value={formData.pricePerKg}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Post Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
