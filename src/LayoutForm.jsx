import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  ArrowLeft, 
  Ruler, 
  MoveHorizontal, 
  Compass, 
  Bath, 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

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

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
          2D VAASTU PLAN CONFIGURATOR
        </span>
      </div>

      <div className="relative z-10 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[#ea580c]">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              2D Layout Plan Requirements
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Architectural floor plan customized with optimal Vaastu orientations
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={(e) => handleOrderSubmit(e, layoutPrice)} className="relative z-10 space-y-4">

        {/* Plot Dimensions */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Plot Dimensions (e.g. 30x50 Ft / 1500 Sq.Ft)
          </label>
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <MoveHorizontal className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
            <input 
              name="plotSize" 
              type="text" 
              className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-mono" 
              placeholder="Width x Length in Feet" 
              required 
            />
          </div>
        </div>

        {/* Plot Facing Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
              Plot Facing (Vaastu)
            </label>
            <div className="relative bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-[#ea580c] transition-all flex items-center">
              <Compass className="w-4 h-4 text-[#ea580c] shrink-0 mr-2" />
              <select name="facing" className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white font-mono cursor-pointer">
                <option value="East" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">East (Purva - Recommended)</option>
                <option value="North" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">North (Uttar - Wealth)</option>
                <option value="West" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">West (Pashchim)</option>
                <option value="South" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">South (Dakshin)</option>
              </select>
            </div>
          </div>

          {/* Washroom Preference */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
              Washroom Preference
            </label>
            <div className="relative bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-[#ea580c] transition-all flex items-center">
              <Bath className="w-4 h-4 text-[#ea580c] shrink-0 mr-2" />
              <select name="washroom" className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white font-mono cursor-pointer">
                <option value="combined" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Combined (Toilet + Bath)</option>
                <option value="separate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Separate Toilet &amp; Bath</option>
                <option value="attached" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Attached to Bedroom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Requirements (BHK, Parking, Puja Room, Floors)
          </label>
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl p-3 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <textarea 
              name="details" 
              className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-sans resize-none h-20" 
              placeholder="e.g. 3 BHK, 1 Car Parking, Open Kitchen, Pooja Room in North-East..." 
              required
            ></textarea>
          </div>
        </div>

        {/* Upload Rough Sketch / Site Photo */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
            Upload Rough Sketch / Plot Photo
          </label>
          <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-[#ea580c] transition-all cursor-pointer group">
            <input 
              name="siteFile" 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => setFileName(e.target.files[0]?.name || '')}
              required 
            />
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:bg-orange-500/10 text-slate-500 dark:text-slate-400 group-hover:text-[#ea580c] flex items-center justify-center transition-all mb-1.5">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 group-hover:text-[#ea580c] transition-colors">
              {fileName ? fileName : 'Choose image file or plot sketch'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              JPG, PNG, or CAD diagram snapshot
            </span>
          </label>
        </div>

        {/* Price Banner */}
        <div className="p-4 rounded-2xl bg-orange-500/10 dark:bg-slate-950 border border-orange-500/25 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#ea580c]" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Fixed Architecture Fee</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Full 2D Plan with Dimensions &amp; Vaastu</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#ea580c] dark:text-[#ff8c42] tracking-tight">₹{layoutPrice}</span>
          </div>
        </div>

        {/* Confirmation Button */}
        <button 
          type="submit" 
          disabled={uploading} 
          className="w-full py-4 px-6 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{uploading ? "Saving Details..." : `CONFIRM & ORDER 2D PLAN (₹${layoutPrice})`}</span>
        </button>

      </form>
    </div>
  );
};

export default LayoutForm;
