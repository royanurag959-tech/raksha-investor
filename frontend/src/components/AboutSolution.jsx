import React from 'react';
import { ShieldCheck, Target, Layers, Users, Rocket, Award } from 'lucide-react';

export default function AboutSolution({ lang, t }) {
  const isHindi = lang === 'hi';

  const roadmapPhases = [
    {
      phase: "Phase 1 (Current Prototype)",
      title_en: "Bilingual Core Resilience Engine",
      title_hi: "द्विभाषी मुख्य सुरक्षा इंजन",
      desc_en: "English + Hindi support, multimodal message analyzer, claim checker, typosquatting link detector, privacy scrubbing, Web Speech voice input, and offline heuristic fallback.",
      status: "Implemented"
    },
    {
      phase: "Phase 2",
      title_en: "Pan-India Regional Languages Expansion",
      title_hi: "अखिल भारतीय क्षेत्रीय भाषाओं का विस्तार",
      desc_en: "Expansion to 7 additional Indian languages: Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati, and Punjabi using lightweight translation caches.",
      status: "Architecture Ready"
    },
    {
      phase: "Phase 3",
      title_en: "Full Voice-First Accessibility for Bharat",
      title_hi: "भारत हेतु संपूर्ण वॉइस-फर्स्ट पहुंच",
      desc_en: "Integration of Indian accent speech models and automated audio explanation playback for low-literacy and elderly investors.",
      status: "Prototype Tested"
    },
    {
      phase: "Phase 4",
      title_en: "Crowdsourced & Real-Time Threat Intelligence",
      title_hi: "सामूहिक व रीयल-टाइम फ्रॉड इंटेलिजेंस",
      desc_en: "Community scam reporting feeds, automated detection of emerging UPI handles, phishing domains, and fake Telegram channels.",
      status: "Planned"
    },
    {
      phase: "Phase 5",
      title_en: "Ecosystem & Banking API Integrations",
      title_hi: "बैंकिंग व साइबर सुरक्षा इकोसिस्टम एकीकरण",
      desc_en: "Official integration with National Cyber Crime Reporting Portal (1930) and banking fraud prevention APIs for instant flagging.",
      status: "Future Vision"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isHindi ? 'रक्षा इन्वेस्टर के बारे में' : 'About Raksha Investor'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              SANGYAN Hackathon • Track A: Digital Fraud & Scam Resilience
            </p>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 mb-8 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>{isHindi ? 'हमारा मिशन: "विश्वास करने से पहले जांचें"' : 'Our Mission: "Check Before You Trust"'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isHindi 
              ? 'लाखों भारतीय पहली बार शेयर बाजार या म्यूचुअल फंड में कदम रख रहे हैं। लेकिन सोशल मीडिया, व्हाट्सएप और टेलीग्राम पर फर्जी गारंटीड रिटर्न, डिजिटल अरेस्ट और विड्रॉल फीस घोटालों के जरिए उनकी मेहनत की कमाई लूट ली जाती है। रक्षा इन्वेस्टर एक निःशुल्क जनहित सुरक्षा ढाल है जो पैसे भेजने से पहले ही खतरे की पहचान कराती है।'
              : 'As millions of citizens from Tier-2 and Tier-3 Indian cities enter financial markets, predatory scammers exploit their optimism with fake guaranteed returns, digital arrest threats, and advance-fee crypto schemes. Raksha Investor serves as a free, privacy-first public-good protective shield to intercept scams BEFORE money leaves the investor’s account.'}
          </p>
        </div>

        {/* Target Audience */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>{isHindi ? 'लक्षित उपयोगकर्ता (Target Beneficiaries)' : 'Target Beneficiaries'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
              <strong className="text-amber-300 block mb-1">🏙️ Tier-2 & Tier-3 First-Time Investors</strong>
              <span>New investors entering markets via mobile apps, often lacking formal financial literacy.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
              <strong className="text-amber-300 block mb-1">👴 Senior Citizens & Pensioners</strong>
              <span>Elderly citizens targeted by impersonation, KYC deactivation threats, and pension scams.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
              <strong className="text-amber-300 block mb-1">📱 Youth on Telegram & Instagram</strong>
              <span>Students and young earners exposed to 'VIP stock tip' jackpot calls and task-earning traps.</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
              <strong className="text-amber-300 block mb-1">🇮🇳 Regional Language Users</strong>
              <span>Investors who prefer clear Hindi over complex English financial jargon.</span>
            </div>
          </div>
        </div>

        {/* 5-Phase Scalability Roadmap */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? '5-चरणीय मापनीयता रोडमैप (Scalability Roadmap)' : '5-Phase Scalability Roadmap'}</span>
          </h3>
          
          <div className="space-y-3">
            {roadmapPhases.map((r, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{r.phase}:</span>
                    <span className="text-sm font-bold text-slate-100">{isHindi ? r.title_hi : r.title_en}</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">
                    {r.desc_en}
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 bg-slate-800 text-slate-300 border border-slate-700">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
