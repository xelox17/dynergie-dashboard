from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.time_entry import TimeEntry, TimeEntryCreate, TimeEntryUpdate
from app.crud import time_entries as crud

router = APIRouter()


@router.get("/", response_model=List[TimeEntry])
def list_time_entries(
    mission_id: Optional[int] = None,
    consultant: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.get_time_entries(db, mission_id=mission_id, consultant=consultant)


@router.get("/{entry_id}", response_model=TimeEntry)
def get_time_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.get_time_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Time entry not found")
    return entry


@router.post("/", response_model=TimeEntry, status_code=201)
def create_time_entry(entry: TimeEntryCreate, db: Session = Depends(get_db)):
    return crud.create_time_entry(db, entry)


@router.patch("/{entry_id}", response_model=TimeEntry)
def update_time_entry(entry_id: int, entry: TimeEntryUpdate, db: Session = Depends(get_db)):
    updated = crud.update_time_entry(db, entry_id, entry)
    if not updated:
        raise HTTPException(status_code=404, detail="Time entry not found")
    return updated


@router.delete("/{entry_id}", status_code=204)
def delete_time_entry(entry_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_time_entry(db, entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Time entry not found")
