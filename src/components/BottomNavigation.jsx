import React from 'react';

function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-house', code: '01' },
    { id: 'service', label: 'Services', icon: 'fa-compass-drafting', code: '02' },
    { id: 'order', label: 'Projects', icon: 'fa-layer-group', code: '03' },
    { id: 'profile', label: 'Account', icon: 'fa-user-astronaut', code: '04' }
  ];

  return (
    <nav className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] px-2 py-1.5 flex justify-around items-center transition-all duration-300">
      
      {/* Top micro-highlight */}
      <div className="absolute -top-[1px] inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#eb6923]/50 to-transparent" />

      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative group tactile-click
              ${isActive 
                ? 'text-[#eb6923] font-bold' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            {/* 3D Active Pill Underlay */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#eb6923]/15 to-transparent rounded-xl border border-[#eb6923]/30 shadow-[0_0_15px_rgba(235,105,35,0.2)]" />
            )}
            
            {/* Top Indicator Indicator Notch */}
            {isActive && (
              <span className="absolute -top-[7px] w-6 h-[3px] bg-gradient-to-r from-[#eb6923] to-[#ff8c42] rounded-full shadow-[0_0_8px_#eb6923]" />
            )}
            
            <div className="relative z-10 flex flex-col items-center">
              <i className={`fa-solid ${item.icon} text-base transition-transform duration-200 ${isActive ? 'transform scale-110 -translate-y-0.5 text-[#ff8c42]' : 'group-hover:scale-105'}`}></i>
              <span className="text-[10px] font-mono tracking-wide mt-1 leading-none">
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
