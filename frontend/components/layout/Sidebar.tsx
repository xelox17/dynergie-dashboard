"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  CheckSquare,
  Rss,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/missions", label: "Missions", icon: Briefcase },
  { href: "/time-tracking", label: "Suivi du temps", icon: Clock },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/watch", label: "Veille", icon: Rss },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-none">Dynergie</p>
          <p className="text-xs text-gray-500 mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={16}
                  className={isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}
                />
                {label}
              </div>
              {isActive && <ChevronRight size={14} className="text-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-xs">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Anas Mehri</p>
            <p className="text-xs text-gray-500 truncate">Consultant</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
