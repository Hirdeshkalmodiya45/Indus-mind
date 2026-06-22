import React from 'react';
import { Network, Info, Search, Database } from 'lucide-react';
import { getKnowledgeGraphData } from '../utils/ragEngine';
import type { GraphNode } from '../utils/ragEngine';

export const KnowledgeGraph: React.FC = () => {
  const { nodes: initialNodes, links } = getKnowledgeGraphData();
  const [nodes] = React.useState<GraphNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = React.useState<GraphNode | null>(initialNodes[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [highlightedNodes, setHighlightedNodes] = React.useState<Set<string>>(new Set());

  // Fixed positions for standard nodes to ensure a beautiful organic layout
  const positions: Record<string, { x: number; y: number }> = {
    'Pump P-101': { x: 300, y: 250 },
    'Maintenance_Report_2025.pdf': { x: 150, y: 150 },
    'Inspection_Log_March.pdf': { x: 450, y: 150 },
    'SOP_Section_4.2': { x: 150, y: 350 },
    'Compliance_Audit_Q1_2026.pdf': { x: 300, y: 420 },
    'OEM_Manual_Section_5.2.pdf': { x: 480, y: 350 },
    'Sarah Jenkins': { x: 550, y: 220 },
    'David Vance': { x: 80, y: 220 },
    'Bearing Overheating Incident': { x: 280, y: 80 },
    'OSHA Safety Audit': { x: 80, y: 420 },
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    
    // Find neighbors
    const neighbors = new Set<string>();
    neighbors.add(node.id);
    
    links.forEach(l => {
      if (l.source === node.id) neighbors.add(l.target);
      if (l.target === node.id) neighbors.add(l.source);
    });

    setHighlightedNodes(neighbors);
  };

  // Run on mount once to highlight initial selected node connections
  React.useEffect(() => {
    if (initialNodes[0]) {
      handleNodeClick(initialNodes[0]);
    }
  }, []);

  const filteredNodes = nodes.filter(n => 
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] animate-fade-in select-none">
      
      {/* LEFT 3 COLS: The interactive Graph Canvas */}
      <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col justify-between overflow-hidden relative">
        
        {/* Canvas Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900 mb-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Ecosystem Knowledge Graph</h3>
              <p className="text-slate-400 text-[10px]">Traversing entity dependencies across Neo4j schema mappings.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Find node or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-8 py-1 text-xs w-44"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pb-2.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900/50 mb-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Assets</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Documents</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> SOP Standards</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Compliance Records</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Incident Cases</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Engineers</span>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
          
          <svg className="w-full h-full min-h-[380px]" viewBox="0 0 640 480">
            
            {/* Draw Links */}
            {links.map((link, idx) => {
              const from = positions[link.source];
              const to = positions[link.target];
              if (!from || !to) return null;

              const isHighlighted = highlightedNodes.has(link.source) && highlightedNodes.has(link.target);
              const opacity = highlightedNodes.size === 0 || isHighlighted ? 'stroke-slate-600 opacity-80' : 'stroke-slate-900 opacity-20';
              const strokeWidth = isHighlighted ? 2 : 1;

              return (
                <g key={idx}>
                  {/* Base Link Line */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className={`transition-all duration-300 ${opacity}`}
                    strokeWidth={strokeWidth}
                  />

                  {/* Pulsing signal dot on highlighted lines */}
                  {isHighlighted && (
                    <circle r="3" className="fill-cyan-400 shadow shadow-cyan-400/50">
                      <animateMotion
                        path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Link Text Label (only show for highlighted relationships) */}
                  {isHighlighted && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      className="fill-slate-500 text-[8px] font-mono text-center select-none"
                      textAnchor="middle"
                    >
                      {link.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {filteredNodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;

              const isSelected = selectedNode?.id === node.id;
              const isNeighbor = highlightedNodes.has(node.id);
              
              // Colors based on type
              let nodeColor = 'fill-cyan-500 stroke-cyan-400';
              if (node.type === 'document') nodeColor = 'fill-emerald-500 stroke-emerald-400';
              if (node.type === 'sop') nodeColor = 'fill-violet-500 stroke-violet-400';
              if (node.type === 'compliance') nodeColor = 'fill-amber-500 stroke-amber-400';
              if (node.type === 'incident') nodeColor = 'fill-rose-500 stroke-rose-400';
              if (node.type === 'engineer') nodeColor = 'fill-slate-500 stroke-slate-400';

              // Node size sizing
              const size = node.id === 'Pump P-101' ? 18 : 12;

              // Border glow for selected
              const nodeStroke = isSelected 
                ? 'stroke-white stroke-[3px] filter drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' 
                : isNeighbor 
                  ? 'stroke-[2px]' 
                  : 'stroke-[1px] opacity-40';

              const opacityClass = highlightedNodes.size === 0 || isNeighbor ? 'opacity-100' : 'opacity-30';

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => handleNodeClick(node)}
                  className={`cursor-pointer transition-all duration-300 ${opacityClass}`}
                >
                  {/* Pulse Effect for failing asset / active node */}
                  {isSelected && (
                    <circle r={size + 8} className="fill-transparent stroke-cyan-400/40 stroke-[2px] animate-ping" />
                  )}
                  {node.id === 'Pump P-101' && (
                    <circle r={size + 6} className="fill-transparent stroke-cyan-500/20 stroke-[1px] animate-pulse-slow" />
                  )}

                  {/* SVG Node circle */}
                  <circle
                    r={size}
                    className={`transition-colors duration-300 ${nodeColor} ${nodeStroke}`}
                  />
                  
                  {/* Inner Node Icon representation / styling */}
                  <circle r={size - 4} className="fill-slate-950" />

                  {/* Label Text */}
                  <text
                    y={size + 14}
                    className={`fill-slate-200 text-[9px] font-bold text-center select-none`}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

          </svg>

        </div>

      </div>

      {/* RIGHT COL: Node properties & connections */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col justify-between overflow-hidden">
        
        {/* Properties header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4">
          <Info className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="font-bold text-white text-xs">Entity Attributes</h4>
            <p className="text-slate-400 text-[9px]">Neo4j Schema Metadata Inspector</p>
          </div>
        </div>

        {selectedNode ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Meta values */}
            <div className="space-y-4">
              <div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide">Node Identifier</span>
                <h4 className="text-sm font-extrabold text-white">{selectedNode.label}</h4>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase mt-1.5 ${
                  selectedNode.type === 'asset' ? 'border-cyan-500/20 bg-cyan-950/20 text-cyan-400'
                  : selectedNode.type === 'document' ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                  : selectedNode.type === 'sop' ? 'border-violet-500/20 bg-violet-950/20 text-violet-400'
                  : selectedNode.type === 'compliance' ? 'border-amber-500/20 bg-amber-950/20 text-brand-orange'
                  : selectedNode.type === 'incident' ? 'border-rose-500/20 bg-rose-950/20 text-rose-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}>
                  {selectedNode.type}
                </span>
              </div>

              {selectedNode.status && (
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Operational State</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedNode.status === 'Normal' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30'
                    : 'bg-rose-950/40 text-rose-400 border border-rose-800/30'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Description</span>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedNode.details || 'No description loaded.'}</p>
              </div>
            </div>

            {/* List connections */}
            <div className="flex-1 mt-6 overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-2">Connected Relationships ({
                  links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).length
                }):</span>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {links
                    .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                    .map((link, idx) => {
                      const targetName = link.source === selectedNode.id ? link.target : link.source;
                      const neighborNode = nodes.find(n => n.id === targetName);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => neighborNode && handleNodeClick(neighborNode)}
                          className="flex items-center justify-between p-2 rounded border border-slate-900 bg-slate-950/40 hover:bg-slate-900/35 cursor-pointer text-[10px] text-slate-400 transition-colors"
                        >
                          <span className="text-slate-300 font-semibold">{neighborNode?.label || targetName}</span>
                          <span className="text-cyan-400 font-mono text-[9px] uppercase tracking-wider">{link.label}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Action query */}
              <div className="pt-4 border-t border-slate-900/80">
                <span className="text-[9px] text-slate-500 block mb-2 leading-tight">Query Indusmind Copilot regarding this entity:</span>
                <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-400">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">"Analyze logs for {selectedNode.label}"</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Network className="w-10 h-10 text-slate-850 mb-2" />
            <span className="text-xs font-semibold text-slate-400">Click a node on the canvas</span>
            <span className="text-[10px] text-slate-500 mt-1">Select any engineering asset or compliance file node to audit connection keys.</span>
          </div>
        )}

      </div>

    </div>
  );
};
