from sqlalchemy import Column, Integer, String, Date, Enum
from app.database import Base
import enum


class MissionStatus(str, enum.Enum):
    in_progress = "in_progress"
    completed = "completed"
    on_hold = "on_hold"
    cancelled = "cancelled"


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    client = Column(String, nullable=False)
    consultant = Column(String, nullable=False)
    status = Column(Enum(MissionStatus), default=MissionStatus.in_progress)
    start_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=False)
    description = Column(String, nullable=True)
