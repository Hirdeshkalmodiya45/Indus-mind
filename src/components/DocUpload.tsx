import React from 'react';
import { UploadCloud, FileText, Search, Database, FileUp, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Document } from '../utils/ragEngine';

interface DocUploadProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  selectedDoc: Document | null;
  setSelectedDoc: (doc: Document | null) => void;
  addActivityLog: (log: string) => void;
}

export const DocUpload: React.FC<DocUploadProps> = ({
  documents,
  setDocuments,
  selectedDoc,
  setSelectedDoc,
  addActivityLog
}) => {
  const [filterType, setFilterType] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Upload States
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [uploadName, setUploadName] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerUploadSimulation = (fileName: string) => {
    setUploadName(fileName);
    setUploadProgress(0);
    addActivityLog(`Uploading document: ${fileName}...`);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Process file metadata
          const title = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
          
          const newDoc: Document = {
            id: `doc-uploaded-${Date.now()}`,
            title: title,
            type: fileName.toLowerCase().includes('sop') ? 'SOP' 
                  : fileName.toLowerCase().includes('compliance') || fileName.toLowerCase().includes('audit') ? 'Compliance'
                  : fileName.toLowerCase().includes('inspect') ? 'Inspection'
                  : fileName.toLowerCase().includes('incident') || fileName.toLowerCase().includes('fail') ? 'Incident'
                  : 'Maintenance',
            date: new Date().toISOString().split('T')[0],
            author: 'reliability-upload-bot',
            asset: fileName.toLowerCase().includes('p-101') || fileName.toLowerCase().includes('pump') ? 'Pump P-101' : 'General Asset',
            content: `UPLOADED DOCUMENT DATA CONTENT EXTRACTED VIA OCR/TESSERACT PARSER
Document Title: ${title}
Timestamp Ingested: ${new Date().toLocaleString()}
Ecosystem Reference: Sector C Operations.

Technical Summary:
This is a user-uploaded diagnostic file. The text engine successfully extracted structural terms.
1. Asset Association: Checked references for Pump P-101 and associated standard valves.
2. Content Log details: Operator logged manual diagnostic checklist review. Temperature was noted within standard tolerances, vibrations reported at normal range.
3. Recommendations: Keep indexed in ChromaDB vector repository. Run monthly semantic audits against OSHA safety SOPs.`,
            metadata: {
              fileSize: '1.4 MB',
              pageCount: 3,
              author: 'Reliability Upload Bot',
              referenceCode: `UP-REG-${Math.floor(100 + Math.random() * 900)}`,
              tags: ['User Ingested', 'OCR Processed', 'Vector Chroma']
            }
          };

          setDocuments(prev => [newDoc, ...prev]);
          setSelectedDoc(newDoc);
          setUploadProgress(null);
          setUploadName('');
          addActivityLog(`Successfully processed and indexed ${title} into vector database.`);
        }, 500);
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      triggerUploadSimulation(files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      triggerUploadSimulation(files[0].name);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.metadata.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* LEFT 2 COLS: Upload zone & Processed list */}
      <div className="lg:col-span-2 flex flex-col justify-between overflow-hidden relative space-y-4">
        
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
            isDragging 
              ? 'border-cyan-500 bg-cyan-950/20 shadow-lg' 
              : 'border-slate-800 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
          />

          {uploadProgress !== null ? (
            <div className="space-y-4 w-full max-w-xs">
              <FileUp className="w-10 h-10 text-cyan-400 animate-bounce mx-auto" />
              <div className="text-xs text-slate-300 font-mono">
                Ingesting <span className="text-cyan-400 font-bold">{uploadName}</span>...
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-100" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block">{uploadProgress}% Complete • Chunking vectors</span>
            </div>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-slate-500 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">Drag & Drop PDF or click to browse</h4>
              <p className="text-slate-400 text-xs max-w-sm mb-1 leading-relaxed">
                Ingest technical manual manuals, safety standards, inspection protocols, and maintenance records.
              </p>
              <span className="text-[10px] text-slate-500">Supports PDF, DOCX, TXT up to 25MB • Automated OCR extraction</span>
            </>
          )}
        </div>

        {/* Processed list container */}
        <div className="flex-1 glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col overflow-hidden">
          
          {/* Header toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-900 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Processed Index ({filteredDocs.length})</span>
            </div>
            
            {/* Search inputs */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search index..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-9 py-1.5 w-44"
                />
              </div>
            </div>
          </div>

          {/* Document Types Filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-3.5 border-b border-slate-900/50 mb-3">
            {['All', 'Maintenance', 'Inspection', 'SOP', 'Compliance', 'Incident'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors shrink-0 ${
                  filterType === type 
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' 
                    : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* List area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredDocs.length === 0 ? (
              <div className="text-slate-500 text-xs italic text-center py-12">No files found matching criteria.</div>
            ) : (
              filteredDocs.map((doc) => {
                let badgeColor = 'border-slate-800 bg-slate-900 text-slate-400';
                if (doc.type === 'Maintenance') badgeColor = 'border-cyan-950 bg-cyan-950/20 text-cyan-400';
                if (doc.type === 'Inspection') badgeColor = 'border-emerald-950 bg-emerald-950/20 text-emerald-400';
                if (doc.type === 'SOP') badgeColor = 'border-violet-950 bg-violet-950/20 text-violet-400';
                if (doc.type === 'Compliance') badgeColor = 'border-amber-950 bg-amber-950/20 text-amber-400';
                if (doc.type === 'Incident') badgeColor = 'border-rose-950 bg-rose-950/20 text-rose-400';

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedDoc?.id === doc.id
                        ? 'border-cyan-500 bg-cyan-950/10'
                        : 'border-slate-900/60 bg-slate-950/30 hover:border-slate-850 hover:bg-slate-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{doc.title}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-500">
                          <span>{doc.date}</span>
                          <span>•</span>
                          <span>{doc.metadata.fileSize}</span>
                          <span>•</span>
                          <span>Code: {doc.metadata.referenceCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${badgeColor}`}>
                        {doc.type}
                      </span>
                      <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* RIGHT COL: OCR Text Previewer */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-900 overflow-hidden flex flex-col justify-between">
        
        {/* Preview header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4">
          <Eye className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="font-bold text-white text-xs">Vector & Text Previewer</h4>
            <p className="text-slate-400 text-[9px]">Ingested OCR/Layout parser telemetry</p>
          </div>
        </div>

        {selectedDoc ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Metadata board */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60">
                <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide">File Reference</span>
                <span className="text-xs font-mono font-bold text-slate-200">{selectedDoc.metadata.referenceCode}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60">
                <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide">Page Count</span>
                <span className="text-xs font-mono font-bold text-slate-200">{selectedDoc.metadata.pageCount} Pages</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60">
                <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide">Author / Org</span>
                <span className="text-xs font-semibold text-slate-200 block truncate">{selectedDoc.metadata.author}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60">
                <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide">Target Asset</span>
                <span className="text-xs font-bold text-cyan-400 block truncate">{selectedDoc.asset}</span>
              </div>
            </div>

            {/* Ingested Tags */}
            <div className="mb-4">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Ecosystem Tags</span>
              <div className="flex flex-wrap gap-1">
                {selectedDoc.metadata.tags.map((t, idx) => (
                  <span key={idx} className="text-[9px] font-semibold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Text Pane */}
            <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 overflow-y-auto font-mono text-[10px] text-slate-400 leading-relaxed max-h-64 whitespace-pre-wrap select-text">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2 pb-1 border-b border-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OCR COMPLETE • PARSED VECTOR BLOCK
              </div>
              {selectedDoc.content}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <FileText className="w-12 h-12 text-slate-800 mb-3" />
            <span className="text-xs font-semibold text-slate-400">Select a document from the list</span>
            <span className="text-[10px] text-slate-500 mt-1">Select any document in the vector index to view metadata tags and parsed layout pages.</span>
          </div>
        )}

      </div>

    </div>
  );
};
