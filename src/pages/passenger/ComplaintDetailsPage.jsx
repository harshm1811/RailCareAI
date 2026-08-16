// src/pages/passenger/ComplaintDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Train, Shield, FileText, Cpu, ArrowRight, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getComplaint(id).then((data) => {
      setComplaint(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400 font-mono">Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <p className="text-slate-300 font-semibold">Complaint not found.</p>
        <Link to="/track" className="text-xs text-cyan-400 underline mt-2 inline-block">← Back to tracking</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Back link */}
      <Link to="/track" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Track
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold">#{complaint.id}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
            {complaint.subCategory || complaint.category} Complaint
          </h1>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Train {complaint.trainNumber} ({complaint.trainName}) • Coach {complaint.coach} • Seat {complaint.seat}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Complaint Description */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h2 className="text-xs font-mono uppercase font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Passenger Description
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed italic">"{complaint.description}"</p>
          </div>

          {/* AI Analysis */}
          {complaint.aiReasoning && complaint.aiReasoning.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30">
              <h2 className="text-xs font-mono uppercase font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> AI Intelligence Analysis
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="block text-slate-500 text-[10px] mb-0.5">CONFIDENCE</span>
                  <span className="text-cyan-400 font-bold">{complaint.aiConfidence || 92}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="block text-slate-500 text-[10px] mb-0.5">CATEGORY</span>
                  <span className="text-white font-bold">{complaint.category}</span>
                </div>
              </div>
              <ul className="space-y-1.5">
                {complaint.aiReasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {complaint.timeline && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h2 className="text-xs font-mono uppercase font-semibold text-slate-400 mb-4 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Resolution Timeline
              </h2>
              <StatusTimeline steps={complaint.timeline} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
            <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Complaint Details</h3>
            {[
              { k: 'Train', v: complaint.trainNumber },
              { k: 'Coach', v: complaint.coach },
              { k: 'Seat', v: complaint.seat },
              { k: 'PNR', v: complaint.pnr || 'N/A' },
              { k: 'Channel', v: complaint.channel },
              { k: 'Filed', v: new Date(complaint.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) },
              { k: 'Officer', v: complaint.assignedOfficer || 'Pending' }
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-200 font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>

          {/* Linked Incident */}
          {complaint.incidentId && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 space-y-2">
              <p className="text-[10px] uppercase font-mono text-rose-400 font-bold">Linked Incident</p>
              <p className="text-lg font-extrabold text-white font-mono">{complaint.incidentId}</p>
              <p className="text-xs text-rose-200/80">
                This complaint is clustered into an active incident under investigation by the control room.
              </p>
              <Link
                to={`/admin/incidents/${complaint.incidentId}`}
                className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 font-mono underline mt-1"
              >
                View Incident <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
