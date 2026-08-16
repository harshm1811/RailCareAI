// src/components/common/PriorityBadge.jsx
import React from 'react';
import { AlertCircle, AlertTriangle, Info, Flame } from 'lucide-react';

/**
 * PriorityBadge component displays priority levels with distinct colors, icons, and text labels.
 * Levels: CRITICAL, HIGH, MEDIUM, LOW
 */
export default function PriorityBadge({ priority = 'LOW', size = 'md' }) {
  const normPriority = (priority || 'LOW').toUpperCase();

  const configs = {
    CRITICAL: {
      bg: 'bg-red-950/70 border-red-500/50 text-red-300 glow-red',
      icon: Flame,
      label: 'CRITICAL',
      iconColor: 'text-red-400'
    },
    HIGH: {
      bg: 'bg-amber-950/60 border-amber-500/50 text-amber-300 glow-amber',
      icon: AlertTriangle,
      label: 'HIGH',
      iconColor: 'text-amber-400'
    },
    MEDIUM: {
      bg: 'bg-blue-950/50 border-blue-500/40 text-blue-300',
      icon: AlertCircle,
      label: 'MEDIUM',
      iconColor: 'text-blue-400'
    },
    LOW: {
      bg: 'bg-slate-800/80 border-slate-700 text-slate-300',
      icon: Info,
      label: 'LOW',
      iconColor: 'text-slate-400'
    }
  };

  const config = configs[normPriority] || configs.LOW;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3.5 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wider uppercase font-mono transition-all ${
        config.bg
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      <IconComponent className={`w-3.5 h-3.5 ${config.iconColor} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
}
