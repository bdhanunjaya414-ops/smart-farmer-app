import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin, Calendar, ArrowUpRight, ArrowDownRight, Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { MarketPrice, Language, translations } from '../../types';

interface MarketPricesProps {
  lang: Language;
}

export default function MarketPrices({ lang }: MarketPricesProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const t = translations[lang];

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-prices');
      const data = await res.json();
      setPrices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = prices.filter(p => 
    p.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search crop or market..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPrices}
            className="p-4 bg-white border border-stone-200 rounded-2xl text-stone-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-stone-600 font-bold shadow-sm hover:bg-stone-50 transition-all">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="w-24 h-6 bg-stone-100 rounded-full"></div>
                <div className="w-12 h-6 bg-stone-100 rounded-full"></div>
              </div>
              <div className="w-32 h-10 bg-stone-100 rounded-xl"></div>
              <div className="w-full h-4 bg-stone-100 rounded-full"></div>
            </div>
          ))
        ) : filteredPrices.map((price, idx) => (
          <motion.div
            key={price.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-stone-50 px-4 py-1.5 rounded-full border border-stone-100">
                <span className="text-stone-800 font-bold text-sm">{price.cropName}</span>
              </div>
              <div className={`flex items-center gap-1 font-bold text-xs ${idx % 2 === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {idx % 2 === 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {idx % 2 === 0 ? '+2.4%' : '-1.2%'}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Current Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-stone-900 tracking-tight">₹{price.price.toFixed(2)}</span>
                <span className="text-stone-400 font-medium">/ kg</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-stone-50">
              <div className="flex items-center gap-3 text-stone-500">
                <MapPin className="w-4 h-4 text-stone-300" />
                <span className="text-sm font-medium">{price.location}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-500">
                <Calendar className="w-4 h-4 text-stone-300" />
                <span className="text-sm font-medium">Updated 2 hours ago</span>
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-stone-900 text-white font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              View Price Trends
            </button>
          </motion.div>
        ))}
      </div>

      {/* Market News */}
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
        <h4 className="text-amber-900 font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Market Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-amber-800 font-bold">Tomato prices expected to rise</p>
            <p className="text-amber-700 text-sm leading-relaxed">Due to unseasonal rains in Kolar region, supply is expected to drop by 20% next week. Farmers are advised to harvest early if possible.</p>
          </div>
          <div className="space-y-2">
            <p className="text-amber-800 font-bold">Rice export demand increasing</p>
            <p className="text-amber-700 text-sm leading-relaxed">New export orders from Middle East have boosted the wholesale prices of Basmati and Sona Masuri varieties by ₹500 per quintal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
