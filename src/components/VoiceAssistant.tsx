import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Sparkles } from 'lucide-react';
import { queryLocalRAGEngine, generateDemoDocuments } from '../utils/ragEngine';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  
  const recognitionRef = React.useRef<any>(null);

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
        setTranscript('Listening...');
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceQuery(text);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setErrorMsg('Microphone error or permission denied.');
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setErrorMsg('Web Speech API is not supported in this browser.');
    }
  }, []);

  const handleVoiceQuery = (speechText: string) => {
    // 1. Query the local RAG engine
    const demoDocs = generateDemoDocuments();
    const result = queryLocalRAGEngine(speechText, demoDocs);
    
    // Clean markdown bold text out for screen reader speech synthesis
    const cleanAnswer = result.answer.replace(/\*\*/g, '').replace(/###/g, '').replace(/\*/g, '');
    setResponse(result.answer);

    // 2. Speak result aloud using SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel pending speech
      const utterance = new SpeechSynthesisUtterance(cleanAnswer.substring(0, 200) + '... Refer to the dashboard sources for details.');
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setErrorMsg('Speech recognition engine is unavailable.');
      }
    }
  };

  const simulateSpeechInput = (text: string) => {
    setTranscript(text);
    handleVoiceQuery(text);
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-6 rounded-3xl border border-slate-900 flex flex-col justify-between items-center text-center space-y-8 animate-fade-in select-none">
      
      {/* Header info */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-[10px] text-cyan-400 font-bold mb-3 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Voice Operations Enabled
        </div>
        <h2 className="text-xl font-extrabold text-white">Industrial Voice Copilot</h2>
        <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
          Tap the mic and speak operational questions. The Copilot will analyze safety logs and read answers aloud.
        </p>
      </div>

      {/* Pulsating Microphone Button */}
      <div className="relative flex items-center justify-center py-6">
        
        {/* Pulsating background ring rings */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-cyan-500/10 border border-cyan-500/20 animate-[ping_2s_linear_infinite]" />
            <div className="absolute w-28 h-28 rounded-full bg-cyan-500/15 border border-cyan-500/30 animate-[ping_1.5s_linear_infinite]" />
          </>
        )}

        <button
          onClick={toggleMic}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isListening 
              ? 'bg-rose-600 shadow-rose-600/35 border-2 border-rose-400 text-white' 
              : 'bg-gradient-to-tr from-cyan-500 to-emerald-500 shadow-cyan-500/20 hover:scale-105 border-2 border-cyan-400/20 text-slate-950'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 stroke-[2.2] animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 stroke-[2.2]" />
          )}
        </button>

      </div>

      {/* Listening / speech output transcripts */}
      <div className="w-full space-y-4 font-mono text-xs max-w-lg">
        
        {/* User spoken input */}
        <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/60 text-left">
          <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide mb-1.5">User spoken input</span>
          <p className="text-slate-200 min-h-[1.5rem]">
            {transcript || 'No voice detected. Press the mic to talk.'}
          </p>
        </div>

        {/* AI voice response output */}
        <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/60 text-left">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 text-[8px] font-bold block uppercase tracking-wide">Assistant response text</span>
            {response && <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          </div>
          <p className="text-slate-300 leading-relaxed min-h-[3rem] whitespace-pre-wrap">
            {response || 'Verbal output transcript will print here...'}
          </p>
        </div>

      </div>

      {/* Suggested Spoken Phrases pills */}
      <div className="w-full max-w-md">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Try saying:</span>
        <div className="flex flex-col gap-1.5">
          {[
            "Why did Pump P-101 fail last year?",
            "Are there any compliance risks?",
            "Show overdue inspections"
          ].map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => simulateSpeechInput(phrase)}
              className="text-[10px] text-slate-400 hover:text-slate-200 border border-slate-900 hover:border-slate-800 bg-slate-950/20 hover:bg-slate-900/30 py-2 px-3 rounded-lg transition-colors text-left flex items-center justify-between"
            >
              <span>"{phrase}"</span>
              <Volume2 className="w-3.5 h-3.5 opacity-40 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Error notices */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-amber-950 bg-amber-950/10 text-amber-400 text-xs max-w-md w-full justify-center">
          <AlertCircle className="w-4.5 h-4.5 text-amber-400" />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
};
