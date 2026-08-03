from fastapi import FastAPI

app = FastAPI(
    title="MemoryBook API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "MemoryBook Backend Running"
    }