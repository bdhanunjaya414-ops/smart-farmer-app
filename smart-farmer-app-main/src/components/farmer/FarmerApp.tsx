import React, { useState } from 'react';
import { 
  LayoutDashboard, 
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
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Language, translations } from '../../types';
import Dashboard from './Dashboard';
import Weather from './Weather';
import DiseaseDetection from './DiseaseDetection';
import MarketPrices from '../shared/MarketPrices';
import Marketplace from '../shared/Marketplace';
import Schemes from '../shared/Schemes';
import Rental from './Rental';
import ExpertConsult from './ExpertConsult';
import Analytics from './Analytics';
import Emergency from './Emergency';

interface FarmerAppProps {
  user: User;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
}

export default function FarmerApp({ user, lang, setLang, onLogout }: FarmerAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const t = translations[lang];

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'kn-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes('weather') || transcript.includes('వాతావరణం') || transcript.includes('मौसम')) {
        setActiveTab('weather');
      } else if (transcript.includes('price') || transcript.includes('ధర') || transcript.includes('भाव')) {
        setActiveTab('market');
      } else if (transcript.includes('disease') || transcript.includes('వ్యాధి') || transcript.includes('बीमारी')) {
        setActiveTab('disease');
      } else if (transcript.includes('marketplace') || transcript.includes('మార్కెట్') || transcript.includes('बाजार')) {
        setActiveTab('marketplace');
      } else if (transcript.includes('expert') || transcript.includes('సలహా') || transcript.includes('सलाह')) {
        setActiveTab('expert');
      } else if (transcript.includes('home') || transcript.includes('డాష్‌బోర్డ్')) {
        setActiveTab('dashboard');
      }
    };

    recognition.start();
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'weather', icon: CloudSun, label: t.weather },
    { id: 'disease', icon: Bug, label: t.disease },
    { id: 'market', icon: TrendingUp, label: t.market },
    { id: 'marketplace', icon: ShoppingBag, label: t.marketplace },
    { id: 'schemes', icon: BookOpen, label: t.schemes },
    { id: 'rental', icon: Truck, label: t.rental },
    { id: 'expert', icon: MessageSquare, label: t.expert },
    { id: 'analytics', icon: BarChart3, label: t.analytics },
    { id: 'emergency', icon: AlertTriangle, label: t.emergency },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} setActiveTab={setActiveTab} lang={lang} />;
      case 'weather': return <Weather lang={lang} />;
      case 'disease': return <DiseaseDetection lang={lang} />;
      case 'market': return <MarketPrices lang={lang} />;
      case 'marketplace': return <Marketplace user={user} lang={lang} />;
      case 'schemes': return <Schemes lang={lang} />;
      case 'rental': return <Rental lang={lang} />;
      case 'expert': return <ExpertConsult user={user} lang={lang} />;
      case 'analytics': return <Analytics user={user} lang={lang} />;
      case 'emergency': return <Emergency user={user} lang={lang} />;
      default: return <Dashboard user={user} setActiveTab={setActiveTab} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <TrendingUp className="text-emerald-600 w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Smart Farmer</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg text-white/80">
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
            className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div className="p-6 hidden md:flex items-center gap-3 border-b border-stone-100">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-stone-800 tracking-tight leading-none">Smart Farmer</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-semibold">Farmer Portal</p>
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
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100' 
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${activeTab === item.id ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
                <Globe className="w-4 h-4 text-stone-400" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-medium text-stone-600 focus:outline-none w-full cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border border-emerald-200">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{user.fullName}</p>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{user.village}</p>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">{t.logout}</span>
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
              {menuItems.find(i => i.id === activeTab)?.label || t.dashboard}
            </h2>
            <p className="text-stone-500 mt-1 font-medium">
              {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="p-3 bg-white border border-stone-200 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center gap-2"
              title={t.logout}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">{t.logout}</span>
            </button>
            <div className="h-10 w-[1px] bg-stone-200 mx-1"></div>
            <button 
              onClick={startListening}
              className={`p-3 border rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
                isListening 
                  ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                  : 'bg-white border-stone-200 text-stone-500 hover:text-emerald-600 hover:border-emerald-200'
              }`}
            >
              <Mic className="w-5 h-5" />
              {isListening && <span className="text-xs font-bold uppercase tracking-widest">Listening...</span>}
            </button>
            <div className="h-10 w-[1px] bg-stone-200 mx-2 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">System Active</span>
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
