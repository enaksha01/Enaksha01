import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';

// Firebase Setup (Source: 4, 5)
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

function App() { 
  // States (Source: 6, 7, 8)
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

  // Logic (Source: 8)
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4200);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => { clearTimeout(timer); unsubscribe(); };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      alert(authMode === 'login' ? "Welcome Back!" : "Account Created!");
    } catch (err) { alert(err.message); }
  };

  const handleServiceClick = (type) => {
    if (!user) { setActiveTab('profile'); } 
    else { setFormType(type); }
  };

  if (showSplash) {
    return (
      <div id="splash-screen">
        <div className="intro-container">
          <svg className="intro-house-svg" viewBox="0 0 120 100">
            <path className="intro-layer-orange" d="M 60 30 L 95 65 V 95 H 75 V 70 H 55 V 95 H 40 V 50 Z" fill="#eb6923" />
            <path className="intro-layer-blue" d="M 15 70 L 60 25 L 85 50 L 70 65 L 60 55 L 35 80 Z" fill="#4b7dbd" />
          </svg>
          <div className="intro-text"><span className="intro-e">e</span>-Naksha</div>
          <div className="intro-slogan">Sketch Your Dream</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header id="main-header">
        <div className="header-logo-text"><span style={{ color: '#eb6923' }}>e</span>-Naksha</div>
        <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-bars-staggered"></i>
        </div>
      </header>

      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
        <div onClick={toggleMenu} style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li className="menu-li" onClick={() => { setActiveTab('home'); toggleMenu(); }}>Home</li>
          <li className="menu-li" onClick={() => { setActiveTab('service'); toggleMenu(); }}>Services</li>
        </ul>
      </div>

      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-section">
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
              <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" alt="Duplex" /></div>
              <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" alt="3D Elevation" /></div>
            </div>
          </div>
        )}

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
                <button className="back-btn" onClick={() => setFormType(null)}>← Back</button>
                <h2 className="form-title">{formType.toUpperCase()} Form</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input className="form-input" placeholder="Dimensions" required />
                  <button type="submit" className="submit-btn">CONFIRM & PAY</button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="content-section">
            {!user ? (
              <Auth 
                authMode={authMode} setAuthMode={setAuthMode} 
                handleAuth={handleAuth} setEmail={setEmail} 
                setPassword={setPassword} setName={setName} 
                setUsername={setUsername} 
              />
            ) : (
              <div className="profile-card">
                <h3>Welcome Back</h3>
                <p>{user.email}</p>
                <button className="logout-btn" onClick={() => signOut(auth)}>LOGOUT</button>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><i className="fa-solid fa-house"></i><span>Home</span></div>
        <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => {setActiveTab('service'); setFormType(null);}}><i className="fa-solid fa-screwdriver-wrench"></i><span>Service</span></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><i className="fa-solid fa-user"></i><span>Profile</span></div>
      </nav>
    </div>
  );
}

export default App;
                                                                                     
