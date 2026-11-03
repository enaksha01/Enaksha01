import React from 'react';

const Auth = ({ 
  authMode, 
  setAuthMode, 
  handleAuth, 
  setEmail, 
  setPassword, 
  setUsername, 
  setName, 
  handleForgotPassword,
  onBack
}) => {
  return (
    <div className="w-full py-4 animate-fadeIn">
      <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-6 sm:p-8 overflow-hidden text-left">
        
        {/* Blueprint background grid accent */}
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#eb6923]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Back Button */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button 
            type="button" 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-[#eb6923] bg-slate-950/80 hover:bg-slate-950 border border-white/10 hover:border-[#eb6923]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer tactile-click"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>BACK</span>
          </button>

          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
            SECURE CAD GATEWAY
          </span>
        </div>

        {/* Brand Header with 3D Logo Accent */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-[#eb6923]/40 shadow-cad-glow mb-3">
            <i className="fa-solid fa-compass-drafting text-2xl text-[#eb6923]"></i>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            <span className="text-[#eb6923]">e</span>-Naksha <span className="text-sm font-mono text-slate-400 font-normal">Portal</span>
          </h2>
          
          <p className="text-xs text-slate-400 font-mono mt-1">
            {authMode === 'login' ? 'Authenticate to manage your 2D & 3D projects' : 'Create an architectural client account'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-950/90 border border-white/10 mt-5">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-gradient-to-r from-[#eb6923] to-[#ff7828] text-white shadow-3d-orange' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMode === 'signup' 
                  ? 'bg-gradient-to-r from-[#eb6923] to-[#ff7828] text-white shadow-3d-orange' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="relative z-10 space-y-3.5">
          {authMode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
                  Full Name
                </label>
                <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
                  <i className="fa-solid fa-user text-xs text-[#eb6923] w-5"></i>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Sharma" 
                    onChange={(e) => setName(e.target.value)} 
                    className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-sans"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
                  Username
                </label>
                <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
                  <i className="fa-solid fa-at text-xs text-[#eb6923] w-5"></i>
                  <input 
                    type="text" 
                    placeholder="e.g. ramesh_arch" 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-mono"
                    required 
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Email Address
            </label>
            <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
              <i className="fa-solid fa-envelope text-xs text-[#eb6923] w-5"></i>
              <input 
                type="email" 
                placeholder="name@domain.com" 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-sans"
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Password
            </label>
            <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#eb6923] focus-within:shadow-[0_0_15px_rgba(235,105,35,0.3)] transition-all">
              <i className="fa-solid fa-lock text-xs text-[#eb6923] w-5"></i>
              <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-mono tracking-widest"
                required 
              />
            </div>
          </div>

          {authMode === 'login' && (
            <div className="text-right pt-0.5">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-mono text-slate-400 hover:text-[#eb6923] transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className={`fa-solid ${authMode === 'login' ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`}></i>
            <span>{authMode === 'login' ? 'LOGIN TO WORKSPACE' : 'CREATE ACCOUNT'}</span>
          </button>
        </form>

        {/* Footer Note */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-mono">
          {authMode === 'login' ? (
            <p>
              New to e-Naksha?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('signup')}
                className="text-[#eb6923] font-bold hover:underline cursor-pointer"
              >
                Sign Up Now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('login')}
                className="text-[#eb6923] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Auth;
