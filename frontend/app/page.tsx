import { Briefcase, Clock, CheckSquare, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const kpis = [
  { label: "Missions actives",    value: "3",     delta: "+1 ce mois",       positive: true,  icon: Briefcase,   color: "text-brand-400",   bg: "bg-brand-400/10",   border: "border-brand-400/20",   href: "/missions" },
  { label: "Heures cette semaine", value: "37.5h", delta: "5 jours travaillés", positive: true,  icon: Clock,       color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", href: "/time-tracking" },
  { label: "Tâches en cours",     value: "4",     delta: "2 haute priorité", positive: false, icon: CheckSquare, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   href: "/tasks" },
  { label: "Articles de veille",  value: "6",     delta: "3 nouveaux",       positive: true,  icon: TrendingUp,  color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  href: "/watch" },
];

const recentMissions = [
  { id: 3, title: "Accompagnement levée de fonds Série A",   client: "Startup Deeptech",  status: "in_progress", deadline: "2026-10-31", progress: 40 },
  { id: 1, title: "Dossier CIR 2026 — Financement R&D",      client: "Groupe Safran",     status: "in_progress", deadline: "2026-09-30", progress: 55 },
  { id: 2, title: "Audit Innovation & Veille Technologique", client: "Airbus",            status: "in_progress", deadline: "2026-07-31", progress: 30 },
];

const upcomingDeadlines = [
  { mission: "Audit Innovation",    client: "Airbus",           days: 39  },
  { mission: "Dossier CIR 2026",   client: "Groupe Safran",    days: 100 },
  { mission: "Levée de fonds",      client: "Startup Deeptech", days: 131 },
];

const statusLabel: Record<string, string> = {
  in_progress: "En cours", completed: "Terminée", on_hold: "En pause", cancelled: "Annulée",
};
const statusClass: Record<string, string> = {
  in_progress: "badge-in-progress", completed: "badge-completed", on_hold: "badge-on-hold", cancelled: "badge-cancelled",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="card p-5 flex items-center justify-between bg-gradient-to-r from-brand-400/10 to-brand-600/10 border-brand-400/20">
        <div>
          <h2 className="text-lg font-semibold text-white">Bonjour, Anas</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Vous avez <span className="text-brand-400 font-medium">3 missions actives</span> et{" "}
            <span className="text-amber-400 font-medium">4 tâches en attente</span> aujourd&apos;hui.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Système opérationnel
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, positive, icon: Icon, color, bg, border, href }) => (
          <Link key={label} href={href} className="card p-4 hover:border-gray-700 transition-colors group">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${bg} border ${border}`}>
                <Icon size={18} className={color} />
              </div>
              <ArrowUpRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
            <p className={`text-xs mt-2 ${positive ? "text-emerald-400" : "text-amber-400"}`}>{delta}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missions */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Mes missions</h3>
            <Link href="/missions" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Voir tout →</Link>
          </div>
          <div className="space-y-3">
            {recentMissions.map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.client}</p>
                  </div>
                  <span className={statusClass[m.status]}>{statusLabel[m.status]}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Avancement</span>
                    <span className="text-xs text-gray-400">{m.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Prochaines échéances</h3>
            <AlertCircle size={14} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/40">
                <div className={`flex-shrink-0 text-center min-w-[40px] px-2 py-1 rounded-md ${
                  d.days <= 14 ? "bg-red-500/10 border border-red-500/20"
                  : d.days <= 30 ? "bg-amber-500/10 border border-amber-500/20"
                  : "bg-gray-700/50 border border-gray-600/30"
                }`}>
                  <p className={`text-lg font-bold leading-none ${
                    d.days <= 14 ? "text-red-400" : d.days <= 30 ? "text-amber-400" : "text-gray-300"
                  }`}>{d.days}</p>
                  <p className="text-xs text-gray-500">j.</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-300 leading-tight">{d.mission}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
