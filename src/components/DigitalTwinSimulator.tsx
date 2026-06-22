import React from 'react';
import { 
  Play, ShieldAlert, Cpu, CheckCircle2, Loader2, Sparkles, AlertTriangle 
} from 'lucide-react';

interface DigitalTwinSimulatorProps {
  pumpTelemetry: {
    temperature: number;
    vibration: number;
    speed: number;
    health: number;
  };
  setPumpTelemetry: React.Dispatch<React.SetStateAction<{
    temperature: number;
    vibration: number;
    speed: number;
    health: number;
  }>>;
  judgeDemoStatus: 'idle' | 'running' | 'completed';
  runJudgeDemo: () => void;
  incidentLogs: string[];
}

export const DigitalTwinSimulator: React.FC<DigitalTwinSimulatorProps> = ({
  pumpTelemetry,
  setPumpTelemetry,
  judgeDemoStatus,
  runJudgeDemo,
  incidentLogs
}) => {
  const [activeFault, setActiveFault] = React.useState<string | null>(null);
  const [hoveredSensor, setHoveredSensor] = React.useState<string | null>(null);

  const isFailing = pumpTelemetry.temperature > 80;

  const triggerFault = (faultType: string) => {
    setActiveFault(faultType);
    if (faultType === 'bearing') {
      setPumpTelemetry({
        temperature: 105.4,
        vibration: 8.2,
        speed: 3200,
        health: 12
      });
    } else if (faultType === 'lubrication') {
      setPumpTelemetry({
        temperature: 82.5,
        vibration: 3.8,
        speed: 3100,
        health: 48
      });
    } else if (faultType === 'alignment') {
      setPumpTelemetry({
        temperature: 68.2,
        vibration: 5.1,
        speed: 3200,
        health: 60
      });
    } else {
      // reset
      setPumpTelemetry({
        temperature: 42.1,
        vibration: 1.1,
        speed: 3200,
        health: 98
      });
      setActiveFault(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-fade-in select-none">
      
      {/* LEFT 2 COLS: Digital Twin & Controls */}
      <div className="lg:col-span-2 flex flex-col justify-between glass-panel p-5 rounded-2xl border border-slate-900 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Pump P-101 Digital Twin</h3>
              <p className="text-slate-400 text-[10px]">Real-time operational status visualizer and valve telemetry schema.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => triggerFault('reset')}
              className="px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset Sensors
            </button>
          </div>
        </div>

        {/* Digital Twin SVG Canvas */}
        <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl my-4 relative overflow-hidden flex items-center justify-center p-4">
          
          {/* Animated SVG Graphic of Pump P-101 */}
          <svg className="w-full max-w-lg h-auto min-h-[300px]" viewBox="0 0 500 350" fill="none">
            
            {/* Grid Pattern BG */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(6, 182, 212, 0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Inlet pipe */}
            <path d="M 50 150 L 150 150" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" />
            <path d="M 50 150 L 150 150" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className={isFailing ? '' : 'animate-[scan_2s_linear_infinite]'} />

            {/* Outlet pipe */}
            <path d="M 250 100 L 250 50 L 450 50" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
            <path d="M 250 100 L 250 50 L 450 50" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className={isFailing ? '' : 'animate-[scan_2s_linear_infinite]'} />

            {/* Pump Housing outer casing */}
            <circle cx="250" cy="200" r="70" className="fill-slate-900 stroke-slate-800 stroke-[4px]" />
            <circle cx="250" cy="200" r="58" className="fill-slate-950 stroke-slate-900 stroke-[2px]" />

            {/* Spinning Impeller Blades inside casing */}
            <g transform="translate(250, 200)">
              <g className={isFailing ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_1.5s_linear_infinite]'}>
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <line x1="-50" y1="0" x2="50" y2="0" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <circle r="15" className="fill-slate-800 stroke-slate-700" />
              </g>
            </g>

            {/* Outboard Bearing housing (Shaft connector) */}
            <rect x="340" y="185" width="40" height="30" rx="4" className="fill-slate-900 stroke-slate-800 stroke-[2px]" />
            {/* Outboard Bearing highlight */}
            <rect 
              x="344" y="189" width="32" height="22" rx="2" 
              className={`transition-all duration-300 ${
                isFailing 
                  ? 'fill-rose-950/80 stroke-rose-500 stroke-[2px] animate-pulse' 
                  : 'fill-slate-950 stroke-emerald-500/40 stroke-[1px]'
              }`}
            />

            {/* Drive shaft */}
            <line x1="310" y1="200" x2="430" y2="200" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

            {/* Inboard Bearing housing */}
            <rect x="180" y="185" width="30" height="30" rx="4" className="fill-slate-900 stroke-slate-800 stroke-[2px]" />

            {/* Motor Casing */}
            <rect x="420" y="150" width="70" height="100" rx="6" className="fill-slate-800 stroke-slate-700 stroke-[3px]" />
            {/* Motor cooling fins */}
            <line x1="435" y1="160" x2="475" y2="160" stroke="#475569" strokeWidth="3" />
            <line x1="435" y1="180" x2="475" y2="180" stroke="#475569" strokeWidth="3" />
            <line x1="435" y1="200" x2="475" y2="200" stroke="#475569" strokeWidth="3" />
            <line x1="435" y1="220" x2="475" y2="220" stroke="#475569" strokeWidth="3" />
            <line x1="435" y1="240" x2="475" y2="240" stroke="#475569" strokeWidth="3" />

            {/* Hotspot Sensor: Bearing Temperature */}
            <g 
              transform="translate(360, 160)" 
              onMouseEnter={() => setHoveredSensor('temp')} 
              onMouseLeave={() => setHoveredSensor(null)}
              className="cursor-pointer"
            >
              <circle r="7" className={`stroke-2 transition-all ${isFailing ? 'fill-rose-950 stroke-rose-500 animate-ping' : 'fill-slate-950 stroke-cyan-400'}`} />
              <circle r="4" className={isFailing ? 'fill-rose-500' : 'fill-cyan-400'} />
              <text x="12" y="4" className="fill-slate-300 text-[8px] font-mono font-bold">S1: Temp</text>
            </g>

            {/* Hotspot Sensor: Shaft Vibration */}
            <g 
              transform="translate(390, 230)" 
              onMouseEnter={() => setHoveredSensor('vib')} 
              onMouseLeave={() => setHoveredSensor(null)}
              className="cursor-pointer"
            >
              <circle r="7" className={`stroke-2 transition-all ${isFailing ? 'fill-rose-950 stroke-rose-500 animate-ping' : 'fill-slate-950 stroke-emerald-400'}`} />
              <circle r="4" className={isFailing ? 'fill-rose-500' : 'fill-emerald-400'} />
              <text x="12" y="4" className="fill-slate-300 text-[8px] font-mono font-bold">S2: Vib</text>
            </g>

            {/* Hotspot Sensor: Speed (Impeller) */}
            <g 
              transform="translate(250, 110)" 
              onMouseEnter={() => setHoveredSensor('speed')} 
              onMouseLeave={() => setHoveredSensor(null)}
              className="cursor-pointer"
            >
              <circle r="7" className="fill-slate-950 stroke-violet-400 stroke-2" />
              <circle r="4" className="fill-violet-400" />
              <text x="12" y="4" className="fill-slate-300 text-[8px] font-mono font-bold">S3: Speed</text>
            </g>

            {/* Floating tooltip labels on graphic */}
            {hoveredSensor === 'temp' && (
              <g transform="translate(310, 105)">
                <rect width="110" height="35" rx="6" className="fill-slate-900 stroke-slate-800 stroke-[1.5px]" />
                <text x="10" y="15" className="fill-slate-300 text-[8px]">Bearing Housing Temp</text>
                <text x="10" y="27" className={`text-[10px] font-bold ${isFailing ? 'fill-rose-500' : 'fill-cyan-400'}`}>{pumpTelemetry.temperature}°C</text>
              </g>
            )}

            {hoveredSensor === 'vib' && (
              <g transform="translate(320, 245)">
                <rect width="110" height="35" rx="6" className="fill-slate-900 stroke-slate-800 stroke-[1.5px]" />
                <text x="10" y="15" className="fill-slate-300 text-[8px]">Shaft Vibration RMS</text>
                <text x="10" y="27" className={`text-[10px] font-bold ${isFailing ? 'fill-rose-500' : 'fill-emerald-400'}`}>{pumpTelemetry.vibration} mm/s</text>
              </g>
            )}

            {hoveredSensor === 'speed' && (
              <g transform="translate(195, 45)">
                <rect width="110" height="35" rx="6" className="fill-slate-900 stroke-slate-800 stroke-[1.5px]" />
                <text x="10" y="15" className="fill-slate-300 text-[8px]">Impeller Speed RPM</text>
                <text x="10" y="27" className="fill-violet-400 text-[10px] font-bold">{pumpTelemetry.speed} RPM</text>
              </g>
            )}

          </svg>

          {/* Glowing alert overlay */}
          {isFailing && (
            <div className="absolute top-4 left-4 p-3 rounded-xl border border-rose-950 bg-rose-950/20 backdrop-blur-md flex items-center gap-2 text-rose-400 text-xs font-semibold animate-pulse-slow">
              <AlertTriangle className="w-5 h-5" />
              <span>WARNING: BEARING OVERHEAT ANOMALY</span>
            </div>
          )}

        </div>

        {/* Fault Injection Panel */}
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-2.5">Incident Simulator Fault Injection controls</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'bearing', label: 'Bearing Wear (Fail)', color: 'border-rose-900 hover:bg-rose-950/10 text-rose-400' },
              { id: 'lubrication', label: 'Lubricant Starve', color: 'border-amber-900 hover:bg-amber-950/10 text-amber-400' },
              { id: 'alignment', label: 'Shaft Misalignment', color: 'border-cyan-900 hover:bg-cyan-950/10 text-cyan-400' },
              { id: 'reset', label: 'Clear Faults', color: 'border-slate-800 hover:bg-slate-900 text-slate-300' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => triggerFault(btn.id)}
                className={`px-3 py-2.5 rounded-xl border text-[10px] font-bold transition-all text-center ${
                  activeFault === btn.id 
                    ? 'bg-slate-900 border-white' 
                    : btn.color
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COL: Judge Demo Mode Simulation logs */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="font-bold text-white text-xs">Judge Demo Engine</h4>
            <p className="text-slate-400 text-[9px]">One-click full incident walkthrough</p>
          </div>
        </div>

        {/* The Action Button */}
        <div className="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
          
          <button
            onClick={runJudgeDemo}
            disabled={judgeDemoStatus === 'running'}
            className="w-full py-4 px-4 bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-sm shadow-xl shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {judgeDemoStatus === 'running' ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Simulating Multi-Agent Run...
              </>
            ) : (
              <>
                <Play className="w-4.5 h-4.5 fill-slate-950" />
                Run Full Industrial Incident
              </>
            )}
          </button>

          {/* Info notice */}
          <p className="text-[10px] text-slate-400 leading-relaxed border-b border-slate-900 pb-3">
            Trigger a real-time bearing failure event. Watch agents isolate the failure from logs, travers graph relationships, check compliance risks, and propose corrections under 6 seconds.
          </p>

          {/* In-simulation log scrolling board */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-3.5 overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed flex flex-col space-y-2">
            
            {/* Status indicators */}
            <div className="flex justify-between border-b border-slate-900 pb-2 mb-1">
              <span>SIMULATION LOGS</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[8px] uppercase ${
                judgeDemoStatus === 'running' ? 'bg-cyan-950/40 text-cyan-400 animate-pulse'
                : judgeDemoStatus === 'completed' ? 'bg-emerald-950/40 text-emerald-400'
                : 'bg-slate-900 text-slate-500'
              }`}>
                {judgeDemoStatus}
              </span>
            </div>

            {incidentLogs.length === 0 ? (
              <div className="text-slate-600 italic text-center py-12">
                Click "Run Full Industrial Incident" above to initiate simulation telemetry logs.
              </div>
            ) : (
              incidentLogs.map((log, idx) => {
                let statusIcon = <Loader2 className="w-3 h-3 animate-spin text-cyan-400 shrink-0 mt-0.5" />;
                let logTextClass = 'text-slate-400';

                if (log.includes('complete') || log.includes('Success') || log.includes('synthesized')) {
                  statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />;
                  logTextClass = 'text-emerald-400 font-semibold';
                } else if (log.includes('FAIL') || log.includes('anomaly') || log.includes('leakage')) {
                  statusIcon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />;
                  logTextClass = 'text-rose-400 font-semibold';
                }

                // If not running anymore and this is an intermediate log, show simple green bullet
                if (judgeDemoStatus !== 'running' && !log.includes('Success')) {
                  statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 mt-0.5" />;
                }

                return (
                  <div key={idx} className="flex gap-2 items-start border-b border-slate-900/40 pb-1.5">
                    {statusIcon}
                    <span className={logTextClass}>{log}</span>
                  </div>
                );
              })
            )}

            {/* Ending Success Banner */}
            {judgeDemoStatus === 'completed' && (
              <div className="mt-4 p-3 rounded-lg border border-emerald-950 bg-emerald-950/15 text-center text-[10px] text-emerald-400 font-bold animate-fade-in">
                🎉 Full incident simulated successfully! RAG chat history has been loaded with root-cause insights.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
