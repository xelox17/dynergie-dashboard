from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database import Base
from datetime import datetime


class WatchArticle(Base):
    __tablename__ = "watch_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    source = Column(String, nullable=True)
    summary = Column(String, nullable=True)
    category = Column(String, nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    is_bookmarked = Column(Boolean, default=False)
