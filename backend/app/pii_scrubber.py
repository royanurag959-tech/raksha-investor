import re
from typing import Dict, Any, Tuple

# Patterns for sensitive financial credentials
OTP_PATTERN = re.compile(r'\b(?:otp|one[- ]?time[- ]?password|verification code|code)\s*(?:is|was|:|-|\s)?\s*([0-9]{4,8})\b', re.IGNORECASE)
PIN_PATTERN = re.compile(r'\b(?:upi\s*pin|atm\s*pin|security\s*pin|pin)\s*(?:is|was|:|-|\s)?\s*([0-9]{4,6})\b', re.IGNORECASE)
PASSWORD_PATTERN = re.compile(r'\b(?:password|passcode|netbanking pwd|pwd)\s*(?:is|was|:|-|\s)?\s*([^\s]{6,25})\b', re.IGNORECASE)
CARD_PATTERN = re.compile(r'\b(?:\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4})\b')
CVV_PATTERN = re.compile(r'\b(?:cvv|cvc|security code)\s*(?:is|was|:|-|\s)?\s*([0-9]{3,4})\b', re.IGNORECASE)
AADHAAR_PATTERN = re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b')

def scrub_sensitive_pii(text: str) -> Tuple[str, bool, Dict[str, Any]]:
    """
    Scrubs sensitive PII like OTP, PIN, Passwords, Card numbers from user input.
    Returns:
        scrubbed_text (str): Cleaned text safe to process
        has_pii (bool): True if sensitive credentials were found and masked
        pii_report (dict): Summary of redacted items with bilingual warnings
    """
    if not text:
        return text, False, {}

    scrubbed = text
    detected_types = []

    # Check and scrub Card Numbers
    if CARD_PATTERN.search(scrubbed):
        scrubbed = CARD_PATTERN.sub('[REDACTED CARD NUMBER]', scrubbed)
        detected_types.append("Debit/Credit Card Number")

    # Check and scrub CVV
    if CVV_PATTERN.search(scrubbed):
        scrubbed = CVV_PATTERN.sub(lambda m: re.sub(r'[0-9]{3,4}', '[REDACTED CVV]', m.group(0)), scrubbed)
        detected_types.append("Card CVV")

    # Check and scrub OTP
    if OTP_PATTERN.search(scrubbed):
        scrubbed = OTP_PATTERN.sub(lambda m: re.sub(r'[0-9]{4,8}', '[REDACTED OTP]', m.group(0)), scrubbed)
        detected_types.append("One-Time Password (OTP)")

    # Check and scrub PIN
    if PIN_PATTERN.search(scrubbed):
        scrubbed = PIN_PATTERN.sub(lambda m: re.sub(r'[0-9]{4,6}', '[REDACTED PIN]', m.group(0)), scrubbed)
        detected_types.append("UPI / ATM PIN")

    # Check and scrub Password
    if PASSWORD_PATTERN.search(scrubbed):
        scrubbed = PASSWORD_PATTERN.sub(lambda m: re.sub(r'[^\s]{6,25}', '[REDACTED PASSWORD]', m.group(0), count=1), scrubbed)
        detected_types.append("Account Password")

    # Check and scrub Aadhaar
    if AADHAAR_PATTERN.search(scrubbed):
        scrubbed = AADHAAR_PATTERN.sub('[REDACTED AADHAAR NUMBER]', scrubbed)
        detected_types.append("Aadhaar Number")

    has_pii = len(detected_types) > 0

    pii_report = {
        "detected": has_pii,
        "detected_items": detected_types,
        "warning_en": "⚠️ PRIVACY ALERT: We detected and automatically redacted sensitive financial credentials (such as OTP, PIN, Card number or Password). NEVER share your OTPs, passwords, or PINs with anyone, not even verification tools!",
        "warning_hi": "⚠️ गोपनीयता चेतावनी: हमने आपकी जानकारी में संवेदनशील वित्तीय क्रेडेंशियल (जैसे ओटीपी, पिन, कार्ड नंबर या पासवर्ड) पाए और उन्हें स्वतः हटा दिया। कभी भी किसी के साथ अपना ओटीपी, पासवर्ड या पिन साझा न करें!"
    } if has_pii else {
        "detected": False,
        "detected_items": [],
        "warning_en": "",
        "warning_hi": ""
    }

    return scrubbed, has_pii, pii_report
