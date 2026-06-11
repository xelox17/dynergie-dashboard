from sqlalchemy.orm import Session
from app.models.watch_article import WatchArticle
from app.schemas.watch_article import WatchArticleCreate, WatchArticleUpdate


def get_articles(db: Session, category: str | None = None, skip: int = 0, limit: int = 50):
    query = db.query(WatchArticle)
    if category:
        query = query.filter(WatchArticle.category == category)
    return query.order_by(WatchArticle.published_at.desc()).offset(skip).limit(limit).all()


def get_article(db: Session, article_id: int):
    return db.query(WatchArticle).filter(WatchArticle.id == article_id).first()


def create_article(db: Session, article: WatchArticleCreate):
    db_article = WatchArticle(**article.model_dump())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def update_article(db: Session, article_id: int, article: WatchArticleUpdate):
    db_article = get_article(db, article_id)
    if not db_article:
        return None
    for field, value in article.model_dump(exclude_unset=True).items():
        setattr(db_article, field, value)
    db.commit()
    db.refresh(db_article)
    return db_article
