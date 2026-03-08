import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreatorLanding from './CreatorLanding';
import CreatorDashboard from './CreatorDashboard';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Header from './Header';
import Footer from './Footer';

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

const CheckCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const MainLanding = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      
      {/* Navigation Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        
        {/* Hero Section */}
        <section className="px-4 pt-20 pb-24 max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center text-center space-y-6 mb-16 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
              Data-Driven Matchmaking
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-4xl text-black">
              The Growth Engine for Local Commerce & Creators.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium">
              Seamlessly connect authentic micro-influencers with enterprise and local businesses. Stop guessing with impressions, start tracking measurable ROI.
            </p>
          </div>

          {/* The Split (CTA Area) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            
            {/* Card 1: Creators */}
            <Link 
              to="/creator" 
              className="group relative flex flex-col p-8 bg-white border border-slate-200 rounded-3xl transition-all duration-300 hover:bg-black hover:border-black hover:shadow-xl cursor-pointer text-left"
            >
              <div className="h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center mb-6 text-black group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <StarIcon />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-black group-hover:text-white transition-colors duration-300">I am a Creator</h3>
              <p className="text-slate-500 font-medium mb-8 flex-grow group-hover:text-slate-300 transition-colors duration-300">
                Monetize your native audience. Sync your APIs for authenticated reach and collaborate seamlessly.
              </p>
              <div className="flex items-center font-bold text-black group-hover:text-white group-hover:underline mt-auto transition-colors duration-300">
                Join the Roster 
                <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </div>
            </Link>

            {/* Card 2: Businesses - UPDATED TO DEFAULT WHITE, HOVER BLACK */}
            <a 
              href="https://google.com" 
              className="group relative flex flex-col p-8 bg-white border border-slate-200 rounded-3xl transition-all duration-300 hover:bg-black hover:border-black hover:shadow-xl cursor-pointer text-left"
            >
              <div className="h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center mb-6 text-black group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <StoreIcon />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-black group-hover:text-white transition-colors duration-300">I am a Business</h3>
              <p className="text-slate-500 font-medium mb-8 flex-grow group-hover:text-slate-300 transition-colors duration-300">
                Eliminate ad-blindness. Target high-ROI local nano and micro-creators with real-time attribution tracking.
              </p>
              <div className="flex items-center font-bold text-black group-hover:text-white group-hover:underline mt-auto transition-colors duration-300">
                Explore Creators
                <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </div>
            </a>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-slate-50 py-24 px-4 border-y border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Engineered for ROI</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">The $32.55B creator economy demands absolute data integrity. We protect your ad spend against fraudulent metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <ActivityIcon className="text-blue-600 mb-4 h-8 w-8" />
                <h3 className="text-xl font-bold mb-3">Real-Time API Sync</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  We integrate natively with Meta, Alphabet, and ByteDance middleware. No screenshots, just 100% verified audience demographics and engagement rates.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <StarIcon className="text-yellow-500 mb-4 h-8 w-8" />
                <h3 className="text-xl font-bold mb-3">Micro-Creator Focus</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Access authenticated nano and micro-influencers (1k-100k followers) who drive up to 4.2% engagement, outperforming traditional corporate ad-spend.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <CheckCircleIcon className="text-green-500 mb-4 h-8 w-8" />
                <h3 className="text-xl font-bold mb-3">Attribution & Escrow</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Bridge the gap between likes and sales. Utilize our integrated UTM tracking, custom promo code generation, and automated hybrid affiliate payouts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">How Matchmaking Works</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">A frictionless, dual-sided marketplace designed to replace clunky enterprise software and opaque agencies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Decorative line connecting steps */}
              <div className="hidden md:block absolute top-[24px] left-[15%] right-[15%] h-px bg-slate-200 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-black/20">1</div>
                <h3 className="text-xl font-bold mb-2">Connect & Verify</h3>
                <p className="text-slate-500 text-sm">Creators authenticate their social profiles via highly-secure API middleware. Brands define their target exact demographics and ROI goals.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-black/20">2</div>
                <h3 className="text-xl font-bold mb-2">Smart Matchmaking</h3>
                <p className="text-slate-500 text-sm">Our algorithm pairs brands with hyper-local nano/micro creators leveraging deep audience analytics, preventing tone-deaf and overlapping campaigns.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-black/20">3</div>
                <h3 className="text-xl font-bold mb-2">Track & Scale</h3>
                <p className="text-slate-500 text-sm">Manage creative briefs, monitor real-time pixel conversions, and automate hybrid payments entirely inside the platform loop.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full bg-black text-white py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">About the Ecosystem</h2>
            <div className="space-y-6 text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
              <p>
                The digital advertising ecosystem is undergoing a structural recalibration. Consumers suffer from profound ad-blindness and synthetic media fatigue. Standard display ads yield diminishing returns.
              </p>
              <p>
                We built ConnectHub because traditional advertising is losing ground and existing creator platforms are prohibitively expensive for local businesses. We believe that authentic, localized storytelling beats generic interruption marketing every time. 
              </p>
              <p className="text-white pt-4">
                Our mission is to establish the infrastructure for the creator economy's middle class, matching authentic voices with the businesses that need them most.
              </p>
            </div>
            <div className="mt-12">
               <a href="https://google.com" className="bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition-colors inline-block">
                Start Building Trust
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/creator" element={<CreatorLanding />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}
