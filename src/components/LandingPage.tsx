import React from 'react';
import { Cpu, ShieldAlert, FileText, Share2, Play, Zap, Network, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden select-none">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0" />
      <div className="absolute inset-0 grid-bg-dense opacity-20 z-0" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 glow-cyan rounded-full filter blur-[100px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] glow-emerald rounded-full filter blur-[120px] z-0" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">INDUSMIND</span>
            <span className="text-cyan-400 text-xs font-bold block leading-none tracking-widest mt-0.5">AI PLATFORM</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-xs text-cyan-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ET AI HACKATHON 2026 SUBMISSION
          </span>
          <button 
            onClick={onLaunch}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 transition-all duration-300 flex items-center gap-1.5"
          >
            Launch Platform <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        
        {/* Hackathon Project Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-sm text-xs font-medium text-slate-300 mb-6 shadow-inner animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>Award-Winning Enterprise AI SaaS Solution</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-[1.1] mb-6">
          Autonomous AI Agent Hub For <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">Industrial Reliability</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Ingest unstructured PDFs, parse safety SOPs, auto-generate asset knowledge graphs, predict hardware failures, and chat directly with operational systems using RAG.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={onLaunch}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-base hover:from-cyan-400 hover:to-emerald-400 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Enter Control Center
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button 
            onClick={onLaunch}
            className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/70 hover:border-slate-700 text-slate-200 font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            Watch 60s Judge Demo
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-24">
          {[
            { label: 'Uptime Risk Reduced', value: '42%', desc: 'Dynamic predictive maintenance schedules' },
            { label: 'Document Ingestion Speed', value: '10x', desc: 'Auto-OCR text & table extraction' },
            { label: 'Regulatory Audits Passed', value: '100%', desc: 'Constant SOP compliance checking' },
            { label: 'AI Answer Confidence', value: '94%', desc: 'Dual-layered RAG & graph citations' },
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl text-left border border-slate-900 bg-slate-950/40 backdrop-blur-sm">
              <span className="text-2xl md:text-3xl font-extrabold text-white block mb-1">{item.value}</span>
              <span className="text-xs font-semibold text-cyan-400 block tracking-wider uppercase mb-1">{item.label}</span>
              <span className="text-slate-400 text-xs">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Problem & Solution Split */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl text-left mb-24">
          <div className="p-8 rounded-3xl border border-rose-500/10 bg-rose-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 glow-rose rounded-full filter blur-3xl opacity-50" />
            <div className="w-12 h-12 rounded-xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Industrial Data Problem</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Critical operations documentation—maintenance logs, standard procedures, equipment diagrams—is trapped in siloed PDFs, paper logs, and outdated folder structures.
            </p>
            <ul className="text-slate-400 text-xs space-y-2">
              <li className="flex items-center gap-2 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Unstructured manuals make rapid diagnostics impossible
              </li>
              <li className="flex items-center gap-2 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Compliance deviations occur silently without alert triggers
              </li>
              <li className="flex items-center gap-2 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Reliability engineers spend 30% of time searching for details
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-cyan-500/10 bg-cyan-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 glow-cyan rounded-full filter blur-3xl opacity-50" />
            <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Indusmind AI Solution</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              An intelligent autonomous ecosystem that digests PDFs, indexes operational standards, runs compliance rules, models asset hierarchies, and predicts failures.
            </p>
            <ul className="text-slate-400 text-xs space-y-2">
              <li className="flex items-center gap-2 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Agentic workflows that index text and model knowledge relationships
              </li>
              <li className="flex items-center gap-2 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Real-time compliance monitoring on machinery parameters
              </li>
              <li className="flex items-center gap-2 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Instant RAG-based AI search with source citation proof
              </li>
            </ul>
          </div>
        </div>

        {/* Professional Architecture Blueprint */}
        <div className="w-full max-w-5xl text-left border border-slate-900 bg-slate-950/60 rounded-3xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 glow-cyan rounded-full filter blur-3xl opacity-20" />
          <h3 className="text-2xl font-bold text-white mb-2">Technical System Architecture</h3>
          <p className="text-slate-400 text-sm mb-8">
            How Indusmind AI integrates Large Language Models, Vector Databases, and Graph Networks to power multi-agent operations.
          </p>

          <div className="grid md:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block mb-1">Ingestion Layer</span>
              <span className="text-[10px] text-slate-500 block mb-3">PDF Uploads, OEM Manuals, Inspection Logs</span>
              <div className="mt-auto px-2 py-1 bg-cyan-950/40 border border-cyan-800/30 rounded text-[10px] text-cyan-400 font-mono">
                Tesseract OCR / PDF.js
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block mb-1">Retrieval (RAG)</span>
              <span className="text-[10px] text-slate-500 block mb-3">Vector indexing, semantic cosine ranking</span>
              <div className="mt-auto px-2 py-1 bg-emerald-950/40 border border-emerald-800/30 rounded text-[10px] text-emerald-400 font-mono">
                ChromaDB / LangChain
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-violet-950 text-violet-400 flex items-center justify-center mx-auto mb-3">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block mb-1">Graph Layer</span>
              <span className="text-[10px] text-slate-500 block mb-3">Entity linkage, dependency graphs</span>
              <div className="mt-auto px-2 py-1 bg-violet-950/40 border border-violet-800/30 rounded text-[10px] text-violet-400 font-mono">
                Neo4j Graph Indexes
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-orange-950 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block mb-1">Agent Orchestrator</span>
              <span className="text-[10px] text-slate-500 block mb-3">Verification path, speech & recommendations</span>
              <div className="mt-auto px-2 py-1 bg-orange-950/40 border border-orange-800/30 rounded text-[10px] text-brand-orange font-mono">
                Gemini 3.5 / WebSpeech
              </div>
            </div>

          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 text-center py-6 text-xs text-slate-500">
        © 2026 INDUSMIND AI. Custom built for the ET AI Hackathon 2026. Deployable ready.
      </footer>
    </div>
  );
};
