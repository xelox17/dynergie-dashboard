from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.watch_article import WatchArticle, WatchArticleCreate, WatchArticleUpdate
from app.crud import watch_articles as crud

router = APIRouter()


@router.get("/", response_model=List[WatchArticle])
def list_articles(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    return crud.get_articles(db, category=category, skip=skip, limit=limit)


@router.get("/{article_id}", response_model=WatchArticle)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = crud.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/", response_model=WatchArticle, status_code=201)
def create_article(article: WatchArticleCreate, db: Session = Depends(get_db)):
    return crud.create_article(db, article)


@router.patch("/{article_id}", response_model=WatchArticle)
def update_article(article_id: int, article: WatchArticleUpdate, db: Session = Depends(get_db)):
    updated = crud.update_article(db, article_id, article)
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    return updated
