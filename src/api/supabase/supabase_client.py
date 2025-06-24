# supabase_client.py
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Try both frontend and backend environment variable names
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing Supabase URL environment variable. Set SUPABASE_URL.")
if not SUPABASE_KEY:
    raise ValueError(
        "Missing Supabase Anon Key environment variable. Set SUPABASE_ANON_KEY."
    )
if not SUPABASE_SERVICE_KEY:
    raise ValueError(
        "Missing Supabase Service Key environment variable. Set SUPABASE_SERVICE_KEY."
    )

# Client for frontend-like access (auth, anon RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Admin client that bypasses RLS (for trusted server-side operations)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
