import React, { useState } from 'react';
import { FileCheck, ShieldCheck, AlertCircle, HelpCircle, Check, Sparkles } from 'lucide-react';

export default function SafetyChecklist({ items, lang, t }) {
  const [completed, setCompleted] = useState({});
  const isHindi = lang === 'hi';

  const defaultList = [
    {
      id: "1",
      question_en: "Is the organization or advisor verified with official regulators (SEBI / RBI / IRDAI)?",
      question_hi: "क्या संस्था या सलाहकार सेबी (SEBI) या आरबीआई में विधिवत पंजीकृत है?",
      tip_en: "Check directly on scores.sebi.gov.in or rbi.org.in. Never rely on certificates shared on WhatsApp.",
      tip_hi: "सीधे scores.sebi.gov.in पर चेक करें। व्हाट्सएप पर भेजे गए फर्जी सर्टिफिकेट पर भरोसा न करें।"
    },
    {
      id: "2",
      question_en: "Does the domain address end with the official corporate extension, without typos (.xyz, .top, hyphens)?",
      question_hi: "क्या वेबसाइट आधिकारिक डोमेन पर है और कोई फर्जी स्पेलिंग या .xyz, .top नहीं है?",
      tip_en: "Always type the web address manually or open the official verified app.",
      tip_hi: "हमेशा वेबसाइट का पता स्वयं टाइप करें या बैंक का आधिकारिक ऐप खोलें।"
    },
    {
      id: "3",
      question_en: "Are you being promised guaranteed returns or doubling your money in weeks?",
      question_hi: "क्या आपको बिना रिस्क के गारंटीड मुनाफे या कुछ दिनों में पैसा दोगुना करने का लालच दिया जा रहा है?",
      tip_en: "Fixed deposits yield 6–8% annually. Anything promising 20–50% guaranteed is virtually always a fraud.",
      tip_hi: "एफडी से सालाना 6-8% ही मिलता है। 20-50% गारंटीड का दावा लगभग हमेशा धोखा होता है।"
    },
    {
      id: "4",
      question_en: "Are you being pressured to invest immediately due to 'limited slots' or 'today only'?",
      question_hi: "क्या 'सीमित सीटें' या 'आज ही ऑफर' कहकर आप पर तुरंत पैसे भेजने का दबाव बनाया जा रहा है?",
      tip_en: "High pressure is used to bypass critical thinking. Take 24 hours to pause and consult family.",
      tip_hi: "जल्दबाजी की चालें सोचने का मौका न देने के लिए होती हैं। 24 घंटे रुकें और परिवार से चर्चा करें।"
    },
    {
      id: "5",
      question_en: "Have you been asked for OTP, UPI PIN, ATM PIN, or to install an APK or AnyDesk app?",
      question_hi: "क्या आपसे ओटीपी, यूपीआई पिन मांगा गया है या कोई ऐप/एपीके डाउनलोड करने को कहा गया है?",
      tip_en: "Entering a UPI PIN debits money from your account. An OTP is never needed to receive money.",
      tip_hi: "यूपीआई पिन डालने से आपके खाते से पैसे कटते हैं। पैसे प्राप्त करने के लिए कभी पिन या ओटीपी की आवश्यकता नहीं होती।"
    },
    {
      id: "6",
      question_en: "Are you being asked to pay an advance fee, tax, or deposit to release or withdraw profits?",
      question_hi: "क्या मुनाफा निकालने के लिए कोई अग्रिम शुल्क, प्रोसेसिंग फीस या टैक्स मांगा जा रहा है?",
      tip_en: "Never pay extra money to withdraw your own capital or profits.",
      tip_hi: "अपने ही पैसे या लाभ को निकालने के लिए कभी भी नया भुगतान न करें।"
    }
  ];

  const list = items && items.length > 0 ? items : defaultList;

  const toggleItem = (id) => {
    setCompleted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const countDone = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((countDone / list.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.checklistPageTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.checklistPageSub}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 mb-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
            <span className="text-slate-300">{t.checklistProgress}</span>
            <span className={progressPct === 100 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {countDone} of {list.length} Verified ({progressPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
            <div 
              className={`h-full transition-all duration-500 ${
                progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-xs text-emerald-400 font-semibold mt-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{t.checklistSafeMessage}</span>
            </p>
          )}
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {list.map((item, idx) => {
            const isDone = !!completed[item.id];
            return (
              <div 
                key={item.id || idx}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100 shadow-sm'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    isDone 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                      : 'border-slate-600 bg-slate-900 text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm sm:text-base font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {isHindi ? item.question_hi : item.question_en}
                    </p>
                    <p className="text-xs text-amber-300/90 flex items-center gap-1.5 font-normal">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{isHindi ? item.tip_hi : item.tip_en}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
