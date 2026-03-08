import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // if you have react-router-dom handy, we can use useNavigate. 
  // since this is a modal, we might just redirect or reload on success.
  // const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.data.id);
        
        // Use window.location as fallback if navigate isn't wired optimally
        window.location.href = '/dashboard'; 
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-black animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200 border border-slate-100">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
        <p className="text-slate-500 font-medium mb-8">Sign in to your creator account.</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-bold mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold block">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold tracking-tight text-lg py-4 rounded-full mt-4 hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
