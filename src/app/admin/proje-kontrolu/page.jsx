"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Star,
    StarOff,
    ArrowRight,
    Search,
    Filter,
    Loader2,
} from "lucide-react";
import { getProjects, toggleFeatured } from "@/lib/actions/projects";

export default function ProjeKontroluPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error("Projects fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleToggleFeatured = async (project) => {
        setTogglingId(project.id);
        const newFeatured = !project.is_featured;

        // featured_order: Eğer öne çıkarılıyorsa en sona ekle
        let newOrder = null;
        if (newFeatured) {
            const maxOrder = projects
                .filter((p) => p.is_featured)
                .reduce((max, p) => Math.max(max, p.featured_order || 0), 0);
            newOrder = maxOrder + 1;
        }

        try {
            const result = await toggleFeatured(project.id, newFeatured, newOrder);
            if (!result.error) {
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === project.id
                            ? {
                                ...p,
                                is_featured: newFeatured,
                                featured_order: newOrder,
                            }
                            : p
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
        setTogglingId(null);
    };

    const featuredCount = projects.filter((p) => p.is_featured).length;
    const totalCount = projects.length;

    const summaryCards = [
        {
            label: "Toplam Proje",
            count: totalCount,
            icon: CheckCircle2,
            gradient: "from-blue-500 to-blue-600",
            glow: "shadow-blue-500/15",
        },
        {
            label: "Öne Çıkan",
            count: featuredCount,
            icon: Star,
            gradient: "from-amber-500 to-amber-600",
            glow: "shadow-amber-500/15",
        },
        {
            label: "Aktif",
            count: projects.filter((p) => p.status === "active").length,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-emerald-600",
            glow: "shadow-emerald-500/15",
        },
    ];

    return (
        <div>
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-black text-hmku-dark tracking-tight">
                    Proje Kontrolü
                </h1>
                <p className="mt-1 text-sm text-hmku-muted">
                    Projeleri yönetin, öne çıkan projeleri ayarlayın.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {summaryCards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div
                            key={c.label}
                            className="bg-white rounded-xl shadow-modern p-4 border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.glow}`}
                                >
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-hmku-dark">
                                        {c.count}
                                    </p>
                                    <p className="text-[10px] font-bold text-hmku-muted uppercase tracking-wider">
                                        {c.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Project list */}
            <div className="bg-white rounded-xl shadow-modern border border-slate-100">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-hmku-dark">
                        Projeler
                    </h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hmku-muted" />
                            <input
                                type="text"
                                placeholder="Proje ara..."
                                className="w-full sm:w-52 pl-9 pr-3 py-2 text-[12px] rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-hmku-primary focus:ring-1 focus:ring-hmku-primary/20 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-6 h-6 border-2 border-hmku-primary/30 border-t-hmku-primary rounded-full animate-spin" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-sm text-hmku-muted">
                            Henüz proje bulunmuyor.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Table header */}
                        <div className="hidden sm:grid grid-cols-[1fr_150px_100px_100px_100px] gap-4 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
                            <span className="text-[10px] font-black text-hmku-muted uppercase tracking-widest">
                                Proje Adı
                            </span>
                            <span className="text-[10px] font-black text-hmku-muted uppercase tracking-widest">
                                Kategori
                            </span>
                            <span className="text-[10px] font-black text-hmku-muted uppercase tracking-widest">
                                Durum
                            </span>
                            <span className="text-[10px] font-black text-hmku-muted uppercase tracking-widest text-center">
                                Sıra
                            </span>
                            <span className="text-[10px] font-black text-hmku-muted uppercase tracking-widest text-center">
                                Öne Çıkan
                            </span>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-50">
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex flex-col sm:grid sm:grid-cols-[1fr_150px_100px_100px_100px] gap-2 sm:gap-4 items-start sm:items-center p-4 md:p-5 hover:bg-slate-50/60 transition-colors"
                                >
                                    {/* Title */}
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-hmku-dark truncate">
                                            {p.title}
                                        </p>
                                        <p className="text-[11px] text-hmku-muted mt-0.5 truncate sm:hidden">
                                            {p.category} · {p.status}
                                        </p>
                                    </div>

                                    {/* Category */}
                                    <span className="hidden sm:inline-flex text-[11px] text-hmku-muted">
                                        {p.category || "-"}
                                    </span>

                                    {/* Status */}
                                    <span
                                        className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${p.status === "active"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {p.status === "active"
                                            ? "Aktif"
                                            : p.status}
                                    </span>

                                    {/* Featured Order */}
                                    <span className="hidden sm:flex justify-center text-[12px] font-bold text-hmku-dark">
                                        {p.is_featured
                                            ? p.featured_order || "-"
                                            : "-"}
                                    </span>

                                    {/* Featured Toggle */}
                                    <div className="flex sm:justify-center w-full sm:w-auto">
                                        <button
                                            onClick={() =>
                                                handleToggleFeatured(p)
                                            }
                                            disabled={togglingId === p.id}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${p.is_featured
                                                    ? "text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100"
                                                    : "text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100"
                                                }`}
                                        >
                                            {togglingId === p.id ? (
                                                <Loader2
                                                    className="w-3.5 h-3.5 animate-spin"
                                                />
                                            ) : p.is_featured ? (
                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                            ) : (
                                                <StarOff className="w-3.5 h-3.5" />
                                            )}
                                            {p.is_featured
                                                ? "Öne Çıkan"
                                                : "Öne Çıkar"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-slate-100">
                    <p className="text-[11px] text-hmku-muted">
                        Toplam{" "}
                        <span className="font-bold text-hmku-dark">
                            {totalCount}
                        </span>{" "}
                        proje
                    </p>
                </div>
            </div>
        </div>
    );
}
