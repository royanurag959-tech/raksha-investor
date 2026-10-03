import re
from typing import Dict, Any, List

def analyze_investment_claim(claim_text: str) -> Dict[str, Any]:
    """
    Analyzes specific financial claims (e.g. return rates, fees, regulatory approvals).
    Distinguishes verified, unverified, and suspicious claims with clear plain-language rationale.
    """
    text_lower = claim_text.lower()
    red_flags_en = []
    red_flags_hi = []
    category = "UNVERIFIED"
    risk_score = 20

    # 1. Unrealistic Guaranteed Returns
    guarantee_words = ["guaranteed", "pakka", "100% sure", "fixed return", "assured return", "risk free", "zero risk", "बिना रिस्क", "गारंटीड", "निश्चित"]
    has_guarantee = any(w in text_lower for w in guarantee_words)

    # Detect percentages
    percent_match = re.search(r'(\d+(?:\.\d+)?)\s*%', claim_text)
    returns_pct = float(percent_match.group(1)) if percent_match else None

    # Detect quick doubling
    doubling_match = re.search(r'(?:double|2x|3x|triple|दो गुना|तीन गुना)\s*(?:money|funds|capital|returns|पैसा)?\s*(?:in|within)?\s*(\d+)?\s*(?:days|hours|weeks|months|दिन|घंटे)?', text_lower)

    if has_guarantee and returns_pct and returns_pct > 15:
        red_flags_en.append(f"Guaranteed {returns_pct}% return promise: Regulated markets (equity/mutual funds) cannot legally guarantee returns, and fixed deposits typically yield 6–8% annually.")
        red_flags_hi.append(f"गारंटीड {returns_pct}% रिटर्न का दावा: कोई भी नियमबद्ध बाजार (शेयर या म्यूचुअल फंड) कानूनी रूप से निश्चित लाभ की गारंटी नहीं दे सकता। एफडी का ब्याज भी सालाना केवल 6-8% होता है।")
        risk_score += 45

    elif has_guarantee:
        red_flags_en.append("Promises 'guaranteed' or 'risk-free' returns. All legitimate investments carry market or credit risk.")
        red_flags_hi.append("'गारंटीड' या 'बिना रिस्क' का वादा। सभी वैध वित्तीय निवेशों में बाजार का जोखिम होता है।")
        risk_score += 35

    if doubling_match:
        red_flags_en.append("Claims rapid multiplication (doubling/tripling) of funds in a short period. This is an archetypal Ponzi/pyramid scheme signal.")
        red_flags_hi.append("कम समय में पैसा दोगुना या तिगुना करने का दावा। यह फर्जी पोंजी या पिरामिड स्कीम का क्लासिक संकेत है।")
        risk_score += 40

    # 2. Advance Fee for Withdrawal
    withdrawal_fee_words = ["withdraw", "release fee", "processing fee", "security deposit", "unlock balance", "tax payment", "निकालने के लिए", "चार्ज", "विड्रॉल"]
    has_withdrawal = any(w in text_lower for w in withdrawal_fee_words)
    has_fee_demand = any(w in text_lower for w in ["pay", "deposit", "transfer", "fees", "fee", "₹", "rs", "रुपये"])

    if has_withdrawal and has_fee_demand:
        red_flags_en.append("Requires paying an advance fee or tax to withdraw your own investment or profits. Legitimate financial institutions deduct fees from balances or prior to payout, never asking for fresh upfront payment to unlock funds.")
        red_flags_hi.append("अपने ही पैसे या लाभ को निकालने के लिए अतिरिक्त अग्रिम शुल्क (विड्रॉल फीस/टैक्स) की मांग। वैध संस्थान कभी भी पैसे निकालने के लिए नया भुगतान नहीं मांगते।")
        risk_score += 50

    # 3. Misleading Government / Regulatory Endorsement
    fake_approval_words = [
        "government approved", "govt approved", "sebi approved profit", "sebi guaranteed", 
        "rbi certified", "rbi approved return", "pm scheme guaranteed", "सरकारी योजना गारंटी"
    ]
    if any(w in text_lower for w in fake_approval_words):
        red_flags_en.append("Claims 'Government/SEBI/RBI approval' for guaranteed returns. Regulators like SEBI and RBI regulate market entities; they NEVER endorse or guarantee private investment returns.")
        red_flags_hi.append("सरकारी या SEBI/RBI द्वारा 'गारंटीड मुनाफे' की मंजूरी का दावा। सेबी या आरबीआई कभी किसी निजी निवेश के मुनाफे की गारंटी या सिफारिश नहीं करते।")
        risk_score += 45

    # 4. Task-based or Social Media Trading Tips
    task_scam_words = ["like video", "telegram vip", "telegram channel", "jackpot call", "daily task", "part time job", "youtube like"]
    if any(w in text_lower for w in task_scam_words):
        red_flags_en.append("Mentions social-media task completion or unregistered Telegram VIP trading groups. These frequently lead to deposit traps.")
        red_flags_hi.append("सोशल मीडिया टास्क (यूट्यूब लाइक) या अनरजिस्टर्ड टेलीग्राम वीआईपी ग्रुप का उल्लेख। ये आगे चलकर बड़े नुकसान का कारण बनते हैं।")
        risk_score += 35

    # 5. Normal Regulatory Disclaimers or standard products
    normal_phrases = ["mutual fund investments are subject to market risks", "read all scheme related documents carefully", "sip", "nav", "portfolio", "nifty", "sensex"]
    if any(w in text_lower for w in normal_phrases) and not has_guarantee and not doubling_match:
        risk_score = 10
        category = "STANDARD_MARKET_DISCLOSURE"
        red_flags_en = ["Contains standard statutory regulatory disclosures required by SEBI."]
        red_flags_hi = ["इसमें सेबी द्वारा अनिवार्य मानक विनियामक जोखिम प्रकटीकरण (डिस्क्लेमर) शामिल है।"]

    risk_score = min(max(risk_score, 5), 98)

    if risk_score >= 70:
        category = "HIGH_RISK_SUSPICIOUS"
        status_label_en = "SUSPICIOUS CLAIM"
        status_label_hi = "संदिग्ध दावा"
        what_it_means_en = "This claim uses patterns strongly associated with financial traps: unrealistic promises, advance fee requirements, or misleading regulatory claims."
        what_it_means_hi = "यह दावा वित्तीय धोखाधड़ी से जुड़े गंभीर पैटर्न दर्शाता है: अवास्तविक वादे, पैसे निकालने हेतु अग्रिम शुल्क, या फर्जी विनियामक मंजूरी।"
    elif risk_score >= 40:
        category = "UNVERIFIED_REQUIRES_CAUTION"
        status_label_en = "UNVERIFIED — PROCEED WITH CAUTION"
        status_label_hi = "अपुष्ट — सावधानी बरतें"
        what_it_means_en = "This claim cannot be verified independently and displays promotional exaggeration. Do not commit funds without official registered documentation."
        what_it_means_hi = "इस दावे की स्वतंत्र पुष्टि नहीं की जा सकती। आधिकारिक पंजीकृत दस्तावेजों के बिना कभी भी धनराशि न लगाएं।"
    elif category == "STANDARD_MARKET_DISCLOSURE":
        status_label_en = "STANDARD REGULATED LANGUAGE"
        status_label_hi = "मानक विनियामक सूचना"
        what_it_means_en = "The claim aligns with typical transparent market terminology and statutory disclaimers."
        what_it_means_hi = "यह संदेश सामान्य बाजार शब्दावली और कानूनी डिस्क्लेमर के अनुरूप प्रतीत होता है।"
    else:
        status_label_en = "LOW RISK / GENERAL INQUIRY"
        status_label_hi = "कम जोखिम / सामान्य जानकारी"
        what_it_means_en = "No immediate predatory scam markers detected. Still verify any specific investment opportunity on the official SEBI or RBI registry."
        what_it_means_hi = "कोई प्रत्यक्ष शिकारी संकेत नहीं मिला। फिर भी आधिकारिक सेबी या आरबीआई पोर्टल पर कंपनी की जांच अवश्य करें।"

    return {
        "claim": claim_text,
        "risk_score": risk_score,
        "category": category,
        "status_label_en": status_label_en,
        "status_label_hi": status_label_hi,
        "red_flags_en": red_flags_en if red_flags_en else ["No obvious predatory triggers detected in this statement"],
        "red_flags_hi": red_flags_hi if red_flags_hi else ["इस कथन में कोई स्पष्ट शिकारी या भ्रामक संकेत नहीं मिला"],
        "what_it_means_en": what_it_means_en,
        "what_it_means_hi": what_it_means_hi,
        "safe_guidance_en": [
            "Check SEBI Intermediary Registry (sebi.gov.in) before acting on advisory tips.",
            "Remember: Rule of 72. To double money in 15 days requires an impossible >1700% annual return.",
            "Never pay money to withdraw your own investment.",
            "No legitimate fund guarantees returns without risk."
        ],
        "safe_guidance_hi": [
            "किसी भी सलाह पर अमल करने से पहले SEBI की वेबसाइट पर एडवाइजर का रजिस्ट्रेशन नंबर चेक करें।",
            "याद रखें: 15 दिन में पैसा दोगुना करने के लिए अवास्तविक 1700% से अधिक रिटर्न चाहिए जो असंभव है।",
            "अपने ही पैसे निकालने के लिए कभी भी अग्रिम शुल्क न भरें।",
            "कोई भी वैध निवेश बिना जोखिम के निश्चित लाभ की गारंटी नहीं देता।"
        ]
    }
