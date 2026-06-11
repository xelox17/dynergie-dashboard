from pydantic import BaseModel
from datetime import date
from app.models.mission import MissionStatus
from typing import Optional


class MissionBase(BaseModel):
    title: str
    client: str
    consultant: str
    status: MissionStatus = MissionStatus.in_progress
    start_date: date
    deadline: date
    description: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    consultant: Optional[str] = None
    status: Optional[MissionStatus] = None
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    description: Optional[str] = None


class Mission(MissionBase):
    id: int

    class Config:
        from_attributes = True
