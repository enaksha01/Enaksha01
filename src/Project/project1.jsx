import React from 'react';

const Project1 = ({ onBack, setFormType }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-100 text-left max-w-md md:max-w-xl mx-auto">
      
      {/* 🔙 Top Back Navigation & Technical CAD Badge */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-xs font-mono font-bold text-slate-300 hover:text-[#eb6923] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-850 px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-md border border-white/10 hover:border-[#eb6923]/40 cursor-pointer tactile-click"
        >
          <i className="fa-solid fa-arrow-left text-[#eb6923]"></i>
          <span>PORTFOLIO HUB</span>
        </button>
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          VERIFIED CAD BLUEPRINT
        </span>
      </div>

      {/* 🏷️ Project Header Card */}
      <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#eb6923]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="bg-[#eb6923]/15 text-[#ff8c42] border border-[#eb6923]/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase">
            RESIDENTIAL • VAASTU COMPLIANT
          </span>
          <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1.5">
            <i className="fa-solid fa-ruler-combined text-[#eb6923]"></i> 40 x 50 FT
          </span>
        </div>

        <h1 className="text-xl font-black text-white mt-1 tracking-tight">
          Modern 40x50 Residential Blueprint
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
          Designed with optimal Vaastu principles, proper cross-ventilation, and luxury modern space utilization.
        </p>
      </div>

      {/* 🖼️ Main Blueprint Image Showcase with 3D Depth */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group">
        <div className="relative h-60 w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
            alt="Project Blueprint" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Floating Architectural HUD Stamp */}
          <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-lg">
            <i className="fa-solid fa-draw-polygon text-[#eb6923]"></i>
            <span>2D FLOOR PLAN & 3D ISOMETRIC VIEW</span>
          </div>

          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-[#ff8c42] text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border border-[#eb6923]/30">
            CAD #2026-EN01
          </div>
        </div>
      </div>

      {/* 📊 Technical Specification Highlights (3D Metric Tiles) */}
      <div className="rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/10 p-5 shadow-xl space-y-4">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b pb-2.5 border-white/5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-list-check text-[#eb6923]"></i>
            Specification Matrix
          </span>
          <span className="font-mono text-[9px] text-[#eb6923]">APPROVED</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 hover:border-[#eb6923]/40 transition-colors">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Plot Area</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 block">2,000 Sq. Ft.</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 hover:border-[#eb6923]/40 transition-colors">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Bedrooms</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 block">3 BHK Luxury</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 hover:border-[#eb6923]/40 transition-colors">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Orientation</span>
            <span className="text-sm font-black text-[#ff8c42] font-mono mt-0.5 block">East Facing (Vaastu)</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 hover:border-[#eb6923]/40 transition-colors">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Structure</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 block">G + 1 Duplex</span>
          </div>
        </div>
      </div>

      {/* 💡 Architect's Note */}
      <div className="rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/10 p-5 shadow-xl space-y-2">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <i className="fa-solid fa-pen-nib text-[#eb6923]"></i>
          Architect's Design Blueprint Note
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
          Ye design specially unke liye banaya gaya hai jo open space, bada living room aur modern kitchen chahte hain. Isme utility area aur car parking ke liye ample space diya gaya hai. Vaastu shastra ke anusaar kitchen aur master bedroom ki placement bilkul perfect hai.
        </p>
      </div>

      {/* 🚀 Action Button to Order Similar Layout */}
      <div className="pt-2">
        <button 
          onClick={() => {
            if (setFormType) setFormType('2d');
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer tactile-click"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Order Similar Custom Design (From ₹999)</span>
        </button>
      </div>

    </div>
  );
};

export default Project1;
