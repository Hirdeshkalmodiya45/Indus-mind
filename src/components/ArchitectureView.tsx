import React from 'react';
import { Layers, Info, CheckCircle2, Cpu, Database, ArrowRight } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const steps = [
    {
      title: 'Document Ingestion (OCR)',
      tech: 'Tesseract OCR / PDF.js',
      desc: 'Ingests unstructured logs, engineering drawings, and manuals. Processes layout geometries, extracts raw characters, and splits text blocks into clean chunks.',
      spec: 'Overlap: 200 chars • Chunk Size: 1000 chars'
    },
    {
      title: 'Semantic Vector Store',
      tech: 'ChromaDB / LangChain Embeddings',
      desc: 'Converts text chunks into high-dimensional vector embeddings. Performs semantic similarity searches (cosine distance metrics) to retrieve contextual evidence.',
      spec: 'Embedding Dimension: 768 • Cosine Similarity Cosθ'
    },
    {
      title: 'Knowledge Graph Linkage',
      tech: 'Neo4j Graph Database',
      desc: 'Extracts structural metadata relationships (e.g. Pump P-101 ↔ Overhaul Report ↔ Operator Sarah). Resolves complex multi-hop dependencies that vectors miss.',
      spec: 'Entity linking schema • Cypher Traversals'
    },
    {
      title: 'AI Synthesis Orchestrator',
      tech: 'Gemini 3.5 Flash / Agentic Reasoning',
      desc: 'Consolidates vector context and graph entities. Prompts the LLM to write a coherent Markdown answer, appending clickable citations for auditing.',
      spec: 'Temperature: 0.1 • Context limits: 1M tokens'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Technical Architecture Blueprint</h2>
        <p className="text-slate-400 text-xs mt-0.5">Explore the multi-agent design, vector RAG embeddings, and graph linkages powering INDUSMIND AI.</p>
      </div>

      {/* Interactive flowchart grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 glow-cyan rounded-full filter blur-3xl opacity-25" />
        
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Autonomous RAG & Graph Pipeline Flow</h3>

        {/* Node Flow items */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border cursor-pointer relative flex flex-col justify-between transition-all duration-300 ${
                  isActive 
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/5' 
                    : 'border-slate-900 bg-slate-950/30 hover:border-slate-800 hover:bg-slate-900/10'
                }`}
              >
                <div>
                  {/* Step counter */}
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mb-3 ${
                    isActive ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 text-slate-500'
                  }`}>
                    STAGE 0{idx + 1}
                  </span>
                  
                  <h4 className="text-xs font-bold text-white mb-1.5">{step.title}</h4>
                  <span className="text-[10px] text-cyan-400 font-semibold font-mono block leading-tight mb-2">
                    {step.tech}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <span>Click to expand specifications</span>
                  {idx < 3 && <ArrowRight className="w-3.5 h-3.5 hidden md:block text-slate-600" />}
                </div>

                {/* Arrow connectors inside components for mobile layout */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500 rotate-45 md:hidden" />
                )}
              </div>
            );
          })}

        </div>

        {/* Selected Flow Stage detail window */}
        <div className="mt-6 p-5 rounded-xl border border-slate-900 bg-slate-950/40 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
            <span className="font-bold text-white text-sm">{steps[activeStep].title} Details</span>
            <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-800/30">
              {steps[activeStep].tech}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed mb-4">{steps[activeStep].desc}</p>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-semibold font-mono">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Specifications: {steps[activeStep].spec}</span>
          </div>
        </div>

      </div>

      {/* Tech specifications stack grids */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4.5 h-4.5 text-cyan-400" />
            <h4 className="font-bold text-white text-xs">Hybrid Storage Matrix</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Combines dense Vector Embeddings database (ChromaDB) for general conceptual matchings with Graph Node networks (Neo4j) for direct hard-link structural validations.
          </p>
          <ul className="text-slate-400 text-[10px] space-y-1.5">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cosine similarity searches</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-hop relation traversals</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dynamic index tagging</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4.5 h-4.5 text-cyan-400" />
            <h4 className="font-bold text-white text-xs">Multi-Agent Verification</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Divides queries into isolated agent subtasks: document query indexes, compliance rules validation, telemetry metrics calculations, and final markdown synthesis.
          </p>
          <ul className="text-slate-400 text-[10px] space-y-1.5">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Isolated processing roles</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Reduced hallucination errors</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Strict audit trails & citations</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            <h4 className="font-bold text-white text-xs">Model Selection</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Uses Gemini 3.5 Flash for operational reasoning. Balanced response speed (under 1.5 seconds) with massive context size capacity (1M+ tokens) to process full documentation sheets.
          </p>
          <ul className="text-slate-400 text-[10px] space-y-1.5">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> High speed inference models</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 1M Token Context capacity</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Custom System Prompt templates</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
