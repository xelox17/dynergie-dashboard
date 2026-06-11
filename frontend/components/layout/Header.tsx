"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Tableau de bord", subtitle: "Vue d'ensemble de l'activité" },
  "/missions": { title: "Missions", subtitle: "Gestion des missions en cours" },
  "/time-tracking": { title: "Suivi du temps", subtitle: "Saisie et visualisation des heures" },
  "/tasks": { title: "Tâches", subtitle: "To-do list par mission" },
  "/watch": { title: "Veille technologique", subtitle: "Articles et tendances innovation" },
};

export default function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Dynergie", subtitle: "" };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-16 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold text-white">{page.title}</h1>
        <p className="text-xs text-gray-500 capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Rechercher…"
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-48"
          />
        </div>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors">
          <Bell size={15} className="text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}
