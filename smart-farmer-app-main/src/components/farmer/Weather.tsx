import React, { useState, useEffect } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, Sun, Zap, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../../types';

interface WeatherProps {
  lang: Language;
}

export default function Weather({ lang }: WeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const t = translations[lang];

  useEffect(() => {
    // Mock weather data for demonstration
    // In a real app, we would use navigator.geolocation and a weather API
    setWeather({
      temp: 32,
      condition: 'Sunny',
      humidity: 45,
      wind: 15,
      forecast: [
        { day: 'Mon', temp: 31, condition: 'Sunny' },
        { day: 'Tue', temp: 29, condition: 'Cloudy' },
        { day: 'Wed', temp: 28, condition: 'Rain' },
        { day: 'Thu', temp: 30, condition: 'Sunny' },
        { day: 'Fri', temp: 33, condition: 'Hot' },
      ],
      alerts: [
        { type: 'Heat Wave', severity: 'High', message: 'Expect temperatures above 40°C in the next 48 hours. Ensure proper irrigation for crops.' }
      ]
    });
  }, []);

  if (!weather) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Current Weather Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="bg-emerald-600 p-12 text-white flex flex-col justify-between md:w-1/3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full -mr-24 -mt-24 opacity-50 blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">Current Weather</p>
            <h3 className="text-6xl font-black tracking-tighter mb-4">{weather.temp}°C</h3>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Sun className="w-6 h-6" />
              {weather.condition}
            </div>
          </div>
          <div className="relative z-10 mt-12">
            <p className="text-sm font-medium opacity-80">Hyderabad, Telangana</p>
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
              <Droplets className="w-4 h-4" /> Humidity
            </div>
            <p className="text-3xl font-black text-stone-800">{weather.humidity}%</p>
            <p className="text-stone-400 text-xs font-medium">Optimal for Rice</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
              <Wind className="w-4 h-4" /> Wind Speed
            </div>
            <p className="text-3xl font-black text-stone-800">{weather.wind} <span className="text-sm">km/h</span></p>
            <p className="text-stone-400 text-xs font-medium">North-East Direction</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4" /> UV Index
            </div>
            <p className="text-3xl font-black text-stone-800">High</p>
            <p className="text-stone-400 text-xs font-medium">Avoid mid-day work</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {weather.alerts.map((alert: any, i: number) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-100 rounded-3xl p-6 flex gap-6 items-start"
        >
          <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-red-900 font-black uppercase tracking-tight">{alert.type} Alert</h4>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full">Severity: {alert.severity}</span>
            </div>
            <p className="text-red-700 font-medium leading-relaxed">{alert.message}</p>
          </div>
        </motion.div>
      ))}

      {/* Forecast & Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold text-stone-800 tracking-tight">5-Day Forecast</h4>
            <Calendar className="w-5 h-5 text-stone-400" />
          </div>
          <div className="flex justify-between items-end gap-2">
            {weather.forecast.map((f: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{f.day}</span>
                <div className="w-12 h-24 bg-stone-50 rounded-full relative overflow-hidden group-hover:bg-emerald-50 transition-colors">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(f.temp / 40) * 100}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors"
                  ></motion.div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-stone-800">{f.temp}°</p>
                  {f.condition === 'Rain' ? <CloudRain className="w-4 h-4 text-blue-500 mx-auto" /> : <Sun className="w-4 h-4 text-amber-500 mx-auto" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
          <h4 className="text-emerald-900 font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Farming Advice
          </h4>
          <ul className="space-y-4">
            {[
              "Increase irrigation frequency due to heat.",
              "Apply mulch to retain soil moisture.",
              "Avoid pesticide spray during high winds.",
              "Monitor for pest outbreaks after rain."
            ].map((advice, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <p className="text-emerald-800 text-sm font-medium leading-snug">{advice}</p>
              </li>
            ))}
          </ul>
          <button className="w-full mt-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group">
            Detailed Guide
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
