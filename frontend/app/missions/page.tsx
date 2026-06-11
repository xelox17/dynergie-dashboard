"use client";

import { useState, useEffect, useCallback } from "react";
import { getMissions, createMission, updateMission, deleteMission, Mission, MissionStatus } from "@/lib/api";
import { Plus, Search, Filter, Calendar, User, Briefcase, Trash2, Edit2, X } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<MissionStatus, string> = {
  in_progress: "En cours",
  completed:   "Terminée",
  on_hold:     "En pause",
  cancelled:   "Annulée",
};

const STATUS_CLASSES: Record<MissionStatus, string> = {
  in_progress: "badge-in-progress",
  completed:   "badge-completed",
  on_hold:     "badge-on-hold",
  cancelled:   "badge-cancelled",
};

const PROGRESS: Record<MissionStatus, number> = {
  in_progress: 50,
  in_review:   75,
  completed:   100,
  on_hold:     30,
  cancelled:   0,
} as unknown as Record<MissionStatus, number>;

function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Create / Edit modal ────────────────────────────────────────────────────

interface ModalProps {
  onClose: () => void;
  onSave: (mission: Mission) => void;
  initial?: Mission;
}

function MissionModal({ onClose, onSave, initial }: ModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    title:       initial?.title       ?? "",
    client:      initial?.client      ?? "",
    consultant:  initial?.consultant  ?? "",
    status:      initial?.status      ?? "in_progress" as MissionStatus,
    start_date:  initial?.start_date  ?? today,
    deadline:    initial?.deadline    ?? "",
    description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.client || !form.consultant || !form.deadline) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const result = initial
        ? await updateMission(initial.id, form)
        : await createMission(form);
      onSave(result);
    } catch {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">
            {initial ? "Modifier la mission" : "Nouvelle mission"}
          </h2>
          <button onClick={onClose} className="p-1 rounded text-gray-500 hover:text-gray-300">
            <X size={18} />
          </button>
        </div>

        {error && (
          <p className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Titre *">
            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nom de la mission" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client *">
              <input className="input" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Nom du client" />
            </Field>
            <Field label="Consultant *">
              <input className="input" value={form.consultant} onChange={e => setForm(f => ({ ...f, consultant: e.target.value }))} placeholder="Prénom Nom" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date de début *">
              <input type="date" className="input" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
            </Field>
            <Field label="Échéance *">
              <input type="date" className="input" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </Field>
          </div>
          <Field label="Statut">
            <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as MissionStatus }))}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea className="input resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Contexte, objectifs…" />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 text-sm rounded-lg bg-brand-400 hover:bg-brand-500 text-white font-medium transition-colors disabled:opacity-50">
              {saving ? "Enregistrement…" : initial ? "Enregistrer" : "Créer la mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

// ─── Mission card ────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  onEdit,
  onDelete,
}: {
  mission: Mission;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const days    = daysLeft(mission.deadline);
  const progress = PROGRESS[mission.status] ?? 50;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-snug">{mission.title}</p>
          <p className="text-xs text-gray-500 mt-1">{mission.client}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}   className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-brand-400 transition-colors"><Edit2 size={14} /></button>
          <button onClick={onDelete} className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><User size={11} />{mission.consultant}</span>
        <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(mission.deadline)}</span>
        <span className={`flex items-center gap-1 ${days < 14 ? "text-red-400" : days < 30 ? "text-amber-400" : ""}`}>
          <Briefcase size={11} />{days > 0 ? `${days} j. restants` : "Échéance dépassée"}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Avancement</span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-800">
        <span className={STATUS_CLASSES[mission.status]}>{STATUS_LABELS[mission.status]}</span>
        <span className="text-xs text-gray-600">Depuis {formatDate(mission.start_date)}</span>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MissionsPage() {
  const [missions, setMissions]         = useState<Mission[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "">("");
  const [showModal, setShowModal]       = useState(false);
  const [editing, setEditing]           = useState<Mission | undefined>();

  const load = useCallback(() => {
    setLoading(true);
    getMissions()
      .then(setMissions)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = missions.filter(m => {
    const matchSearch = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.client.toLowerCase().includes(search.toLowerCase()) ||
      m.consultant.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette mission ?")) return;
    await deleteMission(id);
    setMissions(prev => prev.filter(m => m.id !== id));
  }

  function handleSaved(m: Mission) {
    setMissions(prev => {
      const idx = prev.findIndex(x => x.id === m.id);
      return idx >= 0 ? prev.map(x => x.id === m.id ? m : x) : [m, ...prev];
    });
    setShowModal(false);
    setEditing(undefined);
  }

  const counts: Record<string, number> = missions.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">
            {filtered.length} mission{filtered.length > 1 ? "s" : ""}
            {statusFilter ? ` · ${STATUS_LABELS[statusFilter]}` : ""}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Cliquez sur une carte pour voir le détail</p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-400 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Nouvelle mission
        </button>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {(["", "in_progress", "on_hold", "completed", "cancelled"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-brand-400/15 text-brand-400 border-brand-400/30"
                : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {s ? `${STATUS_LABELS[s]} (${counts[s] ?? 0})` : `Toutes (${missions.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par titre, client, consultant…"
          className="input pl-9 w-full"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-52 animate-pulse bg-gray-800/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Filter size={24} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune mission ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(m => (
            <MissionCard
              key={m.id}
              mission={m}
              onEdit={() => { setEditing(m); setShowModal(true); }}
              onDelete={() => handleDelete(m.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <MissionModal
          initial={editing}
          onClose={() => { setShowModal(false); setEditing(undefined); }}
          onSave={handleSaved}
        />
      )}
    </div>
  );
}
