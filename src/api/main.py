from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [{"text": request.prompt}]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(gemini_url, json=body, headers=headers)
        data = response.json()

    # Extract response text
    reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    return {"reply": reply or "Sorry, I couldn't generate a response."}
