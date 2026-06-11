# Dynergie Dashboard

Plateforme interne pour les consultants de **Dynergie Innovation Consulting** — gestion des missions, suivi du temps, tâches et veille technologique.

> Projet réalisé dans le cadre d'un stage de fin d'études en ingénierie (cybersécurité & IA) à l'ESAIP.

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend | Python · FastAPI · SQLAlchemy |
| Base de données | SQLite (fichier local `dynergie.db`) |
| CI/CD | GitHub Actions |

---

## Structure du projet

```
dynergie-dashboard/
├── frontend/              # Application Next.js 14
│   ├── app/               # Routes (App Router)
│   │   ├── page.tsx       # Tableau de bord
│   │   ├── missions/      # Gestion des missions
│   │   ├── time-tracking/ # Suivi du temps
│   │   ├── tasks/         # Tâches par mission
│   │   └── watch/         # Veille technologique
│   ├── components/
│   │   ├── layout/        # Sidebar, Header
│   │   └── ui/            # Composants réutilisables
│   └── lib/api.ts         # Client API typé
│
├── backend/               # API FastAPI
│   ├── app/
│   │   ├── main.py        # Point d'entrée + CORS
│   │   ├── database.py    # Connexion SQLite / SQLAlchemy
│   │   ├── models/        # Modèles ORM (Mission, Task, TimeEntry, WatchArticle)
│   │   ├── schemas/       # Schémas Pydantic (validation)
│   │   ├── crud/          # Opérations CRUD
│   │   └── routers/       # Routes API REST
│   ├── seed.py            # Script de peuplement avec données démo
│   └── requirements.txt
│
└── .github/
    └── workflows/ci.yml   # Pipeline CI (lint + tests + build)
```

---

## Prérequis

- **Node.js** ≥ 20
- **Python** ≥ 3.11
- **npm** ≥ 10

---

## Installation & lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-compte>/dynergie-dashboard.git
cd dynergie-dashboard
```

### 2. Backend

```bash
cd backend

# Créer et activer un environnement virtuel
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# (Optionnel) Peupler la base avec des données démo
python seed.py

# Démarrer le serveur
uvicorn app.main:app --reload --port 8000
```

L'API est accessible sur **http://localhost:8000**  
Documentation interactive : **http://localhost:8000/docs**

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

L'application est accessible sur **http://localhost:3000**

---

## Variables d'environnement

| Fichier | Variable | Valeur par défaut |
|---------|----------|------------------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |

---

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/missions/` | Liste des missions |
| POST | `/api/missions/` | Créer une mission |
| PATCH | `/api/missions/{id}` | Modifier une mission |
| DELETE | `/api/missions/{id}` | Supprimer une mission |
| GET | `/api/tasks/?mission_id=` | Tâches (filtrables par mission) |
| POST | `/api/tasks/` | Créer une tâche |
| PATCH | `/api/tasks/{id}` | Modifier une tâche |
| GET | `/api/time-entries/` | Saisies de temps |
| POST | `/api/time-entries/` | Créer une saisie |
| GET | `/api/watch/` | Articles de veille |
| GET | `/api/health` | Healthcheck |

---

## CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci.yml`) s'exécute à chaque push sur `main` :

1. **Backend** — Installation des dépendances Python + exécution des tests pytest
2. **Frontend** — `npm ci` + vérification TypeScript (`tsc --noEmit`) + build de production

---

## Auteur

**Anas Mehri** — Étudiant ingénieur 3ème année, ESAIP (Cybersécurité & IA/Data)  
[GitHub](https://github.com/Xelox17) · [anasmehri95@gmail.com](mailto:anasmehri95@gmail.com)
