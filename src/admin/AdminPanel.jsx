import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  Image as ImageIcon, 
  Sliders, 
  Receipt, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  Network
} from 'lucide-react';

import HomePortfolio from './homeportfolio';
import OrderAdmin from './order';
import SiteSettingsAdmin from './SiteSettingsAdmin';
import SitemapAdmin from './SitemapAdmin';

function AdminPanel({ onExit }) {
  // 🔑 Admin Access States
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // 🎛️ Navigation Inside Admin Module
  const [currentModule, setCurrentModule] = useState('menu'); // 'menu', 'portfolio', 'service', 'order', 'settings', 'sitemap'

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
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 blueprint-grid relative">
        <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
        <main className="max-w-md mx-auto w-full px-4 mt-16 relative z-10">
          
          <form onSubmit={handleAdminPasswordSubmit} className="bg-white dark:bg-slate-900/90 backdrop-blur-2xl p-7 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-5 text-center">
            <div>
              <div className="w-14 h-14 bg-orange-500/15 border border-orange-500/30 text-[#ea580c] dark:text-[#ff8c42] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">Ecore Master Control</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Gated workspace for e-Naksha Administrator</p>
              <span className="text-[10px] font-mono text-[#ea580c] font-bold block mt-1">Default Password: e2026</span>
            </div>

            <div>
              <input 
                type="password" 
                placeholder="••••" 
                value={adminInputPassword} 
                onChange={(e) => setAdminInputPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 text-xl text-center font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 active:scale-95 transition-all duration-150 cursor-pointer"
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
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono font-bold rounded-2xl text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
          </form>

        </main>
      </div>
    );
  }

  // 🎛️ GATE 2: Admin Hub Menu Options
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-300 blueprint-grid relative">
      <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      <main className="max-w-md md:max-w-5xl mx-auto px-4 mt-6 relative z-10 text-left">
        
        {/* Header Navigation Actions */}
        <div className="flex justify-between items-center mb-6">
          {currentModule !== 'menu' ? (
            <button 
              onClick={() => setCurrentModule('menu')}
              className="text-xs font-mono font-bold text-[#ea580c] flex items-center gap-1.5 active:scale-95 border border-orange-500/30 bg-orange-500/10 px-3.5 py-2 rounded-xl cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Master Console</span>
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
              className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 active:scale-95 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Console</span>
            </button>
          )}
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-orange-500/10 text-[#ea580c] dark:text-[#ff8c42] border border-orange-500/30 px-3 py-1 rounded-full">
            Ecore Live Panel
          </span>
        </div>

        {/* 1. MAIN HUB BUTTON LIST VIEW */}
        {currentModule === 'menu' && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Console Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Manage offers, header slogans, client deliverables, CMS blueprint galleries, and SEO sitemaps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Button 0: Site Settings & Header Offer Toggle (NEW) */}
              <div 
                onClick={() => setCurrentModule('settings')}
                className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-xl border-2 border-orange-500/30 hover:border-[#ea580c] flex flex-col justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-[#ea580c] border border-orange-500/30 flex items-center justify-center text-xl shadow-inner">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Offer &amp; Slogan Settings</h4>
                      <span className="text-[9px] bg-[#ea580c] text-white px-1.5 py-0.2 rounded-full font-bold">KEY</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                      Toggle header offer line on/off, edit &apos;Sketch Your Dream&apos; slogan &amp; contact channels
                    </p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-[#ea580c]">
                  <span>EDIT SETTINGS</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Button 1: Home Portfolio */}
              <div 
                onClick={() => setCurrentModule('portfolio')}
                className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-white/10 hover:border-[#ea580c] flex flex-col justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-[#ea580c] border border-orange-500/30 flex items-center justify-center text-xl shadow-inner">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Portfolio &amp; CMS</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Add/remove live showcase blueprint slides &amp; cards</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-[#ea580c]">
                  <span>OPEN MANAGER</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Button 2: Service Configurator */}
              <div 
                onClick={() => setCurrentModule('service')}
                className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 flex flex-col justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center justify-center text-xl shadow-inner">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Service &amp; Pricing</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Update 2D and 3D base prices and fee structures</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-blue-500">
                  <span>OPEN CONFIG</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Button 3: Order Controller */}
              <div 
                onClick={() => setCurrentModule('order')}
                className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-white/10 hover:border-emerald-500 flex flex-col justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Client Orders</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Deliver final PDFs, view uploads, track payments</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-emerald-500">
                  <span>OPEN ORDERS</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Button 4: Dynamic Sitemap & SEO (NEW) */}
              <div 
                onClick={() => setCurrentModule('sitemap')}
                className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-white/10 hover:border-purple-500 flex flex-col justify-between cursor-pointer transition-all duration-200 card-3d-tilt tactile-click"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-500 border border-purple-500/30 flex items-center justify-center text-xl shadow-inner">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Dynamic Sitemap &amp; SEO</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Generate, validate, and download XML sitemaps with priority weighting</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-purple-500">
                  <span>SITEMAP ENGINE</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. DYNAMIC MODULE LOADING ENGINES */}
        {currentModule === 'settings' && (
          <SiteSettingsAdmin />
        )}

        {currentModule === 'sitemap' && (
          <SitemapAdmin />
        )}

        {currentModule === 'portfolio' && (
          <HomePortfolio />
        )}

        {currentModule === 'service' && (
          <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center py-10 space-y-3 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/15 text-[#ea580c] border border-orange-500/30 flex items-center justify-center">
              <Sliders className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Service Matrix Hub</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono max-w-sm mx-auto">
              Service prices can be configured in the Manage Orders tab or customized per service module.
            </p>
            <button 
              onClick={() => setCurrentModule('order')}
              className="px-5 py-2.5 bg-[#ea580c] text-white font-mono font-bold text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
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
