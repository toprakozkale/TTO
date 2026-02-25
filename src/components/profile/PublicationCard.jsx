"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Sparkles,
    BookOpen,
    Unlock,
    Lock,
    Quote,
} from "lucide-react";

const INDEX_BADGES = {
    WoS: { label: "WoS", className: "bg-sky-100 text-sky-700 border-sky-200" },
    Scopus: { label: "Scopus", className: "bg-orange-100 text-orange-700 border-orange-200" },
    DOAJ: { label: "DOAJ", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    TR_Dizin: { label: "TR Dizin", className: "bg-violet-100 text-violet-700 border-violet-200" },
    PubMed: { label: "PubMed", className: "bg-teal-100 text-teal-700 border-teal-200" },
};

export default function PublicationCard({ publication, highlightAuthor }) {
    const [expanded, setExpanded] = useState(false);

    const {
        title = "Başlıksız Yayın",
        authors = [],
        year,
        journal,
        doi,
        url,
        tldr,
        citationCount = 0,
        isOpenAccess = false,
        indexes = [],
        type = "Makale",
    } = publication;

    return (
        <article className="group relative bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl shadow-[0_2px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Üst aksan çizgisi */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-hmku-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="p-4 sm:p-5">
                {/* Üst meta satırı */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Yayın türü */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-hmku-muted rounded-full border border-slate-200/60">
                        <BookOpen className="w-3 h-3" />
                        {type}
                    </span>
                    {/* Yıl */}
                    {year && (
                        <span className="text-[11px] font-semibold text-hmku-muted">{year}</span>
                    )}
                    {/* Açık Erişim rozeti */}
                    {isOpenAccess ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200/60">
                            <Unlock className="w-3 h-3" />
                            Açık Erişim
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-slate-50 text-slate-500 rounded-full border border-slate-200/60">
                            <Lock className="w-3 h-3" />
                            Kapalı Erişim
                        </span>
                    )}
                    {/* Atıf sayısı */}
                    {citationCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-full border border-amber-200/60">
                            <Quote className="w-3 h-3" />
                            {citationCount} Atıf
                        </span>
                    )}
                </div>

                {/* Başlık */}
                <h3 className="text-sm sm:text-base font-bold text-hmku-dark leading-snug group-hover:text-hmku-primary transition-colors duration-200 line-clamp-3">
                    {title}
                </h3>

                {/* Yazarlar */}
                {authors.length > 0 && (
                    <p className="mt-2 text-xs text-hmku-muted leading-relaxed line-clamp-2">
                        {authors.map((author, idx) => {
                            const isHighlighted =
                                highlightAuthor &&
                                author.toLowerCase().includes(highlightAuthor.toLowerCase());
                            return (
                                <span key={idx}>
                                    <span
                                        className={
                                            isHighlighted
                                                ? "font-bold text-hmku-dark"
                                                : ""
                                        }
                                    >
                                        {author}
                                    </span>
                                    {idx < authors.length - 1 && ", "}
                                </span>
                            );
                        })}
                    </p>
                )}

                {/* Dergi */}
                {journal && (
                    <p className="mt-1.5 text-[11px] text-hmku-muted italic">{journal}</p>
                )}

                {/* ─── AI TLDR Accordion ─── */}
                {tldr && (
                    <div className="mt-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-2 w-full text-left min-h-[36px] px-3 py-2 rounded-xl bg-gradient-to-r from-violet-50/80 to-purple-50/80 border border-violet-100/80 hover:from-violet-100/80 hover:to-purple-100/80 transition-all duration-200 group/btn"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="text-[11px] font-semibold text-violet-600 flex-1">
                                AI Özeti (TLDR)
                            </span>
                            {expanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                            )}
                        </button>

                        {expanded && (
                            <div className="mt-2 px-3 py-2.5 rounded-xl bg-violet-50/60 border border-violet-100/60">
                                <p className="text-xs text-violet-800/80 leading-relaxed italic">
                                    &ldquo;{tldr}&rdquo;
                                </p>
                                <p className="mt-1.5 text-[10px] text-violet-500/70 font-semibold">
                                    — Semantic Scholar AI Özeti
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Alt Çubuk ─── */}
                <div className="mt-4 pt-3 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* İndeks rozetleri */}
                    <div className="flex flex-wrap gap-1.5 overflow-x-auto hide-scrollbar">
                        {indexes.map((idx) => {
                            const badge = INDEX_BADGES[idx] || {
                                label: idx,
                                className: "bg-slate-100 text-slate-600 border-slate-200",
                            };
                            return (
                                <span
                                    key={idx}
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded border ${badge.className} flex-shrink-0`}
                                >
                                    {badge.label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Dış bağlantılar */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {doi && (
                            <a
                                href={`https://doi.org/${doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-hmku-primary bg-rose-50/80 border border-rose-200/60 rounded-lg hover:bg-hmku-primary hover:text-white hover:border-hmku-primary transition-all duration-200"
                            >
                                DOI
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        {url && !doi && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-sky-600 bg-sky-50/80 border border-sky-200/60 rounded-lg hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-200"
                            >
                                Kaynak
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
