"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    Globe,
    Clock,
    XCircle,
    ArrowRight,
    CalendarDays,
    Users,
    ExternalLink,
} from "lucide-react";

const myProjects = [
    {
        id: 1,
        title: "Yapay Zeka Destekli Erken Uyarı Sistemi",
        category: "Yapay Zeka",
        status: "Yayında",
        statusColor: "bg-emerald-100 text-emerald-700",
        date: "15 Ocak 2025",
        team: 4,
        description:
            "Makine öğrenmesi algoritmaları kullanarak doğal afetlere karşı erken uyarı sağlayan akıllı sistem.",
    },
    {
        id: 2,
        title: "Nano Malzeme Araştırma Projesi",
        category: "Malzeme Bilimi",
        status: "Onay Bekliyor",
        statusColor: "bg-amber-100 text-amber-700",
        date: "3 Şubat 2025",
        team: 2,
        description:
            "Yeni nesil nano malzemelerin endüstriyel uygulamalarına yönelik deneysel çalışma ve üretim süreçleri.",
    },
    {
        id: 3,
        title: "Otonom İHA Kontrol Sistemi",
        category: "Savunma Teknoloji",
        status: "Yayında",
        statusColor: "bg-emerald-100 text-emerald-700",
        date: "20 Aralık 2024",
        team: 5,
        description:
            "İnsansız hava araçları için otonom uçuş ve görev planlama kontrol yazılımı geliştirme.",
    },
    {
        id: 4,
        title: "Biyomedikal Sensör Geliştirme",
        category: "Biyomedikal",
        status: "Onay Bekliyor",
        statusColor: "bg-amber-100 text-amber-700",
        date: "10 Şubat 2025",
        team: 3,
        description:
            "Hasta takibi ve erken teşhis için giyilebilir biyomedikal sensör teknolojileri üzerine Ar-Ge çalışması.",
    },
    {
        id: 5,
        title: "Akıllı Tarım IoT Platformu",
        category: "Tarım Teknoloji",
        status: "Reddedildi",
        statusColor: "bg-red-100 text-red-700",
        date: "5 Ocak 2025",
        team: 2,
        description:
            "IoT sensörleri ve yapay zeka ile tarımsal üretimi optimize eden akıllı tarım yönetim platformu.",
    },
    {
        id: 6,
        title: "5G Ağ Güvenliği Altyapısı",
        category: "Siber Güvenlik",
        status: "Yayında",
        statusColor: "bg-emerald-100 text-emerald-700",
        date: "28 Kasım 2024",
        team: 6,
        description:
            "Yeni nesil 5G iletişim ağlarında güvenlik açıklarını tespit eden ve önleyen altyapı çözümü.",
    },
];

export default function ProjelerimPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Tümü");

    const filters = ["Tümü", "Yayında", "Onay Bekliyor", "Reddedildi"];

    const filtered = myProjects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "Tümü" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-hmku-dark tracking-tight">
                        Projelerim
                    </h1>
                    <p className="mt-1 text-sm text-hmku-muted">
                        Tüm projelerinizi görüntüleyin ve yönetin.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-hmku-primary text-white text-sm font-bold rounded-xl hover:bg-rose-800 transition-all duration-200 shadow-lg shadow-hmku-primary/20 active:scale-[0.97]">
                    <Plus className="w-4 h-4" />
                    Yeni Proje Gönder
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hmku-muted" />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${filter === f
                                    ? "bg-hmku-primary text-white shadow-md shadow-hmku-primary/20"
                                    : "bg-white text-hmku-muted border border-slate-200 hover:border-hmku-primary hover:text-hmku-primary"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {filtered.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white rounded-xl shadow-modern border border-slate-100 p-5 hover:shadow-lg transition-shadow duration-200 group"
                    >
                        {/* Status Badge + Category */}
                        <div className="flex items-center justify-between mb-3">
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full ${project.statusColor}`}
                            >
                                {project.status === "Yayında" && (
                                    <Globe className="w-3 h-3" />
                                )}
                                {project.status === "Onay Bekliyor" && (
                                    <Clock className="w-3 h-3" />
                                )}
                                {project.status === "Reddedildi" && (
                                    <XCircle className="w-3 h-3" />
                                )}
                                {project.status}
                            </span>
                            <span className="text-[10px] font-semibold text-hmku-muted bg-slate-100 px-2 py-0.5 rounded-full">
                                {project.category}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-[15px] font-bold text-hmku-dark leading-snug group-hover:text-hmku-primary transition-colors">
                            {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-hmku-muted leading-relaxed line-clamp-2">
                            {project.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-4 text-[11px] text-hmku-muted">
                            <span className="flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {project.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {project.team} kişi
                            </span>
                        </div>

                        {/* Action */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <button className="flex items-center gap-1.5 text-xs font-bold text-hmku-primary hover:gap-3 transition-all duration-200">
                                Detayları Gör
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            {project.status === "Yayında" && (
                                <button className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition">
                                    <ExternalLink className="w-3 h-3" />
                                    Vitrinde Gör
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-hmku-muted">
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                        Aramanızla eşleşen proje bulunamadı.
                    </p>
                </div>
            )}
        </div>
    );
}
