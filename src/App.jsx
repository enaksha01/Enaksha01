import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';

// =========================================
// FIREBASE CONFIG START
// =========================================
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

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
// =========================================
// FIREBASE CONFIG END
// =========================================

function App() { 
  // --- STATES ---
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formType, setFormType] = useState(null);

  // --- LOGIC & EFFECTS ---
  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => setShowSplash(false), 4200);
    
    // Auth observer (Login check karne ke liye)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Auth handler (Login/Signup process)
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      alert(authMode === 'login' ? "Welcome Back!" : "Account Created!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Service click logic (Auth check ke sath)
  const handleServiceClick = (type) => {
    if (!user) {
      setActiveTab('profile'); // Login nahi toh bhej do profile pe
    } else {
      setFormType(type); // Login hai toh khol do form
    }
  };

  return (
    <div className="app-container">
      {/* 1. ORIGINAL SPLASH SCREEN */}
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

      {!showSplash && (
        <>
          {/* FIXED HEADER */}
          <header id="main-header">
            <div className="header-logo-text">
              <span style={{ color: '#eb6923' }}>e</span><span style={{ color: '#5c5c5c' }}>-</span><span style={{ color: '#4b7dbd' }}>Naksha</span>
            </div>
            <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-bars-staggered" style={{ fontSize: '1.6rem', color: '#5c5c5c' }}></i>
            </div>
          </header>

          {/* SIDE MENU */}
          <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
          <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
            <div onClick={toggleMenu} style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fa-solid fa-xmark fa-2xl"></i></div>
            <ul style={{ listStyle: 'none', marginTop: '30px', padding: 0 }}>
              <li className="menu-li" onClick={() => { setActiveTab('home'); toggleMenu(); }}>Home</li>
              <li className="menu-li" onClick={() => { setActiveTab('service'); toggleMenu(); }}>Services</li>
            </ul>
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="main-content">
            {activeTab === 'home' && (
              <div id="home" className="content-section">
                <h3>Portfolio</h3>
                <div className="portfolio-grid">
                  <div className="portfolio-item">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" alt="Duplex" />
                    <div className="portfolio-label">Duplex Home</div>
                  </div>
                  <div className="portfolio-item">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" alt="3D Elevation" />
                    <div className="portfolio-label">3D Elevation</div>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICE TAB SECTION */}
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
                    <h2 className="form-title">
                      {formType === '2d' ? '2D Layout' : '3D Elevation'}
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); alert("Proceeding to Payment..."); }}>
                      <div className="input-group-form">
                        <label>Plot Dimensions</label>
                        <input type="text" className="form-input-field" placeholder="e.g. 20 x 50 ft" required />
                      </div>
                      <button type="submit" className="submit-btn-form">CONFIRM & PAY NOW</button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'order' && <div className="content-section"><h2>Orders</h2><p>No orders yet.</p></div>}

            {/* PROFILE SECTION WITH IMPORTED AUTH */}
            {activeTab === 'profile' && (
              <div className="content-section">
                {!user ? (
                  <Auth 
                    authMode={authMode} 
                    setAuthMode={setAuthMode} 
                    handleAuth={handleAuth}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setName={setName} 
                    setUsername={setUsername}
                  />
                ) : (
                  <div className="profile-card">
                    <div className="user-avatar">{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</div>
                    <h3>Welcome Back</h3>
                    <p>{user.email}</p>
                    <button className="logout-btn" onClick={() => signOut(auth)}>LOGOUT</button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* STYLISH BOTTOM NAV */}
          <nav className="bottom-nav">
            <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </div>
            <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => {setActiveTab('service'); setFormType(null);}}>
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <span>Service</span>
            </div>
            <div className={`nav-item ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Order</span>
            </div>
            <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fa-solid fa-user"></i>
              <span>Profile</span>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

export default App;
              
