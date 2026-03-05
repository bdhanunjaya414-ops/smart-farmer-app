import React, { useState } from 'react';
import { User, Language, translations } from '../../types';
import { LogIn, UserPlus, Phone, MapPin, Sprout, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function Auth({ onLogin, lang, setLang }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    village: '',
    cropType: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        const user = data.user || { ...formData, id: data.userId };
        localStorage.setItem('farmer_user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row font-sans">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 bg-emerald-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full -mr-48 -mt-48 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700 rounded-full -ml-48 -mb-48 opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-2xl shadow-xl">
              <Sprout className="text-emerald-600 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Farmer</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tighter mb-6">
              Empowering <br />
              <span className="text-emerald-200 italic">Agriculture</span> <br />
              with Intelligence.
            </h2>
            <p className="text-xl text-emerald-50 max-w-md font-medium opacity-90">
              The complete digital ecosystem for modern farmers. Access AI disease detection, market prices, and expert advice in one place.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12">
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/farmer${i}/100/100`} 
                  className="w-12 h-12 rounded-full border-2 border-emerald-600 object-cover"
                  alt="Farmer"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-sm font-semibold tracking-wide uppercase">Joined by 10,000+ Farmers</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 p-8 lg:p-24 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-stone-900 tracking-tight">
                {isLogin ? t.login : t.register}
              </h3>
              <p className="text-stone-500 font-medium">Welcome to the future of farming.</p>
            </div>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="en">EN</option>
              <option value="te">తె</option>
              <option value="kn">ಕ</option>
              <option value="hi">हि</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'farmer' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${formData.role === 'farmer' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white text-stone-500 border-stone-200'}`}
                >
                  I am a Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${formData.role === 'admin' ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200' : 'bg-white text-stone-500 border-stone-200'}`}
                >
                  I am an Admin
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 placeholder:text-stone-300 font-medium"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 placeholder:text-stone-300 font-medium"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Village</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Village"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 placeholder:text-stone-300 font-medium"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Crop Type</label>
                  <div className="relative group">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Main Crop"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 placeholder:text-stone-300 font-medium"
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-stone-800 placeholder:text-stone-300 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? t.login : t.register}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-stone-500 font-semibold hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
