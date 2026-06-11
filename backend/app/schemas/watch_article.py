from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class WatchArticleBase(BaseModel):
    title: str
    url: str
    source: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    published_at: Optional[datetime] = None
    is_bookmarked: bool = False


class WatchArticleCreate(WatchArticleBase):
    pass


class WatchArticleUpdate(BaseModel):
    is_bookmarked: Optional[bool] = None
    summary: Optional[str] = None
    category: Optional[str] = None


class WatchArticle(WatchArticleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
