import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

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
    <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 sm:p-7 overflow-hidden text-left">
      {/* Blueprint grid accent background */}
      <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#eb6923]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Back button and Status Badge */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <button 
          type="button" 
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-[#eb6923] bg-slate-950/80 border border-white/10 hover:border-[#eb6923]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer tactile-click" 
          onClick={() => setFormType(null)}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>BACK</span>
        </button>

        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#eb6923] bg-[#eb6923]/10 px-2.5 py-1 rounded-lg border border-[#eb6923]/30">
          MODULE: 3D FACADE ELEVATION
        </span>
      </div>

      <div className="relative z-10 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#eb6923]/20 border border-[#eb6923]/40 flex items-center justify-center text-[#eb6923] text-sm">
            <i className="fa-solid fa-cube"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              3D Elevation Design Setup
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Photorealistic 3D exterior renders, glass facades, and architectural lighting
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={(e) => handleOrderSubmit(e, elevationPrice)} className="relative z-10 space-y-4">

        {/* Plot Dimensions */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Plot Dimensions / Front Width
          </label>
          <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
            <i className="fa-solid fa-ruler-horizontal text-xs text-[#eb6923] w-5"></i>
            <input 
              name="plotSize" 
              type="text" 
              className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-mono" 
              placeholder="e.g. 40 Ft Front x 50 Ft Depth" 
              required 
            />
          </div>
        </div>

        {/* Style Preference */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Architectural Facade Style
          </label>
          <div className="relative bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] transition-all">
            <select name="details" className="bg-transparent border-none outline-none w-full text-xs text-white font-mono cursor-pointer">
              <option value="Modern / Minimalist" className="bg-slate-900 text-white">Modern / Minimalist Facade</option>
              <option value="Luxury / Glass Work" className="bg-slate-900 text-white">Luxury / Glass Work & Balcony</option>
              <option value="Traditional / Classic" className="bg-slate-900 text-white">Traditional / Classic Indian</option>
              <option value="Box Type Design" className="bg-slate-900 text-white">Box Type Contemporary Cube</option>
            </select>
          </div>
        </div>

        {/* Upload Site Photo (Front View) */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Upload Front View Site Photo / Old Elevation
          </label>
          <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border-2 border-dashed border-white/15 hover:border-[#eb6923]/60 transition-all cursor-pointer group">
            <input 
              name="siteFile" 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => setFileName(e.target.files[0]?.name || '')}
              required 
            />
            <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-[#eb6923]/20 text-slate-400 group-hover:text-[#eb6923] flex items-center justify-center transition-all mb-1.5">
              <i className="fa-solid fa-camera text-base"></i>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-[#eb6923] transition-colors">
              {fileName ? fileName : 'Choose front photo or rough CAD plan'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              Clear front road angle provides best 3D accuracy
            </span>
          </label>
        </div>

        {/* 3D Price Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#eb6923]/15 via-slate-900 to-[#eb6923]/15 border border-[#eb6923]/30 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-[#eb6923] text-base"></i>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Complete 3D Render Package</span>
              <span className="text-xs font-bold text-white">Day & Night Realistic Views</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#ff8c42] tracking-tight">₹{elevationPrice}</span>
          </div>
        </div>

        {/* 3D Confirmation Button */}
        <button 
          type="submit" 
          disabled={uploading} 
          className="w-full py-4 px-6 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <i className="fa-solid fa-cube text-xs"></i>
          <span>{uploading ? "Uploading Front View..." : `CONFIRM 3D ELEVATION ORDER (₹${elevationPrice})`}</span>
        </button>

      </form>
    </div>
  );
};

export default ElevationForm;
