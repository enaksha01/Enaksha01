import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Ruler, 
  Box, 
  Layers, 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Headphones, 
  ShieldCheck 
} from 'lucide-react';
import { useSiteSettings } from '../lib/settingsStore';

function Header({ isMenuOpen, setIsMenuOpen, activeTab = 'home', changeTab, setFormType, user }) {
  const { settings } = useSiteSettings();
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
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

  const navLinks = [
    { 
      id: 'home', 
      label: 'Home Studio', 
      icon: Home, 
      onClick: () => changeTab && changeTab('home') 
    },
    { 
      id: 'service-2d', 
      label: '2D Layouts', 
      icon: Ruler, 
      badge: '₹999', 
      onClick: () => {
        if (!user) {
          if (setFormType) setFormType('2d');
          if (changeTab) changeTab('profile');
        } else {
          if (changeTab) changeTab('service');
          if (setFormType) setFormType('2d');
        }
      } 
    },
    { 
      id: 'service-3d', 
      label: '3D Elevation', 
      icon: Box, 
      badge: '₹2499', 
      onClick: () => {
        if (!user) {
          if (setFormType) setFormType('3d');
          if (changeTab) changeTab('profile');
        } else {
          if (changeTab) changeTab('service');
          if (setFormType) setFormType('3d');
        }
      } 
    },
    { 
      id: 'order', 
      label: 'My Projects', 
      icon: Layers, 
      onClick: () => {
        if (!user) {
          if (changeTab) changeTab('profile');
        } else {
          if (changeTab) changeTab('order');
        }
      } 
    },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      
      {/* 🚀 DYNAMIC HOSTINGER-STYLE TOP MICRO-ANNOUNCEMENT BAR (Controlled via Admin Panel) */}
      {settings.showAnnouncement && (
        <div className="bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#c2410c] text-white py-1 px-4 text-[11px] font-mono font-bold tracking-wide shadow-sm flex items-center justify-between overflow-hidden animate-fadeIn">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              {settings.announcementBadge && (
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider shrink-0">
                  {settings.announcementBadge}
                </span>
              )}
              <span className="truncate">
                {settings.announcementText || '⚡ 2D Vaastu Floor Plans @ ₹999 & 3D Photorealistic Facades @ ₹2499 • 24hr Turnaround!'}
              </span>
            </div>

            {settings.announcementSubText && (
              <div className="hidden sm:flex items-center gap-4 shrink-0 text-[10px]">
                <span className="flex items-center gap-1.5 opacity-90">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-200" />
                  <span>{settings.announcementSubText}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🏛️ MAIN NAVIGATION BAR (Hostinger Clean Surface & Frosted Glass) */}
      <div className="hostinger-header backdrop-blur-2xl transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Studio Identity (Clean transparent logo without orange square) */}
          <div 
            onClick={() => changeTab && changeTab('home')}
            className="flex items-center gap-3.5 cursor-pointer select-none group shrink-0"
          >
            {/* Pure Architectural Logo (Clean, transparent, enlarged CorelDraw vector) */}
            <div className="relative flex items-center justify-center py-0.5">
              <img 
                src="/logo.svg" 
                alt="e-Naksha Studio Logo" 
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md filter contrast-105"
              />
            </div>

            {/* Typography: "e" in Brand Orange (#ea580c) & "Naksha" in Architectural Blue (#2563eb / #38bdf8) */}
            <div className="flex flex-col text-left">
              <div className="flex items-center tracking-tight text-xl sm:text-2xl font-black leading-none select-none">
                <span className="text-[#ea580c] dark:text-[#ff7828] text-2xl sm:text-3xl font-black drop-shadow-sm">e</span>
                <span className="text-slate-400 dark:text-slate-500 px-0.5 text-lg font-bold">-</span>
                <span className="text-[#2563eb] dark:text-[#38bdf8] text-2xl sm:text-3xl font-black drop-shadow-sm">
                  Naksha
                </span>
              </div>
              
              {/* Dynamic Slogan configured via Admin Panel */}
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400 font-semibold mt-1">
                {settings.siteSlogan || 'Sketch Your Dream'}
              </span>
            </div>
          </div>

          {/* 💻 DESKTOP NAVIGATION BAR (Hostinger-Style Clean Nav Links) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = (activeTab === item.id) || (item.id.startsWith('service') && activeTab === 'service');
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-orange-500/10 dark:bg-orange-500/20 text-[#ea580c] dark:text-[#ff7828] font-bold border border-orange-500/30 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[#ea580c] dark:text-[#ff7828]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold bg-[#ea580c] text-white px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Action Button for Desktop */}
            <button
              onClick={() => {
                if (!user) {
                  if (setFormType) setFormType('2d');
                  if (changeTab) changeTab('profile');
                } else {
                  if (changeTab) changeTab('service');
                  if (setFormType) setFormType('2d');
                }
              }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Design</span>
            </button>

            {/* 🌙 Dark / Light Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Architectural Studio"}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 tactile-click cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#ea580c] transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* 🎛️ Mobile Hamburger Menu / Drawer Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu Options"
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 tactile-click cursor-pointer ${
                isMenuOpen 
                  ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-md' 
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#ea580c] dark:hover:text-[#ff7828]'
              }`}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
