import React from 'react';
import { 
  ShieldCheck, 
  MessageSquareWarning, 
  CheckCircle2, 
  Link2, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Hero({ t, lang, onSelectAction }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Track & Hackathon Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.trackBadge}</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-emerald-400">{t.privacyBadge}</span>
        </div>

        {/* Main Title & Tagline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          {t.brand}
        </h1>
        
        <p className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 mb-4">
          "{t.tagline}"
        </p>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 font-normal leading-relaxed">
          {t.subtitle}
        </p>

        {/* 4 Primary Action Cards / Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          
          <button
            onClick={() => onSelectAction('analyzer')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-amber-400/80 text-white font-semibold transition-all hover:scale-[1.02] shadow-md group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2.5 text-amber-400 group-hover:scale-110 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-100">{t.heroBtnAnalyze}</span>
            <span className="text-xs text-slate-400 mt-1">WhatsApp • SMS • Telegram</span>
          </button>

          <button
            onClick={() => onSelectAction('claim')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-amber-400/80 text-white font-semibold transition-all hover:scale-[1.02] shadow-md group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-2.5 text-indigo-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-100">{t.heroBtnClaim}</span>
            <span className="text-xs text-slate-400 mt-1">Guaranteed Returns • Fees</span>
          </button>

          <button
            onClick={() => onSelectAction('link')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-amber-400/80 text-white font-semibold transition-all hover:scale-[1.02] shadow-md group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center mb-2.5 text-sky-400 group-hover:scale-110 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-100">{t.heroBtnLink}</span>
            <span className="text-xs text-slate-400 mt-1">Domain Typos • Fake Sites</span>
          </button>

          <button
            onClick={() => onSelectAction('demo')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/40 hover:border-amber-400 text-white font-semibold transition-all hover:scale-[1.02] shadow-md group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2.5 text-amber-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-amber-300">{t.heroBtnDemo}</span>
            <span className="text-xs text-amber-400/80 mt-1">6 Realistic Scenarios</span>
          </button>

        </div>

        {/* Privacy by Design Banner */}
        <div className="max-w-3xl mx-auto rounded-xl bg-slate-800/60 border border-slate-700/80 p-3.5 sm:p-4 text-left flex items-start space-x-3 shadow-inner">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <span>{t.privacyBannerTitle}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Client-Side Safe
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {t.privacyBannerText}
            </p>
          </div>
        </div>

        {/* Helpline Quick Pill */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>National Cybercrime Helpline: </span>
            <strong className="text-amber-300 ml-1 font-mono text-sm">1930</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">SEBI Grievance: <strong className="text-slate-200">scores.sebi.gov.in</strong></span>
        </div>

      </div>
    </div>
  );
}
