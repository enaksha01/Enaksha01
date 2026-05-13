import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import LayoutForm from './LayoutForm';
import ElevationForm from './ElevationForm';
import { account, databases, storage, APPWRITE_CONFIG } from './lib/appwrite';
import { ID } from 'appwrite';

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
    // Appwrite Auth Check
    account.get()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await account.createEmailPasswordSession(email, password);
      } else {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
      }
      const u = await account.get();
      setUser(u);
    } catch (err) { alert(err.message); }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setActiveTab('home');
    } catch (err) { alert(err.message); }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setActiveTab('profile'); return; }
    const file = e.target.elements.siteFile.files[0];
    if (!file) return alert("Please upload a file.");
    setUploading(true);
    try {
      const fileUpload = await storage.createFile(APPWRITE_CONFIG.bucketId, ID.unique(), file);
      await databases.createDocument(
        APPWRITE_CONFIG.dbId, 
        APPWRITE_CONFIG.collectionId, 
        ID.unique(),
        {
          userid: user.$id,
          userEmail: user.email,
          type: formType,
          dimensions: e.target.elements.plotSize.value,
          details: e.target.elements.details?.value || "N/A",
          fileid: fileUpload.$id
        }
      );
      alert("Order Placed Successfully!");
      setFormType(null);
    } catch (err) { alert("Error: " + err.message); }
    finally { setUploading(false); }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (showSplash) {
    return (
      <div id="splash-screen">
        <div className="intro-container">
          <svg className="intro-house-svg" viewBox="0 0 120 100">
            <path className="intro-layer-orange" d="M 60 30 L 95 65 V 95 H 75 V 70 H 55 V 95 H 40 V 50 Z" fill="#eb6923" />
            <path className="intro-layer-blue" d="M 15 70 L 60 25 L 85 50 L 70 65 L 60 55 L 35 80 Z" fill="#4b7dbd" />
          </svg>
          <div className="intro-text"><span style={{color: '#eb6923'}}>e</span>-Naksha</div>
          <div className="intro-slogan">Sketch Your Dream</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header id="main-header">
        <div className="header-logo-text"><span style={{ color: '#eb6923' }}>e</span>-Naksha</div>
        <div onClick={toggleMenu} style={{ cursor: 'pointer' }}><i className="fa-solid fa-bars-staggered"></i></div>
      </header>
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-section">
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
              <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" alt="Duplex" /></div>
              <div className="portfolio-item"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" alt="3D" /></div>
            </div>
          </div>
        )}
        {activeTab === 'service' && (
          <div className="content-section">
            {!formType ? (
              <div className="service-grid">
                <div className="service-card" onClick={() => user ? setFormType('2d') : setActiveTab('profile')}>
                  <i className="fa-solid fa-ruler-combined"></i>
                  <h3>2D Layout Plan</h3>
                </div>
                <div className="service-card" onClick={() => user ? setFormType('3d') : setActiveTab('profile')}>
                  <i className="fa-solid fa-cube"></i>
                  <h3>3D Elevation</h3>
                </div>
              </div>
            ) : (
              <>
                {formType === '2d' && <LayoutForm handleOrderSubmit={handleOrderSubmit} setFormType={setFormType} uploading={uploading} />}
                {formType === '3d' && <ElevationForm handleOrderSubmit={handleOrderSubmit} setFormType={setFormType} uploading={uploading} />}
              </>
            )}
          </div>
        )}
        {activeTab === 'order' && <div className="content-section"><h2>Orders</h2><p>Check Appwrite Console for orders.</p></div>}
        {activeTab === 'profile' && (
          <div className="content-section">
            {!user ? (
              <Auth 
                authMode={authMode} setAuthMode={setAuthMode} handleAuth={handleAuth} 
                setEmail={setEmail} setPassword={setPassword} setName={setName} 
              />
            ) : (
              <div className="profile-card">
                <div className="user-avatar">{user.email?.charAt(0).toUpperCase()}</div>
                <h3>My Account</h3>
                <p>{user.email}</p>
                <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
              </div>
            )}
          </div>
        )}
      </main>
      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><i className="fa-solid fa-house"></i><span>Home</span></div>
        <div className={`nav-item ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}><i className="fa-solid fa-screwdriver-wrench"></i><span>Service</span></div>
        <div className={`nav-item ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}><i className="fa-solid fa-cart-shopping"></i><span>Order</span></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><i className="fa-solid fa-user"></i><span>Profile</span></div>
      </nav>
    </div>
  );
}

export default App;
            
