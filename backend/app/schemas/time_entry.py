from pydantic import BaseModel
from datetime import date
from typing import Optional


class TimeEntryBase(BaseModel):
    mission_id: int
    consultant: str
    date: date
    hours: float
    description: Optional[str] = None


class TimeEntryCreate(TimeEntryBase):
    pass


class TimeEntryUpdate(BaseModel):
    hours: Optional[float] = None
    description: Optional[str] = None


class TimeEntry(TimeEntryBase):
    id: int

    class Config:
        from_attributes = True
