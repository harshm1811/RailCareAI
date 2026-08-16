// src/components/common/StatusTimeline.jsx
import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

/**
 * StatusTimeline renders a vertical step-by-step complaint lifecycle.
 * Each step has: label, time, status ('completed' | 'in_progress' | 'pending'), and optional note.
 */
export default function StatusTimeline({ steps = [] }) {
  return (
    <div className="relative space-y-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isDone = step.status === 'completed';
        const isActive = step.status === 'in_progress';

        return (
          <div key={idx} className="flex gap-4">
            {/* Left: Icon + vertical line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                isDone
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : isActive
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 min-h-[24px] rounded-full transition-all ${
                  isDone ? 'bg-emerald-500/40' : 'bg-slate-800'
                }`} />
              )}
            </div>

            {/* Right: Content */}
            <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                <span className={`text-sm font-semibold ${
                  isDone ? 'text-slate-200' : isActive ? 'text-cyan-300' : 'text-slate-500'
                }`}>
                  {step.step}
                </span>
                <span className={`text-xs font-mono shrink-0 ${
                  isDone ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-slate-600'
                }`}>
                  {step.time || '--'}
                </span>
              </div>
              {step.note && (
                <p className={`text-xs mt-0.5 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
