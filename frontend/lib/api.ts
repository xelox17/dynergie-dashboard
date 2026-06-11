const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
export const getMissions = () => fetchApi<Mission[]>("/api/missions/");
export const getMission = (id: number) => fetchApi<Mission>(`/api/missions/${id}`);
export const createMission = (data: MissionCreate) =>
  fetchApi<Mission>("/api/missions/", { method: "POST", body: JSON.stringify(data) });
export const updateMission = (id: number, data: Partial<Mission>) =>
  fetchApi<Mission>(`/api/missions/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteMission = (id: number) =>
  fetchApi<void>(`/api/missions/${id}`, { method: "DELETE" });

// --- Tasks ---
export const getTasks = (missionId?: number) =>
  fetchApi<Task[]>(`/api/tasks/${missionId ? `?mission_id=${missionId}` : ""}`);
export const updateTask = (id: number, data: Partial<Task>) =>
  fetchApi<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const createTask = (data: TaskCreate) =>
  fetchApi<Task>("/api/tasks/", { method: "POST", body: JSON.stringify(data) });

// --- Time entries ---
export const getTimeEntries = (missionId?: number, consultant?: string) => {
  const params = new URLSearchParams();
  if (missionId) params.set("mission_id", String(missionId));
  if (consultant) params.set("consultant", consultant);
  return fetchApi<TimeEntry[]>(`/api/time-entries/?${params}`);
};
export const createTimeEntry = (data: TimeEntryCreate) =>
  fetchApi<TimeEntry>("/api/time-entries/", { method: "POST", body: JSON.stringify(data) });

// --- Watch ---
export const getArticles = (category?: string) =>
  fetchApi<WatchArticle[]>(`/api/watch/${category ? `?category=${category}` : ""}`);
export const updateArticle = (id: number, data: Partial<WatchArticle>) =>
  fetchApi<WatchArticle>(`/api/watch/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// ---- Types ----
export type MissionStatus = "in_progress" | "completed" | "on_hold" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "done";

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
