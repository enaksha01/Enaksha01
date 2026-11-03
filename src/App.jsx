import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './lib/supabase';

// Naye Modular Components Ko Import Kiya
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';

// Baki puraane sub-forms
import Auth from './Auth';
import LayoutForm from './LayoutForm';
import ElevationForm from './ElevationForm';
import Orders from './Orders'; 
import Home from './components/Home'; // Naya premium home screen component

import Admin from './admin/AdminPanel'; // Naya location setup

// Hero Showcase ke Target Route Page ke liye
// src ke andar kisi bhi folder ki JSX file ko dynamically load karega
const targetPageModules = import.meta.glob('./**/*.jsx', { eager: true });

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  // 🧭 Ecore Smart URL Routing State
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  // Currently opened Target Route Page
  const [targetPage, setTargetPage] = useState(null);
  
  useEffect(() => {
    // Smooth splash transition
    const timer = setTimeout(() => setShowSplash(false), 2600);
    
    // 🔄 Continuous Smart URL Checker (Taaki user agar /admin par ho toh direct pakde)
    const checkURLRoute = () => {
      const currentURL = window.location.href.toLowerCase();
      if (currentURL.includes('admin')) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    // Initial trigger
    checkURLRoute();

    // Standard Window Events
    window.addEventListener('popstate', checkURLRoute);
    window.addEventListener('hashchange', checkURLRoute);

    // Mobile backup loops (safety switch)
    const urlInterval = setInterval(checkURLRoute, 1000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => { 
      clearTimeout(timer); 
      clearInterval(urlInterval);
      subscription.unsubscribe(); 
      window.removeEventListener('popstate', checkURLRoute);
      window.removeEventListener('hashchange', checkURLRoute);
    };
  }, []);

  // Tab badalte waqt pichhla tab yaad rakhne ke liye function
  const changeTab = (newTab) => {
    setPreviousTab(activeTab);
    setActiveTab(newTab);
  };

  // Hero button click handle karne ke liye
  const handleHeroButtonClick = (type) => {
    if (!user) {
      changeTab('profile'); // Bina login wale ko Auth/Profile me bhejo
    } else {
      changeTab('service'); // Login wale ko Service tab me bhejo
      setFormType(type);    // Aur form type set kardo ('2d' ya '3d')
    }
  };
  
  // Hero Showcase ke Target Route Page ko actual React component ke roop me open karega
  const openTargetPage = (pagePath) => {
    if (!pagePath || !pagePath.trim()) {
      return;
    }

    if (!user) {
      setTargetPage(() => (props) => (
        <Auth
          authMode={authMode}
          setAuthMode={setAuthMode}
          handleAuth={handleAuth}
          setEmail={setEmail}
          setPassword={setPassword}
          setName={setName}
          handleForgotPassword={handleForgotPassword}
          onBack={() => setTargetPage(null)}
        />
      ));
      return;
    }

    let cleanPath = pagePath.trim().replace(/\\/g, '/');

    if (cleanPath.startsWith('src/')) {
      cleanPath = cleanPath.substring(4);
    }

    cleanPath = cleanPath.replace(/^\.?\//, '');

    if (!cleanPath.toLowerCase().endsWith('.jsx')) {
      cleanPath += '.jsx';
    }

    const moduleKey = `./${cleanPath}`;
    const targetKey = Object.keys(targetPageModules).find(k => {
      const normK = k.toLowerCase().replace(/^\.\//, '');
      const normTarget = cleanPath.toLowerCase();
      return normK === normTarget || normK.endsWith('/' + normTarget) || normK.endsWith(normTarget);
    });
    const pageModule = targetKey ? targetPageModules[targetKey] : targetPageModules[moduleKey];

    if (!pageModule || !pageModule.default) {
      alert(`Target Route Page nahi mili:\n${pagePath}`);
      return;
    }

    setTargetPage(() => pageModule.default);
  };
  
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { error } = authMode === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) throw error;
    } catch (err) { alert(err.message); }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message); else alert("Reset link sent!");
  };

  const handleOrderSubmit = async (e, finalPrice) => {
    e.preventDefault();
    if (!user) { setActiveTab('profile'); return; }
    if (!window.Razorpay) {
      alert("Razorpay load ho raha hai, ek second ruko.");
      return;
    }

    const priceToCharge = finalPrice ? finalPrice : 999; 

    const form = e.target;
    const file = form.elements.siteFile.files[0];
    if (!file) return alert("Please upload a file.");

    const options = {
      key: "rzp_live_SpD9DCrPBHSi4S", 
      amount: priceToCharge * 100,
      currency: "INR",
      name: "e-Naksha",
      description: "Service Booking Fee",
      theme: { color: "#eb6923" },
      handler: async function (response) {
        setUploading(true);
        try {
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          const { error: upError } = await supabase.storage.from('site-images').upload(fileName, file);
          if (upError) throw upError;

          const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName);

          const { error: dbError } = await supabase.from('orders').insert([{
            user_id: user.id,
            user_email: user.email,
            type: formType,
            dimensions: form.elements.plotSize.value,
            details: form.elements.details?.value || "N/A",
            file_url: urlData.publicUrl,
            payment_status: 'Success',
            razorpay_payment_id: response.razorpay_payment_id
          }]);

          if (dbError) throw dbError;
          
          alert("Payment Successful! Order placed ho gaya.");
          setFormType(null);
          setActiveTab('order');
        } catch (err) { 
          alert("System Error: " + err.message);
        } finally { 
          setUploading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // 📐 3D ARCHITECTURAL HUD SPLASH SCREEN
  if (showSplash) {
    return (
      <div id="splash-screen" className="fixed inset-0 bg-[#060a14] flex flex-col items-center justify-center z-50 overflow-hidden select-none">
        {/* Animated Blueprint Grid Background */}
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="absolute w-[500px] h-[500px] bg-[#eb6923]/10 rounded-full blur-3xl animate-pulse" />

        {/* 3D Wireframe Emblem */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-5 animate-fadeIn">
          
          {/* Hologram Cube Container */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/90 border-2 border-[#eb6923]/60 shadow-[0_0_35px_rgba(235,105,35,0.45)]">
            <img 
              src="/logo.svg" 
              alt="e-Naksha Splash Logo" 
              className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(235,105,35,0.6)] animate-pulse"
            />
            {/* Spinning CAD ring */}
            <div className="absolute inset-[-6px] rounded-3xl border border-dashed border-[#eb6923]/40 animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          {/* Brand Typography */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-[#f37032] drop-shadow-[0_2px_12px_rgba(243,112,50,0.6)]">e</span>
              <span className="text-slate-400 font-bold">-</span>
              <span className="text-white">Naksha</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#eb6923] font-semibold">
              3D Architectural Blueprint Studio
            </p>
          </div>

          {/* Futuristic Loading Progress Bar */}
          <div className="w-48 space-y-1.5 pt-2">
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#38bdf8] rounded-full animate-pulse w-3/4 shadow-[0_0_10px_#eb6923]" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>INITIALIZING CAD ENGINE</span>
              <span className="text-[#ff8c42]">100% VAASTU</span>
            </div>
          </div>

          <button 
            onClick={() => setShowSplash(false)}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 pt-4 underline cursor-pointer"
          >
            Skip Intro
          </button>
        </div>
      </div>
    );
  }

  // 🛡️ STRICT GATE: URL checks out for Admin
  if (isAdminRoute) {
    return <Admin onExit={() => { setIsAdminRoute(false); if (window.location.hash.includes('admin')) window.location.hash = ''; }} />;
  }

  // 🌐 PUBLIC WEBSITE APP MODE
  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 pb-28 relative blueprint-grid">
      
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#eb6923]/10 rounded-full blur-3xl pointer-events-none z-0" />
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="max-w-md md:max-w-xl mx-auto px-4 mt-5 relative z-10">

        {targetPage ? (
          React.createElement(targetPage, {
            onBack: () => setTargetPage(null),
            setFormType: () => setTargetPage(null)
          })
        ) : (
          <>
            {/* 1. HOME TAB */}
            {activeTab === 'home' && (
              <Home 
                user={user} 
                changeTab={changeTab} 
                setFormType={setFormType}
                openTargetPage={openTargetPage}
                handleHeroButtonClick={handleHeroButtonClick} 
              />
            )}

            {/* 2. SERVICE TAB */}
            {activeTab === 'service' && (
              <div className="space-y-4 animate-fadeIn">
                {!formType ? (
                  <div className="space-y-4">
                    <div className="text-left mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#eb6923] bg-[#eb6923]/10 px-2.5 py-1 rounded-md border border-[#eb6923]/20">
                        ARCHITECTURE WORKBENCH
                      </span>
                      <h2 className="text-2xl font-black text-white mt-1.5 tracking-tight">
                        Select CAD Service Module
                      </h2>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Choose between 2D Vaastu planning or hyper-realistic 3D exterior renders
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Service 1: 2D Layout Plan */}
                      <div 
                        onClick={() => user ? setFormType('2d') : changeTab('profile')}
                        className="group relative p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/10 hover:border-[#eb6923]/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-cad-glow flex flex-col justify-between text-left cursor-pointer transition-all duration-300 card-3d-tilt tactile-click overflow-hidden"
                      >
                        <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-[#eb6923] bg-[#eb6923]/10 border border-[#eb6923]/30 px-2 py-0.5 rounded-md">
                          STARTS ₹999
                        </div>

                        <div className="space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eb6923]/20 to-transparent border border-[#eb6923]/30 text-[#ff8c42] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-ruler-combined"></i>
                          </div>
                          <div>
                            <h3 className="font-black text-lg text-white group-hover:text-[#ff8c42] transition-colors">
                              2D Layout Plan
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              Complete plot dimensions, room allocations, Vaastu placements, and ventilation paths.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-[#eb6923]">
                          <span>START 2D DRAFT</span>
                          <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>

                      {/* Service 2: 3D Elevation */}
                      <div 
                        onClick={() => user ? setFormType('3d') : changeTab('profile')}
                        className="group relative p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/10 hover:border-[#eb6923]/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-cad-glow flex flex-col justify-between text-left cursor-pointer transition-all duration-300 card-3d-tilt tactile-click overflow-hidden"
                      >
                        <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2 py-0.5 rounded-md">
                          STARTS ₹2499
                        </div>

                        <div className="space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38bdf8]/20 to-transparent border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-cube"></i>
                          </div>
                          <div>
                            <h3 className="font-black text-lg text-white group-hover:text-[#38bdf8] transition-colors">
                              3D Elevation
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              Ultra-realistic 3D exterior renders, modern front facade, lighting, and glasswork design.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-[#38bdf8]">
                          <span>START 3D RENDER</span>
                          <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div>
                    {formType === '2d' && (
                      <LayoutForm 
                        handleOrderSubmit={handleOrderSubmit} 
                        setFormType={setFormType} 
                        uploading={uploading} 
                      />
                    )}

                    {formType === '3d' && (
                      <ElevationForm 
                        handleOrderSubmit={handleOrderSubmit} 
                        setFormType={setFormType} 
                        uploading={uploading} 
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. ORDER TAB */}
            {activeTab === 'order' && (
              <div className="space-y-4 animate-fadeIn">
                {user ? (
                  <Orders user={user} />
                ) : (
                  <div className="p-10 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/10 text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto text-[#eb6923] text-2xl">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-white">Client Login Required</h3>
                      <p className="text-xs text-slate-400 font-mono max-w-xs mx-auto">
                        Please authenticate to view and track your live CAD blueprints and downloadable deliverables.
                      </p>
                    </div>
                    <button
                      onClick={() => changeTab('profile')}
                      className="px-6 py-3 bg-gradient-to-r from-[#eb6923] to-[#ff7828] text-white font-extrabold text-xs rounded-xl shadow-3d-orange border border-white/20 active:scale-95 transition-all cursor-pointer"
                    >
                      Login to Client Portal
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn">
                {!user ? (
                  <Auth 
                    authMode={authMode} 
                    setAuthMode={setAuthMode} 
                    handleAuth={handleAuth} 
                    setEmail={setEmail} 
                    setPassword={setPassword} 
                    setName={setName} 
                    handleForgotPassword={handleForgotPassword}
                    onBack={() => setActiveTab(previousTab || 'home')}
                  />
                ) : (
                  <div className="rounded-3xl bg-slate-900/85 backdrop-blur-xl p-7 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#eb6923]/10 rounded-full blur-2xl pointer-events-none" />

                    {/* User Avatar with Glowing HUD Ring */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#eb6923] to-[#ff7828] text-white font-black text-3xl flex items-center justify-center shadow-3d-orange border-2 border-white/20 transform rotate-[-3deg]">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight">Client Account</h3>

                    <p className="text-xs text-slate-400 font-mono mb-6 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5 mt-1">
                      {user.email}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full mb-6">
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5 text-left">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Status</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[9px]"></i> Active Client
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5 text-left">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Workspace</span>
                        <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                          3D Spatial CAD
                        </span>
                      </div>
                    </div>

                    <button 
                      className="w-full py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-mono font-bold text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      onClick={() => supabase.auth.signOut()}
                    >
                      <i className="fa-solid fa-power-off"></i>
                      <span>TERMINATE SESSION (LOGOUT)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Floating 3D Navigation Dock */}
      <BottomNavigation activeTab={activeTab} setActiveTab={changeTab} />

      {/* 3D Side Menu Drawer & Overlay */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside className={`side-menu ${isMenuOpen ? 'active' : ''} text-slate-100 text-left`}>
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-black text-lg">
            <span className="text-[#f37032]">e</span>-Naksha <span className="text-xs font-mono text-slate-400 font-normal">HUD</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#eb6923] text-sm cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="space-y-1.5 font-mono text-xs">
          <li 
            className="menu-li flex items-center gap-3 font-semibold text-slate-200 hover:text-[#eb6923] cursor-pointer"
            onClick={() => { changeTab('home'); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-house text-[#eb6923] w-5"></i>
            <span>01 // Home Studio</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold text-slate-200 hover:text-[#eb6923] cursor-pointer"
            onClick={() => { changeTab('service'); setFormType('2d'); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-ruler-combined text-[#eb6923] w-5"></i>
            <span>02 // 2D Layout Plan</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold text-slate-200 hover:text-[#eb6923] cursor-pointer"
            onClick={() => { changeTab('service'); setFormType('3d'); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-cube text-[#eb6923] w-5"></i>
            <span>03 // 3D Elevation</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold text-slate-200 hover:text-[#eb6923] cursor-pointer"
            onClick={() => { changeTab('order'); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-layer-group text-[#eb6923] w-5"></i>
            <span>04 // My Projects</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold text-slate-200 hover:text-[#eb6923] cursor-pointer"
            onClick={() => { changeTab('profile'); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-user-astronaut text-[#eb6923] w-5"></i>
            <span>05 // {user ? 'Client Account' : 'Login / Register'}</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-bold text-[#ff8c42] bg-[#eb6923]/10 border border-[#eb6923]/30 rounded-xl mt-4 cursor-pointer"
            onClick={() => { setIsAdminRoute(true); setIsMenuOpen(false); }}
          >
            <i className="fa-solid fa-shield-halved text-[#ff8c42] w-5"></i>
            <span>06 // Admin Master Console</span>
          </li>
        </ul>

        <div className="mt-10 p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1 text-center font-mono text-[10px] text-slate-500">
          <p className="text-slate-400 font-bold">e-Naksha Architectural Services</p>
          <p>Sketch Your Dream • v3.0 CAD</p>
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Systems Nominal</span>
          </div>
        </div>
      </aside>

    </div>
  );
}

export default App;
