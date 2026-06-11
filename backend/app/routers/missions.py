from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.mission import Mission, MissionCreate, MissionUpdate
from app.crud import missions as crud

router = APIRouter()


@router.get("/", response_model=List[Mission])
def list_missions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_missions(db, skip=skip, limit=limit)


@router.get("/{mission_id}", response_model=Mission)
def get_mission(mission_id: int, db: Session = Depends(get_db)):
    mission = crud.get_mission(db, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@router.post("/", response_model=Mission, status_code=201)
def create_mission(mission: MissionCreate, db: Session = Depends(get_db)):
    return crud.create_mission(db, mission)


@router.patch("/{mission_id}", response_model=Mission)
def update_mission(mission_id: int, mission: MissionUpdate, db: Session = Depends(get_db)):
    updated = crud.update_mission(db, mission_id, mission)
    if not updated:
        raise HTTPException(status_code=404, detail="Mission not found")
    return updated


@router.delete("/{mission_id}", status_code=204)
def delete_mission(mission_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_mission(db, mission_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Mission not found")
