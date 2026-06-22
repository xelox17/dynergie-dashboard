import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center">
          <span className="text-4xl font-black text-brand-400">?</span>
        </div>

        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">
          Erreur 404
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">Page introuvable</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Cette page n&apos;existe pas ou a été déplacée.<br />
          Revenez au tableau de bord pour reprendre votre activité.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-400 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <LayoutDashboard size={16} />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
