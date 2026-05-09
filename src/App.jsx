import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

          {/* SCROLLABLE HERO SECTION (Middle Part) */}
          <main className="main-content">
            {activeTab === 'home' && (
              <div id="home" className="content-section">
                <h3>Portfolio</h3>
                <div className="portfolio-grid">
                  <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" /><div className="portfolio-label">Duplex Home</div></div>
                  <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" /><div className="portfolio-label">3D Elevation</div></div>
                </div>
              </div>
            )}

            {activeTab === 'service' && (
              <div id="service" className="content-section">
                <div className="service-card" onClick={() => alert('Opening 2D Form...')}>
                  <i className="fa-solid fa-ruler-combined"></i>
                  <h3>2D Layout Plan</h3>
                </div>
                <div className="service-card" onClick={() => alert('Opening 3D Form...')}>
                  <i className="fa-solid fa-cube"></i>
                  <h3>3D Elevation</h3>
                </div>
              </div>
            )}

            {activeTab === 'order' && <div className="content-section"><h2>Orders</h2><p>No orders yet.</p></div>}
            {activeTab === 'profile' && <div className="content-section"><h2>Profile</h2><p>Auth Logic Here.</p></div>}
          </main>

          {/* FIXED BOTTOM NAV (Original Stylish Look) */}
          {/* =========================================
    NAVIGATION START
    ========================================= */}
<nav className="bottom-nav">
  <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
    <i className="fa-solid fa-house"></i>
    <span>Home</span>
  </div>
  <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>
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
{/* =========================================
    NAVIGATION END
    ========================================= */}

        </>
      )}
    </div>
  );
}

export default App;
            
