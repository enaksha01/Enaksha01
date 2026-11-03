import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Ruler, 
  Sparkles, 
  ListCheck, 
  FileText, 
  ShoppingCart,
  PenTool
} from 'lucide-react';

const Project1 = ({ onBack, setFormType }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-900 dark:text-slate-100 text-left max-w-4xl mx-auto transition-colors duration-300">
      
      {/* 🔙 Top Back Navigation & Technical CAD Badge */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-[#ea580c] flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-sm border border-slate-200 dark:border-white/10 hover:border-orange-500/40 cursor-pointer tactile-click"
        >
          <ArrowLeft className="w-4 h-4 text-[#ea580c]" />
          <span>PORTFOLIO HUB</span>
        </button>
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          VERIFIED CAD BLUEPRINT
        </span>
      </div>

      {/* 🏷️ Project Header Card */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-orange-500/10 text-[#ea580c] dark:text-[#ff8c42] border border-orange-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-lg uppercase">
            RESIDENTIAL &bull; VAASTU COMPLIANT
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-[#ea580c]" /> 40 x 50 FT
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Modern 40x50 Residential Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-2">
          Designed with optimal Vaastu principles, proper cross-ventilation, and luxury modern space utilization.
        </p>
      </div>

      {/* 🖼️ Main Blueprint Image Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shadow-xl group">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" 
            alt="Project Blueprint" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

          {/* Floating Architectural HUD Stamp */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>2D FLOOR PLAN &amp; 3D ISOMETRIC VIEW</span>
          </div>

          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-[#ff8c42] text-[10px] font-mono font-bold px-3 py-1 rounded-lg border border-orange-500/30">
            CAD #2026-EN01
          </div>
        </div>
      </div>

      {/* 📊 Technical Specification Highlights */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b pb-3 border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ListCheck className="w-4 h-4 text-[#ea580c]" />
            Specification Matrix
          </span>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">APPROVED SPEC</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Plot Area</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-1 block">2,000 Sq. Ft.</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Bedrooms</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-1 block">3 BHK Luxury</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Orientation</span>
            <span className="text-base font-black text-[#ea580c] dark:text-[#ff8c42] font-mono mt-1 block">East Facing</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Structure</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-1 block">G + 1 Duplex</span>
          </div>
        </div>
      </div>

      {/* 💡 Architect's Note */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-2">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <PenTool className="w-4 h-4 text-[#ea580c]" />
          Architect's Design Blueprint Note
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans pt-1">
          Ye design specially unke liye banaya gaya hai jo open space, bada living room aur modern kitchen chahte hain. Isme utility area aur car parking ke liye ample space diya gaya hai. Vaastu shastra ke anusaar kitchen aur master bedroom ki placement bilkul perfect hai.
        </p>
      </div>

      {/* 🚀 Action Button */}
      <div className="pt-2">
        <button 
          onClick={() => {
            if (setFormType) setFormType('2d');
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-extrabold rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2.5 cursor-pointer tactile-click"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Order Similar Custom Design (From ₹999)</span>
        </button>
      </div>

    </div>
  );
};

export default Project1;
