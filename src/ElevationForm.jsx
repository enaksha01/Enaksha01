import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  ArrowLeft, 
  Box, 
  Ruler, 
  Camera, 
  Sparkles, 
  Lock 
} from 'lucide-react';

const ElevationForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  const [elevationPrice, setElevationPrice] = useState(2499);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('service_prices')
          .select('price')
          .eq('service_name', '3d')
          .single();
          
        if (data && !error) {
          setElevationPrice(data.price);
        }
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrice();
  }, []);

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl p-5 sm:p-8 overflow-hidden text-left transition-colors duration-300">
      {/* Blueprint grid accent background */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      {/* Header with Back button and Status Badge */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <button 
          type="button" 
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-[#ea580c] bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl transition-all cursor-pointer tactile-click" 
          onClick={() => setFormType(null)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
          3D ELEVATION CONFIGURATOR
        </span>
      </div>

      <div className="relative z-10 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              3D Elevation Design Setup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Photorealistic 3D exterior renders, glass facades, and architectural lighting
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={(e) => handleOrderSubmit(e, elevationPrice)} className="relative z-10 space-y-4">

        {/* Plot Dimensions */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Plot Dimensions / Front Width
          </label>
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <Ruler className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
            <input 
              name="plotSize" 
              type="text" 
              className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-mono" 
              placeholder="e.g. 40 Ft Front x 50 Ft Depth" 
              required 
            />
          </div>
        </div>

        {/* Style Preference */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Architectural Facade Style
          </label>
          <div className="relative bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] transition-all">
            <select name="details" className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white font-mono cursor-pointer">
              <option value="Modern / Minimalist" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Modern / Minimalist Facade</option>
              <option value="Luxury / Glass Work" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Luxury / Glass Work &amp; Balcony</option>
              <option value="Traditional / Classic" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Traditional / Classic Indian</option>
              <option value="Box Type Design" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Box Type Contemporary Cube</option>
            </select>
          </div>
        </div>

        {/* Upload Site Photo (Front View) */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Upload Front View Site Photo / Old Elevation
          </label>
          <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-blue-500 transition-all cursor-pointer group">
            <input 
              name="siteFile" 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => setFileName(e.target.files[0]?.name || '')}
              required 
            />
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 flex items-center justify-center transition-all mb-1.5">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 group-hover:text-blue-500 transition-colors">
              {fileName ? fileName : 'Choose front photo or rough CAD plan'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              Clear road angle photo provides best 3D accuracy
            </span>
          </label>
        </div>

        {/* Price Banner */}
        <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-slate-950 border border-blue-500/25 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Complete 3D Render Package</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Day &amp; Night Realistic Views with Textures</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">₹{elevationPrice}</span>
          </div>
        </div>

        {/* Confirmation Button */}
        <button 
          type="submit" 
          disabled={uploading} 
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{uploading ? "Uploading Front View..." : `CONFIRM 3D ELEVATION ORDER (₹${elevationPrice})`}</span>
        </button>

      </form>
    </div>
  );
};

export default ElevationForm;
