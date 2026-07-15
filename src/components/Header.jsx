import React, { useState, useEffect } from 'react';

function Header({ isMenuOpen, setIsMenuOpen }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm px-3 py-2 flex items-center justify-between transition-all duration-300">
      
      {/* 🏠 Ecore Theme Split Logo Section (Mobile Optimized) */}
      <div className="flex items-center gap-0.5 active:scale-95 transition-transform duration-200 cursor-pointer min-w-0 flex-shrink">
        {/* House Icon Part */}
        <img 
          src="/logo.svg" 
          alt="e-Naksha Icon" 
          className="h-16 xs:h-12 w-auto object-contain flex-shrink-0 dark:brightness-110"
        />

        {/* 🖋️ Custom Styled Pure Code Text Part */}
        <div className="flex flex-col items-center justify-center select-none flex-shrink-0">
          {/* e-Naksha Text Part */}
          <div className="flex items-center font-sans font-black tracking-tight text-xl xs:text-2xl leading-none scale-y-105">
            <span className="text-[#f37032] font-extrabold lowercase pr-0.5">e</span>
            <span className="text-[#555555] text-xl font-bold px-0.5 relative bottom-[1px]">-</span>
            <span className="text-[#4a7cbe] font-extrabold tracking-wide antialiased">Naksha</span>
          </div>

          {/* Sketch Your Dream + Pure CSS Arrows */}
          <div className="flex items-center justify-center w-full gap-1 mt-0.5">
            {/* Left Tapered Line */}
            <div 
              className="h-0 w-0 border-y-[1.5px] border-y-transparent border-r-[20px] border-r-[#555555]" 
              style={{ borderRightStyle: 'solid' }}
            />
            
            {/* Tagline Text */}
            <span className="text-[7px] xs:text-[8px] font-black tracking-wider text-[#444444] dark:text-slate-400 whitespace-nowrap font-serif italic antialiased">
              Sketch Your Dream
            </span>
            
            {/* Right Tapered Line */}
            <div 
              className="h-0 w-0 border-y-[1.5px] border-y-transparent border-l-[20px] border-l-[#555555]" 
              style={{ borderLeftStyle: 'solid' }}
            />
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        
        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 active:scale-90"
        >
          <i className={`fa-solid ${darkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-[#4a77b3]'} text-base`}></i>
        </button>

        {/* Hamburger Menu */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 hover:border-[#eb6923] dark:hover:border-[#eb6923] hover:text-[#eb6923] active:scale-90"
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-base`}></i>
        </button>
      </div>
    </header>
  );
}

export default Header;
