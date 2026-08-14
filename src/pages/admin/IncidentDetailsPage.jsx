// src/pages/admin/IncidentDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  Train,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Zap,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import OfficerCard from '../../components/admin/OfficerCard';

export default function IncidentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState(null); // toast notification

  // Load incident details and candidate officers
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const incId = id || 'INC-108';
      const incData = await apiService.getIncident(incId);
      const officersList = await apiService.getRecommendedOfficers(incId, incData.category);
      setIncident(incData);
      setOfficers(officersList);
      setLoading(false);
    }
    loadData();
  }, [id]);

  // Show temporary action banner
  const triggerNotice = (msg, type = 'success') => {
    setActionNotice({ message: msg, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // Handle smart officer assignment
  const handleAssignOfficer = async (officer) => {
    setAssigning(true);
    const res = await apiService.assignOfficer(incident.id, officer.id);
    if (res.success) {
      setIncident({
        ...incident,
        status: 'ASSIGNED',
        assignedOfficer: {
          id: officer.id,
          name: officer.name,
          role: officer.role,
          department: officer.department,
          distance: officer.distance,
          matchScore: officer.matchScore,
          status: 'Dispatched',
          phone: officer.phone
        }
      });
      triggerNotice(`Officer ${officer.name} (${officer.department}) dispatched to Coach ${incident.coach}!`, 'success');
    }
    setAssigning(false);
  };

  // Handle incident escalation
  const handleEscalate = async () => {
    const updated = await apiService.updateIncidentStatus(incident.id, 'ESCALATED');
    setIncident({ ...incident, priority: 'CRITICAL', status: 'ESCALATED' });
    triggerNotice(`Incident ${incident.id} escalated to CRITICAL priority & Divisional HQ alerted.`, 'warning');
  };

  // Handle marking incident as resolved
  const handleMarkResolved = async () => {
    await apiService.updateIncidentStatus(incident.id, 'RESOLVED');
    setIncident({ ...incident, status: 'RESOLVED' });
    triggerNotice(`Incident ${incident.id} marked as RESOLVED. Clustered complaints updated.`, 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-mono">Analyzing incident cluster data...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800">
        <p className="text-slate-400">Incident not found.</p>
        <Link to="/admin" className="mt-4 inline-block text-cyan-400 font-mono text-sm hover:underline">
          Return to Control Room
        </Link>
      </div>
    );
  }

  // Filter complaints within this incident
  const relatedList = incident.relatedComplaintsList || [];
  const filteredComplaints = relatedList.filter(c =>
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.seat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.passengerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Action Notice / Toast */}
      {actionNotice && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-mono animate-fadeIn ${
          actionNotice.type === 'warning'
            ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {actionNotice.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs opacity-75 hover:opacity-100 uppercase underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Control Room Incident Investigation
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">{incident.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {incident.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {incident.status !== 'RESOLVED' && (
            <>
              <button
                onClick={handleEscalate}
                className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Flame className="w-3.5 h-3.5" />
                Escalate
              </button>
              <button
                onClick={handleMarkResolved}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Resolved
              </button>
            </>
          )}
          {incident.status === 'RESOLVED' && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Incident Certified & Resolved
            </div>
          )}
        </div>
      </div>

      {/* Hero Emerging Incident Banner */}
      {incident.status === 'EMERGING' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/50 shadow-lg shadow-rose-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold font-mono uppercase tracking-wide">
                  Emerging Incident Active
                </span>
                <span className="text-xs text-rose-300 font-mono">
                  {incident.complaintCount} passenger grievances clustered in {incident.timeWindowMinutes} mins
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Machine learning threshold triggered. High passenger discomfort risk on train route.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 self-end sm:self-center shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Detected {new Date(incident.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Primary Intelligence & Complaints Cluster (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Metrics Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-slate-500 text-[10px] uppercase mb-1">Train & Coach</span>
              <span className="text-white font-bold text-sm">
                {incident.trainNumber} • Coach {incident.coach}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">{incident.trainName}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-slate-500 text-[10px] uppercase mb-1">AI Severity</span>
              <div className="mt-1">
                <PriorityBadge priority={incident.aiSeverity} size="sm" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-slate-500 text-[10px] uppercase mb-1">Status</span>
              <div className="mt-1">
                <StatusBadge status={incident.status} size="sm" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-slate-500 text-[10px] uppercase mb-1">AI Confidence</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-bold text-sm">{incident.confidence}%</span>
              </div>
            </div>
          </div>

          {/* AI Incident Summary & Diagnostic Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
                AI Diagnostic & Pattern Summary
              </h3>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              "{incident.aiSummary}"
            </p>

            {/* Recommended Action Box */}
            <div className="mt-4 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-0.5">
                  AI Recommended Action & Department
                </span>
                <p className="text-xs text-slate-200">
                  <strong className="text-white">Department: {incident.recommendedDepartment}</strong> — {incident.recommendedAction}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 shrink-0">
                Route: {incident.recommendedDepartment}
              </span>
            </div>
          </div>

          {/* Clustered Grievances Section */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Related Clustered Complaints ({relatedList.length > 0 ? relatedList.length : incident.complaintCount})
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Incoming reports automatically correlated into single incident {incident.id}
                </p>
              </div>

              {/* Breakdown Pills */}
              {incident.complaintBreakdown && (
                <div className="flex flex-wrap gap-1.5">
                  {incident.complaintBreakdown.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono"
                    >
                      <strong className="text-cyan-400">{item.count}×</strong> "{item.text}"
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Search within cluster */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search within clustered complaints (seat, text, ID)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Clustered Complaints List */}
            <div className="space-y-2.5">
              {filteredComplaints.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  No complaints match search "{searchTerm}".
                </div>
              ) : (
                filteredComplaints.map((comp) => {
                  const isExpanded = expandedComplaintId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      className={`rounded-xl border transition-all ${
                        isExpanded
                          ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Complaint Accordion Header */}
                      <button
                        onClick={() => setExpandedComplaintId(isExpanded ? null : comp.id)}
                        className="w-full p-3.5 flex items-center justify-between gap-3 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                            {comp.id}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 shrink-0">
                            Seat {comp.seat || 'N/A'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shrink-0">
                            {comp.channel || 'Text'}
                          </span>
                          <p className="text-xs text-slate-200 truncate max-w-xs sm:max-w-md">
                            "{comp.description}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={comp.priority} size="sm" />
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Complaint Accordion Body */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 text-xs space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                            <div>Passenger: <strong className="text-slate-200">{comp.passengerName || 'Passenger'}</strong></div>
                            <div>PNR: <strong className="text-slate-200">{comp.pnr || 'N/A'}</strong></div>
                            <div>Submitted: <strong className="text-slate-200">{new Date(comp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Full Statement:</span>
                            <p className="text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic">
                              "{comp.description}"
                            </p>
                          </div>

                          {comp.aiReasoning && (
                            <div>
                              <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">AI Reasoning:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {comp.aiReasoning.map((r, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/20 text-[10px] text-slate-300 font-mono">
                                    • {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-1 flex justify-end">
                            <Link
                              to={`/complaint/${comp.id}`}
                              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              View Individual Complaint Details <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Incident Timeline / Audit Log */}
          {incident.timeline && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Cluster Detection Timeline
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {incident.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Step marker */}
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-200">{event.event}</p>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{event.type}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Officer Dispatch & Telemetry (1 col) */}
        <div className="space-y-6">

          {/* Active Assigned Officer Card (if assigned) */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Assigned Officer
              </h3>
              {incident.assignedOfficer && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  {incident.assignedOfficer.status || 'Active'}
                </span>
              )}
            </div>

            {incident.assignedOfficer ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-base shadow">
                    {incident.assignedOfficer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{incident.assignedOfficer.name}</h4>
                    <p className="text-xs text-slate-400">{incident.assignedOfficer.role || incident.assignedOfficer.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>Distance: <strong className="text-slate-200">{incident.assignedOfficer.distance || '0.3 km'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Match: <strong className="text-cyan-300">{incident.assignedOfficer.matchScore || 94}%</strong></span>
                  </div>
                </div>

                {incident.assignedOfficer.phone && (
                  <a
                    href={`tel:${incident.assignedOfficer.phone}`}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Call Officer: {incident.assignedOfficer.phone}
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                <p className="text-xs text-rose-200 font-bold">No Officer Assigned Yet</p>
                <p className="text-[11px] text-slate-400">
                  Select a recommended officer below to dispatch immediate assistance.
                </p>
              </div>
            )}
          </div>

          {/* Smart Officer Assignment Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Smart Officer Recommendations
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Ranked by proximity, expertise & workload
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {officers.map((officer, idx) => {
                const isCurrentlyAssigned = incident.assignedOfficer?.id === officer.id;
                return (
                  <OfficerCard
                    key={officer.id}
                    officer={officer}
                    isTop={idx === 0}
                    isAssigned={isCurrentlyAssigned}
                    onAssign={handleAssignOfficer}
                  />
                );
              })}
            </div>
          </div>

          {/* Train & Journey Telemetry Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Train className="w-4 h-4 text-slate-400" />
              Train Telemetry & Journey Details
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500">Route</span>
                <span className="text-slate-200 font-bold">{incident.route || 'Pune Jn ➔ Mumbai CSMT'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500">Next Scheduled Halt</span>
                <span className="text-amber-300 font-bold">Lonavala (in 12 mins)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500">Current Speed</span>
                <span className="text-emerald-400 font-bold">92 km/h</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500">Coach Type</span>
                <span className="text-slate-200">AC Chair Car (LHB Rake)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

