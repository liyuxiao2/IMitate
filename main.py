#!/usr/bin/env python3
"""
Main entry point for the FastAPI application.
This file helps Railway detect this as a Python project.
"""

import sys
import os
import uvicorn

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Import the FastAPI app
from api.main import app

if __name__ == "__main__":
    # Get port from environment variable (Railway sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the FastAPI app
    uvicorn.run(
        "src.api.main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    ) 