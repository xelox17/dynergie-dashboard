from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.crud import tasks as crud

router = APIRouter()


@router.get("/", response_model=List[Task])
def list_tasks(mission_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_tasks(db, mission_id=mission_id)


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/", response_model=Task, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)


@router.patch("/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    updated = crud.update_task(db, task_id, task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
