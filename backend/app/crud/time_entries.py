from sqlalchemy.orm import Session
from app.models.time_entry import TimeEntry
from app.schemas.time_entry import TimeEntryCreate, TimeEntryUpdate


def get_time_entries(db: Session, mission_id: int | None = None, consultant: str | None = None):
    query = db.query(TimeEntry)
    if mission_id is not None:
        query = query.filter(TimeEntry.mission_id == mission_id)
    if consultant is not None:
        query = query.filter(TimeEntry.consultant == consultant)
    return query.order_by(TimeEntry.date.desc()).all()


def get_time_entry(db: Session, entry_id: int):
    return db.query(TimeEntry).filter(TimeEntry.id == entry_id).first()


def create_time_entry(db: Session, entry: TimeEntryCreate):
    db_entry = TimeEntry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def update_time_entry(db: Session, entry_id: int, entry: TimeEntryUpdate):
    db_entry = get_time_entry(db, entry_id)
    if not db_entry:
        return None
    for field, value in entry.model_dump(exclude_unset=True).items():
        setattr(db_entry, field, value)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def delete_time_entry(db: Session, entry_id: int):
    db_entry = get_time_entry(db, entry_id)
    if not db_entry:
        return None
    db.delete(db_entry)
    db.commit()
    return db_entry
