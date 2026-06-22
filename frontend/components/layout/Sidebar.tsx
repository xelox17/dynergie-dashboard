"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  CheckSquare,
  Rss,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/",              label: "Tableau de bord",  icon: LayoutDashboard },
  { href: "/missions",      label: "Missions",          icon: Briefcase },
  { href: "/time-tracking", label: "Suivi du temps",    icon: Clock },
  { href: "/tasks",         label: "Tâches",            icon: CheckSquare },
  { href: "/watch",         label: "Veille",            icon: Rss },
];

function DynergieLogo() {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "#c5f135" }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="4.5" cy="3.5" r="2" fill="#1a3d2b" />
        <rect x="3" y="7" width="3" height="9" rx="1.5" fill="#1a3d2b" />
        <path d="M10 3 L10 16 C10 16 18.5 16 18.5 9.5 C18.5 3 12 3 10 3 Z" fill="#1a3d2b" />
        <path d="M10 16 Q15 16 16.5 19.5" stroke="#1a3d2b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
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
              onClick={onClose}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-brand-400/10 text-brand-400 border border-brand-400/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-300"} />
                {label}
              </div>
              {isActive && <ChevronRight size={14} className="text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-xs">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Anas Mehri</p>
            <p className="text-xs text-gray-500 truncate">Consultant</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <DynergieLogo />
            <div>
              <p className="font-semibold text-white text-sm leading-none">dynergie</p>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-500 hover:text-gray-300">
            <X size={18} />
          </button>
        </div>
        <NavContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <DynergieLogo />
          <div>
            <p className="font-semibold text-white text-sm leading-none">dynergie</p>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard</p>
          </div>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
