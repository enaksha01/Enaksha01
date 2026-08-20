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
    const timer = setTimeout(() => setShowSplash(false), 4200);
    
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
    // NAYA CODE: Hero button click handle karne ke liye
  const handleHeroButtonClick = (type) => {
    if (!user) {
      changeTab('profile'); // Bina login wale ko Auth/Profile me bhejo
    } else {
      changeTab('service'); // Login wale ko Service tab me bhejo
      setFormType(type);    // Aur form type set kardo ('2d' ya '3d')
    }
  };
  
  // Hero Showcase ke Target Route Page ko actual React component ke roop me open karega
// URL ko bilkul change nahi karega
const openTargetPage = (pagePath) => {
  // Blank path = kuch bhi open nahi hoga
  if (!pagePath || !pagePath.trim()) {
    return;
  }

  // User login nahi hai = Auth.jsx render hoga
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

  // src/ ho to hatao
  if (cleanPath.startsWith('src/')) {
    cleanPath = cleanPath.substring(4);
  }

  // ./ ya / ho to hatao
  cleanPath = cleanPath.replace(/^\.?\//, '');

  // .jsx nahi hai to automatically add karo
  if (!cleanPath.toLowerCase().endsWith('.jsx')) {
    cleanPath += '.jsx';
  }

  const moduleKey = `./${cleanPath}`;
  const pageModule = targetPageModules[moduleKey];

  // File nahi mili
  if (!pageModule || !pageModule.default) {
    alert(`Target Route Page nahi mili:\n${pagePath}`);
    return;
  }

  // Login hai = actual Target JSX open
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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setActiveTab('profile'); return; }
    if (!window.Razorpay) {
      alert("Razorpay load ho raha hai, ek second ruko.");
      return;
    }

    const form = e.target;
    const file = form.elements.siteFile.files[0];
    if (!file) return alert("Please upload a file.");

    const options = {
      key: "rzp_live_SpD9DCrPBHSi4S", 
      amount: 100, 
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

  if (showSplash) {
    return (
      <div id="splash-screen" className="fixed inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center z-50 transition-colors duration-300">
        <div className="text-center animate-bounce flex flex-col items-center justify-center px-6">
          <img 
            src="/flogo.svg" 
            alt="e-Naksha Splash Logo" 
            className="w-48 h-auto object-contain dark:brightness-110 mb-4"
          />
        </div>
      </div>
    );
  }

  // 🛡️ STRICT GATE: URL checks out for Admin
  if (isAdminRoute) {
    return <Admin />;
  }

  // 🌐 PUBLIC WEBSITE APP MODE
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="max-w-md mx-auto px-4 mt-6">

{targetPage ? (
  React.createElement(targetPage, {
    onBack: () => setTargetPage(null),
    setFormType: () => setTargetPage(null)
  })
) : (
    <>
            {activeTab === 'home' && (
        <Home 
          user={user} 
          changeTab={changeTab} 
          setFormType={setFormType}
          openTargetPage={openTargetPage}
          handleHeroButtonClick={handleHeroButtonClick} 
        />
      )}


      {activeTab === 'service' && (
        <div className="space-y-4">
          {!formType ? (
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => user ? setFormType('2d') : changeTab('profile')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 active:border-b-4 active:border-brandOrange"
              >
                <i className="fa-solid fa-ruler-combined text-2xl text-[#eb6923] mb-3"></i>
                <h3 className="font-bold text-sm">2D Layout Plan</h3>
              </div>

              <div 
                onClick={() => user ? setFormType('3d') : changeTab('profile')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 active:border-b-4 active:border-brandOrange"
              >
                <i className="fa-solid fa-cube text-2xl text-[#eb6923] mb-3"></i>
                <h3 className="font-bold text-sm">3D Elevation</h3>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
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

      {activeTab === 'order' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          {user ? (
            <Orders user={user} />
          ) : (
            <p className="text-center text-gray-500">
              Please login to see orders.
            </p>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-4">
          {!user ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
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
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#eb6923] text-white font-bold text-xl flex items-center justify-center shadow-md mb-3">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-lg font-bold">My Account</h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                {user.email}
              </p>

              <button 
                className="w-full py-2.5 rounded-xl border-b-4 border border-red-600 bg-red-500 text-white font-bold tracking-wide active:scale-95 active:border-b transition-all duration-150"
                onClick={() => supabase.auth.signOut()}
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )}

</main>

      <BottomNavigation activeTab={activeTab} setActiveTab={changeTab} />
    </div>
  );
}

export default App;
