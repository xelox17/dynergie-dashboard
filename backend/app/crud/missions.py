from sqlalchemy.orm import Session
from app.models.mission import Mission
from app.schemas.mission import MissionCreate, MissionUpdate


def get_missions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Mission).offset(skip).limit(limit).all()


def get_mission(db: Session, mission_id: int):
    return db.query(Mission).filter(Mission.id == mission_id).first()


def create_mission(db: Session, mission: MissionCreate):
    db_mission = Mission(**mission.model_dump())
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    return db_mission


def update_mission(db: Session, mission_id: int, mission: MissionUpdate):
    db_mission = get_mission(db, mission_id)
    if not db_mission:
        return None
    for field, value in mission.model_dump(exclude_unset=True).items():
        setattr(db_mission, field, value)
    db.commit()
    db.refresh(db_mission)
    return db_mission


def delete_mission(db: Session, mission_id: int):
    db_mission = get_mission(db, mission_id)
    if not db_mission:
        return None
    db.delete(db_mission)
    db.commit()
    return db_mission
