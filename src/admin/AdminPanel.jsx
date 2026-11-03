import React, { useState } from 'react';
import Header from '../components/Header';

import HomePortfolio from './homeportfolio';
import OrderAdmin from './order';

function AdminPanel({ onExit }) {
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
      alert('Incorrect Password! (Default master code: e2026)');
      setAdminInputPassword('');
    }
  };

  // 🔒 GATE 1: Password Gateway Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col transition-colors duration-300 blueprint-grid relative">
        <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
        <main className="max-w-md mx-auto w-full px-4 mt-16 relative z-10">
          
          <form onSubmit={handleAdminPasswordSubmit} className="bg-slate-900/90 backdrop-blur-2xl p-7 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-5 text-center">
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#eb6923]/20 to-transparent border border-[#eb6923]/40 text-[#ff8c42] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-cad-glow">
                <i className="fa-solid fa-shield-halved text-2xl"></i>
              </div>
              <h4 className="font-black text-lg text-white tracking-tight">Ecore Master Control</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">Gated workspace for e-Naksha Administrator</p>
              <span className="text-[10px] font-mono text-[#eb6923] block mt-1">Default Password: e2026</span>
            </div>

            <div>
              <input 
                type="password" 
                placeholder="••••" 
                value={adminInputPassword} 
                onChange={(e) => setAdminInputPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-slate-950/80 text-xl text-center font-bold tracking-widest text-white focus:outline-none focus:border-[#eb6923] focus:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all font-mono"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all duration-150 cursor-pointer"
            >
              VERIFY ACCESS
            </button>

            <button 
              type="button"
              onClick={() => {
                if (typeof onExit === 'function') {
                  onExit();
                } else {
                  window.location.hash = '';
                  window.location.pathname = '/';
                }
              }}
              className="w-full py-2.5 bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white font-mono font-bold rounded-2xl text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/5"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Public Site
            </button>
          </form>

        </main>
      </div>
    );
  }

  // 🎛️ GATE 2: Admin Hub Menu Options
  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 pb-16 transition-colors duration-300 blueprint-grid relative">
      <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      <main className="max-w-md md:max-w-2xl mx-auto px-4 mt-6 relative z-10 text-left">
        
        {/* Header Navigation Actions */}
        <div className="flex justify-between items-center mb-6">
          {currentModule !== 'menu' ? (
            <button 
              onClick={() => setCurrentModule('menu')}
              className="text-xs font-mono font-bold text-[#eb6923] flex items-center gap-1.5 active:scale-95 border border-[#eb6923]/30 bg-[#eb6923]/10 px-3.5 py-2 rounded-xl cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left"></i> Back to Hub
            </button>
          ) : (
            <button 
              onClick={() => {
                if (typeof onExit === 'function') {
                  onExit();
                } else {
                  window.location.hash = '';
                  window.location.pathname = '/';
                }
              }}
              className="text-xs font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1.5 active:scale-95 border border-white/10 bg-slate-900 px-3.5 py-2 rounded-xl cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Exit Console
            </button>
          )}
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#eb6923]/15 text-[#ff8c42] border border-[#eb6923]/30 px-3 py-1 rounded-full">
            Ecore Live Panel
          </span>
        </div>

        {/* 1. MAIN HUB BUTTON LIST VIEW */}
        {currentModule === 'menu' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white border-b pb-2 border-white/10 tracking-tight">Admin Console Matrix</h3>
            
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Button 1: Home Portfolio */}
              <div 
                onClick={() => setCurrentModule('portfolio')}
                className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-white/10 hover:border-[#eb6923]/60 flex items-center justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#eb6923]/15 text-[#ff8c42] border border-[#eb6923]/30 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-images text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Manage Portfolio & CMS</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Add/remove live showcase blueprint slides & cards</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
              </div>

              {/* Button 2: Service Configurator */}
              <div 
                onClick={() => setCurrentModule('service')}
                className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-white/10 hover:border-[#eb6923]/60 flex items-center justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-sliders text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Manage Services & Pricing</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Update 2D and 3D base prices and parameters</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
              </div>

              {/* Button 3: Order Controller */}
              <div 
                onClick={() => setCurrentModule('order')}
                className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-white/10 hover:border-[#eb6923]/60 flex items-center justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-receipt text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Manage Client Orders</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Deliver final PDFs, view uploads, track payments</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
              </div>

            </div>
          </div>
        )}

        {/* 2. DYNAMIC MODULE LOADING ENGINES */}
        {currentModule === 'portfolio' && (
          <HomePortfolio />
        )}

        {currentModule === 'service' && (
          <div className="bg-slate-900/85 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center py-10 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#eb6923]/15 text-[#eb6923] border border-[#eb6923]/30 flex items-center justify-center">
              <i className="fa-solid fa-sliders text-2xl"></i>
            </div>
            <h4 className="font-extrabold text-sm text-white">Service Matrix Hub</h4>
            <p className="text-xs text-slate-400 font-mono">Service prices can be configured in the Manage Orders tab or customized per service module.</p>
            <button 
              onClick={() => setCurrentModule('order')}
              className="px-4 py-2 bg-[#eb6923] text-white font-mono font-bold text-xs rounded-xl shadow-3d-orange"
            >
              Go to Price Manager in Orders
            </button>
          </div>
        )}

        {currentModule === 'order' && (
          <div className="mt-4">
            <OrderAdmin />
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminPanel;
