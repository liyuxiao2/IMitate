#!/usr/bin/env python3
"""
Runner for FastAPI application in Railway deployment.
"""

import os
import uvicorn
from main import app

if __name__ == "__main__":
    # Get port from environment variable (Railway sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the FastAPI app
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False
    ) 