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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm px-4 py-2.5 flex items-center justify-between transition-all duration-300">
      
      {/* 🏠 Ecore Theme Split Logo Section (Complete Pure Code Text) */}
      <div className="flex items-center gap-3 active:scale-95 transition-transform duration-200 cursor-pointer mb-1 pl-0 ml-[-16px]">
        {/* House Icon Part */}
        <img 
          src="/logo.svg" 
          alt="e-Naksha Icon" 
          className="h-18 w-auto object-contain dark:brightness-110"
        />

        {/* 🖋️ Custom Styled Pure Code Text Part (Up-Down Centered) */}
        <div className="flex flex-col items-center justify-center select-none">
          {/* e-Naksha Text Part */}
          <div className="flex items-center font-sans font-black tracking-tight text-3xl leading-none scale-y-105">
            <span className="text-[#f37032] font-extrabold lowercase pr-0.5">e</span>
            <span className="text-[#555555] text-2xl font-bold px-1 relative bottom-[2px]">-</span>
            <span className="text-[#4a7cbe] font-extrabold tracking-wide antialiased">Naksha</span>
          </div>

          {/* Sketch Your Dream + Pure CSS Arrows */}
          <div className="flex items-center justify-center w-full gap-1.5 mt-1">
            {/* Left Tapered Line */}
            <div 
              className="h-0 w-0 border-y-[2.5px] border-y-transparent border-r-[35px] border-r-[#555555]" 
              style={{ borderRightStyle: 'solid' }}
            />
            
            {/* Tagline Text */}
            <span className="text-[10px] font-black tracking-wider text-[#444444] dark:text-slate-400 whitespace-nowrap font-serif italic antialiased">
              Sketch Your Dream
            </span>
            
            {/* Right Tapered Line */}
            <div 
              className="h-0 w-0 border-y-[2.5px] border-y-transparent border-l-[35px] border-l-[#555555]" 
              style={{ borderLeftStyle: 'solid' }}
            />
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3">
        
        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 active:scale-90 active:border-b-2 active:translate-y-[1px]"
        >
          <i className={`fa-solid ${darkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-[#4a77b3]'} text-lg`}></i>
        </button>

        {/* Hamburger Menu */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 hover:border-[#eb6923] dark:hover:border-[#eb6923] hover:text-[#eb6923] active:scale-90 active:border-b-2 active:translate-y-[1px]"
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-lg`}></i>
        </button>
      </div>
    </header>
  );
}

export default Header;
