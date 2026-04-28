import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  User as UserIcon, 
  MapPin, 
  Phone,
  Bell,
  BookOpen,
  Plus,
  Send,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Emergency as EmergencyType, User, Language, translations, MarketPrice, MarketItem } from '../../types';

interface AdminPanelProps {
  lang: Language;
}

export default function AdminPanel({ lang }: AdminPanelProps) {
  const [farmers, setFarmers] = useState<User[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyType[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('farmers');

  // Form states
  const [alertForm, setAlertForm] = useState({ title: '', message: '', type: 'info' });
  const [schemeForm, setSchemeForm] = useState({ title: '', description: '', category: 'Subsidies', link: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, eRes, pRes, mRes] = await Promise.all([
        fetch('/api/admin/farmers'),
        fetch('/api/admin/emergencies'),
        fetch('/api/market-prices'),
        fetch('/api/marketplace')
      ]);
      const [fData, eData, pData, mData] = await Promise.all([
        fRes.json(), 
        eRes.json(), 
        pRes.json(),
        mRes.json()
      ]);
      setFarmers(fData);
      setEmergencies(eData);
      setPrices(pData);
      setMarketplaceItems(mData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (id: number, newPrice: number) => {
    try {
      await fetch('/api/market-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price: newPrice })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm)
      });
      setAlertForm({ title: '', message: '', type: 'info' });
      alert('Alert sent successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemeForm)
      });
      setSchemeForm({ title: '', description: '', category: 'Subsidies', link: '' });
      alert('Scheme added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const resolveEmergency = async (id: number) => {
    try {
      await fetch('/api/admin/emergencies/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Total Farmers', value: farmers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Emergencies', value: emergencies.filter(e => e.status === 'pending').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Market Listings', value: '124', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'System Health', value: '99.9%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm"
          >
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-stone-900">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="border-b border-stone-100 bg-stone-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'farmers', label: 'Farmers', icon: Users },
              { id: 'emergencies', label: 'Emergencies', icon: AlertTriangle },
              { id: 'prices', label: 'Market Prices', icon: TrendingUp },
              { id: 'alerts', label: 'Send Alerts', icon: Bell },
              { id: 'schemes', label: 'Schemes', icon: BookOpen },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'farmers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-stone-50/30 border-b border-stone-100">
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Farmer</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Location</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Crop Type</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Contact</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {farmers.map((farmer) => (
                        <tr key={farmer.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                {farmer.fullName.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-stone-800">{farmer.fullName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-stone-500">
                              <MapPin className="w-4 h-4 text-stone-300" />
                              <span className="text-sm font-medium">{farmer.village}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                              {farmer.cropType}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-stone-500">
                              <Phone className="w-4 h-4 text-stone-300" />
                              <span className="text-sm font-medium">{farmer.mobile}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button className="text-emerald-600 font-bold text-xs hover:underline">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'emergencies' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-stone-50/30 border-b border-stone-100">
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Farmer</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Time</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {emergencies.map((emergency) => (
                        <tr key={emergency.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              emergency.type.includes('Pest') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {emergency.type}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-stone-800">{emergency.farmerName}</span>
                              <span className="text-[10px] text-stone-400 font-bold">{emergency.mobile}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${emergency.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                              <span className="text-sm font-bold text-stone-600 capitalize">{emergency.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-stone-500">
                              <Clock className="w-4 h-4 text-stone-300" />
                              <span className="text-sm font-medium">{new Date(emergency.createdAt).toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex gap-3">
                              {emergency.status === 'pending' && (
                                <button 
                                  onClick={() => resolveEmergency(emergency.id!)}
                                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'prices' && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prices.map(price => (
                    <div key={price.id} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-bold text-stone-800">{price.cropName}</h5>
                          <p className="text-xs text-stone-400">{price.location}</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Current Price (₹/kg)</label>
                          <input 
                            type="number" 
                            defaultValue={price.price}
                            onBlur={(e) => handlePriceUpdate(price.id!, parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold"
                          />
                        </div>
                        <div className="pt-5">
                          <button className="p-2 bg-stone-900 text-white rounded-lg">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="p-8 max-w-2xl">
                  <h5 className="text-lg font-bold text-stone-800 mb-6">Send Real-time Alert to Farmers</h5>
                  <form onSubmit={handleSendAlert} className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Alert Title</label>
                      <input 
                        type="text" 
                        required
                        value={alertForm.title}
                        onChange={e => setAlertForm({...alertForm, title: e.target.value})}
                        placeholder="e.g., Heavy Rain Warning"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Message</label>
                      <textarea 
                        required
                        value={alertForm.message}
                        onChange={e => setAlertForm({...alertForm, message: e.target.value})}
                        rows={4}
                        placeholder="Detailed instructions for farmers..."
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {['info', 'warning', 'danger'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAlertForm({...alertForm, type})}
                          className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                            alertForm.type === type 
                              ? (type === 'danger' ? 'border-red-500 bg-red-50 text-red-700' : type === 'warning' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                              : 'border-stone-100 text-stone-400 hover:border-stone-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-all">
                      <Send className="w-4 h-4" />
                      Broadcast Alert Now
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'schemes' && (
                <div className="p-8 max-w-2xl">
                  <h5 className="text-lg font-bold text-stone-800 mb-6">Upload New Government Scheme</h5>
                  <form onSubmit={handleAddScheme} className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Scheme Title</label>
                      <input 
                        type="text" 
                        required
                        value={schemeForm.title}
                        onChange={e => setSchemeForm({...schemeForm, title: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Description</label>
                      <textarea 
                        required
                        value={schemeForm.description}
                        onChange={e => setSchemeForm({...schemeForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Category</label>
                        <select 
                          value={schemeForm.category}
                          onChange={e => setSchemeForm({...schemeForm, category: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        >
                          <option>Subsidies</option>
                          <option>Insurance</option>
                          <option>Loans</option>
                          <option>Training</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Official Link</label>
                        <input 
                          type="url" 
                          required
                          value={schemeForm.link}
                          onChange={e => setSchemeForm({...schemeForm, link: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-all">
                      <Plus className="w-4 h-4" />
                      Add Scheme
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-stone-50/30 border-b border-stone-100">
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Crop</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quantity</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Location</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {marketplaceItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-stone-800">{item.cropName}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm text-stone-600">{item.quantity}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-black text-emerald-600">₹{item.pricePerKg}/kg</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm text-stone-500">{item.location}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Approve</button>
                              <button className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
