import React from 'react';
import { 
  Wrench, Activity, CheckCircle, Clock, 
  Thermometer, ShieldAlert, Cpu 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PredictiveMaintenanceProps {
  pumpTelemetry: {
    temperature: number;
    vibration: number;
    speed: number;
    health: number;
  };
}

export const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({ pumpTelemetry }) => {
  // Generate telemetry history records based on current telemetry values
  const [telemetryHistory, setTelemetryHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Generate historic baseline records
    const history = [];
    const baseTemp = 42;
    const baseVib = 1.2;
    
    for (let i = 10; i >= 1; i--) {
      // If the current telemetry is elevated, make history slope upward
      const factor = pumpTelemetry.temperature > 80 ? (11 - i) / 10 : 0;
      history.push({
        time: `14:${50 - i * 3}`,
        temperature: parseFloat((baseTemp + (pumpTelemetry.temperature - baseTemp) * factor + Math.random() * 2).toFixed(1)),
        vibration: parseFloat((baseVib + (pumpTelemetry.vibration - baseVib) * factor + Math.random() * 0.2).toFixed(2)),
        limitTemp: 80,
        limitVib: 3.5
      });
    }
    setTelemetryHistory(history);
  }, [pumpTelemetry]);

  // Status metrics styling
  const isAnomaly = pumpTelemetry.temperature > 80 || pumpTelemetry.vibration > 3.5;
  const healthColor = pumpTelemetry.health > 80 ? 'text-emerald-400' : pumpTelemetry.health > 50 ? 'text-amber-400' : 'text-rose-500';
  const healthBg = pumpTelemetry.health > 80 ? 'bg-emerald-950/20 border-emerald-900/30' : pumpTelemetry.health > 50 ? 'bg-amber-950/20 border-amber-900/30' : 'bg-rose-950/20 border-rose-900/30';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Predictive Maintenance Hub</h2>
          <p className="text-slate-400 text-xs mt-0.5">Asset health index, vibration telemetry analytics, and remaining useful life (RUL) projections.</p>
        </div>

        {/* Selected asset dropdown indicator */}
        <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800 rounded-lg p-2 px-3 text-xs text-slate-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Active Asset: Pump P-101 (Sector C)</span>
        </div>
      </div>

      {/* Counter widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Health Score Gauge */}
        <div className={`glass-panel p-5 rounded-2xl border ${healthBg}`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Equipment Health Index</span>
          <span className={`text-3xl font-extrabold ${healthColor} block leading-none mb-1.5`}>{pumpTelemetry.health}%</span>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                pumpTelemetry.health > 80 ? 'bg-emerald-500' : pumpTelemetry.health > 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${pumpTelemetry.health}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">
            {pumpTelemetry.health > 80 ? 'Condition: Optimal' : pumpTelemetry.health > 50 ? 'Condition: Attention Required' : 'Condition: CRITICAL ANOMALY'}
          </span>
        </div>

        {/* Temperature Sensor Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Bearing Housing Temp</span>
            <Thermometer className={`w-4.5 h-4.5 ${isAnomaly ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <span className={`text-3xl font-extrabold block leading-none mb-1.5 ${isAnomaly ? 'text-rose-500' : 'text-white'}`}>
            {pumpTelemetry.temperature}°C
          </span>
          <span className="text-[10px] text-slate-400 block mb-1">Safety Limit Threshold: 80°C</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isAnomaly ? 'bg-rose-950/40 text-rose-400 border border-rose-800/20' : 'bg-slate-900 text-slate-500'
          }`}>
            {isAnomaly ? 'LIMIT BREACH: OVERHEAT' : 'Operating Nominal'}
          </span>
        </div>

        {/* Shaft Vibration Sensor Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Shaft Vibration Amplitude</span>
            <Activity className={`w-4.5 h-4.5 ${isAnomaly ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <span className={`text-3xl font-extrabold block leading-none mb-1.5 ${isAnomaly ? 'text-rose-500' : 'text-white'}`}>
            {pumpTelemetry.vibration} <span className="text-xs font-medium">mm/s</span>
          </span>
          <span className="text-[10px] text-slate-400 block mb-1">ASME VIB Safety Limit: 3.5 mm/s</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isAnomaly ? 'bg-rose-950/40 text-rose-400 border border-rose-800/20' : 'bg-slate-900 text-slate-500'
          }`}>
            {isAnomaly ? 'LIMIT BREACH: EXTREME SHEAR' : 'Operating Nominal'}
          </span>
        </div>

        {/* Remaining Useful Life Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Remaining Useful Life (RUL)</span>
            <Clock className="w-4.5 h-4.5 text-slate-500" />
          </div>
          <span className={`text-3xl font-extrabold block leading-none mb-1.5 ${isAnomaly ? 'text-rose-500' : 'text-cyan-400'}`}>
            {isAnomaly ? '0 Hours' : '1,840 Hours'}
          </span>
          <span className="text-[10px] text-slate-400 block">Estimated from acoustic patterns</span>
          <span className="text-[9px] font-bold text-slate-500 block mt-1">Next Service: {isAnomaly ? 'IMMEDIATE SHUTDOWN' : 'Scheduled in 72 Days'}</span>
        </div>

      </div>

      {/* Main telemetry charts */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-bold text-white text-sm">Real-time Telemetry Sensor Stream</h4>
            <p className="text-slate-400 text-[10px]">Real-time and historic sensor measurements logged in Sector C.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Log Period: 1 Hz updates</span>
        </div>

        <div className="h-72 w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
              <Legend />
              
              {/* Temperature Line */}
              <Line 
                type="monotone" 
                dataKey="temperature" 
                name="Bearing Temp (°C)" 
                stroke={isAnomaly ? '#f43f5e' : '#06b6d4'} 
                strokeWidth={2.5}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="limitTemp" 
                name="Temp Alarm Limit (80°C)" 
                stroke="#e2e8f0" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
              />

              {/* Vibration Line */}
              <Line 
                type="monotone" 
                dataKey="vibration" 
                name="Vibration (mm/s)" 
                stroke={isAnomaly ? '#f43f5e' : '#10b981'} 
                strokeWidth={2} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="limitVib" 
                name="Vib Alarm Limit (3.5 mm/s)" 
                stroke="#94a3b8" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Down Below recommendations and action items */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Urgent maintenance recommendations */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900">
          <h4 className="font-bold text-white text-sm mb-4">Reliability Maintenance Action Plan</h4>
          
          <div className="space-y-3">
            {isAnomaly ? (
              <>
                <div className="p-4 rounded-xl border border-rose-950 bg-rose-950/10 flex gap-3 items-start">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-400 block uppercase tracking-wider mb-1">EMERGENCY SHUTDOWN REQUIRED</span>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      Bearing housing temperature is at **{pumpTelemetry.temperature}°C**, exceeding the emergency shutdown limit of **95°C**.
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">Trigger: SOP ROT-4.2 safety constraint breach</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-950 bg-rose-950/10 flex gap-3 items-start">
                  <Wrench className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block mb-1">Outboard Bearing Seal Overhaul</span>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      Inspect and replace drive shaft oil slinger Viton seals. Flush and replenish oil reservoir with ISO VG 46 synthetic lubricant.
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">Reference: OEM Manual Section 5.2 (SKU-882-BRG Angular Contact)</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block mb-1">Standard Visual Oil Checks</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Check shaft slinger seals for grease weep. Next regular check is in 4 days.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex gap-3 items-start">
                  <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block mb-1">Predictive Spectrometry Collection</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Prepare oil analysis sample #78. Analyze particulate count and viscosity range.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Predictive Failure Breakdown Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900">
          <h4 className="font-bold text-white text-sm mb-4">Vibration Anomaly Spectral Analysis</h4>
          
          <div className="space-y-3.5 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Diagnostic sensors decompose overall vibration into frequency bins. Recent spectral spikes correspond to standard bearing failure modes:
            </p>

            <div className="space-y-2 font-mono text-[10px]">
              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>1x Running Frequency (Shaft Misalignment)</span>
                  <span>1.1 mm/s (Normal)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Outer Race Micro-pitting (30-40 kHz acoustic)</span>
                  <span className={isAnomaly ? 'text-rose-400' : 'text-slate-400'}>{isAnomaly ? '8.2 mm/s (CRITICAL)' : '1.8 mm/s (Baseline)'}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${isAnomaly ? 'bg-rose-500' : 'bg-cyan-500'}`} style={{ width: isAnomaly ? '95%' : '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Unbalance / Cavitation Spectrum</span>
                  <span>0.8 mm/s (Optimal)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <span className="text-[10px] text-slate-500 block leading-relaxed">
                *Failure modeling shows a **92% correlation** between outer race acoustic micro-pitting signals and bearing breakdown incidents.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
