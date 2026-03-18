import React, { useState, useEffect } from 'react';
import Admin from './Admin';
import { Lock, Eye, EyeOff } from 'lucide-react';

const SESSION_KEY = 'fujimi_admin_auth';

const AdminGate = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Persist auth for the session so they don't re-enter every page reload
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      // No password set — allow access (dev mode fallback)
      setAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
      return;
    }

    if (password === adminPassword) {
      setAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 600);
    }
  };

  if (authenticated) return <Admin />;

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className={`relative w-full max-w-sm transition-transform duration-100 ${shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        {/* Lock icon */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-5">
            <Lock className="w-6 h-6 text-white/70" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">Restricted Access</h1>
          <p className="text-white/40 text-sm mt-2 text-center">Enter the admin password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all text-base pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400/80 text-sm text-center px-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={!password}
            className={`w-full py-5 rounded-full font-medium tracking-wide transition-all ${!password ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-95'}`}
          >
            Enter
          </button>
        </form>
      </div>

      {/* Add shake keyframe to the page */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default AdminGate;
