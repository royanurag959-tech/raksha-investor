import re
from urllib.parse import urlparse
from typing import Dict, Any, List

# Legitimate official domains of popular Indian financial institutions
KNOWN_LEGITIMATE_DOMAINS = {
    "sbi.co.in": "State Bank of India",
    "onlinesbi.sbi": "State Bank of India Online",
    "hdfcbank.com": "HDFC Bank",
    "icicibank.com": "ICICI Bank",
    "axisbank.com": "Axis Bank",
    "pnbindia.in": "Punjab National Bank",
    "bankofbaroda.in": "Bank of Baroda",
    "zerodha.com": "Zerodha Broking",
    "groww.in": "Groww Invest Tech",
    "angelone.in": "Angel One",
    "upstox.com": "Upstox (RKSV)",
    "nseindia.com": "National Stock Exchange (NSE)",
    "bseindia.com": "Bombay Stock Exchange (BSE)",
    "sebi.gov.in": "Securities and Exchange Board of India",
    "rbi.org.in": "Reserve Bank of India",
    "incometax.gov.in": "Income Tax Department",
    "epfindia.gov.in": "Employees' Provident Fund Organisation",
    "indiapost.gov.in": "India Post",
    "uidai.gov.in": "UIDAI Aadhaar",
    "npci.org.in": "National Payments Corporation of India"
}

# Suspicious TLDs frequently abused in scam campaigns
HIGH_RISK_TLDS = {
    "top", "xyz", "vip", "club", "work", "icu", "buzz", "rest", "cam", "kim",
    "gq", "cf", "tk", "ml", "ga", "click", "link", "site", "online", "bid", "loan", "party"
}

# Known brand keywords targeted for typosquatting / phishing
BRAND_KEYWORDS = [
    "sbi", "onlinesbi", "yono", "hdfc", "icici", "axis", "pnb", "zerodha", 
    "groww", "angelone", "upstox", "sebi", "rbi", "incometax", "aadhaar", "epfo", "paytm"
]

