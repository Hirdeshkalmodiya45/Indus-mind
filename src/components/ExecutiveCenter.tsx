import React from 'react';
import { 
  TrendingDown, ShieldAlert, Award, Database, Activity 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const downtimeData = [
  { month: 'Jan', traditional: 48, predictive: 42 },
  { month: 'Feb', traditional: 52, predictive: 38 },
  { month: 'Mar', traditional: 45, predictive: 29 },
  { month: 'Apr', traditional: 55, predictive: 22 },
  { month: 'May', traditional: 60, predictive: 18 },
  { month: 'Jun', traditional: 58, predictive: 12 },
];

const complianceAuditScore = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 75 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 92 },
  { month: 'Jun', score: 98 },
];

interface ExecutiveCenterProps {
  documentsCount: number;
  activityLog: string[];
}

export const ExecutiveCenter: React.FC<ExecutiveCenterProps> = ({ 
  documentsCount, 
  activityLog 
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Executive Command Center</h2>
          <p className="text-slate-400 text-xs mt-0.5">High-level telemetry dashboard of operations, compliance status, and ROI impact metrics.</p>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800 rounded-lg p-2 px-3 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-semibold font-mono">Ecosystem: HEALTHY</span>
        </div>
      </div>

      {/* 4 Core Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Ingested Docs', value: documentsCount, desc: 'Reliability logs & SOPs', icon: Database, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10' },
          { label: 'Avg Health Score', value: '88.5%', desc: 'Across 6 Sector C assets', icon: Activity, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10' },
          { label: 'Audit Readiness', value: '98%', desc: 'OSHA Standards compliant', icon: Award, color: 'text-violet-400 border-violet-500/20 bg-violet-950/10' },
          { label: 'Risk Alerts', value: '2 Critical', desc: 'Overdue checklist logs', icon: ShieldAlert, color: 'text-rose-400 border-rose-500/20 bg-rose-950/10' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel p-6 rounded-2xl border ${card.color}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                <Icon className="w-5 h-5 opacity-70" />
              </div>
              <span className="text-3xl font-extrabold text-white block leading-none mb-1">{card.value}</span>
              <span className="text-slate-400 text-xs">{card.desc}</span>
            </div>
          );
        })}
      </div>

      {/* ROI Executive KPIs Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { title: 'Est. Annual ROI Impact', value: '$385,000', change: '+14% this Q', desc: 'Saved via premature failure detection', color: 'text-emerald-400' },
          { title: 'Downtime Reduction', value: '-42%', change: 'Target: -50%', desc: 'Transition to predictive triggers', color: 'text-cyan-400' },
          { title: 'Compliance Accuracy', value: '+35%', change: 'No violations in Q2', desc: 'Real-time SOP constraint tracking', color: 'text-violet-400' },
          { title: 'Information Search Latency', value: '-85%', change: '< 2.5s retrieval', desc: 'Direct RAG context synthesis', color: 'text-brand-orange' },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/30">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">{kpi.title}</span>
            <span className={`text-2xl font-extrabold ${kpi.color} block mb-1`}>{kpi.value}</span>
            <span className="text-white text-xs font-semibold block mb-0.5">{kpi.change}</span>
            <span className="text-slate-400 text-xs">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Graphs Split Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Downtime reduction Comparison */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-white text-sm">Industrial Downtime Trend (Hours)</h4>
              <p className="text-slate-400 text-[10px]">Comparing traditional scheduled schedules vs. Indusmind AI predictive alerts.</p>
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/30 border border-emerald-800/20 px-2 py-0.5 rounded">
              <TrendingDown className="w-3.5 h-3.5" />
              -79% reduction
            </span>
          </div>

          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downtimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="traditional" name="Traditional Downtime" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorTrad)" />
                <Area type="monotone" dataKey="predictive" name="Indusmind AI" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPred)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Safety Curve */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-white text-sm">Regulatory Audit Readiness Score</h4>
              <p className="text-slate-400 text-[10px]">Ecosystem compliance index track relative to historical OSHA standards.</p>
            </div>
            <span className="text-cyan-400 text-xs font-bold bg-cyan-950/30 border border-cyan-800/20 px-2 py-0.5 rounded">
              98% Current
            </span>
          </div>

          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceAuditScore} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis domain={[50, 100]} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="score" name="Compliance Index" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Down Below alerts and live activity feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Live Activity Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white text-sm">Live System Activity Feed</h4>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <p className="text-slate-400 text-[10px] mt-0.5">Real-time logs matching operational agent actions.</p>
          </div>

          <div className="flex-1 space-y-3.5 max-h-48 overflow-y-auto pr-2 font-mono text-xs">
            {activityLog.length === 0 ? (
              <div className="text-slate-500 py-6 text-center italic">No system events logged. Run the Judge Incident Demo to simulate.</div>
            ) : (
              activityLog.map((log, index) => {
                // Parse timestamp and text
                const parts = log.split(' - ');
                const time = parts[0] || '12:00';
                const text = parts[1] || log;
                
                let highlightClass = 'text-slate-400';
                if (text.includes('FAIL') || text.includes('anomaly') || text.includes('hazard')) {
                  highlightClass = 'text-rose-400 font-semibold';
                } else if (text.includes('Agent') || text.includes('Knowledge')) {
                  highlightClass = 'text-cyan-300';
                } else if (text.includes('completed') || text.includes('recommendation')) {
                  highlightClass = 'text-emerald-400';
                }

                return (
                  <div key={index} className="flex gap-3 items-start border-b border-slate-900/50 pb-2">
                    <span className="text-cyan-500/80 font-bold bg-cyan-950/20 px-1.5 py-0.5 rounded text-[10px] shrink-0">{time}</span>
                    <span className={highlightClass}>{text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Static Risk Alerts */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900">
          <h4 className="font-bold text-white text-sm mb-4">Critical Action Items</h4>
          
          <div className="space-y-3">
            {[
              { asset: 'Vessel V-102', tag: 'OVERDUE', time: '14 days overdue', desc: 'Hydrostatic pressure safety validation overdue.', color: 'border-rose-950 bg-rose-950/10 text-rose-400' },
              { asset: 'Compressor C-202', tag: 'PENDING', time: '5 days overdue', desc: 'Shaft alignment tolerance check overdue.', color: 'border-amber-950 bg-amber-950/10 text-amber-400' },
              { asset: 'SOP compliance', tag: 'AUDIT WARNING', time: 'OSHA standard', desc: 'February 2026 Lubrication Log missing.', color: 'border-rose-950 bg-rose-950/10 text-rose-400' }
            ].map((alert, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border ${alert.color.split(' ')[0]} ${alert.color.split(' ')[1]}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">{alert.asset}</span>
                  <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800">{alert.tag}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 mb-1">{alert.desc}</p>
                <span className="text-[10px] font-semibold opacity-70 block">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
