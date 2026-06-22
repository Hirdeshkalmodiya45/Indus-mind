import React from 'react';
import { 
  Play, CheckCircle, Flame, Loader2
} from 'lucide-react';

import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { ExecutiveCenter } from './components/ExecutiveCenter';
import { DocUpload } from './components/DocUpload';
import { AIChatRAG } from './components/AIChatRAG';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { PredictiveMaintenance } from './components/PredictiveMaintenance';
import { DigitalTwinSimulator } from './components/DigitalTwinSimulator';
import { VoiceAssistant } from './components/VoiceAssistant';
import { ArchitectureView } from './components/ArchitectureView';

import { generateDemoDocuments, queryLocalRAGEngine } from './utils/ragEngine';
import type { Document } from './utils/ragEngine';

export default function App() {
  const [isLaunched, setIsLaunched] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('executive');
  
  // General State
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [selectedDocPreview, setSelectedDocPreview] = React.useState<Document | null>(null);
  const [geminiKey, setGeminiKey] = React.useState('');
  
  // Historical Logging feeds
  const [activityFeed, setActivityFeed] = React.useState<string[]>([
    '09:00 - Database initialized.',
    '09:02 - Loaded 52 industrial documentation resources.',
    '09:05 - Active machinery monitors established.'
  ]);

  // Judge Demo / Telemetry Simulation States
  const [judgeDemoStatus, setJudgeDemoStatus] = React.useState<'idle' | 'running' | 'completed'>('idle');
  const [incidentLogs, setIncidentLogs] = React.useState<string[]>([]);
  const [pumpTelemetry, setPumpTelemetry] = React.useState({
    temperature: 42.1,
    vibration: 1.1,
    speed: 3200,
    health: 98
  });

  // Chat History state
  const [chatHistory, setChatHistory] = React.useState<any[]>([
    { 
      role: 'assistant', 
      content: "Hello, I am the Indusmind Copilot. Ask me questions regarding safety compliance, asset health, and maintenance standards." 
    }
  ]);

  // Load documents and configuration on mount
  React.useEffect(() => {
    setDocuments(generateDemoDocuments());
    const savedKey = localStorage.getItem('indusmind_gemini_key');
    if (savedKey) setGeminiKey(savedKey);
  }, []);

  const addActivityLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
    setActivityFeed(prev => [`${timestamp} - ${text}`, ...prev.slice(0, 19)]);
  };

  const handleOpenDocPreview = (doc: Document) => {
    setSelectedDocPreview(doc);
    setActiveTab('docs');
  };

  // Run the full sequence for the ET AI Hackathon Judge Demo
  const runJudgeDemo = () => {
    if (judgeDemoStatus === 'running') return;
    
    // Initialize simulation state
    setJudgeDemoStatus('running');
    setIncidentLogs([]);
    
    // Spike Telemetry immediately to indicate failure
    setPumpTelemetry({
      temperature: 105.4,
      vibration: 8.2,
      speed: 3200,
      health: 12
    });

    addActivityLog('CRITICAL ANOMALY: Pump P-101 bearing temperature exceeded critical safety limit.');

    const simulationSteps = [
      { log: '🚨 FAIL TRIGGERED: Temperature = 105.4°C, Vibration = 8.2 mm/s RMS (Limit: 3.5 mm/s).' },
      { log: '📂 Doc Intel Agent - Ingesting active maintenance records. Located historic replacement log MR-2025-233.' },
      { log: '🕸️ Graph Agent - Traversing Neo4j nodes. Outboard bearing model identified as SKF SKU-882-BRG, supplied by FlowServe.' },
      { log: '🔧 Maintenance Agent - Analyzing telemetry curves. Diagnosed bearing wear due to Viton seal breakdown.' },
      { log: '⚠️ Compliance Agent - Verification alert. Temp (105.4°C) breaches SOP Section 4.2 Category B safety constraints.' },
      { log: '🧠 Expert Copilot - Ingesting retrieved context into Gemini 3.5 Flash RAG pipeline...' },
      { log: '✨ Success - Synthesized failure diagnostic answer and created source citations.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < simulationSteps.length) {
        const step = simulationSteps[currentStep];
        setIncidentLogs(prev => [...prev, step.log]);
        addActivityLog(step.log);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Complete the demo
        setJudgeDemoStatus('completed');
        
        // Generate pre-packaged response
        const mockQuery = 'Why did Pump P-101 fail last year?';
        const finalResponseObj = queryLocalRAGEngine(mockQuery, documents);

        // Load chat history
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: mockQuery },
          { role: 'assistant', content: finalResponseObj.answer, responseObj: finalResponseObj }
        ]);

        addActivityLog('Ecosystem: RAG Chat History updated with incident diagnosis.');

        // Automatically route to AI Chat page so judges see results instantly
        setTimeout(() => {
          setActiveTab('chat');
        }, 1200);
      }
    }, 700);
  };

  if (!isLaunched) {
    return <LandingPage onLaunch={() => setIsLaunched(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex select-none text-slate-100">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none z-0" />
      <div className="absolute top-10 right-10 w-96 h-96 glow-cyan rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 glow-emerald rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        onLogout={() => setIsLaunched(false)}
      />

      {/* Main workspace (offset sidebar) */}
      <div className="flex-1 min-h-screen ml-64 flex flex-col relative z-10">
        
        {/* TOP GLOWING HACKATHON BANNER */}
        <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-950/45 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              🏆 ET AI HACKATHON 2026
            </span>
            <span className="text-[11px] font-bold text-slate-400 hidden md:block">• Optimized for 3-minute judge presentation</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Live Indicator */}
            {pumpTelemetry.temperature > 80 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-950 bg-rose-950/20 text-[10px] font-bold text-rose-400 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Incident Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-[10px] font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>System Nominal</span>
              </div>
            )}

            {/* Run Incident Demo Button */}
            <button
              onClick={runJudgeDemo}
              disabled={judgeDemoStatus === 'running'}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold text-[10px] rounded-lg shadow-lg hover:shadow-cyan-400/10 hover:opacity-95 transition-all duration-200 flex items-center gap-1.5 uppercase tracking-wider"
            >
              {judgeDemoStatus === 'running' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Run Incident Demo
                </>
              )}
            </button>
          </div>

        </header>

        {/* Dynamic content modules renderer */}
        <main className="p-6 flex-1 overflow-x-hidden">
          
          {activeTab === 'executive' && (
            <ExecutiveCenter 
              documentsCount={documents.length} 
              activityLog={activityFeed}
            />
          )}

          {activeTab === 'docs' && (
            <DocUpload 
              documents={documents} 
              setDocuments={setDocuments}
              selectedDoc={selectedDocPreview}
              setSelectedDoc={setSelectedDocPreview}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatRAG 
              documents={documents}
              onOpenDocPreview={handleOpenDocPreview}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'graph' && (
            <KnowledgeGraph />
          )}

          {activeTab === 'compliance' && (
            <ComplianceDashboard 
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'maintenance' && (
            <PredictiveMaintenance 
              pumpTelemetry={pumpTelemetry}
            />
          )}

          {activeTab === 'twin' && (
            <DigitalTwinSimulator 
              pumpTelemetry={pumpTelemetry}
              setPumpTelemetry={setPumpTelemetry}
              judgeDemoStatus={judgeDemoStatus}
              runJudgeDemo={runJudgeDemo}
              incidentLogs={incidentLogs}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceAssistant />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView />
          )}

        </main>

      </div>
    </div>
  );
}
