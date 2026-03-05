import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Send, CheckCircle2, Clock, ShieldAlert, Bug, CloudRain, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Emergency as EmergencyType, Language, translations } from '../../types';

interface EmergencyProps {
  user: User;
  lang: Language;
}

export default function Emergency({ user, lang }: EmergencyProps) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: user.id, type, description })
      });
      if (res.ok) {
        setSubmitted(true);
        setType('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const emergencyTypes = [
    { id: 'pest', label: 'Pest Outbreak', icon: Bug, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'flood', label: 'Flood Damage', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'disease', label: 'Rapid Disease Spread', icon: Zap, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'other', label: 'Other Emergency', icon: AlertTriangle, color: 'text-stone-600', bg: 'bg-stone-50' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Emergency Hotline */}
      <div className="bg-red-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-red-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <Phone className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Emergency Hotline</h3>
            <p className="text-red-100 font-medium opacity-80">Available 24/7 for immediate assistance.</p>
          </div>
        </div>
        <a 
          href="tel:18001234567"
          className="relative z-10 px-8 py-4 bg-white text-red-600 font-black rounded-2xl shadow-xl hover:bg-red-50 transition-all text-xl"
        >
          1800-123-4567
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Form */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <h4 className="text-xl font-bold text-stone-900 mb-6 tracking-tight">Report an Emergency</h4>
          
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 space-y-4"
              >
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h5 className="text-xl font-bold text-stone-900">Report Submitted</h5>
                <p className="text-stone-500 font-medium">Our team has been notified and will contact you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-emerald-600 font-bold hover:underline"
                >
                  Report another issue
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Emergency Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {emergencyTypes.map((et) => (
                      <button
                        key={et.id}
                        type="button"
                        onClick={() => setType(et.label)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${
                          type === et.label 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                            : 'bg-stone-50 border-stone-100 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <et.icon className={`w-6 h-6 ${type === et.label ? 'text-emerald-600' : 'text-stone-400'}`} />
                        <span className="text-xs font-bold leading-tight">{et.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe the situation in detail..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={!type || !description || loading}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Emergency Alert
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Info & Status */}
        <div className="space-y-8">
          <div className="bg-stone-900 rounded-3xl p-8 text-white">
            <h4 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              What happens next?
            </h4>
            <div className="space-y-6">
              {[
                { step: 1, title: 'Alert Received', desc: 'Your report is instantly broadcast to district agriculture officers.' },
                { step: 2, title: 'Verification', desc: 'Experts verify the emergency using satellite and local data.' },
                { step: 3, title: 'Response Team', desc: 'A specialized team is dispatched to your village if needed.' },
                { step: 4, title: 'Compensation', desc: 'Damage assessment for insurance and government relief begins.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0 border border-white/10">
                    {item.step}
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-200">{item.title}</h5>
                    <p className="text-stone-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
            <h4 className="text-lg font-bold text-stone-900 mb-6 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-stone-400" />
              Recent Reports in Your Area
            </h4>
            <div className="space-y-4">
              {[
                { type: 'Pest Outbreak', location: 'Near Village A', status: 'Resolved', time: '2 days ago' },
                { type: 'Flood Damage', location: 'Village B', status: 'In Progress', time: '5 hours ago' },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div>
                    <p className="text-sm font-bold text-stone-800">{report.type}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{report.location} • {report.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
