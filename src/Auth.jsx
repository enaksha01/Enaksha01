import React from 'react';

const Auth = ({ 
  authMode, 
  setAuthMode, 
  handleAuth, 
  setEmail, 
  setPassword, 
  setUsername, 
  setName, 
  handleForgotPassword 
}) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button 
  type="button" 
  onClick={() => window.history.back()}
  style={{
    background: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '15px'
  }}
>
  <i className="fa-solid fa-arrow-left"></i> Back
</button>

        {/* Logo/Brand Header */}
        <div className="auth-brand">
          <span className="brand-e">e</span>-Naksha
          <p className="auth-subtitle">
            {authMode === 'login' ? 'Login to User Account' : 'Create Your Account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {authMode === 'signup' && (
            <>
              <div className="input-group">
                <i className="fa-solid fa-user"></i>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-at"></i>
                <input 
                  type="text" 
                  placeholder="Username" 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}

          <div className="input-group">
            <i className="fa-solid fa-envelope"></i>
            <input 
              type="email" 
              placeholder="Email Address" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fa-solid fa-lock"></i>
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {authMode === 'login' && (
            <div 
              className="forgot-pass-link" 
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {authMode === 'login' ? 'LOGIN NOW' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div className="auth-footer">
          {authMode === 'login' ? (
            <p>Don't have an account? <span onClick={() => setAuthMode('signup')}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setAuthMode('login')}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
