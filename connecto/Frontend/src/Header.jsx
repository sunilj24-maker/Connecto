import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full bg-white z-50 sticky top-0 border-b border-slate-100">
      <Link to="/" className="flex items-center gap-1 font-extrabold text-xl tracking-tighter cursor-pointer">
        <span>Connect</span>
        <span className="text-slate-400">Hub</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="/#how-it-works" className="hover:text-black transition-colors">How it Works</a>
        <a href="/#features" className="hover:text-black transition-colors">Features</a>
        <a href="/#about" className="hover:text-black transition-colors">About</a>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="bg-white border border-slate-300 text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors inline-block"
        >
          Log In
        </button>
        <Link to="/" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors inline-block">
          Get Started
        </Link>
      </div>
    </nav>
    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
