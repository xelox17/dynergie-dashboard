from pydantic import BaseModel, ConfigDict
from app.models.task import TaskStatus
from typing import Optional


class TaskBase(BaseModel):
    mission_id: int
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    assignee: Optional[str] = None
    priority: int = 2


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assignee: Optional[str] = None
    priority: Optional[int] = None


class Task(TaskBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
