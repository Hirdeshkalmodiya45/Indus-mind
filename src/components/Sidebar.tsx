import React from 'react';
import { 
  LayoutDashboard, FileText, MessageSquare, Network, ShieldCheck, 
  Wrench, Cpu, Mic, GitFork, Key, Settings, LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  geminiKey, 
  setGeminiKey,
  onLogout 
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [keyInput, setKeyInput] = React.useState(geminiKey);

  const menuItems = [
    { id: 'executive', label: 'Executive Center', icon: LayoutDashboard },
    { id: 'docs', label: 'Document Intel', icon: FileText },
    { id: 'chat', label: 'AI Chat & RAG', icon: MessageSquare },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'compliance', label: 'Compliance Panel', icon: ShieldCheck },
    { id: 'maintenance', label: 'Predictive Maint', icon: Wrench },
    { id: 'twin', label: 'Digital Twin Sim', icon: Cpu },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'architecture', label: 'Tech Architecture', icon: GitFork },
  ];

  const handleSaveKey = () => {
    setGeminiKey(keyInput);
    localStorage.setItem('indusmind_gemini_key', keyInput);
    setShowSettings(false);
  };

  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between h-screen fixed top-0 left-0 z-20 select-none">
      
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block">INDUSMIND AI</span>
          <span className="text-cyan-400 text-[10px] font-bold tracking-widest block leading-none mt-0.5">CONTROL CENTER</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-950/50 to-slate-900/50 text-cyan-400 border-l-2 border-cyan-500 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings & Profile Area */}
      <div className="p-4 border-t border-slate-900 space-y-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings & LLM Key</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>
      </div>

      {/* Settings Dialog Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              API Settings Configuration
            </h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              By default, the platform uses a preloaded vector index and local rule engine to deliver lightning-fast responses. Enter a Gemini API Key to route queries to real LLM instances.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full glass-input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 text-xs font-bold">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};
