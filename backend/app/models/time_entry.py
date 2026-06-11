from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from app.database import Base


class TimeEntry(Base):
    __tablename__ = "time_entries"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    consultant = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    hours = Column(Float, nullable=False)
    description = Column(String, nullable=True)
