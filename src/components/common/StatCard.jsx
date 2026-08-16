// src/components/common/StatCard.jsx
import React from 'react';

/**
 * StatCard displays a top-level KPI on the admin dashboard.
 * Props: title, value, subtext, icon (Lucide component), accent ('cyan' | 'amber' | 'rose' | 'emerald')
 */
export default function StatCard({ title, value, subtext, icon: Icon, accent = 'cyan' }) {
  const accents = {
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/30',
      iconBg: 'bg-cyan-950 border-cyan-500/40 text-cyan-400',
      value: 'text-cyan-300',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      iconBg: 'bg-amber-950 border-amber-500/40 text-amber-400',
      value: 'text-amber-300',
    },
    rose: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20',
      iconBg: 'bg-rose-950 border-rose-500/40 text-rose-400',
      value: 'text-rose-300',
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      iconBg: 'bg-emerald-950 border-emerald-500/40 text-emerald-400',
      value: 'text-emerald-300',
    },
  };

  const a = accents[accent] || accents.cyan;

  return (
    <div className={`glass-panel p-5 rounded-2xl border ${a.border} ${a.bg} flex items-start gap-4 transition-all hover:shadow-lg`}>
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${a.iconBg}`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <p className={`text-2xl font-extrabold font-mono leading-tight ${a.value}`}>{value}</p>
        {subtext && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{subtext}</p>}
      </div>
    </div>
  );
}
