import React, { useState, useEffect } from 'react';
import { Truck, Calendar, MapPin, Star, CheckCircle2, ArrowRight, Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Equipment, Language, translations } from '../../types';

interface RentalProps {
  lang: Language;
}

export default function Rental({ lang }: RentalProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState<Equipment | null>(null);

  const t = translations[lang];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/equipment');
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            placeholder="Search for tractors, harvesters..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 font-medium shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-stone-600 font-bold shadow-sm hover:bg-stone-50 transition-all">
            <Filter className="w-5 h-5" />
            Category
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-96 rounded-3xl border border-stone-100 animate-pulse"></div>
          ))
        ) : equipment.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col"
          >
            <div className="aspect-video bg-stone-100 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 ${item.availability ? 'bg-emerald-500' : 'bg-red-500'} text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                  {item.availability ? 'Available' : 'Booked'}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-black text-stone-900 tracking-tight">{item.name}</h4>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600 tracking-tight">₹{item.pricePerDay}</p>
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">per day</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-stone-600">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">4.8 <span className="text-stone-400 font-medium">(24 reviews)</span></span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <MapPin className="w-4 h-4 text-stone-300" />
                  <span className="text-sm font-medium">Within 10km of your village</span>
                </div>
              </div>

              <button 
                onClick={() => setShowBookingModal(item)}
                disabled={!item.availability}
                className="w-full mt-auto py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-emerald-600 disabled:bg-stone-100 disabled:text-stone-400 transition-all flex items-center justify-center gap-2 group"
              >
                Book Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Confirm Booking</h3>
                <button onClick={() => setShowBookingModal(null)} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex gap-6 items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <img src={showBookingModal.image} className="w-20 h-20 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-stone-900">{showBookingModal.name}</h4>
                    <p className="text-emerald-600 font-black">₹{showBookingModal.pricePerDay} / day</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Select Dates</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-medium" />
                      <input type="date" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-medium" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-emerald-800 font-medium">Estimated Total</span>
                    <span className="text-emerald-900 font-black text-xl">₹1,500</span>
                  </div>
                  <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Pay at the time of delivery</p>
                </div>

                <button 
                  onClick={() => setShowBookingModal(null)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm Rental
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
