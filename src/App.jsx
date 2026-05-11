import React, { useState, useEffect } from 'react';
import './App.css';

/* =========================================
   FIREBASE CONFIG START
   ========================================= */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARmOCO4APamzc8wuUlp5rEgPH8hZUMX6U",
  authDomain: "enkasha-99c34.firebaseapp.com",
  projectId: "enkasha-99c34",
  storageBucket: "enkasha-99c34.firebasestorage.app",
  messagingSenderId: "759836461630",
  appId: "1:759836461630:web:30cc76c2c1075a3df99f6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
/* =========================================
   FIREBASE CONFIG END
   ========================================= */

function App() {
  // 1. STATES START
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [user, setUser] = useState(null); // User state zaruri hai
  // 1. STATES END

  // 2. LOGIC START
  useEffect(() => { 
    // Splash Timer
    const timer = setTimeout(() => setShowSplash(false), 4200);
    
    // Auth Check Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /* =========================================
     AUTH CHECK FUNCTION START
     ========================================= */
  const handleServiceClick = (type) => {
    if (!user) {
      setActiveTab('profile'); // Agar login nahi hai toh profile par bhej do
    } else {
      setFormType(type); // Login hai toh form kholo
    }
  };
  /* =========================================
     AUTH CHECK FUNCTION END
     ========================================= */
  // 2. LOGIC END

  return (
    <div className="app-container">
      {/* SPLASH SCREEN START */}
      {showSplash && (
        <div id="splash-screen">
          <div className="intro-container">
            <svg className="intro-house-svg" viewBox="0 0 120 100">
              <path className="intro-layer-orange" d="M 60 30 L 95 65 V 95 H 75 V 70 H 55 V 95 H 40 V 50 Z" fill="#eb6923" />
              <path className="intro-layer-blue" d="M 15 70 L 60 25 L 85 50 L 70 65 L 60 55 L 35 80 Z" fill="#4b7dbd" />
            </svg>
            <div className="intro-text">
              <span className="intro-e">e</span><span className="intro-dash">-</span><span className="intro-naksha">Naksha</span>
            </div>
            <div className="intro-slogan">Sketch Your Dream</div>
          </div>
        </div>
      )}
      {/* SPLASH SCREEN END */}

      {!showSplash && (
        <>
          {/* HEADER START */}
          <header id="main-header">
            <div className="header-logo-text">
              <span style={{ color: '#eb6923' }}>e</span><span style={{ color: '#5c5c5c' }}>-</span><span style={{ color: '#4b7dbd' }}>Naksha</span>
            </div>
            <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-bars-staggered" style={{ fontSize: '1.6rem', color: '#5c5c5c' }}></i>
            </div>
          </header>
          {/* HEADER END */}

          {/* SIDE MENU START */}
          <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
          <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
            <div onClick={toggleMenu} style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fa-solid fa-xmark fa-2xl"></i></div>
            <ul style={{ listStyle: 'none', marginTop: '30px', padding: 0 }}>
              <li className="menu-li" onClick={() => { setActiveTab('home'); toggleMenu(); }}>Home</li>
              <li className="menu-li" onClick={() => { setActiveTab('service'); toggleMenu(); }}>Services</li>
            </ul>
          </div>
          {/* SIDE MENU END */}

          <main className="main-content">
            {/* HOME SECTION START */}
            {activeTab === 'home' && (
              <div id="home" className="content-section">
                <h3>Portfolio</h3>
                <div className="portfolio-grid">
                  <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" /><div className="portfolio-label">Duplex Home</div></div>
                  <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" /><div className="portfolio-label">3D Elevation</div></div>
                </div>
              </div>
            )}
            {/* HOME SECTION END */}

            {/* SERVICE SECTION START */}
            {activeTab === 'service' && (
              <div className="content-section">
                {!formType ? (
                  <>
                    <div className="service-card" onClick={() => handleServiceClick('2d')}>
                      <i className="fa-solid fa-ruler-combined"></i>
                      <h3>2D Layout Plan</h3>
                    </div>
                    <div className="service-card" onClick={() => handleServiceClick('3d')}>
                      <i className="fa-solid fa-cube"></i>
                      <h3>3D Elevation</h3>
                    </div>
                  </>
                ) : (
                  <div className="form-container">
                    <button className="back-btn" onClick={() => setFormType(null)}>
                      <i className="fa-solid fa-arrow-left"></i> Back to Services
                    </button>
                    <h2 className="form-title">{formType === '2d' ? '2D Plan' : '3D Elevation'}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); alert("Proceeding to Payment..."); }}>
                      <div className="input-group">
                        <label>Plot Dimensions</label>
                        <input type="text" className="form-input" placeholder="20x50" required />
                      </div>
                      <button type="submit" className="submit-btn">CONFIRM & PAY</button>
                    </form>
                  </div>
                )}
              </div>
            )}
            {/* SERVICE SECTION END */}

            {/* =========================================
    ORDER & PROFILE START
    ========================================= */}
{activeTab === 'order' && <div className="content-section"><h2>Orders</h2><p>No orders yet.</p></div>}

{activeTab === 'profile' && (
  <div className="content-section">
    {!user ? (
      <div className="auth-container">
        <div className="auth-title">
          <span style={{color:'#eb6923'}}>Login</span> Account
        </div>
        
        {/* Login/Signup Tabs */}
        <div className="auth-tabs">
          <div className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Login</div>
          <div className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => setAuthMode('signup')}>Signup</div>
        </div>

        <form onSubmit={handleAuth}>
          {authMode === 'signup' && (
            <div className="input-group">
              <input type="text" className="form-input" placeholder="Full Name" required />
            </div>
          )}
          
          <div className="input-group" style={{marginTop: '10px'}}>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email Address" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group" style={{marginTop: '10px'}}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn" style={{marginTop: '20px'}}>
            {authMode === 'login' ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>
      </div>
    ) : (
      <div className="profile-card">
        <div className="user-avatar">
          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </div>
        <h3>Welcome Back!</h3>
        <p style={{marginBottom: '20px'}}>{user.email}</p>
        <button className="logout-btn" onClick={() => signOut(auth)}>
          LOGOUT
        </button>
      </div>
    )}
  </div>
)}
{/* =========================================
    ORDER & PROFILE END
    ========================================= */}

          </main>

          {/* NAVIGATION START */}
          <nav className="bottom-nav">
            <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <i className="fa-solid fa-house"></i><span>Home</span>
            </div>
            <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => {setActiveTab('service'); setFormType(null);}}>
              <i className="fa-solid fa-screwdriver-wrench"></i><span>Service</span>
            </div>
            <div className={`nav-item ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
              <i className="fa-solid fa-cart-shopping"></i><span>Order</span>
            </div>
            <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fa-solid fa-user"></i><span>Profile</span>
            </div>
          </nav>
          {/* NAVIGATION END */}
        </>
      )}
    </div>
  );
}

export default App;
