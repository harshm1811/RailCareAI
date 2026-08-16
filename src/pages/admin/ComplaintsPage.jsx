// src/pages/admin/ComplaintsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Search,
  Filter,
  Train,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  FileText,
  Mic,
  Camera,
  Video,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function loadComplaints() {
      setLoading(true);
      const data = await apiService.getComplaints();
      setComplaints(data);
      setLoading(false);
    }
    loadComplaints();
  }, []);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.passengerName && c.passengerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.pnr && c.pnr.includes(searchTerm));

    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const categories = ['ALL', 'Electrical', 'Housekeeping', 'Mechanical', 'Catering', 'Security'];
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['ALL', 'UNDER_INVESTIGATION', 'ASSIGNED', 'IN_PROGRESS', 'REGISTERED', 'RESOLVED'];

  // Helper for channel icon
  const getChannelIcon = (channel = '') => {
    const ch = channel.toLowerCase();
    if (ch.includes('voice')) return <Mic className="w-3 h-3 text-amber-400" />;
    if (ch.includes('image')) return <Camera className="w-3 h-3 text-cyan-400" />;
    if (ch.includes('video')) return <Video className="w-3 h-3 text-purple-400" />;
    return <FileText className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-cyan-400" />
            Passenger Complaints Stream
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Multimodal grievance queue with live AI classification and incident clustering
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
          <span>Total Indexed:</span>
          <strong className="text-cyan-400">{complaints.length} tickets</strong>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Complaint ID, Train, Coach, PNR, keyword or passenger name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Filter Dropdowns / Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Priority filter */}
          <div>
            <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? 'All Priorities' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Department / Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        {/* Table Column Headers */}
        <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <div className="col-span-2">ID & Cluster</div>
          <div className="col-span-3">Grievance Statement</div>
          <div className="col-span-2">Train & Location</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Category & Channel</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Details</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center p-12 gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Loading grievances stream...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No complaints match your active filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedPriority('ALL');
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-900">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-5 py-4 items-start lg:items-center hover:bg-slate-900/50 transition-colors text-xs"
              >
                {/* ID & Incident Cluster */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{c.id}</span>
                  </div>
                  {c.incidentId ? (
                    <Link
                      to={`/admin/incidents/${c.incidentId}`}
                      className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono text-rose-300 bg-rose-950/80 border border-rose-500/30 px-1.5 py-0.5 rounded hover:bg-rose-900 transition-colors"
                    >
                      <span>Cluster: {c.incidentId}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Standalone</span>
                  )}
                </div>

                {/* Description */}
                <div className="lg:col-span-3">
                  <p className="text-slate-200 font-medium line-clamp-1">{c.subCategory || c.category}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 italic">"{c.description}"</p>
                </div>

                {/* Train & Coach */}
                <div className="lg:col-span-2 font-mono">
                  <div className="text-slate-200 font-semibold flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Train {c.trainNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Coach <strong className="text-slate-300">{c.coach}</strong>
                    {c.seat && <span> • Berth {c.seat}</span>}
                  </div>
                </div>

                {/* Priority */}
                <div className="lg:col-span-1">
                  <PriorityBadge priority={c.priority} size="sm" />
                </div>

                {/* Category & Channel */}
                <div className="lg:col-span-2 space-y-1">
                  <span className="inline-block text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    {getChannelIcon(c.channel)}
                    <span>{c.channel || 'Text'}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="lg:col-span-1">
                  <StatusBadge status={c.status} size="sm" />
                </div>

                {/* Action Link */}
                <div className="lg:col-span-1 flex lg:justify-end">
                  <Link
                    to={`/complaint/${c.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono text-xs flex items-center gap-1 transition-all"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filtered.length} of {complaints.length} registered grievances</span>
          <span className="hidden sm:inline">Real-time sync active</span>
        </div>
      </div>
    </div>
  );
}
