import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Landmark, Sun, Droplets } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../../types';

interface SchemesProps {
  lang: Language;
}

export default function Schemes({ lang }: SchemesProps) {
  const [dbSchemes, setDbSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes');
      const data = await res.json();
      setDbSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const defaultSchemes = [
    {
      title: "PM Kisan Samman Nidhi",
      icon: Landmark,
      color: "bg-blue-500",
      benefits: "₹6,000 per year in 3 installments",
      eligibility: "Small and marginal farmers with up to 2 hectares of land.",
      process: "Register on PM-Kisan portal with Aadhaar and Bank details.",
      link: "https://pmkisan.gov.in/"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      icon: ShieldCheck,
      color: "bg-emerald-500",
      benefits: "Insurance cover against crop failure due to natural calamities.",
      eligibility: "All farmers including sharecroppers and tenant farmers.",
      process: "Apply through bank or CSC centers before sowing season.",
      link: "https://pmfby.gov.in/"
    },
    {
      title: "Kusum Solar Pump Scheme",
      icon: Sun,
      color: "bg-amber-500",
      benefits: "60% subsidy on solar pumps for irrigation.",
      eligibility: "Farmers with valid land ownership and water source.",
      process: "Apply through State Renewable Energy Department.",
      link: "https://mnre.gov.in/pm-kusum"
    },
    {
      title: "Soil Health Card Scheme",
      icon: Droplets,
      color: "bg-stone-500",
      benefits: "Free soil testing and customized fertilizer recommendations.",
      eligibility: "All farmers across the country.",
      process: "Contact local Agriculture Extension Officer.",
      link: "https://soilhealth.dac.gov.in/"
    }
  ];

  const allSchemes = [
    ...dbSchemes.map(s => ({
      title: s.title,
      icon: BookOpen,
      color: "bg-purple-500",
      benefits: s.description,
      eligibility: "Check official portal for details.",
      process: "Apply online via the link provided.",
      link: s.link
    })),
    ...defaultSchemes
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Government Schemes</h3>
            <p className="text-stone-500 font-medium">Explore subsidies and financial support available for you.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allSchemes.map((scheme, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-stone-50 rounded-3xl p-6 border border-stone-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`${scheme.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <scheme.icon className="w-6 h-6" />
                </div>
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-stone-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              <h4 className="text-xl font-bold text-stone-900 mb-4">{scheme.title}</h4>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Benefits</p>
                  <p className="text-stone-700 text-sm font-semibold">{scheme.benefits}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Eligibility</p>
                  <p className="text-stone-600 text-sm font-medium leading-relaxed">{scheme.eligibility}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">How to Apply</p>
                  <p className="text-stone-600 text-sm font-medium leading-relaxed">{scheme.process}</p>
                </div>
              </div>

              <a 
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-8 py-3 bg-white border border-stone-200 text-stone-600 font-bold rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-emerald-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h4 className="text-2xl font-bold mb-2">Need help with applications?</h4>
          <p className="text-emerald-100 opacity-80 font-medium max-w-md">Our experts can help you with documentation and online registration for any government scheme.</p>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-emerald-900 font-black rounded-2xl shadow-xl hover:bg-emerald-50 transition-all whitespace-nowrap">
          Contact Support
        </button>
      </div>
    </div>
  );
}
