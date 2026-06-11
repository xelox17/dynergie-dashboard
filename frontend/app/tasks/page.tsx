"use client";

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { getTasks, getMissions, updateTask, createTask, Task, TaskStatus, Mission } from "@/lib/api";
import { Plus, GripVertical, X, AlertCircle, Clock, Minus } from "lucide-react";

// ─── Types & Helpers ─────────────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo",        label: "À faire",    color: "text-gray-400" },
  { id: "in_progress", label: "En cours",   color: "text-brand-400" },
  { id: "in_review",   label: "En révision",color: "text-indigo-400" },
  { id: "done",        label: "Terminée",   color: "text-emerald-400" },
];

const PRIORITY_LABELS = ["", "Haute", "Moyenne", "Basse"] as const;
const PRIORITY_CLASSES = ["", "badge-high", "badge-medium", "badge-low"] as const;
const PRIORITY_ICONS   = [null, AlertCircle, Minus, Clock] as const;

// ─── Task Card ───────────────────────────────────────────────────────────────

function TaskCard({
  task,
  index,
  missions,
}: {
  task: Task;
  index: number;
  missions: Mission[];
}) {
  const mission     = missions.find(m => m.id === task.mission_id);
  const PriorityIcon = PRIORITY_ICONS[task.priority] ?? Minus;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gray-800 border rounded-lg p-3 select-none transition-shadow ${
            snapshot.isDragging
              ? "border-brand-400/50 shadow-lg shadow-brand-400/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="flex items-start gap-2">
            {/* Drag handle */}
            <div {...provided.dragHandleProps} className="mt-0.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing">
              <GripVertical size={14} />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <p className={`text-sm font-medium leading-snug ${task.status === "done" ? "line-through text-gray-500" : "text-gray-200"}`}>
                {task.title}
              </p>

              {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                <span className={PRIORITY_CLASSES[task.priority]}>
                  <PriorityIcon size={10} className="mr-1" />
                  {PRIORITY_LABELS[task.priority]}
                </span>

                {mission && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700/50 text-gray-400 border border-gray-600/50 truncate max-w-[120px]">
                    {mission.client}
                  </span>
                )}
              </div>

              {task.assignee && (
                <p className="text-xs text-gray-600">{task.assignee}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ─── Add task mini form ───────────────────────────────────────────────────────

function AddTaskForm({
  status,
  missions,
  onAdd,
  onClose,
}: {
  status: TaskStatus;
  missions: Mission[];
  onAdd: (task: Task) => void;
  onClose: () => void;
}) {
  const [title,     setTitle]     = useState("");
  const [missionId, setMissionId] = useState(missions[0]?.id ?? 0);
  const [priority,  setPriority]  = useState(2);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const task = await createTask({
      title: title.trim(),
      mission_id: missionId,
      status,
      priority,
      assignee: "Anas Mehri",
    });
    onAdd(task);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-brand-400/30 rounded-lg p-3 space-y-2">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre de la tâche…"
        className="input text-xs"
      />
      <div className="grid grid-cols-2 gap-2">
        <select className="input text-xs" value={missionId} onChange={e => setMissionId(Number(e.target.value))}>
          {missions.map(m => <option key={m.id} value={m.id}>{m.client}</option>)}
        </select>
        <select className="input text-xs" value={priority} onChange={e => setPriority(Number(e.target.value))}>
          <option value={1}>Haute</option>
          <option value={2}>Moyenne</option>
          <option value={3}>Basse</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 py-1 text-xs bg-brand-400 hover:bg-brand-500 text-white rounded transition-colors">Ajouter</button>
        <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300"><X size={14} /></button>
      </div>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks,    setTasks]    = useState<Task[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [missionFilter, setMissionFilter] = useState<number | "all">("all");
  const [addingIn, setAddingIn] = useState<TaskStatus | null>(null);

  const load = useCallback(async () => {
    const [t, m] = await Promise.all([getTasks(), getMissions()]);
    setTasks(t);
    setMissions(m);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const displayedTasks = missionFilter === "all"
    ? tasks
    : tasks.filter(t => t.mission_id === missionFilter);

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as TaskStatus;
    const taskId    = Number(result.draggableId);
    if (result.source.droppableId === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      load(); // rollback
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 h-full">
        {COLUMNS.map(c => (
          <div key={c.id} className="card p-4 animate-pulse bg-gray-800/50" style={{ minHeight: 400 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setMissionFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            missionFilter === "all"
              ? "bg-brand-400/15 text-brand-400 border-brand-400/30"
              : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600"
          }`}
        >
          Toutes les missions
        </button>
        {missions.filter(m => m.status === "in_progress").map(m => (
          <button
            key={m.id}
            onClick={() => setMissionFilter(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors truncate max-w-[160px] ${
              missionFilter === m.id
                ? "bg-brand-400/15 text-brand-400 border-brand-400/30"
                : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {m.client}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
          {COLUMNS.map(col => {
            const colTasks = displayedTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-3">
                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-500 flex items-center justify-center">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddingIn(addingIn === col.id ? null : col.id)}
                    className="p-1 rounded text-gray-600 hover:text-brand-400 hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add task form */}
                {addingIn === col.id && (
                  <AddTaskForm
                    status={col.id}
                    missions={missions}
                    onAdd={t => setTasks(prev => [t, ...prev])}
                    onClose={() => setAddingIn(null)}
                  />
                )}

                {/* Droppable zone */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 flex flex-col gap-2 rounded-xl p-2 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-brand-400/5 border border-brand-400/20"
                          : "bg-gray-900/30 border border-gray-800/50"
                      }`}
                    >
                      {colTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          missions={missions}
                        />
                      ))}
                      {provided.placeholder}
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-xs text-gray-700 text-center py-6">Glissez ici</p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
