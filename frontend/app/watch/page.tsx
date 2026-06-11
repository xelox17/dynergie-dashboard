"use client";

import { useState, useEffect, useCallback } from "react";
import { getArticles, updateArticle, WatchArticle } from "@/lib/api";
import { Bookmark, BookmarkCheck, Sparkles, ExternalLink, Tag, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CATEGORIES = ["Tout", "IA", "Cybersécurité", "Développement", "Cloud", "Data"];

const CATEGORY_COLORS: Record<string, string> = {
  IA:             "bg-brand-400/10 text-brand-400 border-brand-400/20",
  Cybersécurité:  "bg-red-500/10 text-red-400 border-red-500/20",
  Développement:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cloud:          "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Data:           "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

// ─── Article card ─────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  onBookmark,
}: {
  article: WatchArticle;
  onBookmark: (id: number, val: boolean) => void;
}) {
  const [summary,      setSummary]      = useState<string | null>(null);
  const [loadingSumm,  setLoadingSumm]  = useState(false);
  const [showSummary,  setShowSummary]  = useState(false);

  async function handleSummarize() {
    if (summary) { setShowSummary(s => !s); return; }
    setLoadingSumm(true);
    try {
      const res = await fetch(`${API_BASE}/api/watch/${article.id}/summarize`, { method: "POST" });
      const data = await res.json();
      setSummary(data.summary);
      setShowSummary(true);
    } catch {
      setSummary("Erreur lors de la génération du résumé.");
      setShowSummary(true);
    } finally {
      setLoadingSumm(false);
    }
  }

  const catClass = CATEGORY_COLORS[article.category ?? ""] ?? "bg-gray-700/50 text-gray-400 border-gray-600/50";
  const pubDate  = article.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    : "";

  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {article.category && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${catClass}`}>
                <Tag size={10} />
                {article.category}
              </span>
            )}
            {article.source && (
              <span className="text-xs text-gray-600">{article.source}</span>
            )}
            {pubDate && (
              <span className="text-xs text-gray-700">· {pubDate}</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-200 leading-snug">{article.title}</h3>
        </div>
        <button
          onClick={() => onBookmark(article.id, !article.is_bookmarked)}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            article.is_bookmarked
              ? "text-brand-400 bg-brand-400/10"
              : "text-gray-600 hover:text-brand-400 hover:bg-brand-400/10"
          }`}
        >
          {article.is_bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      {/* Excerpt */}
      {article.summary && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>
      )}

      {/* AI Summary */}
      {showSummary && summary && (
        <div className="bg-brand-400/5 border border-brand-400/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-brand-400" />
            <span className="text-xs font-semibold text-brand-400">Résumé IA</span>
          </div>
          <div className="text-xs text-gray-400 space-y-1 whitespace-pre-line">{summary}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ExternalLink size={12} /> Lire l&apos;article
        </a>
        <span className="text-gray-700 mx-1">·</span>
        <button
          onClick={handleSummarize}
          disabled={loadingSumm}
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
        >
          {loadingSumm
            ? <><Loader2 size={12} className="animate-spin" /> Génération…</>
            : <><Sparkles size={12} /> {showSummary ? "Masquer le résumé" : "Résumer avec IA"}</>
          }
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WatchPage() {
  const [articles,  setArticles]  = useState<WatchArticle[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState("Tout");
  const [bookmarks, setBookmarks] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleBookmark(id: number, val: boolean) {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, is_bookmarked: val } : a));
    await updateArticle(id, { is_bookmarked: val });
  }

  const filtered = articles
    .filter(a => category === "Tout" || a.category === category)
    .filter(a => !bookmarks || a.is_bookmarked);

  const bookmarkCount = articles.filter(a => a.is_bookmarked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-400">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setBookmarks(b => !b)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            bookmarks
              ? "bg-brand-400/15 text-brand-400 border-brand-400/30"
              : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600"
          }`}
        >
          <Bookmark size={12} />
          Bookmarks ({bookmarkCount})
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              category === cat
                ? cat === "Tout"
                  ? "bg-brand-400/15 text-brand-400 border-brand-400/30"
                  : `${CATEGORY_COLORS[cat] ?? ""} border`
                : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-48 animate-pulse bg-gray-800/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Tag size={24} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun article dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(a => (
            <ArticleCard key={a.id} article={a} onBookmark={handleBookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
