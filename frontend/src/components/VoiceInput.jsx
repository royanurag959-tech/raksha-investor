import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';

export default function VoiceInput({ lang, t, onTranscriptReceived }) {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onTranscriptReceived(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है।' : 'Microphone permission was denied.');
        } else {
          setErrorMsg(lang === 'hi' ? 'आवाज़ पहचानने में समस्या आई। पुनः प्रयास करें।' : 'Speech capture error. Please try again.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang, onTranscriptReceived]);

  const toggleListening = () => {
    setErrorMsg(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400'
        }`}
        title="Voice to text input"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span>{t.voiceStop}</span>
            <span className="flex space-x-1 items-center ml-1">
              <span className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-amber-400" />
            <span>{t.voiceBtn}</span>
            <span className="text-xs text-slate-400 font-normal">
              ({lang === 'hi' ? 'हिन्दी वॉइस' : 'English Voice'})
            </span>
          </>
        )}
      </button>

      {isListening && (
        <span className="text-xs text-amber-300 flex items-center gap-1 font-medium bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
          <Volume2 className="w-3.5 h-3.5 animate-voice-pulse" />
          {t.voiceListening}
        </span>
      )}

      {errorMsg && (
        <span className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/40 px-2 py-1 rounded border border-rose-500/30">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </span>
      )}
    </div>
  );
}
