import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Loader2, AlertCircle, HelpCircle } from 'lucide-react';

export default function ClaimChecker({ lang, t, onAnalyzeClaim, loading }) {
  const [claim, setClaim] = useState('');
  const [error, setError] = useState(null);

  const sampleClaims = [
    {
      en: "Get 40% guaranteed monthly returns with zero market risk.",
      hi: "बिना किसी बाजार जोखिम के महीने का 40% गारंटीड रिटर्न प्राप्त करें।"
    },
    {
      en: "Double your money in 15 days using our proprietary trading bot.",
      hi: "हमारे विशेष ट्रेडिंग बॉट से 15 दिनों में अपना पैसा दोगुना करें।"
    },
    {
      en: "Pay ₹5,000 processing fee to withdraw your ₹3,50,000 investment profit.",
      hi: "अपना ₹3,50,000 का निवेश मुनाफा निकालने हेतु ₹5,000 प्रोसेसिंग शुल्क भरें।"
    },
    {
      en: "Government-approved SEBI guaranteed high-yield investment scheme.",
      hi: "सरकार द्वारा मान्यता प्राप्त सेबी गारंटीड उच्च लाभ निवेश योजना।"
    },
    {
      en: "Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
      hi: "म्यूचुअल फंड निवेश बाजार जोखिमों के अधीन हैं, योजना से जुड़े सभी दस्तावेज ध्यान से पढ़ें।"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claim.trim()) {
      setError(lang === 'hi' ? 'कृपया जांचने के लिए कोई निवेश दावा दर्ज करें।' : 'Please enter an investment claim to verify.');
      return;
    }
    setError(null);
    onAnalyzeClaim(claim);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t.tabClaim}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'दावों की वास्तविकता, अवास्तविक रिटर्न वादों और अग्रिम विड्रॉल फीस की पुष्टि करें'
                : 'Identify unrealistic return promises, withdrawal fees, and false regulatory claims'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.claimLabel}
            </label>
            <textarea
              rows={4}
              value={claim}
              onChange={(e) => {
                setClaim(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.claimPlaceholder}
              className="w-full bg-slate-950 text-slate-100 text-sm sm:text-base rounded-xl p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-600 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Quick sample chips */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'त्वरित उदाहरण (क्लिक करके जांचें):' : 'Quick Samples (Click to test):'}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleClaims.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setClaim(lang === 'hi' ? item.hi : item.en);
                    setError(null);
                  }}
                  className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  "{lang === 'hi' ? item.hi : item.en}"
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.btnAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t.claimBtn}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
