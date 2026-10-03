import os
import re
import json
from typing import Dict, Any, List, Optional
from .pii_scrubber import scrub_sensitive_pii
from .url_checker import analyze_url

# Pattern rules for Indian financial scam vectors
SCAM_SIGNALS = [
    {
        "id": "GUARANTEED_RETURNS",
        "category": "Unrealistic Financial Promise",
        "pattern": r'(?:guaranteed|assured|100%\s*(?:sure|profit|return)|fixed\s*return|zero\s*risk|risk[- ]free|पक्का\s*मुनाफा|गारंटीड|निश्चित\s*रिटर्न|दोगुना|तिगुना)',
        "score_weight": 35,
        "flag_en": "Guaranteed or Risk-Free Returns Claimed",
        "flag_hi": "गारंटीड या बिना जोखिम के मुनाफे का दावा",
        "why_it_matters_en": "In legitimate financial markets, no investment can legally guarantee high returns without risk. Claims of guaranteed 20%, 50%, or doubling money are standard hallmarks of Ponzi and investment fraud.",
        "why_it_matters_hi": "वैध वित्तीय बाजारों में कोई भी निवेश बिना जोखिम के बड़े मुनाफे की गारंटी नहीं दे सकता। पैसा दोगुना करने या 100% गारंटी के दावे पोंजी स्कीम के मुख्य संकेत हैं।"
    },
    {
        "id": "ARTIFICIAL_URGENCY",
        "category": "Psychological Manipulation & Pressure",
        "pattern": r'(?:urgent|immediately|hurry|limited\s*(?:slots|time|seats|offer)|today\s*only|within\s*(?:[0-9]+)\s*(?:hours|minutes|mins)|last\s*chance|तुरंत|जल्दी\s*करें|सीमित\s*समय|आज\s*ही|2\s*घंटे)',
        "score_weight": 25,
        "flag_en": "High Pressure & Artificial Urgency Tactics",
        "flag_hi": "दबाव व जल्दबाजी की रणनीति",
        "why_it_matters_en": "Scammers purposely create false time pressure and FOMO (Fear Of Missing Out) to force victims to send money or click links before they have time to think rationally or consult family.",
        "why_it_matters_hi": "धोखेबाज जानबूझकर समय का दबाव बनाते हैं ताकि पीड़ित को सोचने या परिवार से सलाह लेने का समय न मिले और वह जल्दबाजी में पैसे भेज दे।"
    },
    {
        "id": "ACCOUNT_BLOCK_THREAT",
        "category": "Intimidation & Fear Appeals",
        "pattern": r'(?:blocked|suspended|deactivated|frozen|electricity\s*cut|legal\s*action|police|arrest|cyber\s*crime|cbi|ed|बंद\s*हो\s*जाएगा|खाता\s*बंद|बिजली\s*काट|कानूनी\s*कार्रवाई)',
        "score_weight": 35,
        "flag_en": "Threat of Account Suspension or Legal Consequence",
        "flag_hi": "खाता बंद होने या कानूनी कार्रवाई की धमकी",
        "why_it_matters_en": "Fear-inducing threats (such as 'Your account will be suspended today' or 'Digital Arrest') are used to panic the recipient into immediate compliance. Legitimate institutions give formal notices and do not freeze accounts without standard procedures.",
        "why_it_matters_hi": "खाता बंद होने या 'डिजिटल अरेस्ट' जैसी धमकियों का उपयोग घबराहट पैदा करने के लिए किया जाता है। असली बैंक ऐसे अचानक संदेश भेजकर धमकी नहीं देते।"
    },
    {
        "id": "CREDENTIAL_SOLICITATION",
        "category": "Data Theft & Phishing",
        "pattern": r'(?:otp|pin|password|cvv|net\s*banking\s*details|card\s*number|update\s*pan|kyc\s*update|ओटीपी|पिन|पासवर्ड|केवाईसी\s*अपडेट)',
        "score_weight": 40,
        "flag_en": "Requests for Sensitive Verification or KYC Update",
        "flag_hi": "ओटीपी, पिन या गोपनीय जानकारी मांगने का प्रयास",
        "why_it_matters_en": "Banks and financial regulators repeatedly emphasize: Never share OTPs, PINs, or banking credentials. No genuine bank official will ask you for OTP or login passwords via SMS or WhatsApp.",
        "why_it_matters_hi": "बैंक और नियामक स्पष्ट कहते हैं: कभी किसी के साथ ओटीपी या पिन साझा न करें। कोई भी असली बैंक अधिकारी मैसेज पर ओटीपी या पासवर्ड नहीं मांगता।"
    },
    {
        "id": "UNOFFICIAL_COMMUNICATION",
        "category": "Unregulated Communication Channel",
        "pattern": r'(?:telegram\s*group|vip\s*channel|whatsapp\s*group|dm\s*me|inbox\s*me|send\s*screenshot|टेलीग्राम|व्हाट्सएप\s*ग्रुप)',
        "score_weight": 25,
        "flag_en": "Unregulated Messaging Channel (Telegram/WhatsApp VIP)",
        "flag_hi": "अनधिकृत संचार चैनल (टेलीग्राम/व्हाट्सएप वीआईपी ग्रुप)",
        "why_it_matters_en": "Financial advisory in India requires SEBI registration. Promoting stock tips or investment schemes through anonymous Telegram or WhatsApp groups violates regulations and often leads to pump-and-dump scams.",
        "why_it_matters_hi": "भारत में निवेश सलाह के लिए सेबी पंजीकरण अनिवार्य है। टेलीग्राम या व्हाट्सएप ग्रुप के माध्यम से 'जैकपॉट कॉल' देना नियमों के खिलाफ और धोखाधड़ी की निशानी है।"
    },
    {
        "id": "ADVANCE_PAYMENT_FEE",
        "category": "Advance-Fee Fraud",
        "pattern": r'(?:processing\s*fee|release\s*fee|security\s*deposit|unlock\s*fee|advance\s*charge|withdrawal\s*tax|विड्रॉल\s*फीस|प्रोसेसिंग\s*फीस|सिक्योरिटी\s*डिपॉजिट)',
        "score_weight": 35,
        "flag_en": "Demands Advance Fee to Release Funds or Profits",
        "flag_hi": "मुनाफा या पैसा निकालने के लिए अग्रिम शुल्क की मांग",
        "why_it_matters_en": "Legitimate investment platforms deduct legitimate charges directly from payout proceeds. Requiring you to send new money to withdraw your own profits is always an advance-fee scam.",
        "why_it_matters_hi": "वैध प्लेटफॉर्म शुल्क को राशि से स्वयं काटते हैं। अपने ही पैसे निकालने के लिए नया भुगतान मांगना 100% धोखाधड़ी की चाल है।"
    },
    {
        "id": "MALICIOUS_APP_DOWNLOAD",
        "category": "Malware & Device Hijacking",
        "pattern": r'(?:\.apk|install\s*app|download\s*app|anydesk|teamviewer|rustdesk|एपीके|ऐप\s*डाउनलोड)',
        "score_weight": 40,
        "flag_en": "Prompts APK Download or Remote Screen Sharing Software",
        "flag_hi": "एपीके (.apk) या स्क्रीन शेयरिंग ऐप डाउनलोड करने का आग्रह",
        "why_it_matters_en": "Installing unknown APKs or remote desktop apps gives scammers full access to read your SMS OTPs and control your banking apps remotely.",
        "why_it_matters_hi": "अपरिचित .apk या AnyDesk जैसे ऐप डाउनलोड करने से धोखेबाज आपके फोन के सारे एसएमएस, ओटीपी और बैंक खाते को दूर बैठे नियंत्रित कर लेते हैं।"
    },
    {
        "id": "UNVERIFIED_AUTHORITY",
        "category": "Impersonation",
        "pattern": r'(?:sbi|hdfc|icici|yono|income\s*tax|rbi\s*approved|sebi\s*approved|govt\s*of\s*india|एसबीआई|आयकर|आरबीआई|सेबी)',
        "score_weight": 20,
        "flag_en": "References Major Bank or Government Authority",
        "flag_hi": "प्रतिष्ठित बैंक या सरकारी संस्था का नाम लेकर भरोसा जीतना",
        "why_it_matters_en": "Scammers frequently spoof trusted institutions like SBI, RBI, or the Income Tax Department to exploit trust and create fake credibility.",
        "why_it_matters_hi": "धोखेबाज लोगों का भरोसा जीतने के लिए एसबीआई, आरबीआई या इनकम टैक्स विभाग के नाम का दुरुपयोग करते हैं।"
    }
]

