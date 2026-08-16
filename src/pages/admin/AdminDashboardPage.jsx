// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Train,
  ArrowRight,
  Filter,
  Sparkles,
  Clock,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { apiService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';

// Filter button for the complaints table
function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${active
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
        }`}
    >
      {label}
    </button>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getDashboardStats(),
      apiService.getIncidents(),
      apiService.getComplaints()
    ]).then(([s, inc, comp]) => {
      setStats(s);
      setIncidents(inc);
      setComplaints(comp);
      setLoading(false);
    });
  }, []);

  const filters = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'RESOLVED'];

  const filteredComplaints = activeFilter === 'ALL'
    ? complaints
    : activeFilter === 'RESOLVED'
      ? complaints.filter(c => c.status === 'RESOLVED')
      : complaints.filter(c => c.priority === activeFilter);

  const emergingIncidents = incidents.filter(i => i.status === 'EMERGING');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-mono">Loading control center data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Operations Control Center</h1>
          <p className="text-sm text-slate-400 font-mono">Live AI Grievance Stream & Incident Clustering View</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>AI Engine: <strong className="text-emerald-400">Online</strong></span>
          <span className="text-slate-600">•</span>
          <span>{complaints.length} active tickets</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints.toLocaleString()}
            subtext={stats.totalComplaintsGrowth}
            icon={Inbox}
            accent="cyan"
          />
          <StatCard
            title="Active Incidents"
            value={stats.activeIncidents.toLocaleString()}
            subtext={stats.activeIncidentsSubtext}
            icon={ShieldAlert}
            accent="amber"
          />
          <StatCard
            title="Critical Incidents"
            value={stats.criticalIncidents.toLocaleString()}
            subtext={stats.criticalIncidentsSubtext}
            icon={Flame}
            accent="rose"
          />
          <StatCard
            title="Resolved Today"
            value={stats.resolvedToday.toLocaleString()}
            subtext={stats.resolvedTodaySubtext}
            icon={CheckCircle2}
            accent="emerald"
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* EMERGING INCIDENTS SECTION — The WOW Feature                 */}
      {/* ============================================================ */}
      {emergingIncidents.length > 0 && (
        <section>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/50 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Emerging Incident Detection
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 rounded-full">
                    {emergingIncidents.length} ACTIVE
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-mono">AI-detected complaint clusters requiring immediate dispatch</p>
              </div>
            </div>
            <Link
              to="/admin/incidents"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              All Incidents <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Emerging Incident Cards */}
          <div className="space-y-4">
            {emergingIncidents.map((incident) => (
              <div
                key={incident.id}
                className="relative glass-panel p-5 sm:p-6 rounded-2xl border border-rose-500/40 overflow-hidden"
                style={{ boxShadow: '0 0 40px -10px rgba(239,68,68,0.2)' }}
              >
                {/* Animated background pulse */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-950/20 to-transparent pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Left: Incident Info */}
                  <div className="flex-1">
                    {/* Alert header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-bold font-mono animate-pulse-subtle">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        EMERGING INCIDENT DETECTED
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {incident.id}
                      </span>
                    </div>

                    {/* Train + Coach */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Train className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-200 font-mono">
                        Train {incident.trainNumber} ({incident.trainName}) — Coach {incident.coach}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading mb-3">
                      {incident.title}
                    </h3>

                    {/* Metrics row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase mb-0.5">Related Complaints</span>
                        <span className="text-rose-300 font-bold text-sm">{incident.complaintCount} reports</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase mb-0.5">Detection Window</span>
                        <span className="text-amber-300 font-bold text-sm">{incident.timeWindowMinutes} minutes</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase mb-0.5">AI Severity</span>
                        <PriorityBadge priority={incident.aiSeverity} size="sm" />
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase mb-0.5">Recommended Dept</span>
                        <span className="text-cyan-300 font-bold">{incident.recommendedDepartment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="shrink-0 flex flex-col gap-2 sm:items-end">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>AI Confidence: <strong className="text-cyan-400">{incident.confidence}%</strong></span>
                    </div>
                    <Link
                      to={`/admin/incidents/${incident.id}`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <Zap className="w-4 h-4" />
                      Investigate Incident
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* RECENT COMPLAINTS TABLE                                       */}
      {/* ============================================================ */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Live Complaints Stream
          </h2>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <FilterBtn key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-900/80 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <div className="col-span-2">Complaint ID</div>
            <div className="col-span-3">Issue</div>
            <div className="col-span-2">Train / Coach</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-900">
            {filteredComplaints.slice(0, 12).map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-slate-900/40 transition-colors text-xs">
                <div className="col-span-4 sm:col-span-2">
                  <div className="font-mono font-bold text-cyan-400">{c.id}</div>
                  {c.incidentId && (
                    <div className="text-[10px] font-mono text-rose-400 mt-0.5">{c.incidentId}</div>
                  )}
                </div>
                <div className="col-span-8 sm:col-span-3">
                  <div className="text-slate-200 font-medium truncate">{c.subCategory || c.category}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{c.description.slice(0, 55)}...</div>
                </div>
                <div className="hidden sm:block col-span-2 font-mono text-slate-300">
                  <div>{c.trainNumber}</div>
                  <div className="text-slate-500">Coach {c.coach}</div>
                </div>
                <div className="hidden sm:block col-span-2">
                  <PriorityBadge priority={c.priority} size="sm" />
                </div>
                <div className="hidden sm:block col-span-2">
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <div className="hidden sm:flex col-span-1 justify-end">
                  <Link
                    to={`/complaint/${c.id}`}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-slate-900 bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Showing {Math.min(filteredComplaints.length, 12)} of {filteredComplaints.length} complaints
            </span>
            <Link
              to="/admin/complaints"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View All Complaints <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
