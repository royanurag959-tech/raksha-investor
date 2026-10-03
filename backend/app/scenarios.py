from typing import List, Dict, Any

DEMO_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario-1",
        "title_en": "Guaranteed-Return Investment Scam",
        "title_hi": "गारंटीड-रिटर्न निवेश घोटाला",
        "type": "message",
        "channel": "WhatsApp / Telegram",
        "text": "🔥 SANGYAN MEGA WEALTH OFFER 🔥\nInvest ₹10,000 today and receive GUARANTEED ₹30,000 in your bank within 7 days! 100% Risk Free & Government Approved Algorithm. Only 3 VIP slots left. Send money right now to UPI id: wealthpro@ybl or miss this life-changing chance!",
        "expected_risk": "HIGH RISK",
        "expected_score": 92,
        "description_en": "Promises 300% return in 7 days, creates artificial FOMO with limited slots, and asks for urgent direct UPI transfer.",
        "description_hi": "7 दिनों में 300% रिटर्न का वादा, 'केवल 3 स्लॉट बचे हैं' कहकर दबाव, और सीधे यूपीआई पर पैसे भेजने की मांग।"
    },
    {
        "id": "scenario-2",
        "title_en": "Fake Financial Institution Message",
        "title_hi": "फर्जी बैंक चेतावनी संदेश",
        "type": "message",
        "channel": "SMS",
        "text": "SBI Alert: Dear customer, your SBI YONO account and net banking access will be BLOCKED within 2 hours due to pending PAN KYC. Immediately update your details to prevent legal action: http://sbi-kyc-verify.xyz/login. Do not ignore!",
        "expected_risk": "HIGH RISK",
        "expected_score": 95,
        "description_en": "Impersonates SBI bank, threatens immediate account freeze, uses a fake phishing domain (.xyz), and pressures within 2 hours.",
        "description_hi": "एसबीआई बैंक के नाम से 2 घंटे में खाता बंद करने की धमकी, और फर्जी .xyz वेबसाइट पर लॉगिन करने का दबाव।"
    },
    {
        "id": "scenario-3",
        "title_en": "Withdrawal-Fee Crypto/Forex Scam",
        "title_hi": "विड्रॉल-शुल्क क्रिप्टो घोटाला",
        "type": "claim",
        "channel": "Website / Email",
        "text": "Congratulations! Your automated AI trading profits have reached ₹4,50,000. To release and withdraw your total balance to your bank account, please transfer a one-time mandatory 10% regulatory processing fee of ₹45,000 to our verification wallet.",
        "expected_risk": "HIGH RISK",
        "expected_score": 88,
        "description_en": "Common advance-fee fraud where scammers show fake dashboard profits and demand fresh upfront payments to release funds.",
        "description_hi": "अग्रिम शुल्क धोखा: स्क्रीन पर फर्जी 4.5 लाख का मुनाफा दिखाकर उसे निकालने के लिए ₹45,000 अतिरिक्त शुल्क मांगना।"
    },
    {
        "id": "scenario-4",
        "title_en": "Fake Investment Advisor / VIP Stock Tip",
        "title_hi": "फर्जी शेयर बाजार सलाहकार / टेलीग्राम टिप",
        "type": "message",
        "channel": "Telegram / Instagram",
        "text": "🚀 100% Sure-Shot Jackpot Option Call tomorrow! We provide 50% daily profit in BankNifty. SEBI certified research team. Join our VIP Insider Group for ₹2,999/month. Yesterday our members earned ₹1.5 Lakhs from a single trade. Limited members only!",
        "expected_risk": "SUSPICIOUS",
        "expected_score": 76,
        "description_en": "Unregistered social media tips promising sure-shot jackpot returns and exploiting fake SEBI accreditation.",
        "description_hi": "सोशल मीडिया पर बिना रजिस्ट्रेशन के '100% श्योर-शॉट' जैकपॉट कॉल और फर्जी सेबी सर्टिफिकेशन का झांसा।"
    },
    {
        "id": "scenario-5",
        "title_en": "Phishing / Income Tax Refund APK",
        "title_hi": "फर्जी इनकम टैक्स रिफंड व APK डाउनलोड",
        "type": "message",
        "channel": "SMS / WhatsApp",
        "text": "Govt of India - Income Tax Dept: An overdue refund of ₹24,850 has been approved for your account. Please download and install the official Refund Claim app from: https://incometax-refunds.top/claim.apk to verify your bank details.",
        "expected_risk": "HIGH RISK",
        "expected_score": 94,
        "description_en": "Lures user with government tax refund, but distributes a malicious Android APK file to hijack SMS and banking OTPs.",
        "description_hi": "इनकम टैक्स रिफंड का लालच देकर मोबाइल में खतरनाक .apk फ़ाइल डाउनलोड करवाना जिससे बैंक ओटीपी चोरी हो सके।"
    },
    {
        "id": "scenario-6",
        "title_en": "Normal Regulated Financial Communication",
        "title_hi": "सामान्य वैध वित्तीय विवरण (म्यूचुअल फंड)",
        "type": "message",
        "channel": "Official Email / SMS",
        "text": "Dear Investor, your monthly SIP of ₹2,000 in Nippon India Large Cap Fund - Growth has been successfully debited and processed on 03-Oct-2026. Allotted Units: 24.312 at NAV ₹82.26. Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
        "expected_risk": "LOW RISK / NO RED FLAGS",
        "expected_score": 12,
        "description_en": "Authentic transactional confirmation with NAV, units, no pressure, no credential requests, and standard SEBI risk disclosures.",
        "description_hi": "वास्तविक वित्तीय पुष्टिकरण जिसमें एनएवी, यूनिट्स, कोई दबाव नहीं, और सेबी द्वारा अनिवार्य कानूनी डिस्क्लेमर शामिल है।"
    }
]
