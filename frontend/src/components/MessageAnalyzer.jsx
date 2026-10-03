import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Send, 
  ClipboardCopy, 
  Trash2, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import VoiceInput from './VoiceInput';

export default function MessageAnalyzer({ lang, t, onAnalyze, loading }) {
  const [text, setText] = useState('');
  const [channel, setChannel] = useState(t.channelOptions[0]);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(lang === 'hi' ? 'कृपया विश्लेषण के लिए कोई संदेश दर्ज करें।' : 'Please enter or paste a message to analyze.');
      return;
    }
    setError(null);
    onAnalyze({ text, channel });
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        setError(null);
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleClear = () => {
    setText('');
    setError(null);
  };

  const handleTranscript = (voiceText) => {
    setText(prev => (prev ? `${prev} ${voiceText}` : voiceText));
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.tabMessage}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' 
                  ? 'व्हाट्सएप, टेलीग्राम या एसएमएस संदेशों में छिपे फ्रॉड पैटर्न की जांच करें' 
                  : 'Detect social engineering, fake guarantees, and scam signals'}
              </p>
            </div>
          </div>

          {/* Voice Input Button */}
          <VoiceInput 
            lang={lang} 
            t={t} 
            onTranscriptReceived={handleTranscript} 
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Channel selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">
              {t.channelLabel}
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {t.channelOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.msgPlaceholder}
              className="w-full bg-slate-950 text-slate-100 text-sm sm:text-base rounded-xl p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600 transition-all font-sans leading-relaxed"
            />
            
            {/* Quick Action Buttons inside textarea */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <span>{text.length} characters</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  <span>{t.btnPaste}</span>
                </button>
                {text && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.btnClear}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.btnAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t.btnAnalyze}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
