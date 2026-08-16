// src/components/common/StatusBadge.jsx
import React from 'react';
import { Radio, CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';

/**
 * StatusBadge component indicates lifecycle status of complaints and incidents.
 */
export default function StatusBadge({ status = 'REGISTERED', size = 'md' }) {
  const normStatus = (status || 'REGISTERED').toUpperCase();

  const configs = {
    EMERGING: {
      bg: 'bg-rose-950/80 border-rose-500/70 text-rose-200 animate-pulse-subtle',
      dot: 'bg-rose-500 animate-ping',
      label: 'EMERGING INCIDENT',
      icon: ShieldAlert
    },
    UNDER_INVESTIGATION: {
      bg: 'bg-amber-950/60 border-amber-500/40 text-amber-200',
      dot: 'bg-amber-400',
      label: 'INVESTIGATING',
      icon: Clock
    },
    INVESTIGATING: {
      bg: 'bg-amber-950/60 border-amber-500/40 text-amber-200',
      dot: 'bg-amber-400',
      label: 'INVESTIGATING',
      icon: Clock
    },
    ASSIGNED: {
      bg: 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200',
      dot: 'bg-cyan-400',
      label: 'OFFICER ASSIGNED',
      icon: Wrench
    },
    IN_PROGRESS: {
      bg: 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200',
      dot: 'bg-indigo-400',
      label: 'IN PROGRESS',
      icon: Radio
    },
    RESOLVED: {
      bg: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200',
      dot: 'bg-emerald-400',
      label: 'RESOLVED',
      icon: CheckCircle2
    },
    REGISTERED: {
      bg: 'bg-slate-800/80 border-slate-700 text-slate-300',
      dot: 'bg-slate-400',
      label: 'REGISTERED',
      icon: Clock
    }
  };

  const config = configs[normStatus] || configs.REGISTERED;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-2',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-mono shadow-sm ${
        config.bg
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {normStatus === 'EMERGING' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      <span>{config.label}</span>
    </span>
  );
}
