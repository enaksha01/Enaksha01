import React from 'react';

const Auth = ({ authMode, setAuthMode, handleAuth, setEmail, setPassword, setUsername, setName }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Professional Header inside Form */}
        <div className="auth-brand">
          <span className="brand-e">e</span>-Naksha
          <p className="auth-subtitle">{authMode === 'login' ? 'Login User' : 'Create Account'}</p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {authMode === 'signup' && (
            <>
              <div className="input-group">
                <i className="fa-solid fa-user"></i>
                <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-at"></i>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </>
          )}

          <div className="input-group">
            <i className="fa-solid fa-envelope"></i>
            <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <i className="fa-solid fa-lock"></i>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {authMode === 'login' && (
            <div className="forgot-pass">Forgot Password?</div>
          )}

          <button type="submit" className="auth-submit-btn">
            {authMode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="auth-footer">
          {authMode === 'login' ? (
            <p>Don't have an account? <span onClick={() => setAuthMode('signup')}>Create Account</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setAuthMode('login')}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
