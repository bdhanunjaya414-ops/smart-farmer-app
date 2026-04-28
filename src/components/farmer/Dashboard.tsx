import React from 'react';
import { User, translations, Language } from '../../types';
import { 
  CloudSun, 
  Bug, 
  TrendingUp, 
  ShoppingBag, 
  BookOpen, 
  Mic, 
  Truck, 
  MessageSquare, 
  BarChart3, 
  AlertTriangle,
  ArrowRight,
  Droplets,
  Thermometer,
  Wind
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  user: User;
  setActiveTab: (tab: string) => void;
  lang: Language;
}

export default function Dashboard({ user, setActiveTab, lang }: DashboardProps) {
  const t = translations[lang];

  const cards = [
    { id: 'weather', icon: CloudSun, label: t.weather, color: 'bg-blue-500', desc: 'Real-time alerts & advice' },
    { id: 'disease', icon: Bug, label: t.disease, color: 'bg-emerald-500', desc: 'AI-powered leaf analysis' },
    { id: 'market', icon: TrendingUp, label: t.market, color: 'bg-amber-500', desc: 'Live crop market prices' },
    { id: 'marketplace', icon: ShoppingBag, label: t.marketplace, color: 'bg-indigo-500', desc: 'Sell your crops directly' },
    { id: 'schemes', icon: BookOpen, label: t.schemes, color: 'bg-purple-500', desc: 'Govt subsidies & support' },
    { id: 'rental', icon: Truck, label: t.rental, color: 'bg-orange-500', desc: 'Rent farming equipment' },
    { id: 'expert', icon: MessageSquare, label: t.expert, color: 'bg-cyan-500', desc: 'Chat with agri-experts' },
    { id: 'analytics', icon: BarChart3, label: t.analytics, color: 'bg-rose-500', desc: 'Yield & profit insights' },
    { id: 'emergency', icon: AlertTriangle, label: t.emergency, color: 'bg-red-500', desc: 'Report pest or flood' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero / Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Hello, {user.fullName}!</h3>
            <p className="text-emerald-50 opacity-90 mb-6 max-w-md font-medium">
              Your {user.cropType} farm in {user.village} is looking healthy. Today's weather is favorable for harvesting.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm font-bold">32°C</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-bold">65% Humidity</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                <Wind className="w-4 h-4" />
                <span className="text-sm font-bold">12 km/h Wind</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Market Insight</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-800 font-bold text-lg">{user.cropType} Price</span>
              <span className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                +4.2% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <p className="text-stone-900 text-3xl font-black">₹42.50 <span className="text-sm font-medium text-stone-400">/ kg</span></p>
          </div>
          <button 
            onClick={() => setActiveTab('market')}
            className="w-full mt-6 py-3 bg-stone-50 text-stone-600 font-bold rounded-2xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 group"
          >
            View Market
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Service Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-stone-800 tracking-tight">Farm Services</h4>
          <div className="h-[1px] flex-1 bg-stone-100 mx-6"></div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">10 Active Modules</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.button
              key={card.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(card.id)}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all text-left flex flex-col group"
            >
              <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h5 className="text-lg font-bold text-stone-800 mb-1">{card.label}</h5>
              <p className="text-stone-400 text-sm font-medium leading-snug">{card.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Open Service <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
          
          {/* IoT Special Card */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-stone-900 p-6 rounded-3xl shadow-xl text-left flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
              <Droplets className="w-6 h-6" />
            </div>
            <h5 className="text-lg font-bold text-white mb-1">IoT Smart Farm</h5>
            <p className="text-stone-400 text-sm font-medium leading-snug">Soil moisture: <span className="text-emerald-400">Optimal</span></p>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
              </div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Live Data</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
