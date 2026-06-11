"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getTimeEntries, getMissions, createTimeEntry, TimeEntry, Mission } from "@/lib/api";
import { Clock, Plus, TrendingUp, Calendar, X } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const CHART_COLORS = ["#a277ff", "#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function getWeekDates(offset = 0): Date[] {
  const now    = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDay(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// ─── Add Entry Modal ──────────────────────────────────────────────────────────

function AddEntryModal({
  missions,
  onClose,
  onSave,
}: {
  missions: Mission[];
  onClose: () => void;
  onSave: (e: TimeEntry) => void;
}) {
  const today = toISO(new Date());
  const [form, setForm] = useState({
    mission_id: missions[0]?.id ?? 0,
    consultant: "Anas Mehri",
    date:       today,
    hours:      "7.5",
    description:"",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const entry = await createTimeEntry({
      ...form,
      mission_id: Number(form.mission_id),
      hours:      parseFloat(form.hours),
    });
    onSave(entry);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Nouvelle saisie</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mission *</label>
            <select className="input" value={form.mission_id} onChange={e => setForm(f => ({ ...f, mission_id: Number(e.target.value) }))}>
              {missions.map(m => <option key={m.id} value={m.id}>{m.client} — {m.title.slice(0, 30)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date *</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Heures *</label>
              <input type="number" step="0.5" min="0.5" max="24" className="input" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Consultant</label>
            <input className="input" value={form.consultant} onChange={e => setForm(f => ({ ...f, consultant: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Activité réalisée…" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">Annuler</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 text-sm rounded-lg bg-brand-400 hover:bg-brand-500 text-white font-medium transition-colors disabled:opacity-50">
              {saving ? "Enregistrement…" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimeTrackingPage() {
  const [entries,    setEntries]    = useState<TimeEntry[]>([]);
  const [missions,   setMissions]   = useState<Mission[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal,  setShowModal]  = useState(false);

  const weekDates = getWeekDates(weekOffset);

  const load = useCallback(async () => {
    const [e, m] = await Promise.all([getTimeEntries(), getMissions()]);
    setEntries(e);
    setMissions(m);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Stats ──
  const totalWeek = entries
    .filter(e => weekDates.some(d => toISO(d) === e.date))
    .reduce((s, e) => s + e.hours, 0);

  const totalMonth = entries
    .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, e) => s + e.hours, 0);

  // ── Bar chart data (hours per day this week) ──
  const barData = weekDates.map((d, i) => ({
    day:   DAYS_FR[i],
    hours: entries.filter(e => e.date === toISO(d)).reduce((s, e) => s + e.hours, 0),
  }));

  // ── Pie chart data (hours per mission) ──
  const pieData = missions
    .map(m => ({
      name:  m.client,
      value: entries.filter(e => e.mission_id === m.id).reduce((s, e) => s + e.hours, 0),
    }))
    .filter(d => d.value > 0);

  // ── Week entries table ──
  const weekEntries = entries
    .filter(e => weekDates.some(d => toISO(d) === e.date))
    .sort((a, b) => b.date.localeCompare(a.date));

  const missionName = (id: number) =>
    missions.find(m => m.id === id)?.client ?? `Mission #${id}`;

  if (loading) {
    return <div className="card p-8 animate-pulse bg-gray-800/50 h-96" />;
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Cette semaine",  value: `${totalWeek}h`,                     icon: Clock,       color: "text-brand-400",   bg: "bg-brand-400/10",   border: "border-brand-400/20" },
          { label: "Ce mois",        value: `${totalMonth}h`,                    icon: Calendar,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Moy. / jour",    value: `${(totalWeek / 5).toFixed(1)}h`,    icon: TrendingUp,  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className="card p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${bg} border ${border}`}><Icon size={20} className={color} /></div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Heures par jour</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-400 transition-colors">←</button>
              <span className="text-xs text-gray-400 w-32 text-center">
                {formatDay(weekDates[0])} – {formatDay(weekDates[6])}
              </span>
              <button onClick={() => setWeekOffset(w => w + 1)} disabled={weekOffset >= 0} className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-400 transition-colors disabled:opacity-30">→</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(v) => [`${v}h`, "Heures"]}
              />
              <Bar dataKey="hours" fill="#a277ff" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Répartition par mission</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}h`]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-600 text-center py-12">Aucune donnée</p>
          )}
        </div>
      </div>

      {/* Entries table */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Saisies — semaine en cours</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-400 hover:bg-brand-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="overflow-x-auto">
          {weekEntries.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-10">Aucune saisie cette semaine.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Mission</th>
                  <th className="text-left px-5 py-3">Consultant</th>
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-right px-5 py-3">Heures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {weekEntries.map(e => (
                  <tr key={e.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(e.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-brand-400/10 text-brand-400 border border-brand-400/20">
                        {missionName(e.mission_id)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{e.consultant}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{e.description ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-white">{e.hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <AddEntryModal
          missions={missions}
          onClose={() => setShowModal(false)}
          onSave={e => { setEntries(prev => [e, ...prev]); setShowModal(false); }}
        />
      )}
    </div>
  );
}
