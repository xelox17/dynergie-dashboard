import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import missions, tasks, time_entries, watch

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dynergie Dashboard API",
    description="Internal consultant dashboard API for Dynergie",
    version="1.0.0",
)

# Accept localhost (dev) + any Vercel deployment URL
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
]

extra = os.getenv("ALLOWED_ORIGINS", "")
if extra:
    origins += [o.strip() for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(time_entries.router, prefix="/api/time-entries", tags=["time-entries"])
app.include_router(watch.router, prefix="/api/watch", tags=["watch"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
