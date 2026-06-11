import os
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


@router.post("/{article_id}/summarize")
def summarize_article(article_id: int, db: Session = Depends(get_db)):
    """Generate a 3-point AI summary. Uses Claude API if ANTHROPIC_API_KEY is set."""
    article = crud.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    api_key = os.getenv("ANTHROPIC_API_KEY")

    if api_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            message = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=300,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Résume cet article en exactement 3 points clés en français, "
                        f"format bullet points (commence chaque point par •).\n\n"
                        f"Titre : {article.title}\n"
                        f"Source : {article.source}\n"
                        f"Résumé : {article.summary or 'non disponible'}"
                    ),
                }],
            )
            summary = message.content[0].text
        except Exception:
            summary = _mock_summary(article.title)
    else:
        summary = _mock_summary(article.title)

    return {"article_id": article_id, "summary": summary}


def _mock_summary(title: str) -> str:
    return (
        f"• {title} — sujet d'actualité majeur dans le secteur de l'innovation.\n"
        f"• Les experts soulignent un impact significatif sur les pratiques métier et les stratégies d'entreprise.\n"
        f"• Des actions concrètes sont recommandées pour anticiper les transformations à venir."
    )
