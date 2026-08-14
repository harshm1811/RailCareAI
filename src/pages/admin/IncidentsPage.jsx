// src/pages/admin/IncidentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Train,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';
import { apiService } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      const data = await apiService.getIncidents();
      setIncidents(data);
      setLoading(false);
    }
    fetchIncidents();
  }, []);

  const filterOptions = ['ALL', 'EMERGING', 'ASSIGNED', 'IN_PROGRESS', 'INVESTIGATING', 'RESOLVED'];

  const filtered = activeFilter === 'ALL'
    ? incidents
    : incidents.filter(i => i.status === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-mono">Loading active incidents & clusters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Active Incidents & Complaint Clusters
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            AI-grouped multiple passenger grievances consolidated into single actionable incidents
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                activeFilter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(inc => {
          const isEmerging = inc.status === 'EMERGING';
          return (
            <div
              key={inc.id}
              className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all ${
                isEmerging
                  ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 shadow-lg shadow-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                      {inc.id}
                    </span>
                    <StatusBadge status={inc.status} size="sm" />
                    <PriorityBadge priority={inc.priority} size="sm" />
                    <span className="text-xs font-mono text-slate-400">
                      Detected {new Date(inc.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">
                      {inc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                      <Train className="w-3.5 h-3.5 text-slate-400" />
                      <span>Train {inc.trainNumber} ({inc.trainName})</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-cyan-400">Coach {inc.coach}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">
                    {inc.aiSummary}
                  </p>

                  {/* Grievances Breakdown Badges */}
                  {inc.complaintBreakdown && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 self-center mr-1">
                        Clustered:
                      </span>
                      {inc.complaintBreakdown.map((b, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                        >
                          <strong className="text-cyan-400">{b.count}×</strong> "{b.text}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right metadata & CTA */}
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Confidence: <strong className="text-cyan-300">{inc.confidence}%</strong></span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Dept: <strong className="text-slate-200">{inc.recommendedDepartment}</strong>
                    </div>
                    {inc.assignedOfficer && (
                      <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Officer: {inc.assignedOfficer.name}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/admin/incidents/${inc.id}`}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                      isEmerging
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <span>Investigate Incident</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
