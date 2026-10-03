import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Share2, 
  RotateCcw, 
  Lock, 
  FileCheck2,
  PhoneCall,
  Info
} from 'lucide-react';

export default function AnalysisResult({ result, lang, t, onReset }) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  if (!result) return null;

  const isHindi = lang === 'hi';
  const score = result.risk_score || 0;
  
  // Color styling based on risk score
  let badgeBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  let scoreColor = "text-emerald-400";
  let ringColor = "stroke-emerald-400";
  let riskTitle = isHindi ? (result.risk_level_hi || "कम जोखिम") : result.risk_level;

  if (score >= 81) {
    badgeBg = "bg-rose-500/20 text-rose-400 border-rose-500/30";
    scoreColor = "text-rose-400";
    ringColor = "stroke-rose-500";
  } else if (score >= 61) {
    badgeBg = "bg-orange-500/20 text-orange-400 border-orange-500/30";
    scoreColor = "text-orange-400";
    ringColor = "stroke-orange-500";
  } else if (score >= 31) {
    badgeBg = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    scoreColor = "text-amber-400";
    ringColor = "stroke-amber-400";
  }

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copySummary = () => {
    const summary = `🛡️ Raksha Investor Scam Assessment:
Risk Level: ${result.risk_level} (${result.risk_score}/100)
Status: ${isHindi ? result.risk_summary_hi : result.risk_summary_en}
Key Flags: ${(isHindi ? result.why_we_flagged_hi : result.why_we_flagged_en)?.slice(0, 3).join(', ')}
Advice: Never send money or share OTP without independent verification. Report fraud on 1930 / cybercrime.gov.in.`;
    
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whyFlagged = isHindi ? result.why_we_flagged_hi : result.why_we_flagged_en;
  const explainPoints = isHindi ? result.explanation_points_hi : result.explanation_points_en;
  const doNotList = isHindi ? result.do_not_hi : result.do_not_en;
  const doList = isHindi ? result.do_hi : result.do_en;
  const checklist = result.verification_checklist || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-4xl mx-auto my-8">
      
      {/* Privacy Redaction Alert Banner (If PII was detected) */}
      {result.pii_report && result.pii_report.detected && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 flex items-start space-x-3">
          <Lock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">
              {isHindi ? result.pii_report.warning_hi : result.pii_report.warning_en}
            </p>
            <p className="text-xs text-amber-200/80 mt-1">
              {isHindi ? 'हटाए गए क्रेडेंशियल: ' : 'Redacted items: '}
              <span className="font-semibold">{result.pii_report.detected_items.join(', ')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Header: AI Risk Indicator Card */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left text */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-slate-800 text-slate-300 border-slate-600">
            <span>{t.riskIndicatorLabel}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
            {score >= 61 ? <ShieldAlert className="w-8 h-8 text-rose-500" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
            <span>{riskTitle}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-normal max-w-lg">
            {isHindi ? result.risk_summary_hi : result.risk_summary_en}
          </p>
        </div>

        {/* Circular Risk Meter */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-700"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="currentColor"
              strokeWidth="10"
              className={ringColor}
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * score) / 100}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold font-mono ${scoreColor}`}>
              {score}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              / 100
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 1: WHY WE FLAGGED THIS (Scam Signal Detection) */}
      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>{t.whyFlaggedTitle}</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {whyFlagged && whyFlagged.map((flag, idx) => (
            <div 
              key={idx} 
              className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm"
            >
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">⚠️</span>
              <span className="font-medium">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: WHAT THIS MEANS (Explainable AI in Simple Language) */}
      {explainPoints && explainPoints.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-indigo-400" />
            <span>{t.whatMeansTitle}</span>
          </h3>

          <div className="space-y-3">
            {explainPoints.map((pt, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300 text-xs sm:text-sm"
              >
                <div className="flex items-center space-x-2 text-amber-300 font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{pt.detected}</span>
                </div>
                <p className="text-slate-300 font-normal leading-relaxed pl-4">
                  {pt.why_it_matters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded URL Analysis Section if present */}
      {result.url_analyses && result.url_analyses.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>{isHindi ? 'संदेश में मिले वेब लिंक की जांच' : 'Embedded Link Safety Check'}</span>
          </h4>
          {result.url_analyses.map((uRes, uIdx) => (
            <div key={uIdx} className="text-xs text-slate-300 space-y-1 mt-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sky-300 truncate max-w-xs sm:max-w-md">{uRes.url}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  uRes.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {uRes.risk_level}
                </span>
              </div>
              <p className="text-slate-400 mt-1">
                {isHindi ? uRes.explanation_hi : uRes.explanation_en}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: WHAT SHOULD YOU DO NOW? (DO NOT vs DO Side-by-Side) */}
      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          <span>{t.whatToDoTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* DO NOT CARD */}
          <div className="p-4 sm:p-5 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm sm:text-base mb-3">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{t.doNotHeading}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {doNotList && doNotList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DO CARD */}
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm sm:text-base mb-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{t.doHeading}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {doList && doList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 4: PRE-INVESTMENT VERIFICATION CHECKLIST (Feature 13) */}
      {checklist && checklist.length > 0 && (
        <div className="mb-8 p-5 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
              <span>{t.checklistHeading}</span>
            </h4>
            <span className="text-xs text-amber-400 font-semibold">
              {Object.values(checkedItems).filter(Boolean).length} / {checklist.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            {isHindi 
              ? 'पैसे भेजने से पहले स्वयं इन बिंदुओं पर टिक करें और सुनिश्चित करें कि कोई खतरा नहीं है:' 
              : 'Tick each point before proceeding to confirm you have performed essential due diligence:'}
          </p>

          <div className="space-y-2">
            {checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <label 
                  key={item.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isChecked 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200' 
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    {isHindi ? item.label_hi : item.label_en}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Helplines */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900 border border-slate-700/80 mb-8">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm mb-1">
          <PhoneCall className="w-4 h-4" />
          <span>{t.helplineTitle}</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">{t.helplineSub}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">National Cyber Crime</span>
            <a 
              href="tel:1930" 
              className="text-amber-400 font-mono font-bold text-sm hover:underline block mt-0.5"
            >
              📞 1930 (Toll Free)
            </a>
            <span className="text-[10px] text-slate-500">cybercrime.gov.in</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">SEBI SCORES Portal</span>
            <a 
              href="https://scores.sebi.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-indigo-400 font-bold hover:underline block mt-0.5"
            >
              scores.sebi.gov.in
            </a>
            <span className="text-[10px] text-slate-500">Investor Grievance Redressal</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">RBI Sachet Portal</span>
            <a 
              href="https://sachet.rbi.org.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-400 font-bold hover:underline block mt-0.5"
            >
              sachet.rbi.org.in
            </a>
            <span className="text-[10px] text-slate-500">Report Unregistered Schemes</span>
          </div>
        </div>
      </div>

      {/* AI Disclaimer Guardrail Notice */}
      <div className="border-t border-slate-800 pt-4 mb-6 text-center text-xs text-slate-400">
        <p className="italic">
          "{isHindi ? result.ai_disclaimer_hi : result.ai_disclaimer_en}"
        </p>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={copySummary}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-semibold transition-colors"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>{copied ? (isHindi ? 'कॉपी कर लिया गया!' : 'Copied to Clipboard!') : t.btnShare}</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.btnNewCheck}</span>
        </button>
      </div>

    </div>
  );
}
