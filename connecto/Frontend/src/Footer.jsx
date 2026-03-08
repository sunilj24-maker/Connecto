import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 py-8 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-medium">
        <p>&copy; {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy & Data Policy</Link>
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
