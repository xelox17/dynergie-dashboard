from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from app.database import Base
import enum


class TaskStatus(str, enum.Enum):
    todo        = "todo"
    in_progress = "in_progress"
    in_review   = "in_review"
    done        = "done"


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, index=True)
    mission_id  = Column(Integer, ForeignKey("missions.id"), nullable=False)
    title       = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status      = Column(Enum(TaskStatus), default=TaskStatus.todo)
    assignee    = Column(String, nullable=True)
    priority    = Column(Integer, default=2)  # 1=high 2=medium 3=low
