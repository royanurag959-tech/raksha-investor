import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, ShieldCheck, PlayCircle, Loader2 } from 'lucide-react';

export default function DemoCenter({ scenarios, lang, t, onRunScenario, loading }) {
  const isHindi = lang === 'hi';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 my-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SANGYAN Hackathon Evaluation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.demoHeading}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2">
          {t.demoSub}
        </p>
      </div>

      {/* Grid of 6 Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {scenarios.map((item, idx) => {
          const isSafe = item.expected_risk.includes('LOW');
          const isSuspicious = item.expected_risk.includes('SUSPICIOUS');
          const isHigh = item.expected_risk.includes('HIGH');

          let badgeBg = "bg-rose-500/20 text-rose-400 border-rose-500/30";
          if (isSuspicious) badgeBg = "bg-amber-500/20 text-amber-400 border-amber-500/30";
          if (isSafe) badgeBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

          return (
            <div 
              key={item.id || idx}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]"
            >
              <div>
                {/* Channel & Risk Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.channel}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                    {item.expected_risk}
                  </span>
                </div>

                {/* Scenario Title */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {idx + 1}. {isHindi ? item.title_hi : item.title_en}
                </h3>

                {/* Scenario Description */}
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {isHindi ? item.description_hi : item.description_en}
                </p>

                {/* Snippet Quote */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans mb-4 max-h-24 overflow-y-auto italic">
                  "{item.text}"
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={loading}
                onClick={() => onRunScenario(item)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs sm:text-sm border border-slate-700 hover:border-amber-400 transition-all shadow-sm group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{t.demoRunBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
