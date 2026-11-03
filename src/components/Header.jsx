import React, { useState, useEffect } from 'react';

function Header({ isMenuOpen, setIsMenuOpen }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark architectural mode
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] px-4 py-2.5 transition-all duration-300">
      
      {/* Subtle top ambient glowing laser highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#eb6923] to-transparent opacity-80" />

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between">
        
        {/* 🏠 3D Logo Section with CAD HUD Stamp */}
        <div 
          onClick={() => { window.location.hash = ''; }}
          className="flex items-center gap-2 group cursor-pointer select-none"
        >
          {/* 3D Elevated House Emblem with Glow */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-950 border border-white/15 shadow-inner-glow group-hover:border-[#eb6923]/60 group-hover:shadow-cad-glow transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-[-2deg]">
            <img 
              src="/logo.svg" 
              alt="e-Naksha Icon" 
              className="w-7 h-7 object-contain drop-shadow-[0_4px_8px_rgba(235,105,35,0.4)]"
            />
            {/* Live CAD Engine Indicator Dot */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950"></span>
            </span>
          </div>

          {/* Typography Brand Block */}
          <div className="flex flex-col text-left">
            <div className="flex items-center font-sans font-black tracking-tight text-xl leading-none">
              <span className="text-[#f37032] font-black lowercase text-2xl drop-shadow-[0_2px_10px_rgba(243,112,50,0.5)]">e</span>
              <span className="text-slate-400 font-bold px-0.5 text-lg">-</span>
              <span className="text-white font-extrabold tracking-wide antialiased">Naksha</span>
              <span className="ml-2 text-[9px] font-mono tracking-widest uppercase bg-[#eb6923]/15 text-[#ff8c42] border border-[#eb6923]/30 px-1.5 py-0.5 rounded-md font-semibold hidden xs:inline-block">
                3D CAD
              </span>
            </div>

            {/* Subtitle / Tagline */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-[#eb6923] rounded-full inline-block"></span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-medium">
                Sketch Your Dream • Studio
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Controls (HUD Buttons) */}
        <div className="flex items-center gap-2.5">
          
          {/* 3D Blueprint Status Chip (Desktop / Tablet view) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-[10px] font-mono text-slate-300">
            <i className="fa-solid fa-cube text-[#eb6923] text-xs animate-pulse"></i>
            <span>3D SPATIAL</span>
          </div>

          {/* 🌙 Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Architectural HUD"}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-850 hover:border-[#eb6923]/50 text-slate-300 hover:text-[#eb6923] shadow-md transition-all duration-200 tactile-click active:scale-90"
          >
            <i className={`fa-solid ${darkMode ? 'fa-sun text-amber-400 text-sm' : 'fa-moon text-[#4a77b3] text-sm'}`}></i>
          </button>

          {/* 🎛️ Hamburger Navigation Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu & Admin Portal"
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 tactile-click active:scale-90 shadow-md ${
              isMenuOpen 
                ? 'bg-[#eb6923] border-[#eb6923] text-white shadow-3d-orange' 
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-[#eb6923]/60 hover:text-[#eb6923]'
            }`}
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark text-base' : 'fa-bars-staggered text-sm'}`}></i>
          </button>

        </div>

      </div>
    </header>
  );
}

export default Header;
