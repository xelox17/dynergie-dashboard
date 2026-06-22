"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, X, AlertTriangle, Briefcase, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/":              { title: "Tableau de bord",       subtitle: "Vue d'ensemble de l'activité" },
  "/missions":      { title: "Missions",               subtitle: "Gestion des missions en cours" },
  "/time-tracking": { title: "Suivi du temps",         subtitle: "Saisie et visualisation des heures" },
  "/tasks":         { title: "Tâches",                 subtitle: "Kanban par mission" },
  "/watch":         { title: "Veille technologique",   subtitle: "Articles et tendances innovation" },
};

const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", title: "Deadline dans 39 jours", body: "Audit Innovation — Airbus", read: false },
  { id: 2, icon: Briefcase,     color: "text-brand-400", bg: "bg-brand-400/10",  border: "border-brand-400/20",  title: "Nouvelle mission assignée", body: "Dossier CIR 2026 — Groupe Safran", read: false },
  { id: 3, icon: FileText,      color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", title: "Rapport hebdomadaire disponible", body: "Semaine du 16 juin 2026", read: false },
  { id: 4, icon: AlertTriangle, color: "text-red-400",   bg: "bg-red-500/10",    border: "border-red-500/20",    title: "Tâche en révision en attente", body: "Pitch deck Série A — Startup Deeptech", read: true  },
];

export default function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Dynergie", subtitle: "" };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs]         = useState(NOTIFICATIONS);
  const notifRef                    = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function dismiss(id: number) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <header className="h-16 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold text-white">{page.title}</h1>
        <p className="text-xs text-gray-500 capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Rechercher…"
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 w-48"
          />
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(v => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            <Bell size={15} className="text-gray-400" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Tout marquer lu
                  </button>
                )}
              </div>

              {notifs.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-8">Aucune notification</p>
              ) : (
                <div className="divide-y divide-gray-800/60 max-h-72 overflow-y-auto">
                  {notifs.map(({ id, icon: Icon, color, bg, border, title, body, read }) => (
                    <div key={id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-800/40 transition-colors ${read ? "opacity-60" : ""}`}>
                      <div className={`mt-0.5 w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${bg} border ${border}`}>
                        <Icon size={13} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-200 leading-snug">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{body}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!read && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                        <button onClick={() => dismiss(id)} className="p-0.5 text-gray-600 hover:text-gray-400 transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
