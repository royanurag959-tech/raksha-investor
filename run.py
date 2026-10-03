"""
Raksha Investor - Standalone Launcher
Starts the FastAPI application which serves both the AI resilience backend and the built React frontend.
Visit: http://localhost:8000
"""

import sys
import os
from pathlib import Path

# Set UTF-8 encoding for standard output on Windows
if sys.platform.startswith('win'):
    os.system('') # Enable ANSI colors
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("[*] RAKSHA INVESTOR -- Check Before You Trust")
    print("[*] SANGYAN Hackathon - Track A: Digital Fraud & Scam Resilience")
    print("=" * 60)
    print("[*] Starting server at: http://localhost:8000")
    print("[*] API Documentation:  http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True, app_dir=str(backend_dir))
