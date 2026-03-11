import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-container">
      {/* Background Animated Blobs */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <main className="hero">
        <h1 className="hero-title">
          Welcome to the <span className="text-gradient">Future</span>
        </h1>
        <p className="hero-subtitle">
          Experience a seamlessly designed, ultra-modern interface built with React, Vite, and cutting-edge aesthetics.
        </p>
        
        <div className="cta-group">
          <button className="btn btn-primary" onClick={() => alert('Get Started Clicked!')}>
            Get Started
          </button>
          <button className="btn btn-secondary">
            View Source
          </button>
        </div>

        <div className="features">
          <div className="feature-card glass">
            <span className="feature-icon">✨</span>
            <h3 className="feature-title">Vibrant Design</h3>
            <p className="feature-desc">Dynamic gradients, glassmorphism, and meticulously refined typography create an unforgettable aesthetic.</p>
          </div>
          
          <div className="feature-card glass">
            <span className="feature-icon">⚡</span>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-desc">Powered by Vite and React, ensuring rapid development cycles and incredible performance.</p>
          </div>
          
          <div className="feature-card glass">
            <span className="feature-icon">🎨</span>
            <h3 className="feature-title">Modern CSS</h3>
            <p className="feature-desc">Engineered with pure CSS mastery. Uncompromised styling with fully custom tokens and variables.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
