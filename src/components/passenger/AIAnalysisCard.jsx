// src/components/passenger/AIAnalysisCard.jsx
import React from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';

/**
 * AIAnalysisCard displays the extracted intelligence, classification,
 * confidence score, reasoning breakdown, and emerging incident link.
 */
export default function AIAnalysisCard({ analysis, onConfirm, onEdit, isSubmitting = false }) {
  if (!analysis) return null;

  const isHighOrCritical = analysis.priority === 'HIGH' || analysis.priority === 'CRITICAL';

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/40 glow-cyan p-6 sm:p-8 space-y-6 transition-all animate-fadeIn">
      {/* Header: AI Diagnostic Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-heading">AI Grievance Intelligence</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                PROCESSED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Confidence Score: <span className="text-cyan-400 font-bold">{analysis.confidence || 94}%</span>
            </p>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Calculated Urgency:</span>
          <PriorityBadge priority={analysis.priority} size="md" />
        </div>
      </div>

      {/* Cluster Warning if linked to an emerging incident */}
      {analysis.matchedIncidentId && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-3 text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-rose-100 flex items-center gap-2">
              <span>Emerging Incident Cluster Detected</span>
              <span className="font-mono bg-rose-900 px-1.5 py-0.5 rounded text-[10px] text-rose-200 border border-rose-500/40">
                {analysis.matchedIncidentId}
              </span>
            </p>
            <p className="text-rose-300/90 leading-relaxed">
              16 other passengers in Train {analysis.train} (Coach {analysis.coach}) have reported similar cooling failures. Your complaint is being clustered to elevate rapid technical response.
            </p>
          </div>
        </div>
      )}

      {/* Structured Extraction Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Detected Issue</span>
          <p className="text-sm font-bold text-white leading-tight">{analysis.issue}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Target Department</span>
          <p className="text-sm font-bold text-cyan-400 leading-tight">{analysis.category}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Train Number</span>
          <p className="text-sm font-bold text-white font-mono leading-tight">{analysis.train}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Coach & Seat</span>
          <p className="text-sm font-bold text-white font-mono leading-tight">Coach {analysis.coach} • Seat {analysis.seat}</p>
        </div>
      </div>

      {/* AI Reasoning List */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
        <p className="text-xs font-mono uppercase font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Diagnostic Reasoning</span>
        </p>

        <ul className="space-y-1.5 text-xs text-slate-300">
          {analysis.aiReasoning && analysis.aiReasoning.length > 0 ? (
            analysis.aiReasoning.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                <span>{reason}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400">Standard classification based on keyword telemetry.</li>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
        >
          Edit Information
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Ticket...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Submit Grievance</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
