"""Seed script — peuple la base avec des données démo réalistes."""
import os, sys
from datetime import date, datetime, timedelta

# Supprime l'ancienne base pour repartir proprement
if os.path.exists("dynergie.db"):
    os.remove("dynergie.db")

from app.database import SessionLocal, engine, Base
from app.models.mission import Mission, MissionStatus
from app.models.task import Task, TaskStatus
from app.models.time_entry import TimeEntry
from app.models.watch_article import WatchArticle

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Missions ────────────────────────────────────────────────────────────────
missions = [
    Mission(title="Transformation Digitale Banque Centrale", client="BNP Paribas",    consultant="Sophie Martin", status=MissionStatus.in_progress, start_date=date(2026,3,1),  deadline=date(2026,8,31),  description="Accompagnement à la digitalisation des processus internes."),
    Mission(title="Audit SI & Cybersécurité",                client="Groupe Sanofi",  consultant="Thomas Dupont", status=MissionStatus.in_progress, start_date=date(2026,4,15), deadline=date(2026,7,15),  description="Audit complet du SI et recommandations sécurité."),
    Mission(title="Déploiement IA Générative RH",            client="Michelin",        consultant="Anas Mehri",    status=MissionStatus.in_progress, start_date=date(2026,5,1),  deadline=date(2026,9,30),  description="Intégration d'assistants IA pour les équipes RH."),
    Mission(title="Optimisation Supply Chain",               client="Decathlon",       consultant="Laura Bernard", status=MissionStatus.completed,   start_date=date(2026,1,10), deadline=date(2026,4,30),  description="Analyse et optimisation de la chaîne logistique Europe."),
    Mission(title="Migration Cloud AWS",                     client="EDF",             consultant="Marc Leroy",    status=MissionStatus.on_hold,     start_date=date(2026,2,1),  deadline=date(2026,6,30),  description="Migration de l'infrastructure on-premise vers AWS."),
]
db.add_all(missions)
db.commit()
for m in missions:
    db.refresh(m)

# ── Tasks ────────────────────────────────────────────────────────────────────
tasks = [
    # BNP Paribas
    Task(mission_id=missions[0].id, title="Cartographie des processus actuels",   status=TaskStatus.done,        assignee="Sophie Martin", priority=1),
    Task(mission_id=missions[0].id, title="Ateliers de co-construction",          status=TaskStatus.done,        assignee="Sophie Martin", priority=1),
    Task(mission_id=missions[0].id, title="Rédaction du plan de transformation",  status=TaskStatus.in_review,   assignee="Sophie Martin", priority=1),
    Task(mission_id=missions[0].id, title="Livraison du rapport intermédiaire",   status=TaskStatus.todo,        assignee="Sophie Martin", priority=2),
    # Sanofi
    Task(mission_id=missions[1].id, title="Collecte des actifs SI",               status=TaskStatus.done,        assignee="Thomas Dupont", priority=1),
    Task(mission_id=missions[1].id, title="Tests de pénétration réseau",          status=TaskStatus.in_progress, assignee="Thomas Dupont", priority=1),
    Task(mission_id=missions[1].id, title="Rédaction rapport d'audit",            status=TaskStatus.todo,        assignee="Thomas Dupont", priority=2),
    # Michelin — Anas
    Task(mission_id=missions[2].id, title="Benchmark solutions IA générative",    status=TaskStatus.done,        assignee="Anas Mehri",    priority=1),
    Task(mission_id=missions[2].id, title="POC chatbot RH avec LangChain",        status=TaskStatus.in_progress, assignee="Anas Mehri",    priority=1),
    Task(mission_id=missions[2].id, title="Révision architecture LLM",            status=TaskStatus.in_review,   assignee="Anas Mehri",    priority=1),
    Task(mission_id=missions[2].id, title="Formation des équipes RH",             status=TaskStatus.todo,        assignee="Anas Mehri",    priority=2),
    Task(mission_id=missions[2].id, title="Déploiement production",               status=TaskStatus.todo,        assignee="Anas Mehri",    priority=1),
]
db.add_all(tasks)
db.commit()

# ── Time entries ─────────────────────────────────────────────────────────────
today = date.today()
entries = []
for i in range(14):
    d = today - timedelta(days=i)
    if d.weekday() < 5:  # Lundi–Vendredi seulement
        entries.append(TimeEntry(mission_id=missions[2].id, consultant="Anas Mehri",    date=d, hours=7.5, description="Développement POC IA"))
    if i < 10 and d.weekday() < 5:
        entries.append(TimeEntry(mission_id=missions[0].id, consultant="Sophie Martin", date=d, hours=6.0, description="Ateliers client"))
    if i < 7 and d.weekday() < 5:
        entries.append(TimeEntry(mission_id=missions[1].id, consultant="Thomas Dupont", date=d, hours=8.0, description="Tests sécurité"))

db.add_all(entries)
db.commit()

# ── Watch articles ────────────────────────────────────────────────────────────
articles = [
    WatchArticle(title="L'IA générative transforme le conseil en stratégie",       url="https://example.com/ai-conseil",      source="Les Échos",             summary="Les cabinets de conseil intègrent massivement les LLMs pour accélérer la production de livrables.", category="IA",             published_at=datetime.now()-timedelta(days=1)),
    WatchArticle(title="Cybersécurité 2026 : les menaces qui pèsent sur les PME",  url="https://example.com/cyber-pme",       source="Le Monde Informatique", summary="Ransomware, phishing ciblé, deepfakes — panorama des menaces pour les entreprises françaises.",        category="Cybersécurité",  published_at=datetime.now()-timedelta(days=2)),
    WatchArticle(title="Next.js 15 : ce qui change pour les développeurs",         url="https://example.com/nextjs15",        source="Dev.to",                summary="Turbopack stable, Server Actions améliorés, nouvelles API de cache.",                                   category="Développement",  published_at=datetime.now()-timedelta(days=3)),
    WatchArticle(title="Cloud souverain : où en est la France ?",                  url="https://example.com/cloud-souverain", source="Silicon.fr",            summary="Bilan du programme Cloud au Centre et perspectives pour les administrations publiques.",                  category="Cloud",          published_at=datetime.now()-timedelta(days=4)),
    WatchArticle(title="DataOps : intégrer la qualité des données dès le pipeline",url="https://example.com/dataops",         source="Towards Data Science",  summary="Bonnes pratiques pour automatiser les contrôles qualité dans les pipelines de données.",                 category="Data",           published_at=datetime.now()-timedelta(days=5), is_bookmarked=True),
    WatchArticle(title="GitHub Copilot Workspace : l'IDE du futur ?",              url="https://example.com/copilot",         source="GitHub Blog",           summary="Retour d'expérience sur le nouveau workspace IA de GitHub pour la génération de code.",                  category="IA",             published_at=datetime.now()-timedelta(days=6)),
]
db.add_all(articles)
db.commit()
db.close()

print("✅ Base de données peuplée avec succès !")
