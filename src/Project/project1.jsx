import React from 'react';

const Project1 = ({ onBack, setFormType }) => {
  return (
    <div className="space-y-6 pb-10 animate-fadeIn text-slate-900 dark:text-slate-100">
      
      {/* 🔙 Top Back Navigation Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-[#eb6923] flex items-center gap-2 bg-[#eb6923]/10 hover:bg-[#eb6923]/20 px-4 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm border border-[#eb6923]/20 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <span className="text-[10px] font-bold tracking-widest uppercase bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
          Verified Blueprint
        </span>
      </div>

      {/* 🏷️ Project Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="bg-blue-500/10 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
            Residential
          </span>
          <span className="text-xs text-gray-400 font-semibold">
            <i className="fa-solid fa-ruler-combined mr-1"></i> 40 x 50 Ft
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
          Modern 40x50 Residential Blueprint
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Designed with optimal Vaastu principles, proper ventilation, and luxury space utilization.
        </p>
      </div>

      {/* 🖼️ Main Blueprint Image Showcase */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
            alt="Project Blueprint" 
            className="w-full h-56 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
            2D Floor Plan Preview
          </div>
        </div>
      </div>

      {/* 📊 Project Specifications / Highlights */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b pb-2 border-gray-100 dark:border-slate-800">
          <i className="fa-solid fa-list-check mr-2 text-[#eb6923]"></i> Specification Highlights
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Plot Area</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">2,000 Sq. Ft.</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Bedrooms</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">3 BHK Luxury</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Facing</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">East Facing</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Floors</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">G + 1 Floor</span>
          </div>
        </div>
      </div>

      {/* 💡 Additional Details description */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-2">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Architect's Note
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Ye design specially unke liye banaya gaya hai jo open space, bada living room aur modern kitchen chahte hain. Isme utility area aur car parking ke liye ample space diya gaya hai. Vaastu shastra ke anusaar kitchen aur master bedroom ki placement bilkul perfect hai.
        </p>
      </div>

      {/* 🚀 Action Button to Order Similar Layout */}
      <div className="pt-2">
        <button 
          onClick={() => {
            if (setFormType) setFormType('2d');
          }}
          className="w-full py-3.5 bg-[#eb6923] text-white font-extrabold rounded-2xl text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-cart-shopping"></i> Order Similar Custom Design
        </button>
      </div>

    </div>
  );
};

export default Project1;
