
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.routers import photos, editor,admin
from app.routers import address, orders
from sqlalchemy import text

from app.core.database import Base, engine, get_db
import app.models  # Ensures models are imported before creating tables

# Automatically create tables in Supabase PostgreSQL if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MemoryBook API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"
                   , "https://memory-book.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "MemoryBook Backend with SQLAlchemy is running!"}

@app.get("/health/db")
def check_db_health(db: Session = Depends(get_db)):
    try:
        # Run a raw query using SQLAlchemy session
        result = db.execute(text("SELECT 1")).fetchone()
        return {"status": "connected", "query_result": result[0]}
    except Exception as e:
        return {"status": "error", "details": str(e)}

app.include_router(photos.router)
app.include_router(editor.router)
app.include_router(address.router)
app.include_router(orders.router)
app.include_router(admin.router)