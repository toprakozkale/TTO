"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    FileText,
    BarChart3,
    User,
    ChevronLeft,
    ExternalLink,
    Mail,
    Globe,
} from "lucide-react";

const menuItems = [
    { id: "profil", label: "Profil Özeti", icon: User, hash: "#profil" },
    { id: "yayinlar", label: "Yayınlar & Eserler", icon: BookOpen, hash: "#yayinlar" },
    { id: "istatistikler", label: "Bibliyometri", icon: BarChart3, hash: "#istatistikler" },
    { id: "projeler", label: "Projeler", icon: FileText, hash: "#projeler" },
];

export default function ProfileSidebar({ akademisyen }) {
    const [activeSection, setActiveSection] = useState("yayinlar");

    const initials = akademisyen?.name
        ? akademisyen.name
              .split(" ")
              .filter((p) =>
                  !["prof.", "doç.", "dr.", "arş.", "gör.", "uzm.", "öğr."].includes(
                      p.toLowerCase()
                  )
              )
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()
        : "AK";

    // Deterministik gradient rengi
    const GRADIENTS = [
        "from-hmku-primary to-rose-400",
        "from-violet-500 to-purple-500",
        "from-emerald-500 to-teal-500",
        "from-amber-500 to-orange-500",
        "from-sky-500 to-blue-500",
    ];
    const hash = (akademisyen?.name || "").split("").reduce(
        (acc, c) => c.charCodeAt(0) + ((acc << 5) - acc),
        0
    );
    const gradient = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

    const handleNavClick = (id) => setActiveSection(id);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Geri Butonu */}
            <div className="px-5 pt-5 pb-4">
                <Link
                    href="/hakkimizda"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-hmku-muted hover:text-hmku-primary transition-colors duration-200 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Ekibe Dön
                </Link>
            </div>

            {/* Profil Başlığı */}
            <div className="px-5 pb-6 border-b border-white/30">
                <div className="flex flex-col items-center text-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                        <div
                            className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ring-4 ring-white/60`}
                        >
                            <span className="text-white text-2xl font-black">{initials}</span>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-hmku-dark leading-tight">
                            {akademisyen?.name || "Akademisyen"}
                        </h2>
                        <p className="mt-0.5 text-[11px] text-hmku-muted font-medium">
                            {akademisyen?.role || "Akademisyen"}
                        </p>
                        {akademisyen?.department && (
                            <p className="mt-0.5 text-[10px] text-hmku-muted/70">
                                {akademisyen.department}
                            </p>
                        )}
                    </div>
                    {/* İletişim linkleri */}
                    <div className="flex items-center gap-2 mt-1">
                        {akademisyen?.email && (
                            <a
                                href={`mailto:${akademisyen.email}`}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 border border-white/40 text-hmku-muted hover:text-hmku-primary hover:bg-rose-50/80 transition-all duration-200 shadow-sm"
                                title={akademisyen.email}
                            >
                                <Mail className="w-3.5 h-3.5" />
                            </a>
                        )}
                        {akademisyen?.profile_url && (
                            <a
                                href={akademisyen.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 border border-white/40 text-hmku-muted hover:text-hmku-primary hover:bg-rose-50/80 transition-all duration-200 shadow-sm"
                                title="Akademik Profil"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                        <a
                            href={`mailto:${akademisyen?.email || ""}`}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 border border-white/40 text-hmku-muted hover:text-sky-500 hover:bg-sky-50/80 transition-all duration-200 shadow-sm"
                            title="Web Sayfası"
                        >
                            <Globe className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigasyon */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                        <a
                            key={item.id}
                            href={item.hash}
                            onClick={() => handleNavClick(item.id)}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                                active
                                    ? "bg-hmku-primary/10 text-hmku-primary"
                                    : "text-hmku-dark hover:bg-white/50"
                            }`}
                        >
                            {/* Aktif göstergesi — sol çubuk */}
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-hmku-primary shadow-[0_0_8px_2px_rgba(190,18,60,0.35)]" />
                            )}
                            <Icon
                                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                                    active
                                        ? "text-hmku-primary"
                                        : "text-hmku-muted group-hover:text-hmku-dark"
                                }`}
                            />
                            <span>{item.label}</span>
                            {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-hmku-primary animate-pulse" />
                            )}
                        </a>
                    );
                })}
            </nav>

            {/* Alt bilgi */}
            <div className="px-4 pb-5 pt-3 border-t border-white/30">
                <p className="text-[10px] text-hmku-muted/60 text-center leading-relaxed">
                    Hatay Mustafa Kemal Üniversitesi
                    <br />
                    Teknoloji Transfer Ofisi
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* ─── Masaüstü Sidebar (lg+) ─── */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:flex-shrink-0 lg:h-screen lg:sticky lg:top-0 overflow-hidden">
                {/* Glassmorphism arka plan */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.08)]" />
                <div className="relative flex flex-col h-full z-10">
                    <SidebarContent />
                </div>
            </aside>

            {/* ─── Mobil Bottom Navigation (< lg) ─── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 overflow-hidden">
                {/* Glassmorphism arka plan */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.12)]" />
                <div className="relative z-10 flex items-center justify-around px-2 py-2 safe-area-pb">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.hash}
                                onClick={() => handleNavClick(item.id)}
                                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                                    active
                                        ? "text-hmku-primary"
                                        : "text-hmku-muted"
                                }`}
                            >
                                {active && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-hmku-primary shadow-[0_0_8px_2px_rgba(190,18,60,0.4)]" />
                                )}
                                <Icon
                                    className={`w-5 h-5 transition-all duration-200 ${
                                        active ? "scale-110" : "scale-100"
                                    }`}
                                />
                                <span className={`text-[9px] font-bold leading-none ${active ? "text-hmku-primary" : "text-hmku-muted"}`}>
                                    {item.label.split(" ")[0]}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
