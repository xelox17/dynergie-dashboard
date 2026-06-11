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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
