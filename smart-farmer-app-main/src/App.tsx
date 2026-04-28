import React, { useState, useEffect } from 'react';
import { User, Language } from './types';
import Auth from './components/shared/Auth';
import FarmerApp from './components/farmer/FarmerApp';
import AdminApp from './components/admin/AdminApp';
import { socketService } from './services/socketService';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    socketService.connect();
    const unsubscribe = socketService.subscribe((data) => {
      if (data.type === 'ALERT') {
        setNotification({ title: data.title, message: data.message, type: data.alertType });
        setTimeout(() => setNotification(null), 10000);
      }
      if (data.type === 'PRICE_UPDATE') {
        // We could show a small toast here too
      }
    });

    const savedUser = localStorage.getItem('farmer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('farmer_user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={setUser} lang={lang} setLang={setLang} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminApp 
        user={user} 
        lang={lang} 
        setLang={setLang} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-4 ${
              notification.type === 'danger' ? 'bg-red-50 border-red-100 text-red-900' :
              notification.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
              'bg-emerald-50 border-emerald-100 text-emerald-900'
            }`}>
              <div className={`p-2 rounded-xl ${
                notification.type === 'danger' ? 'bg-red-100' :
                notification.type === 'warning' ? 'bg-amber-100' :
                'bg-emerald-100'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{notification.title}</h4>
                <p className="text-xs opacity-80 mt-1">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FarmerApp 
        user={user} 
        lang={lang} 
        setLang={setLang} 
        onLogout={handleLogout} 
      />
    </>
  );
}
