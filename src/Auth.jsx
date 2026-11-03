import React from 'react';
import { 
  ArrowLeft, 
  Compass, 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserPlus 
} from 'lucide-react';

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
    <div className="w-full py-4 animate-fadeIn max-w-md mx-auto">
      <div className="relative rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl p-6 sm:p-8 overflow-hidden text-left transition-colors duration-300">
        
        {/* Blueprint background grid accent */}
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

        {/* Back Button */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button 
            type="button" 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-[#ea580c] bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl transition-all cursor-pointer tactile-click"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK</span>
          </button>

          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-black/5 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5">
            CLIENT STUDIO
          </span>
        </div>

        {/* Brand Header with Logo Accent */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#ff7828] text-white shadow-lg shadow-orange-500/25 mb-3">
            <Compass className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            <span className="text-[#ea580c]">e</span>-Naksha <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-normal">Studio</span>
          </h2>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">
            {authMode === 'login' ? 'Authenticate to manage your 2D & 3D projects' : 'Create an architectural client account'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-white/10 mt-5">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMode === 'signup' 
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
                  Full Name
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                  <User className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Sharma" 
                    onChange={(e) => setName(e.target.value)} 
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-sans"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
                  Username
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                  <AtSign className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
                  <input 
                    type="text" 
                    placeholder="e.g. ramesh_arch" 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-mono"
                    required 
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
              Email Address
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Mail className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
              <input 
                type="email" 
                placeholder="name@domain.com" 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-sans"
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block pl-1">
              Password
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Lock className="w-4 h-4 text-[#ea580c] shrink-0 mr-2.5" />
              <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-transparent border-none outline-none w-full text-xs text-slate-900 dark:text-white placeholder-slate-400 font-mono tracking-widest"
                required 
              />
            </div>
          </div>

          {authMode === 'login' && (
            <div className="text-right pt-0.5">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-[#ea580c] transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            {authMode === 'login' ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>LOGIN TO WORKSPACE</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>CREATE ACCOUNT</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
          {authMode === 'login' ? (
            <p>
              New to e-Naksha?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('signup')}
                className="text-[#ea580c] font-bold hover:underline cursor-pointer"
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
                className="text-[#ea580c] font-bold hover:underline cursor-pointer"
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
