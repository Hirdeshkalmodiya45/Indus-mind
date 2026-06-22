import React from 'react';
import { 
  Send, Bot, User, FileText, BrainCircuit, Activity, RotateCcw, Check, Loader2
} from 'lucide-react';
import { queryLocalRAGEngine } from '../utils/ragEngine';
import type { Document, ChatResponse } from '../utils/ragEngine';

interface AIChatRAGProps {
  documents: Document[];
  onOpenDocPreview: (doc: Document) => void;
  chatHistory: { role: 'user' | 'assistant'; content: string; responseObj?: ChatResponse }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string; responseObj?: ChatResponse }[]>>;
  addActivityLog: (log: string) => void;
}

export const AIChatRAG: React.FC<AIChatRAGProps> = ({
  documents,
  onOpenDocPreview,
  chatHistory,
  setChatHistory,
  addActivityLog
}) => {
  const [queryText, setQueryText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedResponse, setSelectedResponse] = React.useState<ChatResponse | null>(null);
  
  // Agent States for the Multi-Agent Visualizer
  const [agents, setAgents] = React.useState([
    { name: 'Document Intelligence Agent', desc: 'Auto-OCR & metadata miner', status: 'idle' },
    { name: 'Knowledge Graph Agent', desc: 'Entities & relationship connector', status: 'idle' },
    { name: 'Maintenance Intelligence Agent', desc: 'Telemetry & failure analyzer', status: 'idle' },
    { name: 'Compliance Intelligence Agent', desc: 'SOP compliance checker', status: 'idle' },
    { name: 'Expert Knowledge Copilot', desc: 'Gemini synthesis & citations builder', status: 'idle' },
  ]);


  // Auto-select explainability of the latest AI message when chatHistory updates
  React.useEffect(() => {
    const assistantMsgs = chatHistory.filter(m => m.role === 'assistant');
    if (assistantMsgs.length > 0) {
      const latest = assistantMsgs[assistantMsgs.length - 1];
      if (latest.responseObj) {
        setSelectedResponse(latest.responseObj);
      }
    }
  }, [chatHistory]);

  const runChatQuery = async (text: string) => {
    if (!text.trim() || isSubmitting) return;
    
    // 1. Append user message
    const newChatHistory = [...chatHistory, { role: 'user' as const, content: text }];
    setChatHistory(newChatHistory);
    setQueryText('');
    setIsSubmitting(true);
    
    addActivityLog(`User queried: "${text.substring(0, 30)}..."`);

    // 2. Animate agent workflow sequentially
    const steps = [
      { agentIdx: 0, status: 'processing', log: 'Document Intelligence Agent - Ingesting file text and table vectors...' },
      { agentIdx: 0, status: 'completed', log: 'Document Intelligence Agent - Ingestion complete.' },
      { agentIdx: 1, status: 'processing', log: 'Knowledge Graph Agent - Traversing Neo4j nodes for entity linkage...' },
      { agentIdx: 1, status: 'completed', log: 'Knowledge Graph Agent - Linked P-101 telemetry mapping.' },
      { agentIdx: 2, status: 'processing', log: 'Maintenance Agent - Checking bearing specifications and thresholds...' },
      { agentIdx: 3, status: 'processing', log: 'Compliance Agent - Cross-referencing active safety SOPs...' },
      { agentIdx: 2, status: 'completed', log: 'Maintenance Agent - Anomaly profile generated.' },
      { agentIdx: 3, status: 'completed', log: 'Compliance Agent - Flagged SOP validation breaches.' },
      { agentIdx: 4, status: 'reasoning', log: 'Expert Copilot - Ingesting context chunks into Gemini RAG model...' },
      { agentIdx: 4, status: 'completed', log: 'Expert Copilot - Response synthesized.' }
    ];

    // Reset all agents to idle before starting
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const step = steps[i];
      setAgents(prev => prev.map((a, idx) => idx === step.agentIdx ? { ...a, status: step.status } : a));
      addActivityLog(step.log);
    }

    // 3. Query RAG engine
    const response = queryLocalRAGEngine(text, documents);
    
    // 4. Append assistant response
    setChatHistory(prev => [...prev, {
      role: 'assistant' as const,
      content: response.answer,
      responseObj: response
    }]);

    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runChatQuery(queryText);
  };

  const sampleQuestions = [
    "Why did Pump P-101 fail last year?",
    "Show all maintenance records",
    "Which inspections are overdue?",
    "What are the compliance risks?",
    "Generate maintenance recommendations"
  ];

  const handleCitationClick = (citation: any) => {
    // Attempt to locate target document based on cited title
    const foundDoc = documents.find(d => d.title === citation.title);
    if (foundDoc) {
      onOpenDocPreview(foundDoc);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* LEFT 2 COLS: Chat window & Sample Questions */}
      <div className="lg:col-span-2 flex flex-col justify-between glass-panel p-5 rounded-2xl border border-slate-900 overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Expert Reliability Copilot</h3>
              <p className="text-slate-400 text-[10px]">Augmented RAG Engine querying {documents.length} connected files.</p>
            </div>
          </div>
          <button 
            onClick={() => setChatHistory([{ role: 'assistant', content: "Hello, I am the Indusmind Copilot. Ask me questions regarding safety compliance, asset health, and maintenance standards." }])}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Chat
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto text-left'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                  isUser 
                    ? 'bg-slate-900 border-slate-800 text-cyan-400' 
                    : 'bg-gradient-to-tr from-cyan-500 to-emerald-400 border-cyan-400/20 text-slate-950'
                }`}>
                  {isUser ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5 stroke-[2.5]" />}
                </div>

                {/* Content Bubble */}
                <div className="space-y-3">
                  <div className={`rounded-2xl p-4 text-xs leading-relaxed border ${
                    isUser 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200 rounded-tr-none' 
                      : 'bg-slate-950/70 border-slate-900 text-slate-300 rounded-tl-none'
                  }`}>
                    
                    {/* Render message with line breaks & bold text support */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content.split('\n').map((line, lIdx) => {
                        // Bold markdown parser (crude but works for rendering bold keywords)
                        let parsedLine: React.ReactNode = line;
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          parsedLine = parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-cyan-400 font-bold">{part}</strong> : part);
                        }
                        return <p key={lIdx}>{parsedLine}</p>;
                      })}
                    </div>

                    {/* Clickable Citations */}
                    {msg.responseObj && msg.responseObj.citations && msg.responseObj.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-900/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 block mb-2">Sources Cited:</span>
                        <div className="flex flex-wrap gap-2">
                          {msg.responseObj.citations.map((cit, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleCitationClick(cit)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300 font-medium transition-colors"
                            >
                              <FileText className="w-3 h-3 text-cyan-400" />
                              <span>{cit.title}</span>
                              <span className="text-slate-500 text-[9px]">({cit.section.split(':')[1]?.trim() || cit.section})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* Submitting Spinner */}
          {isSubmitting && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-slate-900 border border-slate-800 text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-slate-900 text-xs text-slate-400 italic">
                Reasoning across vector databases and knowledge graphs...
              </div>
            </div>
          )}
        </div>

        {/* Sample questions panel */}
        <div className="py-2 border-t border-slate-900">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Suggested queries:</span>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => runChatQuery(q)}
                disabled={isSubmitting}
                className="text-[10px] font-semibold text-slate-400 hover:text-slate-200 border border-slate-900 hover:border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 px-3 py-1 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center pt-2">
          <input
            type="text"
            placeholder="Ask anything about Pump P-101 failure logs, SOP rules, or overdue tasks..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 glass-input py-3"
          />
          <button
            type="submit"
            disabled={isSubmitting || !queryText.trim()}
            className="p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 transition-opacity text-slate-950 rounded-xl flex items-center justify-center"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

      </div>

      {/* RIGHT COL: Multi-Agent status & Explainability */}
      <div className="space-y-6 overflow-y-auto pr-1 max-h-[calc(100vh-140px)]">
        
        {/* Multi-Agent Visualizer */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-bold text-white text-xs">Multi-Agent Workflow</h4>
              <p className="text-slate-400 text-[9px]">Active pipeline monitoring orchestration</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {agents.map((agent, index) => {
              let statusText = 'Idle';
              let statusColor = 'text-slate-500 bg-slate-900 border-slate-800';
              let animationClass = '';

              if (agent.status === 'processing') {
                statusText = 'Processing';
                statusColor = 'text-cyan-400 bg-cyan-950/20 border-cyan-500/30';
                animationClass = 'animate-pulse';
              } else if (agent.status === 'reasoning') {
                statusText = 'Reasoning';
                statusColor = 'text-amber-400 bg-amber-950/20 border-amber-500/30';
                animationClass = 'animate-pulse';
              } else if (agent.status === 'completed') {
                statusText = 'Completed';
                statusColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
              }

              return (
                <div key={index} className="flex justify-between items-center p-3 rounded-xl border border-slate-900/60 bg-slate-950/30">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{agent.name}</span>
                    <span className="text-[10px] text-slate-500 block">{agent.desc}</span>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border ${statusColor} ${animationClass}`}>
                    {agent.status === 'processing' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                    {agent.status === 'completed' && <Check className="w-2.5 h-2.5" />}
                    <span>{statusText}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainability Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-bold text-white text-xs">AI Explainability Hub</h4>
              <p className="text-slate-400 text-[9px]">Validation telemetry on the latest query response</p>
            </div>
          </div>

          {selectedResponse ? (
            <div className="space-y-4">
              
              {/* Confidence Score Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <span>RAG Accuracy Confidence</span>
                  <span className="text-cyan-400 font-mono">{selectedResponse.confidence}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${selectedResponse.confidence}%` }}
                  />
                </div>
              </div>

              {/* Reasoning Path Steps */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Internal Reasoning Path:</span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedResponse.reasoningPath.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-[10px] leading-relaxed text-slate-400">
                      <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[9px] flex items-center justify-center shrink-0 text-cyan-400 font-bold">{idx + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citations used snippet details */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Sources Correlated:</span>
                <div className="space-y-2">
                  {selectedResponse.citations.map((c, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60 text-[10px]">
                      <div className="flex justify-between items-center mb-1 text-slate-300 font-semibold">
                        <span>{c.title}</span>
                        <span className="text-slate-500 text-[9px]">{c.section}</span>
                      </div>
                      <p className="text-slate-400 italic">"{c.snippet}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-slate-500 text-[11px] italic text-center py-6">
              Submit an AI query to generate verification and validation telemetry.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
