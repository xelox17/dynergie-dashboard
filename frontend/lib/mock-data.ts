import type { Mission, Task, TimeEntry, WatchArticle } from "./api";

export const MOCK_MISSIONS: Mission[] = [
  { id: 1, title: "Transformation Digitale Banque Centrale", client: "BNP Paribas",    consultant: "Sophie Martin", status: "in_progress", start_date: "2026-03-01", deadline: "2026-08-31", description: "Accompagnement à la digitalisation des processus internes." },
  { id: 2, title: "Audit SI & Cybersécurité",               client: "Groupe Sanofi",   consultant: "Thomas Dupont", status: "in_progress", start_date: "2026-04-15", deadline: "2026-07-15", description: "Audit complet du SI et recommandations sécurité." },
  { id: 3, title: "Déploiement IA Générative RH",           client: "Michelin",         consultant: "Anas Mehri",    status: "in_progress", start_date: "2026-05-01", deadline: "2026-09-30", description: "Intégration d'assistants IA pour les équipes RH." },
  { id: 4, title: "Optimisation Supply Chain",              client: "Decathlon",        consultant: "Laura Bernard", status: "completed",   start_date: "2026-01-10", deadline: "2026-04-30", description: "Analyse et optimisation de la chaîne logistique Europe." },
  { id: 5, title: "Migration Cloud AWS",                    client: "EDF",              consultant: "Marc Leroy",    status: "on_hold",     start_date: "2026-02-01", deadline: "2026-06-30", description: "Migration de l'infrastructure on-premise vers AWS." },
];

export const MOCK_TASKS: Task[] = [
  { id: 1,  mission_id: 1, title: "Cartographie des processus actuels",  status: "done",        assignee: "Sophie Martin", priority: 1 },
  { id: 2,  mission_id: 1, title: "Ateliers de co-construction",         status: "done",        assignee: "Sophie Martin", priority: 1 },
  { id: 3,  mission_id: 1, title: "Rédaction du plan de transformation", status: "in_review",   assignee: "Sophie Martin", priority: 1 },
  { id: 4,  mission_id: 1, title: "Livraison du rapport intermédiaire",  status: "todo",        assignee: "Sophie Martin", priority: 2 },
  { id: 5,  mission_id: 2, title: "Collecte des actifs SI",              status: "done",        assignee: "Thomas Dupont", priority: 1 },
  { id: 6,  mission_id: 2, title: "Tests de pénétration réseau",         status: "in_progress", assignee: "Thomas Dupont", priority: 1 },
  { id: 7,  mission_id: 2, title: "Rédaction rapport d'audit",           status: "todo",        assignee: "Thomas Dupont", priority: 2 },
  { id: 8,  mission_id: 3, title: "Benchmark solutions IA générative",   status: "done",        assignee: "Anas Mehri",    priority: 1 },
  { id: 9,  mission_id: 3, title: "POC chatbot RH avec LangChain",       status: "in_progress", assignee: "Anas Mehri",    priority: 1 },
  { id: 10, mission_id: 3, title: "Révision architecture LLM",           status: "in_review",   assignee: "Anas Mehri",    priority: 1 },
  { id: 11, mission_id: 3, title: "Formation des équipes RH",            status: "todo",        assignee: "Anas Mehri",    priority: 2 },
  { id: 12, mission_id: 3, title: "Déploiement production",              status: "todo",        assignee: "Anas Mehri",    priority: 1 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: i + 1,  mission_id: 3, consultant: "Anas Mehri",    date: daysAgo(i),      hours: i % 5 === 4 ? 4 : 7.5, description: "Développement POC IA" })),
  ...Array.from({ length: 8 },  (_, i) => ({ id: i + 11, mission_id: 1, consultant: "Sophie Martin", date: daysAgo(i + 1),  hours: 6,   description: "Ateliers client" })),
  ...Array.from({ length: 5 },  (_, i) => ({ id: i + 19, mission_id: 2, consultant: "Thomas Dupont", date: daysAgo(i + 2),  hours: 8,   description: "Tests sécurité" })),
];

export const MOCK_ARTICLES: WatchArticle[] = [
  { id: 1, title: "L'IA générative transforme le conseil en stratégie",        url: "#", source: "Les Échos",             summary: "Les cabinets de conseil intègrent massivement les LLMs pour accélérer la production de livrables.", category: "IA",            published_at: daysAgo(1) + "T08:00:00", is_bookmarked: false },
  { id: 2, title: "Cybersécurité 2026 : les menaces qui pèsent sur les PME",   url: "#", source: "Le Monde Informatique", summary: "Ransomware, phishing ciblé, deepfakes — panorama des menaces pour les entreprises françaises.",       category: "Cybersécurité", published_at: daysAgo(2) + "T09:00:00", is_bookmarked: false },
  { id: 3, title: "Next.js 15 : ce qui change pour les développeurs",          url: "#", source: "Dev.to",                summary: "Turbopack stable, Server Actions améliorés, nouvelles API de cache.",                                category: "Développement", published_at: daysAgo(3) + "T10:00:00", is_bookmarked: false },
  { id: 4, title: "Cloud souverain : où en est la France ?",                   url: "#", source: "Silicon.fr",            summary: "Bilan du programme Cloud au Centre et perspectives pour les administrations publiques.",               category: "Cloud",         published_at: daysAgo(4) + "T11:00:00", is_bookmarked: false },
  { id: 5, title: "DataOps : intégrer la qualité des données dès le pipeline", url: "#", source: "Towards Data Science",  summary: "Bonnes pratiques pour automatiser les contrôles qualité dans les pipelines de données.",               category: "Data",          published_at: daysAgo(5) + "T12:00:00", is_bookmarked: true  },
  { id: 6, title: "GitHub Copilot Workspace : l'IDE du futur ?",               url: "#", source: "GitHub Blog",           summary: "Retour d'expérience sur le nouveau workspace IA de GitHub pour la génération de code.",               category: "IA",            published_at: daysAgo(6) + "T08:00:00", is_bookmarked: false },
];
