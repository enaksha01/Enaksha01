import React from 'react';

function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'service', label: 'Service', icon: 'fa-screwdriver-wrench' },
    { id: 'order', label: 'Order', icon: 'fa-cart-shopping' },
    { id: 'profile', label: 'Profile', icon: 'fa-user' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-2 flex justify-around items-center transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-xl transition-all duration-200 relative group
              active:scale-90 active:translate-y-[2px] active:border-b focus:outline-none
              ${isActive 
                ? 'text-[#eb6923] border border-[#eb6923]/20 bg-[#eb6923]/5 dark:bg-[#eb6923]/10 shadow-inner' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            {/* Top Indicator Indicator Line for Active Tab */}
            {isActive && (
              <span className="absolute -top-[10px] w-8 h-[3px] bg-[#eb6923] rounded-full animate-pulse" />
            )}
            
            <i className={`fa-solid ${item.icon} text-lg transition-transform duration-200 group-hover:scale-110`}></i>
            <span className="text-[10px] font-semibold mt-1 tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
