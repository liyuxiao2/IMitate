import random
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
import traceback
from typing import List

# Load environment variables
load_dotenv()
from api.supabase_client import supabase, supabase_admin


app = FastAPI()


# Allow frontend (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- your exact front-end URL
    allow_credentials=True,
    allow_methods=["*"],  # or ["*"]
    allow_headers=["*"],  # or ["*"]
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


class ScoreUpdate(BaseModel):
    uid: str  # matches users.id (UUID)
    score: int  # amount to add


class ProfilePictureUpdate(BaseModel):
    profile_picture_url: str


class LeaderboardEntry(BaseModel):
    username: str
    total_score: int
    profile_picture_url: str


class AddMatchPayload(BaseModel):
    patient_info: dict  # use dict if you are directly passing a JSON object
    score: int
    submitted_diagnosis: str
    submitted_aftercare: str
    feedback: str


class HistoryRequest(BaseModel):
    user_id: str


class HistoryEntry(BaseModel):
    id: int
    user_id: str
    patient_info: dict
    score: int
    submitted_diagnosis: str
    submitted_aftercare: str
    feedback: str
    created_at: str


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    print(
        f"\\n--- Raw prompt received from frontend: ---\\n{request.prompt}\\n-----------------------------------------\\n"
    )

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
            print(
                ">>> PROMPT REFORMATTING FAILED: Separator not found. Using original prompt. <<<\n"
            )
            pass

    print(
        f"\\n--- Final prompt sent to Gemini: ---\\n{final_prompt_text}\\n-----------------------------------\\n"
    )

    headers = {"Content-Type": "application/json"}
    body = {"contents": [{"parts": [{"text": final_prompt_text}]}]}

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


@app.post("/evaluate")
async def evaluate_performance(request: EvaluationRequest):
    """
    Evaluates student performance based on patient data, chat history,
    and a defined rubric.
    """
    evaluation_rubric = """
    Scoring System (Total 50 pts):
    - Correct Diagnosis: 25 pts (Is the submitted diagnosis correct? If yes award 25 pts, if no overlap award 0 pts, partial points if partial overlap)
    Scoring System (Total 50 pts):
    - Correct Diagnosis: 25 pts (Is the submitted diagnosis correct?)
    - OLDCARTS Mnemonic: 12 pts (1.5 pts for each component: Onset, Location, Duration, Character, Aggravating/Alleviating factors, Radiation, Temporal pattern, Severity)
    - Differential Diagnoses: 5 pts (Did the student consider other plausible diagnoses?)
    - History Gathering: 4 pts (Did they ask about relevant medical, family, or social history?)
    - Logical, Focused Reasoning: 2 pts (Was the questioning logical and not random?)
    - Timing Bonus: 2 pts (Deduct 0.5 pts per minute over 5 minutes, max deduction at 9 minutes)
    If a category is not applicable, award full points for that category.
    """

    prompt = f"""
    You are an expert medical education evaluator. Your task is to analyze a simulated patient encounter and score the medical student's performance based on the provided data and a strict rubric. Do not pamper the student, be objective.

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
    Please evaluate the student's performance by analyzing the chat transcript. Provide a score for each category in the rubric and brief, constructive feedback explaining your reasoning for the score. Your response must be in a structured format.

    **VERY IMPORTANT:** Your final response MUST begin with the total score as a single integer on the very first line, followed by a newline character. For example:
    50
    
    **Correct Diagnosis: 25/25**
    The student correctly identified the condition...
    """

    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    body = {"contents": [{"parts": [{"text": prompt}]}]}

    async with httpx.AsyncClient() as client:
        response = await client.post(gemini_url, json=body, headers=headers)
        data = response.json()

    try:
        full_response_text = data["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response to separate the score from the detailed evaluation
        response_parts = full_response_text.split("\n", 1)
        score_str = response_parts[0].strip()
        evaluation_text = response_parts[1].strip() if len(response_parts) > 1 else ""

        # Convert score to integer, with a fallback
        try:
            score = int(score_str)
        except (ValueError, IndexError):
            print(
                f"⚠️ Could not parse score from response: '{score_str}'. Defaulting to 0."
            )
            score = 0
            evaluation_text = (
                full_response_text  # Keep the original text if score parsing fails
            )

        return {"score": score, "evaluation": evaluation_text}
    except (KeyError, IndexError) as e:
        print(f"⚠️ Failed to parse Gemini evaluation response: {e}")
        return {"error": "Failed to get a valid evaluation from the AI."}


@app.get("/getProfile")
async def get_user(request: Request):
    auth_header = request.headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header"
        )

    token = auth_header.replace("Bearer ", "")
    user_response = supabase.auth.get_user(token)

    if user_response is None or user_response.user is None:
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
        
        print("auth.uid():", user_response.user.id)
        print("payload score:", payload.score)
        print("Authorization header:", auth_header)
        print("Supabase user:", user_response.user)



        return {"message": "Score updated", "new_score": new_score}
    
    except Exception as e:
        print("🔥 Exception occurred:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") 
      


