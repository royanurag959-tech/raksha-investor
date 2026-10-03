import React, { useState } from 'react';
import { Link2, Sparkles, Loader2, AlertCircle, ShieldAlert, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function LinkChecker({ lang, t, onAnalyzeUrl, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const sampleLinks = [
    { label: "Fake SBI KYC", url: "http://sbi-kyc-verify.xyz/login" },
    { label: "Phishing Income Tax APK", url: "https://incometax-refunds.top/claim.apk" },
    { label: "Fake HDFC Reward", url: "http://hdfc-reward-claim.online/redeem" },
    { label: "Telegram Shortener", url: "https://t.me/sure_shot_jackpot_vip" },
    { label: "Official SBI Bank", url: "https://onlinesbi.sbi" },
    { label: "Official SEBI Portal", url: "https://sebi.gov.in" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError(lang === 'hi' ? 'कृपया जांचने के लिए कोई वेब लिंक या URL दर्ज करें।' : 'Please enter a URL or website link to check.');
      return;
    }
    setError(null);
    onAnalyzeUrl(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t.tabLink}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'डोमेन की स्पेलिंग, फर्जी बैंक नकल (.xyz, .top), और असुरक्षित डाउनलोड लिंक की जांच करें'
                : 'Inspect domain typosquatting, deceptive extensions, APK downloads, and brand mismatches'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.linkLabel}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.linkPlaceholder}
              className="w-full bg-slate-950 text-slate-100 text-sm sm:text-base rounded-xl p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-600 transition-all font-mono"
            />
          </div>

          {/* Quick Samples */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>{lang === 'hi' ? 'त्वरित लिंक उदाहरण:' : 'Quick Link Samples:'}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleLinks.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(item.url);
                    setError(null);
                  }}
                  className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 font-mono"
                >
                  <span className="text-amber-400 font-sans font-medium">{item.label}:</span>
                  <span className="truncate max-w-[180px]">{item.url}</span>
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
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.btnAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t.linkBtn}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
