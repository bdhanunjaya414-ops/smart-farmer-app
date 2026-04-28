import React from 'react';
import { BarChart3, TrendingUp, PieChart, Map, ArrowUpRight, ArrowDownRight, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { User, Language, translations } from '../../types';

interface AnalyticsProps {
  user: User;
  lang: Language;
}

const yieldData = [
  { month: 'Jan', yield: 400, profit: 240 },
  { month: 'Feb', yield: 300, profit: 139 },
  { month: 'Mar', yield: 200, profit: 980 },
  { month: 'Apr', yield: 278, profit: 390 },
  { month: 'May', yield: 189, profit: 480 },
  { month: 'Jun', yield: 239, profit: 380 },
  { month: 'Jul', yield: 349, profit: 430 },
];

const cropDistribution = [
  { name: 'Rice', value: 400, color: '#10b981' },
  { name: 'Tomato', value: 300, color: '#f59e0b' },
  { name: 'Onion', value: 300, color: '#6366f1' },
  { name: 'Maize', value: 200, color: '#ec4899' },
];

export default function Analytics({ user, lang }: AnalyticsProps) {
  const t = translations[lang];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Farm Area', value: '12.5 Acres', icon: Map, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Est. Yield', value: '450 Quintals', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Profit Projection', value: '₹4.2 Lakhs', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Weather Risk', value: 'Low', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
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
            <h4 className="text-xl font-black text-stone-900">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Yield Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-bold text-stone-900 tracking-tight">Yield & Profit Analysis</h4>
              <p className="text-stone-400 text-xs font-medium">Performance over the last 7 months</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Yield</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Profit</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col">
          <h4 className="text-xl font-bold text-stone-900 tracking-tight mb-8">Crop Distribution</h4>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {cropDistribution.map((crop, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: crop.color }}></div>
                  <span className="text-sm font-medium text-stone-600">{crop.name}</span>
                </div>
                <span className="text-sm font-bold text-stone-900">{((crop.value / 1200) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-stone-900 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h4 className="text-2xl font-bold tracking-tight">Regional Comparison</h4>
            <p className="text-stone-400 font-medium">How your farm compares to the village average.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Your Farm</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stone-500"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Village Avg</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: 'Water Efficiency', your: 85, avg: 65 },
            { label: 'Fertilizer Use', your: 40, avg: 75 },
            { label: 'Yield per Acre', your: 92, avg: 78 },
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">{item.label}</span>
                <span className="text-emerald-400 font-black text-xl">{item.your}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.your}%` }}></div>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-stone-600 rounded-full" style={{ width: `${item.avg}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
