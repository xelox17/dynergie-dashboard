import {
  MOCK_MISSIONS,
  MOCK_TASKS,
  MOCK_TIME_ENTRIES,
  MOCK_ARTICLES,
} from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Missions ---
export const getMissions = (): Promise<Mission[]> =>
  DEMO ? Promise.resolve(MOCK_MISSIONS) : fetchApi<Mission[]>("/api/missions/");
export const getMission = (id: number): Promise<Mission> =>
  DEMO
    ? Promise.resolve(MOCK_MISSIONS.find((m) => m.id === id) ?? MOCK_MISSIONS[0])
    : fetchApi<Mission>(`/api/missions/${id}`);
export const createMission = (data: MissionCreate): Promise<Mission> =>
  DEMO
    ? Promise.resolve({ id: Date.now(), ...data })
    : fetchApi<Mission>("/api/missions/", { method: "POST", body: JSON.stringify(data) });
export const updateMission = (id: number, data: Partial<Mission>): Promise<Mission> =>
  DEMO
    ? Promise.resolve({ ...(MOCK_MISSIONS.find((m) => m.id === id) ?? MOCK_MISSIONS[0]), ...data })
    : fetchApi<Mission>(`/api/missions/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteMission = (id: number): Promise<void> =>
  DEMO ? Promise.resolve() : fetchApi<void>(`/api/missions/${id}`, { method: "DELETE" });

// --- Tasks ---
export const getTasks = (missionId?: number): Promise<Task[]> => {
  if (DEMO) {
    const tasks = missionId ? MOCK_TASKS.filter((t) => t.mission_id === missionId) : MOCK_TASKS;
    return Promise.resolve(tasks);
  }
  return fetchApi<Task[]>(`/api/tasks/${missionId ? `?mission_id=${missionId}` : ""}`);
};
export const updateTask = (id: number, data: Partial<Task>): Promise<Task> =>
  DEMO
    ? Promise.resolve({ ...(MOCK_TASKS.find((t) => t.id === id) ?? MOCK_TASKS[0]), ...data })
    : fetchApi<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const createTask = (data: TaskCreate): Promise<Task> =>
  DEMO
    ? Promise.resolve({ id: Date.now(), ...data })
    : fetchApi<Task>("/api/tasks/", { method: "POST", body: JSON.stringify(data) });

// --- Time entries ---
export const getTimeEntries = (missionId?: number, consultant?: string): Promise<TimeEntry[]> => {
  if (DEMO) {
    let entries = MOCK_TIME_ENTRIES;
    if (missionId) entries = entries.filter((e) => e.mission_id === missionId);
    if (consultant) entries = entries.filter((e) => e.consultant === consultant);
    return Promise.resolve(entries);
  }
  const params = new URLSearchParams();
  if (missionId) params.set("mission_id", String(missionId));
  if (consultant) params.set("consultant", consultant);
  return fetchApi<TimeEntry[]>(`/api/time-entries/?${params}`);
};
export const createTimeEntry = (data: TimeEntryCreate): Promise<TimeEntry> =>
  DEMO
    ? Promise.resolve({ id: Date.now(), ...data })
    : fetchApi<TimeEntry>("/api/time-entries/", { method: "POST", body: JSON.stringify(data) });

// --- Watch ---
export const getArticles = (category?: string): Promise<WatchArticle[]> => {
  if (DEMO) {
    const articles = category
      ? MOCK_ARTICLES.filter((a) => a.category === category)
      : MOCK_ARTICLES;
    return Promise.resolve(articles);
  }
  return fetchApi<WatchArticle[]>(`/api/watch/${category ? `?category=${category}` : ""}`);
};
export const updateArticle = (id: number, data: Partial<WatchArticle>): Promise<WatchArticle> =>
  DEMO
    ? Promise.resolve({ ...(MOCK_ARTICLES.find((a) => a.id === id) ?? MOCK_ARTICLES[0]), ...data })
    : fetchApi<WatchArticle>(`/api/watch/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// ---- Types ----
export type MissionStatus = "in_progress" | "completed" | "on_hold" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";

export interface Mission {
  id: number;
  title: string;
  client: string;
  consultant: string;
  status: MissionStatus;
  start_date: string;
  deadline: string;
  description?: string;
}

export type MissionCreate = Omit<Mission, "id">;

export interface Task {
  id: number;
  mission_id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  priority: number;
}

export type TaskCreate = Omit<Task, "id">;

export interface TimeEntry {
  id: number;
  mission_id: number;
  consultant: string;
  date: string;
  hours: number;
  description?: string;
}

export type TimeEntryCreate = Omit<TimeEntry, "id">;

export interface WatchArticle {
  id: number;
  title: string;
  url: string;
  source?: string;
  summary?: string;
  category?: string;
  published_at?: string;
  is_bookmarked: boolean;
}
