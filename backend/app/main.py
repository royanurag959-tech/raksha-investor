import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from .analyzer import analyze_message_text
from .claim_checker import analyze_investment_claim
from .url_checker import analyze_url
from .scenarios import DEMO_SCENARIOS

app = FastAPI(
    title="Raksha Investor API",
    description="Digital Fraud & Scam Resilience Assistant for Indian Investors",
    version="1.0.0"
)

# Enable CORS for local dev and frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="The message content to analyze")
    channel: Optional[str] = Field("WhatsApp / SMS / Telegram", description="Origin channel of the message")

class ClaimAnalysisRequest(BaseModel):
    claim: str = Field(..., min_length=1, max_length=5000, description="The investment claim statement to verify")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="The URL to check")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Raksha Investor API",
        "tagline": "Check Before You Trust",
        "version": "1.0.0"
    }

@app.post("/api/analyze/message")
def analyze_message(payload: MessageAnalysisRequest):
    try:
        result = analyze_message_text(payload.text, payload.channel or "Unknown")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/claim")
def analyze_claim(payload: ClaimAnalysisRequest):
    try:
        result = analyze_investment_claim(payload.claim)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claim analysis failed: {str(e)}")

@app.post("/api/analyze/url")
def analyze_link(payload: UrlAnalysisRequest):
    try:
        result = analyze_url(payload.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL analysis failed: {str(e)}")

@app.get("/api/scenarios")
def get_scenarios():
    return {
        "count": len(DEMO_SCENARIOS),
        "scenarios": DEMO_SCENARIOS
    }

@app.get("/api/checklist")
def get_checklist():
    return {
        "checklist": [
            {
                "id": "1",
                "question_en": "Is the organization or advisor verified with official regulators (SEBI / RBI / IRDAI)?",
                "question_hi": "क्या संस्था या सलाहकार सेबी (SEBI) या आरबीआई में विधिवत पंजीकृत है?",
                "tip_en": "Check directly on scores.sebi.gov.in or rbi.org.in. Never rely on certificates shared on WhatsApp.",
                "tip_hi": "सीधे scores.sebi.gov.in पर चेक करें। व्हाट्सएप पर भेजे गए फर्जी सर्टिफिकेट पर भरोसा न करें।"
            },
            {
                "id": "2",
                "question_en": "Does the domain address end with the official corporate extension, without typos (.xyz, .top, hyphens)?",
                "question_hi": "क्या वेबसाइट आधिकारिक डोमेन पर है और कोई फर्जी स्पेलिंग या .xyz, .top नहीं है?",
                "tip_en": "Always type the web address manually or open the official verified app.",
                "tip_hi": "हमेशा वेबसाइट का पता स्वयं टाइप करें या बैंक का आधिकारिक ऐप खोलें।"
            },
            {
                "id": "3",
                "question_en": "Are you being promised guaranteed returns or doubling your money in weeks?",
                "question_hi": "क्या आपको बिना रिस्क के गारंटीड मुनाफे या कुछ दिनों में पैसा दोगुना करने का लालच दिया जा रहा है?",
                "tip_en": "Fixed deposits yield 6–8% annually. Anything promising 20–50% guaranteed is virtually always a fraud.",
                "tip_hi": "एफडी से सालाना 6-8% ही मिलता है। 20-50% गारंटीड का दावा लगभग हमेशा धोखा होता है।"
            },
            {
                "id": "4",
                "question_en": "Are you being pressured to invest immediately due to 'limited slots' or 'today only'?",
                "question_hi": "क्या 'सीमित सीटें' या 'आज ही ऑफर' कहकर आप पर तुरंत पैसे भेजने का दबाव बनाया जा रहा है?",
                "tip_en": "High pressure is used to bypass critical thinking. Take 24 hours to pause and consult family.",
                "tip_hi": "जल्दबाजी की चालें सोचने का मौका न देने के लिए होती हैं। 24 घंटे रुकें और परिवार से चर्चा करें।"
            },
            {
                "id": "5",
                "question_en": "Have you been asked for OTP, UPI PIN, ATM PIN, or to install an APK or AnyDesk app?",
                "question_hi": "क्या आपसे ओटीपी, यूपीआई पिन मांगा गया है या कोई ऐप/एपीके डाउनलोड करने को कहा गया है?",
                "tip_en": "Entering a UPI PIN debits money from your account. An OTP is never needed to receive money.",
                "tip_hi": "यूपीआई पिन डालने से आपके खाते से पैसे कटते हैं। पैसे प्राप्त करने के लिए कभी पिन या ओटीपी की आवश्यकता नहीं होती।"
            },
            {
                "id": "6",
                "question_en": "Are you being asked to pay an advance fee, tax, or deposit to release or withdraw profits?",
                "question_hi": "क्या मुनाफा निकालने के लिए कोई अग्रिम शुल्क, प्रोसेसिंग फीस या टैक्स मांगा जा रहा है?",
                "tip_en": "Never pay extra money to withdraw your own capital or profits.",
                "tip_hi": "अपने ही पैसे या लाभ को निकालने के लिए कभी भी नया भुगतान न करें।"
            }
        ]
    }

def get_dist_dir() -> Optional[Path]:
    candidates = [
        Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
        Path(__file__).resolve().parent.parent / "frontend" / "dist",
        Path.cwd() / "frontend" / "dist",
        Path("/opt/render/project/src/frontend/dist"),
        Path.cwd() / "dist",
    ]
    for p in candidates:
        if p.exists() and (p / "index.html").exists():
            return p
    return None

# Attempt static mount
current_dist = get_dist_dir()
if current_dist and (current_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(current_dist / "assets")), name="assets")

@app.get("/")
def serve_root():
    dist = get_dist_dir()
    if dist and (dist / "index.html").exists():
        return FileResponse(dist / "index.html")
    return HTMLResponse("<h2>Raksha Investor API is Online. Loading frontend...</h2><p>Visit <a href='/api/health'>/api/health</a> or <a href='/docs'>/docs</a></p>")

@app.get("/{full_path:path}")
def serve_frontend_catchall(full_path: str):
    if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
        raise HTTPException(status_code=404, detail="API route not found")
    dist = get_dist_dir()
    if dist:
        file_path = dist / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist / "index.html")
    raise HTTPException(status_code=404, detail="Frontend assets not yet compiled")
