import React, { useState } from 'react';
import Header from '../components/Header';

// 🔌 Future Architecture: Jab tu ye files banayega, tab in lines ko uncomment (saaf) kar dena
// import HomePortfolio from './homeportfolio';
// import ServiceAdmin from './service';
// import OrderAdmin from './order';

function AdminPanel() {
  // 🔑 Admin Access States
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // 🎛️ Navigation Inside Admin Module
  const [currentModule, setCurrentModule] = useState('menu'); // 'menu', 'portfolio', 'service', 'order'

  const handleAdminPasswordSubmit = (e) => {
    e.preventDefault();
    if (adminInputPassword === 'e2026') {
      setIsAdminAuthenticated(true);
    } else {
      alert('Galat Password Hai Bhai!');
      setAdminInputPassword('');
    }
  };

  // 🔒 GATE 1: Password Gateway Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
        <main className="max-w-md mx-auto w-full px-4 mt-20">
          
          <form onSubmit={handleAdminPasswordSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-[#eb6923]/10 text-[#eb6923] rounded-xl flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-lock-open text-xl"></i>
              </div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">Ecore Master Control</h4>
              <p className="text-xs text-gray-400 mt-1">Gated workspace for e-Naksha Administrator</p>
            </div>

            <div>
              <input 
                type="password" 
                placeholder="••••" 
                value={adminInputPassword} 
                onChange={(e) => setAdminInputPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-lg text-center font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-[#eb6923] transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-[#eb6923] text-white font-bold rounded-xl text-sm border-b-4 border-orange-700 shadow-sm active:translate-y-[2px] active:border-b-2 transition-all duration-150 tracking-wider"
            >
              VERIFY ACCESS
            </button>
          </form>

        </main>
      </div>
    );
  }

  // 🎛️ GATE 2: Admin Hub Menu Options
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-10 transition-colors duration-300">
      <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      <main className="max-w-md mx-auto px-4 mt-6">
        
        {/* Header Navigation Actions */}
        <div className="flex justify-between items-center mb-6">
          {currentModule !== 'menu' ? (
            <button 
              onClick={() => setCurrentModule('menu')}
              className="text-xs font-bold text-[#eb6923] flex items-center gap-1 active:scale-95 border border-[#eb6923]/20 bg-[#eb6923]/5 px-3 py-1.5 rounded-xl"
            >
              <i className="fa-solid fa-chevron-left"></i> Back to Hub
            </button>
          ) : (
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="text-xs font-bold text-gray-500 flex items-center gap-1 active:scale-95 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Exit Console
            </button>
          )}
          <span className="text-[10px] font-bold tracking-widest uppercase bg-[#4a77b3]/10 text-[#4a77b3] px-2.5 py-1 rounded-full">
            Ecore Live Panel
          </span>
        </div>

        {/* 1. MAIN HUB BUTTON LIST VIEW */}
        {currentModule === 'menu' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-slate-800 text-slate-800 dark:text-white">Admin Console</h3>
            
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Button 1: Home Portfolio */}
              <div 
                onClick={() => setCurrentModule('portfolio')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] active:border-l-4 active:border-[#eb6923]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eb6923]/10 text-[#eb6923] flex items-center justify-center">
                    <i className="fa-solid fa-images text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Manage Portfolio</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Add/remove live showcase designs</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
              </div>

              {/* Button 2: Service Configurator */}
              <div 
                onClick={() => setCurrentModule('service')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] active:border-l-4 active:border-[#eb6923]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eb6923]/10 text-[#eb6923] flex items-center justify-center">
                    <i className="fa-solid fa-sliders text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Manage Services</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Modify pricing structures and form fields</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
              </div>

              {/* Button 3: Order Controller */}
              <div 
                onClick={() => setCurrentModule('order')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] active:border-l-4 active:border-[#eb6923]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eb6923]/10 text-[#eb6923] flex items-center justify-center">
                    <i className="fa-solid fa-receipt text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Manage Orders</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Track user requirements & live submissions</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
              </div>

            </div>
          </div>
        )}

        {/* 2. DYNAMIC MODULE LOADING ENGINES */}
        {currentModule === 'portfolio' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center py-10">
            {/* Future Placement: <HomePortfolio /> */}
            <i className="fa-solid fa-images text-4xl text-[#eb6923]/20 mb-3"></i>
            <h4 className="font-bold text-sm">Portfolio Sub-System Gateway</h4>
            <p className="text-xs text-gray-400 mt-1">Ready for homeportfolio.jsx connection</p>
          </div>
        )}

        {currentModule === 'service' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center py-10">
            {/* Future Placement: <ServiceAdmin /> */}
            <i className="fa-solid fa-sliders text-4xl text-[#eb6923]/20 mb-3"></i>
            <h4 className="font-bold text-sm">Service Control Grid</h4>
            <p className="text-xs text-gray-400 mt-1">Ready for service.jsx connection</p>
          </div>
        )}

        {currentModule === 'order' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center py-10">
            {/* Future Placement: <OrderAdmin /> */}
            <i className="fa-solid fa-receipt text-4xl text-[#eb6923]/20 mb-3"></i>
            <h4 className="font-bold text-sm">Order Ledger Console</h4>
            <p className="text-xs text-gray-400 mt-1">Ready for order.jsx connection</p>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminPanel;
