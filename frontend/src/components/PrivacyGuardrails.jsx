import React from 'react';
import { Lock, ShieldAlert, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

export default function PrivacyGuardrails({ lang, t }) {
  const isHindi = lang === 'hi';

  const principles = [
    {
      title_en: "1. Zero Credential Collection",
      title_hi: "1. किसी भी गोपनीय क्रेडेंशियल का संकलन नहीं",
      desc_en: "Raksha Investor will NEVER ask for, store, or accept your OTPs, PINs, Passwords, Card CVV, or Netbanking passwords. If pasted accidentally, our client & server scrubbers redact them immediately.",
      desc_hi: "रक्षा इन्वेस्टर कभी भी आपके ओटीपी, पिन, पासवर्ड या कार्ड सीवीवी की मांग या संग्रहण नहीं करता। यदि गलती से पेस्ट किया जाता है, तो हमारा सिस्टम उसे तुरंत हटा देता है।"
    },
    {
      title_en: "2. Strictly Non-Advisory (No Investment Recommendations)",
      title_hi: "2. गैर-सलाहकारी (कोई निवेश सिफारिश नहीं)",
      desc_en: "This application NEVER tells users which stock, mutual fund, or cryptocurrency to purchase. Its sole mandate is Scam Detection, Risk Explanation, and Safe Action Guidance (DETECT → EXPLAIN → WARN → GUIDE).",
      desc_hi: "यह ऐप कभी यह नहीं बताता कि कौन सा शेयर या क्रिप्टो खरीदें। इसका एकमात्र उद्देश्य धोखाधड़ी की पहचान, जोखिम समझाना और सुरक्षा मार्गदर्शन है।"
    },
    {
      title_en: "3. Transparent AI Uncertainty Communication",
      title_hi: "3. एआई अनिश्चितता का पारदर्शी प्रकटीकरण",
      desc_en: "AI analysis is an assistive safety shield, not conclusive evidence. The platform communicates probabilistic indicators (e.g. 'Potentially suspicious — verification recommended') rather than absolute defamatory claims.",
      desc_hi: "एआई विश्लेषण एक सुरक्षा सहायता है, कानूनी साक्ष्य नहीं। प्रणाली निश्चित दावों के बजाय संभावित जोखिम संकेत ('संदिग्ध — पुष्टि की सिफारिश की जाती है') दर्शाती है।"
    },
    {
      title_en: "4. No Impersonation of Regulators or Authorities",
      title_hi: "4. किसी भी नियामक या बैंक का रूप धारण नहीं",
      desc_en: "Raksha Investor does not pose as SEBI, RBI, Cyber Crime Cell, or any commercial bank. We direct users directly to verified official government portals (1930 Helpline, cybercrime.gov.in, scores.sebi.gov.in).",
      desc_hi: "रक्षा इन्वेस्टर कभी सेबी, आरबीआई या बैंक होने का दावा नहीं करता। हम उपयोगकर्ताओं को सीधे 1930 और सरकारी पोर्टलों पर मार्गदर्शन करते हैं।"
    },
    {
      title_en: "5. Ephemeral & Minimal Processing",
      title_hi: "5. न्यूनतम व क्षणिक डेटा प्रोसेसिंग",
      desc_en: "User-submitted message texts are analyzed in-memory. We do not maintain unencrypted databases of user messages or track personal identities.",
      desc_hi: "विश्लेषण के लिए दर्ज किए गए संदेश मेमोरी में संसाधित होते हैं। हम उपयोगकर्ताओं के निजी संदेशों का कोई स्थायी डेटाबेस नहीं बनाते।"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.guardrailsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isHindi ? 'संज्ञान हैकाथॉन मूल्यांकन मानदंड 3 के अनुसार निर्मित' : 'Compliant with SANGYAN Hackathon Evaluation Criterion 3'}
            </p>
          </div>
        </div>

        {/* Big Statutory Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 mb-8">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm mb-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{isHindi ? 'वैधानिक सुरक्षा सूचना व डिस्क्लेमर' : 'Statutory Safety Disclaimer'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.disclaimerText}
          </p>
        </div>

        {/* 5 Core Principles */}
        <div className="space-y-4">
          {principles.map((p, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1.5">
                {isHindi ? p.title_hi : p.title_en}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {isHindi ? p.desc_hi : p.desc_en}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
