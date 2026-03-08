import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_URL) || 
                    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const supabaseKey = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_ANON_KEY) || 
                    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');



export default function CreatorLanding() {
  // 3-step auth flow state
  const [authStep, setAuthStep] = useState(1);   // 1=Request OTP, 2=Verify OTP, 3=Set Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Google OAuth
  const handleGoogleLogin = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
    if (oauthError) setError(oauthError.message || 'Google sign-in failed.');
  };

  // Step 1: Send OTP (email only)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({ email });
      if (otpError) throw otpError;
      setAuthStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' });
      if (verifyError) throw verifyError;
      if (data.session) {
        setAuthStep(3);
      } else {
        setError('Verification succeeded but no session was created. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set Password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      console.log('Password set successfully!');
      // Reset and redirect
      setAuthStep(1);
      setEmail(''); setOtpCode(''); setPassword(''); setConfirmPassword('');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col selection:bg-black selection:text-white">
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow">
      {/* 1. Hero Section (The Form First) */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Massive Headline */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-black">
              Monetize<br />Your<br />Audience.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Join the invite-only network of local creators. Sign up in seconds.
            </p>
          </div>

          {/* Right Column: The Auth Card */}
          <div className="w-full max-w-md mx-auto lg:ml-auto lg:mx-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              {/* Step Progress Indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1,2,3].map(step => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      authStep === step ? 'bg-black text-white' :
                      authStep > step ? 'bg-slate-200 text-slate-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>{step}</div>
                    {step < 3 && <div className={`flex-1 h-px w-10 transition-all ${ authStep > step ? 'bg-black' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>

              {/* Error Block */}
              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* ── STEP 1: Request OTP ── */}
              {authStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-black mb-1">Get Started</h2>
                    <p className="text-slate-500 text-sm font-medium">We'll send a one-time code to verify your identity.</p>
                  </div>

                  {/* Google Sign-In */}
                  <button type="button" onClick={handleGoogleLogin} disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="mx-3 text-slate-400 text-sm font-medium">or use email</span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  <input
                    type="email" required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors font-medium"
                  />

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold text-base py-3.5 rounded-lg hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
                    Send Verification Code
                  </button>
                </form>
              )}

              {/* ── STEP 2: Verify OTP ── */}
              {authStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-black mb-1">Enter Verification Code</h2>
                    <p className="text-slate-500 text-sm font-medium">
                      We sent a 6-digit code to <span className="font-bold text-black">{authMethod === 'email' ? email : '+91 ' + phone}</span>
                    </p>
                  </div>

                  <input
                    type="text" required inputMode="numeric" autoComplete="one-time-code"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-4xl font-black tracking-[0.4em] px-4 py-4 bg-white border border-slate-200 rounded-lg text-black placeholder:text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold text-base py-3.5 rounded-lg hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
                    Verify Code
                  </button>

                  <button type="button"
                    onClick={() => { setAuthStep(1); setOtpCode(''); setError(''); }}
                    className="w-full py-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-black transition-all"
                  >
                    ← Go Back
                  </button>
                </form>
              )}

              {/* ── STEP 3: Set Password ── */}
              {authStep === 3 && (
                <form onSubmit={handleSetPassword} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-black mb-1">Secure Your Account</h2>
                    <p className="text-slate-500 text-sm font-medium">Set a password for your new creator profile.</p>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password (min 6 characters)"
                      className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-lg text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors font-medium"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-lg text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors font-medium"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold text-base py-3.5 rounded-lg hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
                    Save Password & Continue
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. "What we offer" Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-center mb-16 text-black">
          What we offer.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 hover:shadow-lg transition-shadow duration-300">
            <span className="text-5xl font-black block mb-6 text-black">1</span>
            <h3 className="text-2xl font-bold mb-4 text-black tracking-tight">Brand Partnerships</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Connect with top brands seeking creators exactly like you. Stop sending cold emails and let our algorithm bring high-paying deals directly to your inbox.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 hover:shadow-lg transition-shadow duration-300">
            <span className="text-5xl font-black block mb-6 text-black">2</span>
            <h3 className="text-2xl font-bold mb-4 text-black tracking-tight">Campaign Management</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Benefit from our expertise. Manage deliverables, timelines, and communications all in one centralized dashboard. Never lose track of a brief again.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 hover:shadow-lg transition-shadow duration-300">
            <span className="text-5xl font-black block mb-6 text-black">3</span>
            <h3 className="text-2xl font-bold mb-4 text-black tracking-tight">Performance Insights</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Track and measure success. Access enterprise-grade analytics to prove your ROI to brands, negotiate better rates, and understand your audience growth.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 hover:shadow-lg transition-shadow duration-300">
            <span className="text-5xl font-black block mb-6 text-black">4</span>
            <h3 className="text-2xl font-bold mb-4 text-black tracking-tight">Automated Payouts</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Stop chasing invoices. All payments are secured in escrow before you start working and disbursed automatically upon approval of your content.
            </p>
          </div>

        </div>
      </section>

      {/* 3. "How it works" Section (Sticky Stacking Cards) */}
      <section className="w-full py-32 px-6 bg-slate-50 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-center mb-24 text-black">
            How it works.
          </h2>
          
          <div className="relative space-y-8 md:space-y-0 h-auto">
            
            {/* Sticky Card 1 */}
            <div className="md:sticky top-24 z-10 w-full mb-8 md:mb-0">
              <div className="bg-black text-white border border-slate-800 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-slate-700 text-sm font-bold tracking-wide uppercase">Step 01</div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Subscribe to Our Service</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-md">
                    Create your profile in under 2 minutes. Authenticate your social accounts to instantly verify your audience data without taking a single screenshot.
                  </p>
                </div>
                <div className="flex-1 w-full bg-slate-900 rounded-2xl aspect-video md:aspect-square max-h-[300px] flex items-center justify-center border border-slate-800">
                   {/* Minimalist Graphic Placeholder */}
                   <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-700 animate-spin-slow"></div>
                </div>
              </div>
            </div>

            {/* Sticky Card 2 */}
            <div className="md:sticky top-32 z-20 w-full mb-8 md:mb-0 md:mt-[50vh]">
              <div className="bg-black text-white border border-slate-800 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-slate-700 text-sm font-bold tracking-wide uppercase">Step 02</div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Get Matched with Brands</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-md">
                    Our data-engine pairs you exclusively with brands searching for your specific audience demographic. High relevance means higher conversion rates.
                  </p>
                </div>
                <div className="flex-1 w-full bg-slate-900 rounded-2xl aspect-video md:aspect-square max-h-[300px] flex items-center justify-center border border-slate-800">
                   {/* Minimalist Graphic Placeholder */}
                   <div className="flex gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-slate-800"></div>
                     <div className="w-16 h-16 rounded-2xl bg-white/10 animate-pulse"></div>
                   </div>
                </div>
              </div>
            </div>

            {/* Sticky Card 3 */}
            <div className="md:sticky top-40 z-30 w-full md:mt-[50vh]">
              <div className="bg-black text-white border border-slate-800 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-slate-700 text-sm font-bold tracking-wide uppercase">Step 03</div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Create & Get Paid</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-md">
                    Review the content brief, submit your drafts directly through the platform, post, and watch your escrowed funds transfer automatically.
                  </p>
                </div>
                 <div className="flex-1 w-full bg-slate-900 rounded-2xl aspect-video md:aspect-square max-h-[300px] flex items-center justify-center border border-slate-800">
                   {/* Minimalist Graphic Placeholder */}
                   <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-3xl font-black">
                     $
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
