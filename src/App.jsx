import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#e67e22' }}>ESHAL ARCH PORTAL</h1>
      <p>Professional Architectural Solutions</p>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3>Order Requirements</h3>
        <input type="text" placeholder="Plot Dimensions" style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <button style={{ background: '#2b6cb0', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default App;