@app.get("/getLeaderboard")
async def get_leaderboard():
    """
    Get the global leaderboard sorted by total_score in descending order.
    Returns users with their username, total_score, and profile_picture_url.
    """
    response = (
        supabase_admin.table("users")
        .select("username, total_score, profile_picture_url")
        .order("total_score", desc=True)
        .execute()
    )
    print(response.data)
    return response.data


@app.post("/updateProfilePicture")
async def update_profile_picture(request: Request, body: ProfilePictureUpdate):
    """
    Update the current user's profile picture URL.
    Requires authentication.
    """
    try:
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Missing or invalid Authorization header"
            )

        token = auth_header.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)

        if user_response is None or user_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = user_response.user.id

        # Use the admin client to bypass RLS for the update
        update_response = (
            supabase_admin.table("users")
            .update({"profile_picture_url": body.profile_picture_url})
            .eq("id", user_id)
            .execute()
        )

        if not update_response.data:
            # This could happen if the user ID doesn't exist, even with admin rights
            raise HTTPException(
                status_code=404,
                detail="User not found or failed to update profile picture",
            )

        updated_user = update_response.data[0]

        return {
            "username": updated_user["username"],
            "profile_picture_url": updated_user["profile_picture_url"],
        }

    except HTTPException:
        raise
    except Exception as e:
        # Generic error for production
        print(
            f"An unexpected error occurred while updating profile picture for user {user_id}: {e}"
        )
        raise HTTPException(
            status_code=500, detail="An internal server error occurred."
        )


@app.post("/addMatch")
async def add_match(request: Request, payload: AddMatchPayload):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header"
        )

    token = auth_header.replace("Bearer ", "")
    user_response = supabase.auth.get_user(token)

    if user_response.user is None:
        raise HTTPException(403, "Invalid user")

    user_id = user_response.user.id

    insert_resp = (
        supabase_admin.table("history")
        .insert(
            {
                "user_id": str(user_id),
                "patient_info": payload.patient_info,
                "score": payload.score,
                "submitted_diagnosis": payload.submitted_diagnosis,
                "submitted_aftercare": payload.submitted_aftercare,
                "feedback": payload.feedback,
            }
        )
        .execute()
    )

    if not insert_resp.data:
        raise HTTPException(500, "Failed to insert match history.")

    return insert_resp.data[0]


@app.get("/patients/random", response_model=PatientData)
async def get_random_patient_endpoint(request: Request):
    """
    Returns one random patient from Supabase, after verifying the caller's JWT.
    """
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header"
        )

    token = auth_header.replace("Bearer ", "")
    user_response = supabase.auth.get_user(token)
    if user_response.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        # 2) Count the total rows
        count_res = (
            supabase_admin
            .table("patient_data")
            .select("id", count="exact", head=True)
            .execute()
        )
        total = count_res.count or 0
        if total == 0:
            raise HTTPException(404, "No patients found")

        # 3) Pick a random offset and fetch that single row
        offset = random.randrange(total)
        row_res = (
            supabase_admin
            .table("patient_data")
            .select("*")
            .range(offset, offset)
            .execute()
        )
        data = row_res.data
        if not data:
            raise HTTPException(500, "Failed to retrieve random patient")

        # 4) Return the one PatientData
        print(data[0])
        return data[0]

    except HTTPException:
        # re-raise your intended HTTP errors
        raise
    except Exception as e:
        # catch-all for anything unexpected
        print("🔥 Error in get_random_patient_endpoint:", e)
        traceback.print_exc()
        raise HTTPException(500, "Internal server error")


@app.get("/fetchHistory", response_model=List[HistoryEntry])
async def fetch_history(request: Request):
    """
    Fetches a user's match history from the database,
    sorted by most recent.
    Requires authorization.
    """
    try:
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Missing or invalid Authorization header"
            )

        token = auth_header.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)

        if user_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = user_response.user.id

        # Query Supabase for this user's history, sorted by most recent
        response = (
            supabase_admin.table("history")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        if not response.data:
            return []

        return response.data

    except HTTPException:
        raise
    except Exception as e:
        print("🔥 Error fetching history:", e)
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="An internal server error occurred."
        )
