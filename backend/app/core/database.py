import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is missing in .env")

# 1. SQLAlchemy Engine Setup
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Supabase Client Setup (used specifically for Storage/Bucket operations)
#
# IMPORTANT: this uses the SERVICE ROLE key, not the anon key.
# Storage/bucket writes (upload/delete) happen only from backend routes that
# have already authenticated the caller via get_current_user_id (JWT check),
# so it's safe for the backend itself to use elevated Storage privileges here
# rather than being subject to the bucket's RLS policies a second time.
# Using the anon key here caused "new row violates row-level security policy"
# 403 errors on photo upload, since the anon key has no special grant on the
# storage.objects table unless a matching RLS policy exists for it.
if not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("SUPABASE_SERVICE_ROLE_KEY is missing in .env")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


# Dependency to get DB session in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()