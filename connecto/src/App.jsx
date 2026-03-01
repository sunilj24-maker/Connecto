import React from 'react';

// Simple SVG Icons
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const StoreIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1 font-extrabold text-xl tracking-tighter">
          <span>Connect</span>
          <span className="text-slate-400">Hub</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-black transition-colors">How it Works</a>
          <a href="#" className="hover:text-black transition-colors">Features</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
        </div>
        
        <div>
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 w-full pt-16 pb-24 max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            Now in Beta
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-4xl text-black">
            The Growth Engine for Local Commerce & Creators.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium">
            Seamlessly connecting authentic influencers with mid-sized businesses to drive real, measurable local impact.
          </p>
        </div>

        {/* The Split (CTA Area) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          
          {/* Card 1: Creators */}
          <a 
            href="https://creator.yourdomain.com" 
            className="group relative flex flex-col p-8 bg-white border border-slate-200 rounded-3xl transition-all duration-300 hover:border-black hover:shadow-lg cursor-pointer text-left"
          >
            <div className="h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center mb-6 text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
              <StarIcon />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 text-black">I am a Creator</h3>
            <p className="text-slate-500 font-medium mb-8 flex-grow">
              Monetize your local audience and collaborate with brands you love.
            </p>
            <div className="flex items-center font-bold text-black group-hover:underline mt-auto">
              Join the Roster 
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </div>
          </a>

          {/* Card 2: Businesses */}
          <a 
            href="https://business.yourdomain.com" 
            className="group relative flex flex-col p-8 bg-black border border-black rounded-3xl transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 cursor-pointer text-left focus:outline-none"
          >
            <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
              <StoreIcon />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">I am a Business</h3>
            <p className="text-slate-400 font-medium mb-8 flex-grow">
              Find authentic local voices to drive foot traffic and sales.
            </p>
            <div className="flex items-center font-bold text-white group-hover:underline mt-auto">
              Explore Creators
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </div>
          </a>

        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-200 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
