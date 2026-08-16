// src/pages/admin/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Train,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { apiService } from '../../services/api';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await apiService.getAnalyticsData();
      setAnalyticsData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-mono">Aggregating AI operations intelligence...</span>
      </div>
    );
  }

  const { categoryDistribution, priorityTrends, trainProblemFrequency, aiInsights } = analyticsData;

  // Custom Recharts Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs font-mono">
          <p className="text-white font-bold mb-1">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: <strong className="text-white">{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            AI & Operations Intelligence
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Pattern discovery, recurring defect heatmaps, SLA compliance & neural insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predictive Engine Active</span>
          </span>
        </div>
      </div>

      {/* Top Operations KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Ticket De-duplication
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">74.8%</p>
          <p className="text-[10px] text-slate-500 font-mono">Clustered into incidents</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Avg Resolution SLA
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">34 mins</p>
          <p className="text-[10px] text-slate-500 font-mono">87.4% within time target</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Emerging Incident Trigger
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">14 mins</p>
          <p className="text-[10px] text-slate-500 font-mono">From first grievance to alert</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Officer Dispatch Latency
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">3.2 mins</p>
          <p className="text-[10px] text-slate-500 font-mono">Down from 18 min manual routing</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* AI INSIGHTS SECTION                                           */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-heading">
            AI Neural Incident Insights
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            AUTO-GENERATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight) => {
            const isAlert = insight.type === 'alert' || insight.type === 'critical';
            return (
              <div
                key={insight.id}
                className={`glass-panel p-5 rounded-2xl border transition-all ${
                  insight.type === 'critical'
                    ? 'border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-slate-900'
                    : insight.type === 'alert'
                      ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-slate-900'
                      : 'border-cyan-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    insight.type === 'critical'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                      : insight.type === 'alert'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                  }`}>
                    {insight.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">RailCare AI Engine</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{insight.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* VISUAL CHARTS SECTION                                         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Priority Trends Over Time (Area Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Grievance Ingestion by Priority
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Hourly volume trends showing peak emerging cluster spikes
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priorityTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" name="Critical" />
                <Area type="monotone" dataKey="high" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHigh)" name="High Priority" />
                <Area type="monotone" dataKey="medium" stroke="#06b6d4" fillOpacity={1} fill="url(#colorMed)" name="Medium" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Department Category Distribution (Donut Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Department Grievance Share
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Categorized via AI natural language & multimodal classification
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry) => (
                    <span className="text-xs font-mono text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Train Problem Frequency & Hotspots */}
      <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Train className="w-4 h-4 text-cyan-400" />
              Train & Coach Anomaly Hotspots
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Frequent defect concentration per rake to schedule depot maintenance
            </p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainProblemFrequency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="train" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="complaints" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Total Complaints" />
              <Bar dataKey="incidents" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Clustered Incidents" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
