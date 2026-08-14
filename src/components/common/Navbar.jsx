// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Train, Shield, PlusCircle, Search, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/report', label: 'Report Grievance', icon: PlusCircle },
    { path: '/track', label: 'Track Status', icon: Search }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  RAILCARE <span className="text-cyan-400">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded">
                  INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">From complaints to incidents</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Switch Button */}
            <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-slate-800 flex items-center">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Control Room</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
