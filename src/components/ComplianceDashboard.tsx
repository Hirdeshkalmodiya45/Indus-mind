import React from 'react';
import { 
  ShieldCheck, ClipboardList, ShieldAlert
} from 'lucide-react';

interface ComplianceDashboardProps {
  addActivityLog: (log: string) => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ addActivityLog }) => {
  
  // Interactive Compliance Audit Checklist State
  const [checklist, setChecklist] = React.useState([
    { id: 1, task: 'Upload missing Feb 2026 Lubrication Log for Pump P-101', category: 'OSHA Standard', severity: 'Critical', done: false },
    { id: 2, task: 'Perform hydrostatic containment inspect for Vessel V-102', category: 'ASME Boiler Code', severity: 'Critical', done: false },
    { id: 3, task: 'Perform laser shaft alignment certification for Compressor C-202', category: 'Reliability SOP 4.2', severity: 'Medium', done: false },
    { id: 4, task: 'Recalibrate noise pressure indicators in Sector C workspace', category: 'HSE Environmental', severity: 'Low', done: true },
    { id: 5, task: 'Review chemical spill response logs for acid tank valves', category: 'EPA Compliance', severity: 'Medium', done: true },
  ]);

  const handleToggleCheck = (id: number, task: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        addActivityLog(`Compliance checklist update: "${task}" marked as ${nextState ? 'RESOLVED' : 'PENDING'}`);
        return { ...item, done: nextState };
      }
      return item;
    }));
  };

  // Calculate dynamic compliance scores based on checkbox states
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(t => t.done).length;
  const auditReadiness = Math.round((completedTasks / totalTasks) * 100);
  const riskIndex = 100 - auditReadiness;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Compliance & Regulatory Panel</h2>
          <p className="text-slate-400 text-xs mt-0.5">Tracking OSHA safety thresholds, EPA emissions, and ASME structural certifications.</p>
        </div>

        {/* Sync Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4.5 h-4.5" />
          <span>Real-time Compliance Rules Active</span>
        </div>
      </div>

      {/* Main Score counter boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Audit Readiness Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Ecosystem Audit Readiness Score</span>
          <span className="text-4xl font-extrabold text-cyan-400 block mb-2">{auditReadiness}%</span>
          
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 mb-2">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${auditReadiness}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">Calculated from checklist completion rates</span>
        </div>

        {/* Active Compliance Risk Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Regulatory Violation Risk Index</span>
          <span className={`text-4xl font-extrabold block mb-2 ${riskIndex > 30 ? 'text-rose-500' : 'text-emerald-400'}`}>{riskIndex}%</span>
          
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${riskIndex > 30 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${riskIndex}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">Based on overdue ASME/EPA certification windows</span>
        </div>

        {/* Incomplete Item Count */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Unresolved Tasks</span>
            <span className="text-4xl font-extrabold text-white block">{totalTasks - completedTasks}</span>
          </div>
          <span className="text-[10px] text-slate-500 block leading-tight">Review outstanding items in the compliance log below.</span>
        </div>

      </div>

      {/* Checklist and Details split */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Compliance checklist table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4.5 h-4.5 text-cyan-400" />
              <h4 className="font-bold text-white text-sm">Regulatory & SOP Compliance Log</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Auto-audits hourly</span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => {
              let tagColor = 'border-slate-800 bg-slate-900 text-slate-400';
              if (item.severity === 'Critical') tagColor = 'border-rose-950 bg-rose-950/20 text-rose-400';
              if (item.severity === 'Medium') tagColor = 'border-amber-950 bg-amber-950/20 text-amber-400';
              
              return (
                <div 
                  key={item.id} 
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-colors ${
                    item.done 
                      ? 'border-slate-950 bg-slate-950/20 opacity-60' 
                      : 'border-slate-900 bg-slate-950/40 hover:bg-slate-900/10'
                  }`}
                >
                  <div className="flex gap-3 items-start pr-4">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleCheck(item.id, item.task)}
                      className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0 focus:outline-none cursor-pointer"
                    />
                    <div>
                      <span className={`text-xs font-semibold leading-relaxed block ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.task}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500">
                        <span className="font-bold text-slate-400">{item.category}</span>
                        <span>•</span>
                        <span className={`font-mono ${item.done ? 'text-slate-500' : 'text-cyan-400'}`}>
                          {item.done ? 'Status: Resolved' : 'Status: Pending Action'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border shrink-0 ${tagColor}`}>
                    {item.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel detailing compliance risks */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-5">
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
            Compliance Rule Violations
          </h4>

          <div className="space-y-4">
            
            <div className="p-3.5 rounded-xl border border-rose-950 bg-rose-950/5 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white">SOP Section 4.2 Breach</span>
                <span className="text-[8px] font-bold bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded">Category B</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-2">
                Running Pump P-101 with outboard bearing temperatures above **90°C** for more than 10 minutes violates mandatory regulatory temperature parameters.
              </p>
              <span className="text-[9px] font-mono text-rose-300 block">Historic Logged Incident: Oct 12, 2025</span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-950 bg-amber-950/5 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white">OSHA Document Incompleteness</span>
                <span className="text-[8px] font-bold bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded">Inspection Gap</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-2">
                Missing Lubrication Maintenance Log for Pump P-101 in February 2026 triggers regulatory compliance flags for the annual safety audit.
              </p>
              <span className="text-[9px] font-mono text-amber-300 block">Status: Overdue by 120+ days</span>
            </div>

          </div>

          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 text-[10px] text-slate-500 leading-relaxed">
            💡 **Remediation Tip**: Checkboxes above allow reliability engineers to certify task completion, dynamically recalibrating the Ecosystem Audit Readiness Score.
          </div>
        </div>

      </div>

    </div>
  );
};
