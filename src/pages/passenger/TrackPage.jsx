// src/pages/passenger/TrackPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Train, ArrowRight, AlertCircle, FileText } from 'lucide-react';
import { apiService } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a Complaint ID or PNR number.');
      return;
    }
    setLoading(true);
    setError('');
    setComplaint(null);
    setSearched(true);

    try {
      const result = await apiService.getComplaint(query.trim());
      setComplaint(result);
    } catch {
      setError('Could not find a complaint with that ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickIds = ['RM-1024', 'RM-1035', 'RM-1010'];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            COMPLAINT TRACKING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">Track Your Grievance</h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter your Complaint ID or PNR to view real-time status and resolution timeline.
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setError(''); }}
              placeholder="Enter Complaint ID (e.g. RM-1024) or 10-digit PNR..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 placeholder:text-slate-600 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-cyan-500/20 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Track</span>
          </button>
        </div>

        {/* Quick Demo IDs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Try demo IDs:</span>
          {quickIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => { setQuery(id); setError(''); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 font-mono transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Fetching complaint record...</p>
        </div>
      )}

      {/* Result */}
      {complaint && !loading && (
        <div className="space-y-5">
          {/* Summary Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            {/* ID Row */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">#{complaint.id}</span>
                  {complaint.incidentId && (
                    <span className="text-[10px] font-mono bg-rose-950/80 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded">
                      Linked: {complaint.incidentId}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {complaint.subCategory || complaint.category} Issue
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Train {complaint.trainNumber} ({complaint.trainName}) • Coach {complaint.coach} • Seat {complaint.seat}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={complaint.status} size="sm" />
                <PriorityBadge priority={complaint.priority} size="sm" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'Complaint ID', value: complaint.id },
                { label: 'Channel', value: complaint.channel },
                { label: 'Category', value: complaint.category },
                { label: 'Registered', value: new Date(complaint.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) },
                { label: 'AI Confidence', value: `${complaint.aiConfidence || 92}%` },
                { label: 'Assigned Officer', value: complaint.assignedOfficer || 'Pending assignment' }
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">{item.label}</span>
                  <span className="text-slate-200 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[10px] uppercase font-mono text-slate-500 mb-1.5">Passenger Description</p>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{complaint.description}"</p>
            </div>

            {/* Linked Incident Banner */}
            {complaint.incidentId && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between gap-3">
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-rose-200">Linked to Active Incident Cluster</p>
                  <p className="text-rose-300/80 font-mono">
                    {complaint.incidentId} — This grievance is part of a larger incident being investigated by the control room.
                  </p>
                </div>
                <Link
                  to={`/admin/incidents/${complaint.incidentId}`}
                  className="shrink-0 px-3 py-2 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>View Incident</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-mono uppercase font-semibold text-cyan-400 mb-5">
              Resolution Timeline
            </h3>
            {complaint.timeline && complaint.timeline.length > 0 ? (
              <StatusTimeline steps={complaint.timeline} />
            ) : (
              <p className="text-xs text-slate-500 font-mono">Timeline not yet available for this complaint.</p>
            )}
          </div>

          {/* Full Details Link */}
          <div className="text-right">
            <Link
              to={`/complaint/${complaint.id}`}
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              <FileText className="w-3.5 h-3.5" />
              View full complaint details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
