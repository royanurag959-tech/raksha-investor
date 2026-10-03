"""
Raksha Investor - Production & Standalone Launcher
Supports local development and cloud platforms like Render, Railway, etc.
Automatically binds to PORT environment variable and 0.0.0.0 in cloud environments.
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
    # Render and cloud platforms supply PORT dynamically
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    is_dev = os.environ.get("ENV", "production").lower() == "development"

    print("=" * 60)
    print("[*] RAKSHA INVESTOR -- Check Before You Trust")
    print("[*] SANGYAN Hackathon - Track A: Digital Fraud & Scam Resilience")
    print("=" * 60)
    print(f"[*] Starting server on {host}:{port}")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app", 
        host=host, 
        port=port, 
        reload=is_dev, 
        app_dir=str(backend_dir)
    )
