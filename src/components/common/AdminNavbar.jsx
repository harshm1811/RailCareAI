// src/components/common/AdminNavbar.jsx
import React from 'react';
import { Bell, ShieldAlert, Cpu, Sparkles, User } from 'lucide-react';

export default function AdminNavbar() {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Section Header & Division Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Control Room • Pune Division (CR)
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          <span>Active Incident in Train 12124 (Coach B4)</span>
        </div>
      </div>

      {/* Right: AI Telemetry & Admin Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clustering Latency: <strong>42ms</strong></span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        {/* Admin User Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">Divisional Ops Lead</p>
            <p className="text-[10px] text-slate-400 font-mono">ID: CR-PUNE-881</p>
          </div>
        </div>
      </div>
    </header>
  );
}
