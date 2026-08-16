// src/components/admin/OfficerCard.jsx
import React from 'react';
import { CheckCircle2, Clock, Star, MapPin, Wrench, Zap } from 'lucide-react';

/**
 * OfficerCard shows recommended officer details for smart assignment.
 * Props: officer (object), onAssign (fn), isAssigned (bool), isTop (bool)
 */
export default function OfficerCard({ officer, onAssign, isAssigned = false, isTop = false }) {
  return (
    <div className={`relative p-5 rounded-2xl border transition-all ${
      isTop
        ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
        : 'border-slate-800 bg-slate-900/60'
    }`}>
      {isTop && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold font-mono shadow">
          <Zap className="w-2.5 h-2.5" />
          AI TOP MATCH
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {officer.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h4 className="text-sm font-bold text-white">{officer.name}</h4>
              <p className="text-xs text-slate-400">{officer.role}</p>
            </div>
            {/* AI Match Score */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              <Star className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300">{officer.matchScore}%</span>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {officer.expertise.map((e) => (
              <span key={e} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                {e}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-slate-400">
              {officer.isAvailable
                ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                : <Clock className="w-3 h-3 text-amber-400" />}
              <span className={officer.isAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                {officer.availability}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Wrench className="w-3 h-3 text-slate-500" />
              <span>{officer.activeTasks} tasks</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{officer.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Button */}
      <button
        onClick={() => onAssign(officer)}
        disabled={isAssigned}
        className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all border ${
          isAssigned
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 cursor-not-allowed'
            : isTop
              ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-500 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
        }`}
      >
        {isAssigned ? '✓ Officer Assigned' : 'Assign Officer'}
      </button>
    </div>
  );
}
