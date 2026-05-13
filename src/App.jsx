import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import LayoutForm from './LayoutForm';
import ElevationForm from './ElevationForm';
import Orders from './Orders'; // Naya component import kiya
import { supabase } from './lib/supabase';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4200);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { clearTimeout(timer); subscription.unsubscribe(); };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { error } = authMode === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) throw error;
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    alert(error ? error.message : "Password reset link sent to your email!");
  };

  // --- Naya Handle Order Submit (Payment + Formula logic) ---
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setActiveTab('profile'); return; }
    
    const form = e.target;
    const file = form.elements.siteFile.files[0];
    if (!file) return alert("Please upload a site photo/sketch.");

    const options = {
      key: "Rzp_test_Sk3KAPlDWASFJY", // Teri Razorpay Key
      amount: 100, // ₹1
      currency: "INR",
      name: "e-Naksha",
      description: "Architectural Service Fee",
      theme: { color: "#eb6923" },
      handler: async function (response) {
        setUploading(true);
        try {
          // 1. Photo Upload
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          const { error: upError } = await supabase.storage.from('site-images').upload(fileName, file);
          if (upError) throw upError;

          const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName);

          // 2. Database Entry with Payment Success
          const { error: dbError } = await supabase.from('orders').insert([{
            user_id: user.id,
            user_email: user.email,
            type: formType,
            dimensions: form.elements.plotSize.value,
            details: form.elements.details.value,
            file_url: urlData.publicUrl,
            payment_status: 'Success'
          }]);

          if (dbError) throw dbError;
          
          alert("Order & Payment Successful!");
          setFormType(null);
          setActiveTab('order'); // Sidha Orders page par bhejo
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
      <div className="splash-screen">
        <div className="splash-logo">e-Naksha</div>
        <div className="loader-line"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-section">
          <div className="logo-icon"><i className="fa-solid fa-compass-drafting"></i></div>
          <h1>e-Naksha</h1>
        </div>
        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </header>

      <main className="content-area">
        {activeTab === 'home' && (
          <div className="home-hero">
            <h2>Modern Architectural Solutions</h2>
            <p>Get professional 2D & 3D designs for your dream project.</p>
            <div className="hero-stats">
              <div className="stat-item"><span>500+</span><label>Plans</label></div>
              <div className="stat-item"><span>100%</span><label>Quality</label></div>
            </div>
          </div>
        )}

        {activeTab === 'service' && (
          <div className="services-grid">
            {!formType ? (
              <>
                <div className="service-card" onClick={() => setFormType('2D Layout')}>
                  <i className="fa-solid fa-map"></i>
                  <h3>2D Layout Plan</h3>
                  <button className="select-btn">Start Project</button>
                </div>
                <div className="service-card" onClick={() => setFormType('3D Elevation')}>
                  <i className="fa-solid fa-cube"></i>
                  <h3>3D Elevation</h3>
                  <button className="select-btn">Start Project</button>
                </div>
              </>
            ) : (
              <div className="form-container">
                <button className="back-btn" onClick={() => setFormType(null)}>← Back</button>
                {formType === '2D Layout' ? (
                  <LayoutForm onSubmit={handleOrderSubmit} uploading={uploading} />
                ) : (
                  <ElevationForm onSubmit={handleOrderSubmit} uploading={uploading} />
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'order' && (
          <div className="orders-section">
            {user ? <Orders user={user} /> : <p className="login-msg">Please login to see orders</p>}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            {!user ? (
              <Auth 
                authMode={authMode} setAuthMode={setAuthMode} handleAuth={handleAuth} 
                setEmail={setEmail} setPassword={setPassword} setName={setName} 
                handleForgotPassword={handleForgotPassword}
              />
            ) : (
              <div className="profile-card">
                <div className="user-avatar">{user.email?.charAt(0).toUpperCase()}</div>
                <h3>My Account</h3>
                <p>{user.email}</p>
                <button className="logout-btn" onClick={() => supabase.auth.signOut()}>LOGOUT</button>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <i className="fa-solid fa-house"></i><span>Home</span>
        </div>
        <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>
          <i className="fa-solid fa-screwdriver-wrench"></i><span>Service</span>
        </div>
        <div className={`nav-item ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
          <i className="fa-solid fa-cart-shopping"></i><span>Order</span>
        </div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <i className="fa-solid fa-user"></i><span>Profile</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
