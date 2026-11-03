import React from 'react';
import { Compass, Layers, FolderCheck, User } from 'lucide-react';

function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'service', label: 'Services', icon: Layers },
    { id: 'order', label: 'Projects', icon: FolderCheck },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto pinterest-dock rounded-full px-2.5 py-1.5 flex items-center gap-1 sm:gap-2 shadow-2xl transition-all duration-300">
        
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-full transition-all duration-300 tactile-click cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white font-extrabold shadow-lg shadow-orange-500/35 scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {/* Lucide Icon with Pinterest smooth pop */}
              <IconComp className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              
              {/* Dynamic Expandable Label (Pinterest-style Pill expansion for active tab) */}
              <span className={`text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                isActive ? 'inline-block opacity-100 max-w-[85px]' : 'hidden sm:inline-block opacity-75'
              }`}>
                {item.label}
              </span>

              {/* Active pulsing micro-dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse hidden xs:inline-block" />
              )}
            </button>
          );
        })}

      </nav>
    </div>
  );
}

export default BottomNavigation;
