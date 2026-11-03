import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './lib/supabase';
import { 
  Home as HomeIcon, 
  Ruler, 
  Box, 
  Layers, 
  User as UserIcon, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Power, 
  ArrowRight, 
  Lock, 
  Sparkles,
  Compass,
  FileText,
  Network
} from 'lucide-react';
import { useSiteSettings } from './lib/settingsStore';

// Naye Modular Components Ko Import Kiya
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import LegalModal from './components/LegalModal';

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
  const { settings } = useSiteSettings();
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

  // 📜 Legal Compliance Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms');

  // 🧭 Ecore Smart URL Routing State
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  // Currently opened Target Route Page
  const [targetPage, setTargetPage] = useState(null);
  
  useEffect(() => {
    // Smooth splash transition
    const timer = setTimeout(() => setShowSplash(false), 1800);
    
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

  const openLegalModal = (tab = 'terms') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Tab badalte waqt pichhla tab yaad rakhne ke liye function
  const changeTab = (newTab) => {
    setPreviousTab(activeTab);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (data?.user) {
          // Smoothly return to previous tab if requested from service or order
          setActiveTab(previousTab && previousTab !== 'profile' ? previousTab : 'home');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password, 
          options: { data: { full_name: name.trim() } } 
        });
        if (error) throw error;
        if (data?.user && !data?.session) {
          alert("Account created successfully! A confirmation link has been sent to your email. Please verify to sign in.");
          setAuthMode('login');
        } else if (data?.user) {
          setActiveTab(previousTab && previousTab !== 'profile' ? previousTab : 'home');
        }
      }
    } catch (err) { 
      alert("Authentication Notice: " + err.message); 
    }
  };

  const handleForgotPassword = async () => {
    let targetEmail = email;
    if (!targetEmail || !targetEmail.trim()) {
      targetEmail = window.prompt("Please enter your registered email address to receive password reset link:");
    }
    if (!targetEmail || !targetEmail.trim()) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail.trim());
      if (error) {
        alert("Password Reset Notice: " + error.message);
      } else {
        alert("Password reset link has been dispatched to " + targetEmail.trim() + "! Please check your inbox and spam folder.");
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }
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
      <div id="splash-screen" className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center z-50 overflow-hidden select-none">
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-4 animate-fadeIn">
          
          {/* Logo directly presented with sharp crispness */}
          <div className="relative flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="e-Naksha Splash Logo" 
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-xl animate-pulse"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center">
              <span className="text-[#ea580c] drop-shadow-[0_2px_12px_rgba(234,88,12,0.6)]">e</span>
              <span className="text-slate-400 px-0.5 font-bold">-</span>
              <span className="text-[#38bdf8] drop-shadow-[0_2px_12px_rgba(56,189,248,0.5)]">Naksha</span>
            </h1>
            <p className="text-[11px] font-mono tracking-widest uppercase text-orange-400 font-bold">
              {settings.siteSlogan || 'Sketch Your Dream'}
            </p>
          </div>

          <div className="w-48 space-y-1.5 pt-2">
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#38bdf8] rounded-full animate-pulse w-3/4 shadow-[0_0_10px_#ea580c]" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>LOADING CAD ENGINE</span>
              <span className="text-orange-400 font-bold">100% VAASTU</span>
            </div>
          </div>

          <button 
            onClick={() => setShowSplash(false)}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 pt-2 underline cursor-pointer"
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-28 relative blueprint-grid transition-colors duration-300 flex flex-col justify-between">
      
      <div>
        {/* Hostinger-grade Header with desktop navigation links, dynamic offer banner & dark/light toggle */}
        <Header 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          activeTab={activeTab} 
          changeTab={changeTab} 
          setFormType={setFormType} 
        />

        {/* Main Expansive Responsive Layout Container (Mobile to Desktop) */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 relative z-10 transition-all duration-300">

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
                <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto text-left">
                  {!formType ? (
                    <div className="space-y-6">
                      <div className="text-left border-b border-slate-200 dark:border-white/10 pb-4">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ea580c] bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                          ARCHITECTURE WORKBENCH
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                          Select CAD Service Module
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono mt-1">
                          Choose between 2D Vaastu planning or hyper-realistic 3D exterior renders
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Service 1: 2D Layout Plan */}
                        <div 
                          onClick={() => user ? setFormType('2d') : changeTab('profile')}
                          className="group relative p-7 rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-[#ea580c] shadow-sm hover:shadow-2xl flex flex-col justify-between text-left cursor-pointer transition-all duration-300 card-3d-tilt tactile-click overflow-hidden"
                        >
                          <div className="absolute top-4 right-4 text-xs font-mono font-bold text-[#ea580c] bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
                            STARTS ₹999
                          </div>

                          <div className="space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/15 text-[#ea580c] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                              <Ruler className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-[#ea580c] transition-colors">
                                2D Layout Plan
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                Complete plot dimensions, room allocations, Vaastu placements, door/window schedules, and ventilation paths.
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>100% Vaastu Shastra Compliance</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>High-Resolution Printable PDF</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[#ea580c]">
                            <span>START 2D DRAFT</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>

                        {/* Service 2: 3D Elevation */}
                        <div 
                          onClick={() => user ? setFormType('3d') : changeTab('profile')}
                          className="group relative p-7 rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 shadow-sm hover:shadow-2xl flex flex-col justify-between text-left cursor-pointer transition-all duration-300 card-3d-tilt tactile-click overflow-hidden"
                        >
                          <div className="absolute top-4 right-4 text-xs font-mono font-bold text-blue-500 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                            STARTS ₹2499
                          </div>

                          <div className="space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                              <Box className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                                3D Elevation Facade
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                Ultra-realistic 3D exterior renders, modern front facade, lighting, glasswork design, and material specs.
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>Photorealistic Day &amp; Night Views</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>Color Theme &amp; Material Palettes</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold text-blue-500">
                            <span>START 3D RENDER</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
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
                <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                  {user ? (
                    <Orders user={user} />
                  ) : (
                    <div className="p-10 rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-xl">
                      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-[#ea580c] flex items-center justify-center mx-auto">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Client Login Required</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono max-w-sm mx-auto">
                          Please authenticate to view and track your live CAD blueprints and downloadable deliverables.
                        </p>
                      </div>
                      <button
                        onClick={() => changeTab('profile')}
                        className="px-6 py-3 bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
                      >
                        Login to Client Studio
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn max-w-md mx-auto">
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
                    <div className="rounded-3xl bg-white dark:bg-slate-900/85 backdrop-blur-xl p-8 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ea580c] to-[#ff7828] text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform rotate-[-2deg]">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Client Account</h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-6 bg-slate-100 dark:bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 mt-1">
                        {user.email}
                      </p>

                      <div className="grid grid-cols-2 gap-3 w-full mb-6">
                        <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Status</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active Client</span>
                          </span>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Workspace</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                            3D Spatial CAD
                          </span>
                        </div>
                      </div>

                      <button 
                        className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-mono font-bold text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => supabase.auth.signOut()}
                      >
                        <Power className="w-4 h-4" />
                        <span>TERMINATE SESSION (LOGOUT)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* 🏛️ STUDIO ARCHITECTURAL FOOTER & COMPLIANCE STRIP */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 pb-12 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Brand info with Orange 'e' and Blue 'Naksha' */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="e-Naksha" 
              className="h-10 w-auto object-contain filter contrast-105" 
            />
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200 flex items-center">
                <span className="text-[#ea580c] font-black">e</span>
                <span className="text-slate-400 dark:text-slate-500 px-0.5 font-bold">-</span>
                <span className="text-[#2563eb] dark:text-[#38bdf8] font-black">Naksha</span>
                <span className="text-slate-400 dark:text-slate-500 mx-2">&bull;</span>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                  {settings.siteSlogan || 'Sketch Your Dream'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Government-compliant 2D architectural CAD plans &amp; 3D elevation studio
              </p>
            </div>
          </div>

          {/* Legal Compliance Links (Terms, Privacy, Refund, Delivery, Disclaimer) */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <button 
              onClick={() => openLegalModal('terms')} 
              className="hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('privacy')} 
              className="hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('refund')} 
              className="hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('shipping')} 
              className="hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              Digital Delivery
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('disclaimer')} 
              className="hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>

          {/* Copyright & Security Compliance (Admin button removed from public view for security) */}
          <div className="text-[11px] text-slate-400 text-center md:text-right space-y-1 font-mono">
            <p>&copy; {new Date().getFullYear()} e-Naksha. All rights reserved.</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center md:justify-end gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>SSL 256-Bit Encrypted &bull; 100% Vaastu Verified</span>
            </p>
          </div>

        </div>
      </footer>

      {/* 📌 PINTEREST-STYLE FLOATING BOTTOM PILL DOCK */}
      <BottomNavigation activeTab={activeTab} setActiveTab={changeTab} />

      {/* 📜 Legal Compliance Modal */}
      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        initialTab={legalModalTab} 
      />

      {/* 3D Side Menu Drawer & Overlay (Dual Theme Aware) */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside className={`side-menu ${isMenuOpen ? 'active' : ''} text-slate-900 dark:text-slate-100 text-left`}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center tracking-tight font-black text-lg select-none">
            <span className="text-[#ea580c] text-xl font-black">e</span>
            <span className="text-slate-400 dark:text-slate-500 px-0.5 font-bold">-</span>
            <span className="text-[#2563eb] dark:text-[#38bdf8] text-xl font-black">Naksha</span>
            <span className="ml-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
              STUDIO
            </span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#ea580c] text-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-1.5 font-mono text-xs">
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { changeTab('home'); setIsMenuOpen(false); }}
          >
            <HomeIcon className="w-4 h-4 text-[#ea580c]" />
            <span>01 // Home Studio</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { changeTab('service'); setFormType('2d'); setIsMenuOpen(false); }}
          >
            <Ruler className="w-4 h-4 text-[#ea580c]" />
            <span>02 // 2D Layout Plan</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { changeTab('service'); setFormType('3d'); setIsMenuOpen(false); }}
          >
            <Box className="w-4 h-4 text-[#ea580c]" />
            <span>03 // 3D Elevation</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { changeTab('order'); setIsMenuOpen(false); }}
          >
            <Layers className="w-4 h-4 text-[#ea580c]" />
            <span>04 // My Projects</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { changeTab('profile'); setIsMenuOpen(false); }}
          >
            <UserIcon className="w-4 h-4 text-[#ea580c]" />
            <span>05 // {user ? 'Client Account' : 'Login / Register'}</span>
          </li>
          <li 
            className="menu-li flex items-center gap-3 font-semibold hover:text-[#ea580c] cursor-pointer"
            onClick={() => { openLegalModal('terms'); setIsMenuOpen(false); }}
          >
            <FileText className="w-4 h-4 text-[#ea580c]" />
            <span>06 // Legal Terms &amp; Policies</span>
          </li>
        </ul>

        <div className="mt-8 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 space-y-1 text-center font-mono text-[10px] text-slate-500">
          <p className="font-bold text-slate-800 dark:text-slate-300">e-Naksha Architectural Services</p>
          <p>{settings.siteSlogan || 'Sketch Your Dream'} &bull; v3.2 CAD</p>
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Studio Systems Online</span>
          </div>
        </div>
      </aside>

    </div>
  );
}

export default App;