# Statutory market disclaimer detection
STATUTORY_DISCLAIMERS = [
    r'mutual\s*fund\s*investments\s*are\s*subject\s*to\s*market\s*risks',
    r'read\s*all\s*scheme\s*related\s*documents\s*carefully',
    r'allotted\s*units',
    r'sip\s*(?:installment|processed|debited)',
    r'nav\s*(?:is|of|:)?\s*[0-9]+'
]

def analyze_message_text(raw_text: str, channel: str = "Generic") -> Dict[str, Any]:
    """
    Main analysis pipeline:
    1. Privacy & PII scrubbing
    2. Embedded URL extraction & safety analysis
    3. Multi-signal scam pattern detection
    4. Statutory disclosure calibration
    5. Scoring & risk classification
    6. Explainable AI synthesis in English & Hindi
    7. Safe Action guidance
    """
    if not raw_text or not raw_text.strip():
        return {
            "error": "Empty input provided",
            "risk_level": "UNKNOWN",
            "risk_score": 0
        }

    # Step 1: Privacy Scrubbing
    scrubbed_text, pii_detected, pii_report = scrub_sensitive_pii(raw_text)

    # Step 2: URL Extraction & Analysis
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
    extracted_urls = url_pattern.findall(scrubbed_text)
    url_analyses = [analyze_url(u) for u in extracted_urls]

    # Step 3: Scam Signal Extraction
    matched_signals = []
    base_score = 10
    has_statutory_disclosure = any(re.search(pat, scrubbed_text, re.IGNORECASE) for pat in STATUTORY_DISCLAIMERS)

    for sig in SCAM_SIGNALS:
        if re.search(sig["pattern"], scrubbed_text, re.IGNORECASE):
            matched_signals.append(sig)
            base_score += sig["score_weight"]

    # Incorporate URL risk into overall score
    for u_res in url_analyses:
        if u_res["risk_level"] == "HIGH":
            base_score += 40
        elif u_res["risk_level"] == "MEDIUM":
            base_score += 20

    # If it contains genuine statutory disclosures without heavy red flags, reduce score
    if has_statutory_disclosure and len(matched_signals) <= 1:
        base_score = max(5, base_score - 50)

    # Clamp risk score
    risk_score = min(max(base_score, 5), 98)

    # Determine Risk Tier (Feature 12)
    if risk_score >= 81:
        risk_level = "HIGH RISK"
        risk_level_hi = "उच्च जोखिम (खतरा)"
        risk_badge_color = "red"
        risk_summary_en = "High likelihood of financial fraud or deceptive manipulation."
        risk_summary_hi = "वित्तीय धोखाधड़ी या धोखे की अत्यधिक संभावना है।"
    elif risk_score >= 61:
        risk_level = "SUSPICIOUS"
        risk_level_hi = "संदिग्ध (सावधान)"
        risk_badge_color = "orange"
        risk_summary_en = "Contains multiple warning signals commonly found in predatory investment traps."
        risk_summary_hi = "इसमें कई ऐसे संकेत हैं जो अक्सर निवेश घोटालों में पाए जाते हैं।"
    elif risk_score >= 31:
        risk_level = "CAUTION"
        risk_level_hi = "चेतावनी (सतर्क रहें)"
        risk_badge_color = "amber"
        risk_summary_en = "Unverified claims or promotional language detected. Exercise caution before transacting."
        risk_summary_hi = "अपुष्ट दावे या प्रचार भाषा मिली है। लेनदेन से पहले अतिरिक्त सावधानी बरतें।"
    else:
        risk_level = "LOW CONCERN / NO OBVIOUS RED FLAGS"
        risk_level_hi = "कम जोखिम / कोई स्पष्ट लाल झंडा नहीं"
        risk_badge_color = "green"
        risk_summary_en = "No immediate predatory scam markers detected. Always verify official channels independently."
        risk_summary_hi = "कोई प्रत्यक्ष शिकारी संकेत नहीं मिला। फिर भी हमेशा आधिकारिक स्रोतों से स्वतंत्र जांच करें।"

    # Step 4: Explainable AI generation (Feature 2)
    why_we_flagged_en = [sig["flag_en"] for sig in matched_signals]
    why_we_flagged_hi = [sig["flag_hi"] for sig in matched_signals]

    if not why_we_flagged_en:
        if has_statutory_disclosure:
            why_we_flagged_en.append("Message contains standard statutory risk disclosures and transparent transaction details.")
            why_we_flagged_hi.append("संदेश में मानक कानूनी जोखिम प्रकटीकरण और पारदर्शी लेनदेन विवरण शामिल हैं।")
        else:
            why_we_flagged_en.append("No obvious manipulative patterns detected in the text.")
            why_we_flagged_hi.append("पाठ में कोई स्पष्ट भ्रामक या शिकारी पैटर्न नहीं मिला।")

    # Detailed Explainable breakdown: 1. What we detected, 2. Why it matters, 3. What the user should do
    explanation_points_en = []
    explanation_points_hi = []

    for sig in matched_signals[:3]:
        explanation_points_en.append({
            "detected": sig["flag_en"],
            "why_it_matters": sig["why_it_matters_en"],
            "what_to_do": f"Do not respond to demands related to {sig['flag_en'].lower()} without independent confirmation."
        })
        explanation_points_hi.append({
            "detected": sig["flag_hi"],
            "why_it_matters": sig["why_it_matters_hi"],
            "what_to_do": f"स्वतंत्र पुष्टि के बिना {sig['flag_hi']} से जुड़ी मांगों पर कोई कदम न उठाएं।"
        })

    # Step 5: Safe Action Guidance (Feature 5)
    do_not_list_en = [
        "DO NOT send money, UPI transfers, or advance booking fees.",
        "DO NOT share OTP, UPI PIN, ATM PIN, or Netbanking passwords.",
        "DO NOT download any APK files or install remote apps (AnyDesk, TeamViewer).",
        "DO NOT click links sent by unknown numbers on Telegram, WhatsApp, or SMS."
    ]

    do_not_list_hi = [
        "पैसे, यूपीआई ट्रांसफर या कोई अग्रिम बुकिंग शुल्क बिल्कुल न भेजें।",
        "कभी भी ओटीपी, यूपीआई पिन, एटीएम पिन या पासवर्ड साझा न करें।",
        "कोई भी .apk फ़ाइल डाउनलोड न करें या स्क्रीन-शेयरिंग ऐप (AnyDesk) इंस्टॉल न करें।",
        "अज्ञात नंबरों द्वारा व्हाट्सएप, एसएमएस या टेलीग्राम पर भेजे गए लिंक पर क्लिक न करें।"
    ]

    do_list_en = [
        "Verify the sender's identity independently using official bank/institution apps.",
        "Check SEBI Intermediary Portal (scores.sebi.gov.in) to verify registered advisors.",
        "Consult a trusted family member or certified financial advisor before transferring money.",
        "Report cyber fraud immediately on the National Cybercrime Portal: Call 1930 or visit cybercrime.gov.in."
    ]

    do_list_hi = [
        "संबंधित बैंक या कंपनी के आधिकारिक मोबाइल ऐप या वेबसाइट से सीधे पुष्टि करें।",
        "सेबी पोर्टल (scores.sebi.gov.in) पर जाकर देखें कि क्या सलाहकार पंजीकृत है।",
        "पैसे भेजने से पहले परिवार के किसी समझदार सदस्य या जानकार से राय लें।",
        "धोखाधड़ी का संदेह होने पर राष्ट्रीय साइबर हेल्पलाइन 1930 पर तुरंत कॉल करें या cybercrime.gov.in पर रिपोर्ट करें।"
    ]

    # Verification Checklist (Feature 13)
    verification_checklist = [
        {"id": "org_genuine", "label_en": "Is the organization genuine and registered with regulatory authorities?", "label_hi": "क्या संस्था असली है और सेबी/आरबीआई में पंजीकृत है?"},
        {"id": "domain_official", "label_en": "Is the website/domain official and not a typo-squatted fake (.xyz, .top)?", "label_hi": "क्या वेबसाइट आधिकारिक डोमेन पर है और कोई फर्जी नकल (.xyz, .top) नहीं है?"},
        {"id": "claim_realistic", "label_en": "Is the investment claim realistic and free of guaranteed return promises?", "label_hi": "क्या निवेश का दावा यथार्थवादी है और बिना गारंटीड रिटर्न के है?"},
        {"id": "no_pressure", "label_en": "Are you free from artificial urgency, fear tactics, or 'limited slots' pressure?", "label_hi": "क्या आप पर 'तुरंत भेजें' या 'सीमित स्लॉट' का कोई अनुचित दबाव नहीं है?"},
        {"id": "no_credentials", "label_en": "Has the sender NOT asked for OTP, PIN, password, or remote screen access?", "label_hi": "क्या सामने वाले ने ओटीपी, पिन, पासवर्ड या ऐप डाउनलोड करने को नहीं कहा?"},
        {"id": "standard_channel", "label_en": "Is the payment being handled through standard official banking channels?", "label_hi": "क्या भुगतान किसी व्यक्तिगत यूपीआई/वॉलेट के बजाय आधिकारिक बैंक चैनल से हो रहा है?"}
    ]

    return {
        "original_length": len(raw_text),
        "scrubbed_input": scrubbed_text,
        "pii_report": pii_report,
        "channel": channel,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "risk_level_hi": risk_level_hi,
        "risk_badge_color": risk_badge_color,
        "risk_summary_en": risk_summary_en,
        "risk_summary_hi": risk_summary_hi,
        "signals_count": len(matched_signals),
        "why_we_flagged_en": why_we_flagged_en,
        "why_we_flagged_hi": why_we_flagged_hi,
        "explanation_points_en": explanation_points_en,
        "explanation_points_hi": explanation_points_hi,
        "url_analyses": url_analyses,
        "do_not_en": do_not_list_en,
        "do_not_hi": do_not_list_hi,
        "do_en": do_list_en,
        "do_hi": do_list_hi,
        "verification_checklist": verification_checklist,
        "official_helplines": [
            {"name": "National Cyber Crime Helpline", "contact": "1930", "link": "https://cybercrime.gov.in"},
            {"name": "SEBI SCORES (Investor Grievance)", "contact": "1800 266 7575", "link": "https://scores.sebi.gov.in"},
            {"name": "RBI Sachet (Unregistered Entities)", "contact": "sachet.rbi.org.in", "link": "https://sachet.rbi.org.in"}
        ],
        "ai_disclaimer_en": "AI Risk Indicator is an assistive safety tool and informational aid, not legal proof or financial advice. Verify important financial matters through trusted official sources.",
        "ai_disclaimer_hi": "एआई जोखिम संकेतक एक सुरक्षा सहायता उपकरण है, कोई कानूनी प्रमाण या वित्तीय सलाह नहीं। महत्वपूर्ण वित्तीय मामलों की आधिकारिक स्रोतों से पुष्टि करें।"
    }
