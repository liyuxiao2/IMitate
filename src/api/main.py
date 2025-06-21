from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
from .database import get_all_patients, get_patient_by_id, get_random_patient

load_dotenv()

app = FastAPI()

# # Initialize database on startup
# @app.on_event("startup")
# async def startup_event():
#     init_database()

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

class PatientData(BaseModel):
    id: str
    first_name: str
    last_name: str
    age: int
    sex: str
    pronouns: str
    primary_complaint: str
    personality: str
    symptoms: str
    medical_history: str
    correct_diagnosis: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    print(f"\\n--- Raw prompt received from frontend: ---\\n{request.prompt}\\n-----------------------------------------\\n")

    final_prompt_text = request.prompt
    
    # Check if this is a patient simulation chat
    if "\n\nUser:" in request.prompt and "Patient Details:" in request.prompt:
        try:
            patient_info_block, user_query = request.prompt.split("\n\nUser:", 1)
            user_query = user_query.strip()

            final_prompt_text = (
                "You are a patient simulator for a medical student. Your task is to act as the patient described below. "
                "Respond to the medical student's questions from the patient's perspective, in the first person. "
                "Talk as if you are the patient, do not use quotation marks, you may use *asterisks* to illustrate actions (eg. *clutches stomach*), if you do, put it on a new line."
                "Use the provided personality and symptoms to guide your answers. Do not break character or reveal that you are an AI model.\\n\\n"
                "--- PATIENT DETAILS ---\\n"
                f"{patient_info_block}\\n"
                "--- END DETAILS ---\\n\\n"
                f'Medical Student\'s Question: "{user_query}"\\n\\n'
                "Your response (as the patient):"
            )
        except ValueError:
            # If split fails, just fall back to the original prompt
            print(">>> PROMPT REFORMATTING FAILED: Separator not found. Using original prompt. <<<\n")
            pass

    print(f"\\n--- Final prompt sent to Gemini: ---\\n{final_prompt_text}\\n-----------------------------------\\n")

    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [{"text": final_prompt_text}]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(gemini_url, json=body, headers=headers)
        data = response.json()

    print("🔍 Gemini raw response:", data)

    reply = ""
    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print("⚠️ Failed to parse Gemini response:", e)

    return {"reply": reply or "Sorry, I couldn't generate a response."}

@app.get("/patients")
async def get_patients():
    """Get all patients from the database"""
    patients = get_all_patients()
    return {"patients": patients}

@app.get("/patients/random")
async def get_random_patient_endpoint():
    """Get a single random patient from the database"""
    patient = get_random_patient()
    if patient:
        return {"patient": patient}
    return {"error": "No patients found in database"}

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get a specific patient by ID"""
    patient = get_patient_by_id(patient_id)
    if patient:
        return {"patient": patient}
    return {"error": "Patient not found"}

