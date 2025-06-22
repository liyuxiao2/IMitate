# supabase_client.py
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load the .env.local file if it exists, otherwise .env
env_path = ".env.local" if os.path.exists(".env.local") else ".env"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing Supabase URL environment variable.")
if not SUPABASE_KEY:
    raise ValueError("Missing Supabase Anon Key environment variable.")
if not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing Supabase Service Key environment variable.")

# Client for frontend-like access (auth, anon RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Admin client that bypasses RLS (for trusted server-side operations)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
