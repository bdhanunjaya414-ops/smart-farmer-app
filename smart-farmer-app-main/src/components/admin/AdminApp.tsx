import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingBag, 
  BookOpen, 
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Language, translations } from '../../types';
import AdminPanel from './AdminPanel';
import MarketPrices from '../shared/MarketPrices';
import Marketplace from '../shared/Marketplace';
import Schemes from '../shared/Schemes';

interface AdminAppProps {
  user: User;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
}

export default function AdminApp({ user, lang, setLang, onLogout }: AdminAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { id: 'farmers', icon: Users, label: 'Farmer Management' },
    { id: 'emergencies', icon: AlertTriangle, label: 'Emergency Alerts' },
    { id: 'market', icon: TrendingUp, label: 'Market Prices' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'schemes', icon: BookOpen, label: 'Govt Schemes' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'farmers':
      case 'emergencies':
        return <AdminPanel lang={lang} />;
      case 'market': return <MarketPrices lang={lang} />;
      case 'marketplace': return <Marketplace user={user} lang={lang} />;
      case 'schemes': return <Schemes lang={lang} />;
      default: return <AdminPanel lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Farmer Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-stone-900 text-stone-400 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div className="p-6 hidden md:flex items-center gap-3 border-b border-white/5">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-white tracking-tight leading-none">Smart Admin</h1>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1 font-semibold">Management Console</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id 
                      ? 'bg-white/10 text-white font-semibold shadow-sm' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${activeTab === item.id ? 'text-emerald-400' : 'text-stone-500'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Globe className="w-4 h-4 text-stone-500" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-medium text-stone-400 focus:outline-none w-full cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">System Administrator</p>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Logout Admin</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label || 'Admin Dashboard'}
            </h2>
            <p className="text-stone-500 mt-1 font-medium">
              System Overview • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="p-3 bg-white border border-stone-200 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Logout</span>
            </button>
            <div className="h-10 w-[1px] bg-stone-200 mx-1"></div>
            <button className="p-3 bg-white border border-stone-200 rounded-2xl text-stone-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
            <div className="h-10 w-[1px] bg-stone-200 mx-2 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-stone-900 rounded-2xl shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Admin Secure</span>
            </div>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
