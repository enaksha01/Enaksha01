import React, { useState, useEffect } from 'react';

function Header({ isMenuOpen, setIsMenuOpen }) {
  // Check if theme exists in localStorage, otherwise default to light
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme to HTML tag whenever darkMode changes
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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm px-5 py-3 flex items-center justify-between transition-all duration-300">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 active:scale-95 transition-transform duration-200 cursor-pointer">
        <img 
  src="/logo.png" 
  alt="e-Naksha Logo" 
  className="h-16 sm:h-20 w-auto object-contain dark:brightness-110 transition-all duration-200"
/>

      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3">
        
        {/* 🌙 Light/Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 active:scale-90 active:border-b-2 active:translate-y-[1px]"
        >
          <i className={`fa-solid ${darkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-brandBlue'} text-lg`}></i>
        </button>

        {/* Hamburger Menu */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 hover:border-brandOrange dark:hover:border-brandOrange hover:text-brandOrange active:scale-90 active:border-b-2 active:translate-y-[1px]"
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-2 transition-all duration-300">
          <a href="#about" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">About Us</a>
          <a href="#contact" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Contact</a>
        </div>
      )}
    </header>
  );
}

export default Header;
