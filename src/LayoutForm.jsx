import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const LayoutForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  const [layoutPrice, setLayoutPrice] = useState(999);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('service_prices')
          .select('price')
          .eq('service_name', '2d')
          .single();
          
        if (data && !error) {
          setLayoutPrice(data.price);
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
          MODULE: 2D VAASTU PLAN
        </span>
      </div>

      <div className="relative z-10 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#eb6923]/20 border border-[#eb6923]/40 flex items-center justify-center text-[#eb6923] text-sm">
            <i className="fa-solid fa-ruler-combined"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              2D Layout Plan Requirements
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Architectural floor plan customized with optimal Vaastu orientations
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={(e) => handleOrderSubmit(e, layoutPrice)} className="relative z-10 space-y-4">

        {/* Plot Dimensions */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Plot Dimensions (e.g. 30x50 Ft / 1500 Sq.Ft)
          </label>
          <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
            <i className="fa-solid fa-arrows-left-right text-xs text-[#eb6923] w-5"></i>
            <input 
              name="plotSize" 
              type="text" 
              className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-mono" 
              placeholder="Width x Length in Feet" 
              required 
            />
          </div>
        </div>

        {/* Plot Facing Dropdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Plot Facing (Vaastu)
            </label>
            <div className="relative bg-slate-950/80 border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-[#eb6923] transition-all">
              <select name="facing" className="bg-transparent border-none outline-none w-full text-xs text-white font-mono cursor-pointer">
                <option value="East" className="bg-slate-900 text-white">East (Purva - Recommended)</option>
                <option value="North" className="bg-slate-900 text-white">North (Uttar - Wealth)</option>
                <option value="West" className="bg-slate-900 text-white">West (Pashchim)</option>
                <option value="South" className="bg-slate-900 text-white">South (Dakshin)</option>
              </select>
            </div>
          </div>

          {/* Washroom Preference */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Washroom Preference
            </label>
            <div className="relative bg-slate-950/80 border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-[#eb6923] transition-all">
              <select name="washroom" className="bg-transparent border-none outline-none w-full text-xs text-white font-mono cursor-pointer">
                <option value="combined" className="bg-slate-900 text-white">Combined (Toilet + Bath)</option>
                <option value="separate" className="bg-slate-900 text-white">Separate Toilet & Bath</option>
                <option value="attached" className="bg-slate-900 text-white">Attached to Bedroom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Requirements (BHK, Parking, Puja Room, Floors)
          </label>
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
            <textarea 
              name="details" 
              className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-sans resize-none h-20" 
              placeholder="e.g. 3 BHK, 1 Car Parking, Open Kitchen, Pooja Room in North-East..." 
              required
            ></textarea>
          </div>
        </div>

        {/* Upload Rough Sketch / Site Photo */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
            Upload Rough Sketch / Plot Photo
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
              <i className="fa-solid fa-cloud-arrow-up text-base"></i>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-[#eb6923] transition-colors">
              {fileName ? fileName : 'Choose image file or plot sketch'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              JPG, PNG, or CAD diagram snapshot
            </span>
          </label>
        </div>

        {/* 3D Price Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#eb6923]/15 via-slate-900 to-[#eb6923]/15 border border-[#eb6923]/30 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-check text-[#eb6923] text-base"></i>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Fixed Architecture Fee</span>
              <span className="text-xs font-bold text-white">Full 2D Plan with Dimensions</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#ff8c42] tracking-tight">₹{layoutPrice}</span>
          </div>
        </div>

        {/* 3D Confirmation Button */}
        <button 
          type="submit" 
          disabled={uploading} 
          className="w-full py-4 px-6 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <i className="fa-solid fa-lock text-xs"></i>
          <span>{uploading ? "Uploading Blueprint..." : `CONFIRM & ORDER 2D PLAN (₹${layoutPrice})`}</span>
        </button>

      </form>
    </div>
  );
};

export default LayoutForm;