def analyze_url(raw_url: str) -> Dict[str, Any]:
    """
    Performs safety analysis on a suspicious URL based on structural and heuristic checks.
    Never asserts 100% safety solely due to HTTPS.
    """
    cleaned_url = raw_url.strip()
    if not cleaned_url.startswith(("http://", "https://")):
        cleaned_url = "https://" + cleaned_url

    parsed = urlparse(cleaned_url)
    hostname = (parsed.hostname or "").lower()
    path = parsed.path.lower()
    query = parsed.query.lower()
    scheme = parsed.scheme.lower()

    flags_en = []
    flags_hi = []
    risk_level = "LOW"
    risk_score = 15

    # 1. Check IP address as host
    is_ip = bool(re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname))
    if is_ip:
        flags_en.append("Uses raw IP address instead of a registered domain name (common in malicious servers)")
        flags_hi.append("पंजीकृत डोमेन नाम के स्थान पर सीधे आईपी पते (IP address) का उपयोग किया गया है (अक्सर धोखाधड़ी में उपयोग)")
        risk_score += 45
        risk_level = "HIGH"

    # 2. Check HTTP vs HTTPS
    if scheme == "http":
        flags_en.append("Insecure connection (HTTP): Data transmitted is unencrypted and vulnerable to interception")
        flags_hi.append("असुरक्षित कनेक्शन (HTTP): भेजा गया डेटा एन्क्रिप्टेड नहीं है और कोई भी देख सकता है")
        risk_score += 25
        if risk_level != "HIGH":
            risk_level = "MEDIUM"

    # 3. Check for APK or executable downloads
    if any(ext in path for ext in [".apk", ".exe", ".bat", ".scr", ".msi", ".vbs"]):
        flags_en.append("Prompts direct download of an application/APK file outside official app stores (Google Play/Apple App Store)")
        flags_hi.append("आधिकारिक ऐप स्टोर के बाहर सीधे ऐप/एपीके (.apk) फ़ाइल डाउनलोड करने का प्रयास करता है")
        risk_score += 50
        risk_level = "HIGH"

    # 4. Check for URL shorteners / Obfuscation
    shorteners = ["bit.ly", "tinyurl.com", "t.me", "is.gd", "cutt.ly", "rb.gy", "shorturl.at"]
    if any(sh in hostname for sh in shorteners):
        flags_en.append("Uses a URL shortener to hide the real destination website")
        flags_hi.append("असली वेबसाइट को छिपाने के लिए लिंक शॉर्टनर का इस्तेमाल किया गया है")
        risk_score += 30
        if risk_level == "LOW":
            risk_level = "MEDIUM"

    # 5. Check TLD risk
    parts = hostname.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    if tld in HIGH_RISK_TLDS:
        flags_en.append(f"Uses a high-risk domain extension (.{tld}) commonly used by temporary scam operations")
        flags_hi.append(f"उच्च जोखिम वाले डोमेन एक्सटेंशन (.{tld}) का उपयोग किया गया है जो अक्सर फर्जी साइटों में पाया जाता है")
        risk_score += 30
        if risk_level == "LOW":
            risk_level = "MEDIUM"

    # 6. Typosquatting / Brand impersonation check
    matched_brand = None
    for brand in BRAND_KEYWORDS:
        if brand in hostname:
            matched_brand = brand
            break

    is_verified_official = False
    for legit_domain, org_name in KNOWN_LEGITIMATE_DOMAINS.items():
        if hostname == legit_domain or hostname.endswith("." + legit_domain):
            is_verified_official = True
            break

    if matched_brand and not is_verified_official:
        flags_en.append(f"Potential brand impersonation: Domain name references '{matched_brand}' but is NOT on an official domain")
        flags_hi.append(f"संभावित ब्रांड धोखाधड़ी: डोमेन में '{matched_brand}' लिखा है लेकिन यह आधिकारिक डोमेन नहीं है")
        risk_score += 55
        risk_level = "HIGH"

    # 7. Check for multiple hyphens or excessive subdomains
    if hostname.count("-") >= 2 or len(parts) >= 4:
        flags_en.append("Deceptive subdomain or excessive hyphens detected (attempt to mimic genuine banking URLs)")
        flags_hi.append("भ्रामक सब-डोमेन या अतिरिक्त हाइफ़न (-) मिले हैं (अक्सर असली बैंक के लिंक की नकल करने हेतु)")
        risk_score += 20
        if risk_level == "LOW":
            risk_level = "MEDIUM"

    # 8. Check for sensitive keywords in URL path
    sensitive_path_keywords = ["kyc", "login", "update", "refund", "claim", "verify", "bonus", "reward", "lottery", "gift"]
    found_path_keywords = [kw for kw in sensitive_path_keywords if kw in path or kw in query]
    if found_path_keywords and not is_verified_official:
        flags_en.append(f"URL path includes suspicious action triggers: {', '.join(found_path_keywords)}")
        flags_hi.append(f"यूआरएल में संदिग्ध कार्रवाई वाले शब्द शामिल हैं: {', '.join(found_path_keywords)}")
        risk_score += 15

    # Determine final risk assessment
    risk_score = min(max(risk_score, 0), 100)

    if is_verified_official and risk_score < 40:
        risk_level = "LOW"
        explanation_en = f"This domain appears to match the officially known domain for {KNOWN_LEGITIMATE_DOMAINS.get(hostname, 'the organization')}. However, always ensure you opened it yourself and did not follow an unsolicited forwarded message."
        explanation_hi = f"यह डोमेन {KNOWN_LEGITIMATE_DOMAINS.get(hostname, 'संबंधित संस्था')} के आधिकारिक डोमेन से मेल खाता प्रतीत होता है। फिर भी हमेशा ध्यान रखें कि आपने इसे स्वयं खोला हो।"
        verification_status = "VERIFIED_OFFICIAL_PATTERN"
    elif risk_level == "HIGH":
        explanation_en = "High likelihood of phishing or malicious intent. The URL exhibits deceptive structural patterns, impersonation, or unverified download triggers."
        explanation_hi = "फ़िशिंग या धोखाधड़ी की अत्यधिक संभावना है। यह लिंक किसी प्रतिष्ठित संस्था की नकल या असुरक्षित डाउनलोड की कोशिश कर रहा है।"
        verification_status = "SUSPICIOUS_UNVERIFIED"
    elif risk_level == "MEDIUM":
        explanation_en = "Unable to independently verify this website. The URL contains patterns requiring caution (such as link shorteners or unverified extensions). Treat it cautiously and verify through the organization's official channel."
        explanation_hi = "इस वेबसाइट की स्वतंत्र रूप से पुष्टि नहीं हो सकी है। इसमें लिंक शॉर्टनर या संदिग्ध एक्सटेंशन जैसे संकेत हैं। हमेशा संगठन के आधिकारिक चैनल के माध्यम से पुष्टि करें।"
        verification_status = "UNKNOWN_REQUIRES_VERIFICATION"
    else:
        explanation_en = "No immediate structural red flags detected on the URL format itself. Note: Having HTTPS or a clean domain does NOT guarantee the business or investment offer is genuine. Independent verification required."
        explanation_hi = "यूआरएल के प्रारूप में कोई सीधा खतरा नहीं दिखा। ध्यान दें: केवल HTTPS होना निवेश के सुरक्षित होने का प्रमाण नहीं है। हमेशा स्वतंत्र जांच करें।"
        verification_status = "UNKNOWN_REQUIRES_VERIFICATION"

    return {
        "url": raw_url,
        "hostname": hostname,
        "scheme": scheme,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "is_verified_official": is_verified_official,
        "verification_status": verification_status,
        "flags_en": flags_en if flags_en else ["No immediate suspicious URL syntax found"],
        "flags_hi": flags_hi if flags_hi else ["यूआरएल संरचना में कोई प्रत्यक्ष संदिग्ध पैटर्न नहीं मिला"],
        "explanation_en": explanation_en,
        "explanation_hi": explanation_hi,
        "safe_guidance_en": [
            "Do NOT enter netbanking credentials, OTP, or UPI PIN on this page.",
            "Do NOT download any .apk file sent via messaging apps.",
            "Type the official bank/institution website address manually in your browser address bar.",
            "If in doubt, contact customer support via the number listed on your physical bank card or statement."
        ],
        "safe_guidance_hi": [
            "इस पृष्ठ पर कभी भी नेटबैंकिंग क्रेडेंशियल, ओटीपी या यूपीआई पिन दर्ज न करें।",
            "व्हाट्सएप या टेलीग्राम पर भेजी गई किसी भी .apk फ़ाइल को डाउनलोड न करें।",
            "हमेशा अपने ब्राउज़र में बैंक या कंपनी की आधिकारिक वेबसाइट का पता स्वयं टाइप करें।",
            "संदेह होने पर अपने बैंक कार्ड पर लिखे आधिकारिक कस्टमर केयर नंबर पर ही कॉल करें।"
        ]
    }
