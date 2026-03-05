import React, { useState } from 'react';
import { Bug, Upload, Camera, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectDisease } from '../../services/geminiService';
import { Language, translations } from '../../types';

interface DiseaseDetectionProps {
  lang: Language;
}

export default function DiseaseDetection({ lang }: DiseaseDetectionProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const data = await detectDisease(image);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
            <Bug className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">AI Crop Disease Detection</h3>
            <p className="text-stone-500 font-medium">Upload a photo of the affected leaf for instant diagnosis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div 
              className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                image ? 'border-emerald-500 bg-emerald-50/30' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt="Crop leaf" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur shadow-lg rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center p-12 text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 text-stone-400">
                    <Camera className="w-8 h-8" />
                  </div>
                  <span className="text-stone-800 font-bold mb-1">Take or Upload Photo</span>
                  <span className="text-stone-400 text-sm font-medium">JPG, PNG up to 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:scale-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Start AI Diagnosis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-stone-50 rounded-3xl border border-stone-100"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <Bug className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-2">Analyzing Leaf Patterns...</h4>
                  <p className="text-stone-400 text-sm font-medium">Our AI is comparing your image with thousands of disease samples.</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 space-y-6"
                >
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Diagnosis Complete</span>
                      <span className="text-emerald-600 font-bold text-sm">{result.confidence}% Confidence</span>
                    </div>
                    <h4 className="text-2xl font-black text-emerald-900 mb-1">{result.diseaseName}</h4>
                    <p className="text-emerald-700 font-bold text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Affected Plant: {result.plantName}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-stone-800 font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-stone-400" />
                      Recommended Treatment
                    </h5>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec: string, i: number) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-3 p-4 bg-white border border-stone-100 rounded-2xl shadow-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-stone-600 text-sm font-medium leading-relaxed">{rec}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-3xl border border-red-100"
                >
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h4 className="text-lg font-bold text-red-900 mb-2">Analysis Failed</h4>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-stone-50 rounded-3xl border border-stone-100 border-dashed">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-stone-300 mb-4">
                    <Bug className="w-8 h-8" />
                  </div>
                  <h4 className="text-stone-400 font-bold">Waiting for Image</h4>
                  <p className="text-stone-300 text-sm font-medium">Diagnosis results will appear here after analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Good Lighting", desc: "Take photos in natural daylight for best results." },
          { title: "Focus Clearly", desc: "Ensure the leaf is in sharp focus and fills the frame." },
          { title: "Both Sides", desc: "Some diseases show symptoms on the underside of leaves." }
        ].map((tip, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <h6 className="text-stone-800 font-bold mb-1">{tip.title}</h6>
            <p className="text-stone-500 text-sm font-medium">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
