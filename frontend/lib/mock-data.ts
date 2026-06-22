import type { Mission, Task, TimeEntry, WatchArticle } from "./api";

export const MOCK_MISSIONS: Mission[] = [
  { id: 1, title: "Dossier CIR 2026 — Financement R&D",       client: "Groupe Safran",         consultant: "Anas Mehri",    status: "in_progress", start_date: "2026-03-01", deadline: "2026-09-30", description: "Constitution et optimisation du dossier Crédit Impôt Recherche pour les projets R&D aéronautique." },
  { id: 2, title: "Audit Innovation & Veille Technologique",   client: "Airbus",                consultant: "Sophie Martin", status: "in_progress", start_date: "2026-04-01", deadline: "2026-07-31", description: "Évaluation de la maturité innovation et mise en place d'une cellule de veille technologique." },
  { id: 3, title: "Accompagnement levée de fonds Série A",     client: "Startup Deeptech",      consultant: "Anas Mehri",    status: "in_progress", start_date: "2026-05-01", deadline: "2026-10-31", description: "Structuration du pitch, roadmap technique et accompagnement des négociations investisseurs." },
  { id: 4, title: "Stratégie Open Innovation",                 client: "EDF",                   consultant: "Thomas Dupont", status: "completed",   start_date: "2026-01-15", deadline: "2026-05-31", description: "Définition de la stratégie d'innovation ouverte et partenariats startups pour la transition énergétique." },
  { id: 5, title: "Diagnostic Maturité Innovation",            client: "Bouygues Construction", consultant: "Laura Bernard", status: "on_hold",     start_date: "2026-02-01", deadline: "2026-07-15", description: "Évaluation du niveau de maturité innovation et feuille de route de transformation." },
];

export const MOCK_TASKS: Task[] = [
  { id: 1,  mission_id: 1, title: "Collecte des données R&D Safran",           status: "done",        assignee: "Anas Mehri",    priority: 1 },
  { id: 2,  mission_id: 1, title: "Analyse éligibilité projets CIR",            status: "done",        assignee: "Anas Mehri",    priority: 1 },
  { id: 3,  mission_id: 1, title: "Rédaction du dossier technique",             status: "in_review",   assignee: "Anas Mehri",    priority: 1 },
  { id: 4,  mission_id: 1, title: "Validation juriste fiscaliste",              status: "todo",        assignee: "Anas Mehri",    priority: 2 },
  { id: 5,  mission_id: 2, title: "Interviews des équipes innovation Airbus",   status: "done",        assignee: "Sophie Martin", priority: 1 },
  { id: 6,  mission_id: 2, title: "Benchmark concurrents secteur aéro",         status: "in_progress", assignee: "Sophie Martin", priority: 1 },
  { id: 7,  mission_id: 2, title: "Livrable : rapport d'audit innovation",      status: "todo",        assignee: "Sophie Martin", priority: 2 },
  { id: 8,  mission_id: 3, title: "Analyse du marché deeptech français",        status: "done",        assignee: "Anas Mehri",    priority: 1 },
  { id: 9,  mission_id: 3, title: "Rédaction du business plan investisseurs",   status: "in_progress", assignee: "Anas Mehri",    priority: 1 },
  { id: 10, mission_id: 3, title: "Préparation pitch deck Série A",             status: "in_review",   assignee: "Anas Mehri",    priority: 1 },
  { id: 11, mission_id: 3, title: "Prise de contact fonds d'investissement",    status: "todo",        assignee: "Anas Mehri",    priority: 2 },
  { id: 12, mission_id: 3, title: "Négociation term sheet",                     status: "todo",        assignee: "Anas Mehri",    priority: 1 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: i + 1,  mission_id: 3, consultant: "Anas Mehri",    date: daysAgo(i),     hours: i % 5 === 4 ? 4 : 7.5, description: "Préparation levée de fonds Série A" })),
  ...Array.from({ length: 8 },  (_, i) => ({ id: i + 11, mission_id: 1, consultant: "Anas Mehri",    date: daysAgo(i + 1), hours: 6,   description: "Dossier CIR Safran" })),
  ...Array.from({ length: 5 },  (_, i) => ({ id: i + 19, mission_id: 2, consultant: "Sophie Martin", date: daysAgo(i + 2), hours: 8,   description: "Audit Innovation Airbus" })),
];

export const MOCK_ARTICLES: WatchArticle[] = [
  { id: 1, title: "L'IA générative transforme le conseil en stratégie",               url: "#", source: "Les Échos",              summary: "Les cabinets de conseil intègrent massivement les LLMs pour accélérer la production de livrables et le diagnostic client.", category: "IA",            published_at: daysAgo(1) + "T08:00:00", is_bookmarked: false },
  { id: 2, title: "CIR 2026 : les nouvelles règles qui changent tout pour les PME",   url: "#", source: "L'Usine Nouvelle",      summary: "Le Budget 2026 modifie les taux et plafonds du Crédit Impôt Recherche. Ce que les entreprises doivent anticiper dès maintenant.", category: "Data",          published_at: daysAgo(2) + "T09:00:00", is_bookmarked: true  },
  { id: 3, title: "Open Innovation : comment les grands groupes collaborent avec les startups", url: "#", source: "HBR France", summary: "Airbus, EDF, Safran… les stratégies gagnantes pour sourcer, qualifier et co-développer avec l'écosystème deeptech.", category: "IA",            published_at: daysAgo(3) + "T10:00:00", is_bookmarked: false },
  { id: 4, title: "Levée de fonds Série A : les attentes des VCs en 2026",            url: "#", source: "Maddyness",             summary: "Les critères de sélection des fonds d'investissement français et européens pour les startups deeptech post-amorçage.", category: "Développement", published_at: daysAgo(4) + "T11:00:00", is_bookmarked: false },
  { id: 5, title: "Cybersécurité industrielle : les nouveaux enjeux OT/IT",           url: "#", source: "Le Monde Informatique", summary: "Convergence des systèmes informatiques et opérationnels dans l'industrie aéronautique et énergétique — panorama des menaces.", category: "Cybersécurité", published_at: daysAgo(5) + "T12:00:00", is_bookmarked: false },
  { id: 6, title: "Transition énergétique : l'innovation comme levier stratégique",   url: "#", source: "Batiactu",              summary: "Comment Bouygues, EDF et leurs partenaires accélèrent leur transformation via l'innovation ouverte et les partenariats R&D.", category: "Cloud",         published_at: daysAgo(6) + "T08:00:00", is_bookmarked: false },
];
