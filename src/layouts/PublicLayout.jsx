// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Train, Sparkles, Shield, Heart } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">RAILCARE AI PLATFORM</span>
            <span>—</span>
            <span>From Complaints to Incidents</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Smart India Hackathon Prototype</span>
            <span>•</span>
            <span className="text-cyan-400">Multimodal Complaint Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
