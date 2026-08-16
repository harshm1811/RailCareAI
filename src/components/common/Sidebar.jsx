// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  BarChart3,
  Train,
  ArrowUpRight,
  Radio
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    {
      to: '/admin',
      end: true,
      label: 'Control Center',
      icon: LayoutDashboard,
      badge: 'LIVE'
    },
    {
      to: '/admin/incidents',
      label: 'Incidents & Clusters',
      icon: ShieldAlert,
      count: '3 Emerging'
    },
    {
      to: '/admin/complaints',
      label: 'Complaints Stream',
      icon: Inbox,
      count: '1,248'
    },
    {
      to: '/admin/analytics',
      label: 'AI & Operations Insights',
      icon: BarChart3
    }
  ];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Sidebar Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-600/30">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>RAILCARE</span>
              <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">
                OPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">CR DIVISION • HQ PUNE</p>
          </div>
        </Link>
      </div>

      {/* Live System Signal Status */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-slate-300">AI Clustering Engine</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          ACTIVE
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 py-2">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
          Operations Hub
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Switch to Passenger Portal */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <Link
          to="/"
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Passenger Portal</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
