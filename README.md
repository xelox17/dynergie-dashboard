# Dynergie Dashboard

[![CI](https://github.com/xelox17/dynergie-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/xelox17/dynergie-dashboard/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

> Plateforme interne de pilotage pour les consultants **Dynergie Innovation Consulting** — gestion des missions, suivi du temps, Kanban et veille technologique avec résumé IA.

---

## Screenshots

| Tableau de bord | Missions |
|:-:|:-:|
| ![Tableau de bord](./docs/screenshots/dashboard.png) | ![Missions](./docs/screenshots/missions.png) |

| Kanban Tâches | Suivi du temps |
|:-:|:-:|
| ![Kanban](./docs/screenshots/tasks.png) | ![Suivi du temps](./docs/screenshots/time-tracking.png) |

> **Pour ajouter les captures d'écran :** faites un screenshot de chaque page (F12 → Device toolbar ou simplement la fenêtre), enregistrez les fichiers dans `docs/screenshots/` sous les noms `dashboard.png`, `missions.png`, `tasks.png`, `time-tracking.png`, puis commitez et pushez.

---

## Contexte

Ce dashboard a été conçu pour simuler l'outil de pilotage interne qu'utiliserait un cabinet de conseil en innovation comme Dynergie. Il couvre les 4 besoins principaux d'un consultant :

| Module | Description |
|--------|-------------|
| **Missions** | Vue d'ensemble des missions actives, filtres par statut, CRUD complet |
| **Tâches** | Kanban en 4 colonnes avec drag & drop entre statuts |
| **Suivi du temps** | Saisie journalière, graphiques hebdomadaires et répartition par mission |
| **Veille** | Agrégateur d'articles avec filtres par thématique et résumé IA (Claude API) |

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | **Next.js 14** (App Router) · TypeScript · Tailwind CSS · Recharts |
| Backend | **Python** · FastAPI · SQLAlchemy ORM |
| Base de données | SQLite (fichier local `dynergie.db`) |
| Tests | Pytest · httpx · TestClient |
| CI/CD | **GitHub Actions** (typecheck + build + tests) |
| Drag & Drop | @hello-pangea/dnd |

---

## Structure du projet

```
dynergie-dashboard/
├── frontend/                    # Application Next.js 14
│   ├── app/
│   │   ├── page.tsx             # Tableau de bord (KPIs + missions + échéances)
│   │   ├── missions/            # Grille filtrée + modal CRUD
│   │   ├── tasks/               # Kanban drag & drop
│   │   ├── time-tracking/       # Graphiques + saisie heures
│   │   └── watch/               # Veille + résumé IA
│   ├── components/layout/       # Sidebar + Header
│   └── lib/api.ts               # Client API TypeScript typé
│
├── backend/                     # API REST FastAPI
│   ├── app/
│   │   ├── main.py              # Application + CORS
│   │   ├── database.py          # Connexion SQLAlchemy
│   │   ├── models/              # ORM : Mission, Task, TimeEntry, WatchArticle
│   │   ├── schemas/             # Validation Pydantic v2
│   │   ├── crud/                # Opérations CRUD génériques
│   │   └── routers/             # Routes : /missions /tasks /time-entries /watch
│   ├── tests/                   # 9 tests pytest (health + CRUD)
│   ├── seed.py                  # Données démo réalistes
│   └── requirements.txt
│
└── .github/workflows/ci.yml     # Pipeline CI (frontend + backend)
```

---

## Installation & lancement

### Prérequis

- Node.js ≥ 20
- Python 3.12 (recommandé) ou 3.11+

### Backend

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Peupler la base avec des données démo
python seed.py

# Lancer le serveur (port 8000)
uvicorn app.main:app --reload --port 8000
```

API disponible sur **http://localhost:8000**  
Documentation Swagger : **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur **http://localhost:3000**

---

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/health` | Healthcheck |
| `GET/POST` | `/api/missions/` | Liste / Créer |
| `PATCH/DELETE` | `/api/missions/{id}` | Modifier / Supprimer |
| `GET/POST` | `/api/tasks/` | Liste (filtrables par mission) / Créer |
| `PATCH` | `/api/tasks/{id}` | Modifier statut (Kanban) |
| `GET/POST` | `/api/time-entries/` | Saisies de temps |
| `GET/POST` | `/api/watch/` | Articles de veille |
| `POST` | `/api/watch/{id}/summarize` | Résumé IA (Claude) |

---

## CI/CD — GitHub Actions

Le pipeline `.github/workflows/ci.yml` se déclenche sur chaque push et pull request vers `main` :

```
Push → main
  ├── Job: Frontend
  │     ├── npm ci
  │     ├── tsc --noEmit  (typecheck)
  │     └── npm run build
  └── Job: Backend
        ├── pip install -r requirements-dev.txt
        └── pytest tests/ -v
```

---

## Variables d'environnement

| Fichier | Variable | Utilité |
|---------|----------|---------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | URL de l'API (défaut : `http://localhost:8000`) |
| `backend/.env` | `ANTHROPIC_API_KEY` | Clé Claude pour les résumés IA (optionnel) |

---

## Auteur

**Anas Mehri** — Étudiant ingénieur 3ème année, ESAIP (Cybersécurité & IA/Data)

[![GitHub](https://img.shields.io/badge/GitHub-xelox17-181717?logo=github)](https://github.com/xelox17)
[![Email](https://img.shields.io/badge/Email-anasmehri95%40gmail.com-EA4335?logo=gmail)](mailto:anasmehri95@gmail.com)
