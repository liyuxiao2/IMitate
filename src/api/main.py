from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
from .data.database import get_random_patient
from .supabase.supabase_client import supabase
import traceback

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

class EvaluationRequest(BaseModel):
    patientData: PatientData
    chatHistory: str
    submittedDiagnosis: str
    submittedAftercare: str
    
class ScorePayload(BaseModel):
    score: int


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


@app.get("/patients/random")
async def get_random_patient_endpoint():
    """Get a single random patient from the database"""
    patient = get_random_patient()
    if patient:
        return {"patient": patient}
    return {"error": "No patients found in database"}


@app.post("/evaluate")
async def evaluate_performance(request: EvaluationRequest):
    """
    Evaluates student performance based on patient data, chat history,
    and a defined rubric.
    """
    evaluation_rubric = """
    Scoring System (Total 50 pts):
    - Correct Diagnosis: 25 pts (Is the submitted diagnosis correct?)
    - OLDCARTS Mnemonic: 12 pts (1.5 pts for each component: Onset, Location, Duration, Character, Aggravating/Alleviating factors, Radiation, Temporal pattern, Severity)
    - Differential Diagnoses: 5 pts (Did the student consider other plausible diagnoses?)
    - Associated Symptom Questions: 5 pts (Did they ask about relevant positive/negative symptoms?)
    - History Gathering: 4 pts (Did they ask about relevant medical, family, or social history?)
    - Logical, Focused Reasoning: 2 pts (Was the questioning logical and not random?)
    - Timing Bonus: 2 pts (Deduct 0.5 pts per minute over 5 minutes, max deduction at 9 minutes)
    """

    prompt = f"""
    You are an expert medical education evaluator. Your task is to analyze a simulated patient encounter and score the medical student's performance based on the provided data and a strict rubric.

    **1. Full Patient Case:**
    ```json
    {request.patientData.model_dump_json(indent=2)}
    ```

    **2. Student's Submitted Diagnosis:**
    - Diagnosis: {request.submittedDiagnosis}
    - Aftercare Plan: {request.submittedAftercare}

    **3. Full Chat Transcript:**
    ```
    {request.chatHistory}
    ```

    **4. Evaluation Rubric:**
    {evaluation_rubric}

    **Instructions:**
    Please evaluate the student's performance by analyzing the chat transcript. Provide a score for each category in the rubric and brief, constructive feedback explaining your reasoning for the score. Your response should be in a structured format.
    """

    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(gemini_url, json=body, headers=headers)
        data = response.json()

    try:
        evaluation_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"evaluation": evaluation_text}
    except (KeyError, IndexError) as e:
        print(f"⚠️ Failed to parse Gemini evaluation response: {e}")
        return {"error": "Failed to get a valid evaluation from the AI."}


@app.get("/getProfile")
async def get_user(request: Request):
    auth_header = request.headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.replace("Bearer ", "")
    user_response = supabase.auth.get_user(token)

    if user_response.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user_response.user


@app.post("/addScore")
async def add_score(payload: ScorePayload, request: Request):
    try:
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

        token = auth_header.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)

        if user_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = user_response.user.id
        print("Auth user_id:", user_id)

        user_data_response = supabase.table("users").select("total_score").eq("id", user_id).single().execute()
        user_data = user_data_response.data
        print("User data:", user_data)

        current_score = user_data.get("total_score", 0) or 0
        new_score = current_score + payload.score

        update_response = supabase.table("users").update({"total_score": new_score}).eq("id", user_id).execute()
        print("Update response:", update_response)

        return {"message": "Score updated", "new_score": new_score}
    
    except Exception as e:
        print("🔥 Exception occurred:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

