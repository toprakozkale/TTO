"use client";

import { useState } from "react";
import TTOLogo from "@/components/ui/TTOLogo";
import Link from "next/link";
import {
    ChevronLeft,
    Download,
    Mail,
    MapPin,
    BookOpen,
    Award,
    FileText,
    Globe,
    Briefcase,
    Bell,
    GraduationCap,
    FlaskConical,
    Users,
    TrendingUp,
    Unlock,
    BookMarked,
    ExternalLink,
    ChevronDown,
    Sparkles,
    Lock,
    Quote,
    Filter,
    Menu,
    X,
} from "lucide-react";

import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// ─── Navigasyon öğeleri ───────────────────────────────────────────
const NAV_ITEMS = [
    { id: "anasayfa", label: "Ana Sayfa", icon: Globe },
    { id: "egitim", label: "Eğitim Bilgileri", icon: GraduationCap },
    { id: "arastirma", label: "Araştırma Alanları", icon: FlaskConical },
    { id: "idari", label: "Akademik İdari Deneyim", icon: Briefcase },
    { id: "yayinlar", label: "Yayınlar & Eserler", icon: BookOpen },
    { id: "projeler", label: "Proje & Patent & Tasarım", icon: FileText },
    { id: "faaliyetler", label: "Bilimsel & Mesleki Faaliyetler", icon: TrendingUp },
    { id: "basarilar", label: "Başarılar & Tanınırlık", icon: Award },
    { id: "duyurular", label: "Duyurular & Dokümanlar", icon: Bell },
    { id: "iletisim", label: "İletişim", icon: Mail },
];

// ─── Sosyal medya rozetleri ───────────────────────────────────────
const SOCIAL_ICONS = [
    { label: "GS", title: "Google Scholar", bg: "bg-red-500", textColor: "text-white", href: "#" },
    { label: "SC", title: "Semantic Scholar", bg: "bg-orange-500", textColor: "text-white", href: "#" },
    { label: "iD", title: "ORCID", bg: "bg-green-500", textColor: "text-white", href: "#" },
    { label: "P", title: "Publons", bg: "bg-blue-600", textColor: "text-white", href: "#" },
    { label: "RG", title: "ResearchGate", bg: "bg-teal-600", textColor: "text-white", href: "#" },
];

// ─── Deterministik renk ──────────────────────────────────────────
const GRADIENTS = [
    "from-hmku-primary to-rose-400",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-sky-500 to-blue-500",
];
function getGradient(name = "") {
    const hash = name.split("").reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0);
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
function getInitials(name = "") {
    return name
        .split(" ")
        .filter((p) => !["prof.", "doç.", "dr.", "arş.", "gör.", "uzm.", "öğr."].includes(p.toLowerCase()))
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase() || "AK";
}

// ═══════════════════════════════════════════════════════════════════
// PANEL BİLEŞENLERİ
// ═══════════════════════════════════════════════════════════════════

function AnaSayfaPanel({ akademisyen, stats }) {
    const [metriklerOpen, setMetriklerOpen] = useState(true);

    const genelBilgiler = [
        {
            label: "Kurum Bilgileri",
            value: "Mühendislik Fakültesi, Bilgisayar Mühendisliği",
        },
        {
            label: "WoS Araştırma Alanları",
            value: "Computer Science, Engineering, Information Science",
        },
        {
            label: "Scopus Araştırma Alanları",
            value: "Computer Science, Engineering, Decision Sciences",
        },
        {
            label: "Avesis Araştırma Alanları",
            value: "Yapay Zeka, Makine Öğrenmesi, Veri Madenciliği, Siber Güvenlik",
        },
        {
            label: "Yayınlardaki İsimleri",
            value: akademisyen?.name
                ? akademisyen.name
                    .split(" ")
                    .filter((p) => !["prof.", "doç.", "dr."].includes(p.toLowerCase()))
                    .map((_, i, arr) =>
                        i === 0 ? arr[0][0] + ". " + arr[arr.length - 1] : null
                    )
                    .filter(Boolean)
                    .join(", ")
                : "Kaya, A.",
        },
    ];

    const metrikler = [
        { label: "Yayın (OpenAlex)", value: stats?.totalPublications ?? 0, badge: null },
        { label: "Atıf (OpenAlex)", value: stats?.citations ?? 0, badge: null },
        { label: "H-İndeks (OpenAlex)", value: stats?.hIndex ?? 0, badge: null },
        { label: "Proje", value: stats?.projects ?? 0, badge: null },
        { label: "Yayın (WoS)", value: stats?.wosCount ?? 0, badge: null },
        { label: "Yayın (Scopus)", value: stats?.scopusCount ?? 0, badge: null },
        {
            label: "Açık Erişim",
            value: stats?.openAccess ?? 0,
            badge: (
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-500 flex-shrink-0" fill="currentColor">
                    <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="space-y-0">
            {/* ── Genel Bilgiler ── */}
            <div className="bg-white border border-slate-200 rounded-t-2xl">
                {/* Başlık */}
                <div className="px-6 pt-6 pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Genel Bilgiler</h2>
                    <div className="mt-1.5 w-12 h-1 bg-slate-800 rounded-full" />
                </div>


                {/* Bilgi satırları */}
                <div className="px-6 pb-6 space-y-2.5">
                    {genelBilgiler.map(({ label, value }) => (
                        <p key={label} className="text-sm text-slate-700 leading-relaxed">
                            <span className="font-semibold">{label}:</span>{" "}
                            <span className="text-slate-600">{value}</span>
                        </p>
                    ))}
                </div>
            </div>

            {/* ── Metrikler Accordion ── */}
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-2xl overflow-hidden">
                {/* Accordion başlık */}
                <button
                    onClick={() => setMetriklerOpen(!metriklerOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-t border-slate-200"
                >
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Metrikler</span>
                    <span className="text-slate-400 text-lg leading-none">{metriklerOpen ? "—" : "+"}</span>
                </button>


                {metriklerOpen && (
                    <div className="p-5">
                        {/* "Daha fazla metrik" butonu */}
                        <div className="flex justify-end mb-4">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                </svg>
                                Daha fazla metrik
                            </button>
                        </div>

                        {/* Metrik grid — 4 sütun, referanstaki gibi */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                            {metrikler.map(({ label, value, badge }) => (
                                <div key={label} className="bg-white p-4 flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-[11px] text-slate-500 leading-tight mb-1">{label}</p>
                                        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
                                    </div>
                                    {badge && (
                                        <div className="flex-shrink-0 mt-0.5">{badge}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


function AccordionSection({ title, count, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-700">{title}</span>
                    {count !== undefined && (
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
                            {count}
                        </span>
                    )}
                </div>

                <span className="text-slate-400 text-base leading-none font-light select-none">{open ? "—" : "+"}</span>
            </button>
            {open && <div className="px-5 py-4">{children}</div>}
        </div>
    );
}

function EgitimPanel() {
    const egitimler = [
        { period: "2012 – 2017", degree: "Doktora", university: "Ankara Üniversitesi, Fen Bilimleri Enstitüsü, Türkiye" },
        { period: "2010 – 2012", degree: "Yüksek Lisans", university: "Hacettepe Üniversitesi, Fen Bilimleri Enstitüsü, Türkiye" },
        { period: "2009 – 2010", degree: "Yüksek Lisans", university: "ODTÜ, Bilişim Enstitüsü, Türkiye" },
        { period: "2005 – 2009", degree: "Lisans", university: "Hacettepe Üniversitesi, Mühendislik Fakültesi, Türkiye" },
    ];

    const tezler = [
        { year: "2017", degree: "Doktora", title: "Derin öğrenme yöntemleriyle ağ trafiği anomali tespiti: Türkiye örneği", university: "Ankara Üniversitesi, Fen Bilimleri Enstitüsü" },
        { year: "2012", degree: "Yüksek Lisans", title: "Makine öğrenmesi tabanlı siber saldırı sınıflandırma yöntemlerinin karşılaştırmalı analizi", university: "Hacettepe Üniversitesi, Fen Bilimleri Enstitüsü" },
        { year: "2010", degree: "Yüksek Lisans", title: "Doğal dil işleme ve metin madenciliği uygulamaları", university: "ODTÜ, Bilişim Enstitüsü" },
    ];

    const diller = ["İngilizce"];

    return (
        <div className="space-y-0">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Eğitim Bilgileri</h2>
                <div className="mt-1.5 w-14 h-1 bg-slate-800 rounded-full" />
            </div>


            {/* 2 sütun accordion grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Sol — Eğitim Bilgileri */}
                <AccordionSection title="Eğitim Bilgileri" count={egitimler.length}>
                    <div className="space-y-5">
                        {egitimler.map((e, i) => (
                            <div key={i}>
                                <p className="text-[11px] text-slate-400 font-medium mb-0.5">{e.period}</p>
                                <p className="text-sm font-bold text-slate-800">{e.degree}</p>
                                <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{e.university}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Sağ — Yaptığı Tezler */}
                <AccordionSection title="Yaptığı Tezler" count={tezler.length}>
                    <div className="space-y-5">
                        {tezler.map((t, i) => (
                            <div key={i}>
                                <p className="text-[11px] text-slate-400 font-medium mb-0.5">{t.year}</p>
                                <p className="text-sm font-bold text-slate-800">{t.degree}</p>
                                <p className="text-[12px] text-slate-600 mt-0.5 leading-snug">{t.title}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{t.university}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>
            </div>

            {/* Yabancı Diller — tam genişlik */}
            <AccordionSection title="Yabancı Diller" count={diller.length}>
                <div className="space-y-1">
                    {diller.map((d) => (
                        <p key={d} className="text-sm font-semibold text-slate-700">{d}</p>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}


function ArastirmaPanel({ authorTopics = [] }) {
    const SHOW_LIMIT = 20;
    const [showAll, setShowAll] = useState(false);

    const temelAlanlar = [
        "Sosyal ve Beşeri Bilimler",
        "Bilgisayar ve Bilişim Bilimleri",
        "Yapay Zeka ve Makine Öğrenmesi",
        "Siber Güvenlik",
        "Veri Bilimi",
    ];

    // OpenAlex topic listesi: count'a göre azalan sırada
    const sortedTopics = [...authorTopics].sort((a, b) => b.count - a.count);

    // Alan (field) bazında grupla — sadece görüntüleme için başlık ekler
    const groupedByField = sortedTopics.reduce((acc, topic) => {
        const field = topic.field?.display_name || 'Diğer';
        if (!acc[field]) acc[field] = [];
        acc[field].push(topic);
        return acc;
    }, {});

    const allTopics = showAll ? sortedTopics : sortedTopics.slice(0, SHOW_LIMIT);

    return (
        <div className="space-y-4">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Araştırma Alanları</h2>
                <div className="mt-1.5 w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Accordion 1 — Temel Araştırma Alanları */}
            <AccordionSection title="Araştırma Alanları" count={temelAlanlar.length}>
                <div className="space-y-3">
                    {temelAlanlar.map((alan) => (
                        <p key={alan} className="text-sm font-bold text-slate-800">{alan}</p>
                    ))}
                </div>
            </AccordionSection>

            {/* Accordion 2 — OpenAlex Konuları (WoS) */}
            <AccordionSection title="Akademik Faaliyetlere Dayalı Araştırma Alanları (WoS/OpenAlex)" count={sortedTopics.length}>
                {sortedTopics.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">OpenAlex konu verisi bulunamadı.</p>
                ) : (
                    <>
                        {/* Chip grid */}
                        <div className="flex flex-wrap gap-2">
                            {allTopics.map((topic) => (
                                <span
                                    key={topic.display_name}
                                    title={`${topic.subfield?.display_name || ''} • ${topic.field?.display_name || ''} • ${topic.count} yayın`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-default"
                                >
                                    {/* Count badge */}
                                    <span className="text-[10px] font-black text-slate-400 leading-none">
                                        {topic.count}
                                    </span>
                                    {topic.display_name}
                                </span>
                            ))}
                            {!showAll && sortedTopics.length > SHOW_LIMIT && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="inline-flex items-center px-3 py-1.5 text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    Daha Fazla {" >>"}
                                </button>
                            )}
                        </div>

                        {/* Field breakdown */}
                        {showAll && (
                            <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
                                {Object.entries(groupedByField).map(([field, topics]) => (
                                    <div key={field}>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{field}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {topics.map(topic => (
                                                <span
                                                    key={topic.display_name}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-slate-700 bg-white border border-slate-200 rounded-lg"
                                                >
                                                    <span className="text-[10px] font-black text-slate-400">{topic.count}</span>
                                                    {topic.display_name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </AccordionSection>
        </div>
    );
}


function IdariPanel() {
    const unvanlar = [
        { period: "2024 - Devam Ediyor", title: "Prof. Dr.", university: "Hatay Mustafa Kemal Üniversitesi, Mühendislik Fakültesi, Bilgisayar Mühendisliği" },
        { period: "2020 - 2024", title: "Doç. Dr.", university: "Hatay Mustafa Kemal Üniversitesi, Mühendislik Fakültesi" },
        { period: "2017 - 2020", title: "Dr. Öğr. Üyesi", university: "Hacettepe Üniversitesi, Mühendislik Fakültesi" },
        { period: "2012 - 2017", title: "Araştırma Görevlisi", university: "Ankara Üniversitesi, Fen Bilimleri Enstitüsü" },
        { period: "2009 - 2012", title: "Araştırma Görevlisi", university: "Hacettepe Üniversitesi, Fen Bilimleri Enstitüsü" },
    ];

    const yonetimsel = [
        { period: "2024 - Devam Ediyor", title: "TTO Araştırma Koordinatörü", university: "Hatay Mustafa Kemal Üniversitesi, REKTÖRLÜK" },
        { period: "2024 - Devam Ediyor", title: "Fakülte Kurulu Üyesi", university: "Hatay Mustafa Kemal Üniversitesi, Mühendislik Fakültesi, Bilgisayar Mühendisliği" },
    ];

    const dersler = {
        "Lisans": [
            "BİL101-Programlamaya Giriş-I",
            "BİL102-Programlamaya Giriş-II",
            "BİL201-Veri Yapıları ve Algoritmalar",
            "BİL301-Yapay Zeka",
            "BİL302-Makine Öğrenmesi",
            "BİL401-Derin Öğrenme",
            "BİL402-Doğal Dil İşleme",
            "BİL210-Veritabanı Sistemleri",
        ],
        "Lisans Çift Anadal / Yan Dal": [
            "BİL5001-İleri Yapay Zeka Yöntemleri",
            "BİL6002-Büyük Veri Analitiği",
            "BİL6010-Siber Güvenliğe Giriş",
            "BİL5022-Makine Öğrenmesi Uygulamaları",
        ],
    };

    return (
        <div className="space-y-4">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Akademik İdari Deneyim</h2>
                <div className="mt-1.5 w-14 h-1 bg-slate-800 rounded-full" />
            </div>


            {/* 2 sütun grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Sol — Akademik Ünvanlar */}
                <AccordionSection title="Akademik Ünvanlar" count={unvanlar.length}>
                    <div className="space-y-5">
                        {unvanlar.map((u, i) => (
                            <div key={i}>
                                <p className="text-[11px] text-slate-400 font-medium mb-0.5">{u.period}</p>
                                <p className="text-sm font-bold text-slate-800">{u.title}</p>
                                <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{u.university}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Sağ — Yönetimsel Görevler */}
                <AccordionSection title="Yönetimsel Görevler" count={yonetimsel.length}>
                    <div className="space-y-5">
                        {yonetimsel.map((y, i) => (
                            <div key={i}>
                                <p className="text-[11px] text-slate-400 font-medium mb-0.5">{y.period}</p>
                                <p className="text-sm font-bold text-slate-800">{y.title}</p>
                                <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{y.university}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>
            </div>

            {/* Verdiği Dersler — tam genişlik */}
            <AccordionSection title="Verdiği Dersler" count={Object.values(dersler).flat().length}>
                <div className="space-y-5">
                    {Object.entries(dersler).map(([seviye, liste]) => (
                        <div key={seviye}>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{seviye}</p>

                            <div className="space-y-1.5">
                                {liste.map((ders) => (
                                    <div key={ders} className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-800 flex-1">{ders}</p>
                                        <button title="Detay" className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
                                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <circle cx="8" cy="8" r="6.5" />
                                                <path d="M8 7v4M8 5.5v.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <button title="Program" className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
                                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
                                                <path d="M5 1v3M11 1v3M1.5 7h13" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}


// Basit yayın kartı (tam bağımsız, client-safe)
function PubCard({ pub, index, highlight }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex gap-4 group">
            {/* Numara ve İkon */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                <span className="text-sm font-medium text-slate-400">{index}.</span>
                <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-300">
                    <BookOpen className="w-5 h-5" />
                </div>
            </div>

            <div className="flex-1 pb-7 border-b border-slate-100 last:border-0">
                <h3 className="text-sm font-bold text-slate-700 leading-snug hover:text-blue-600 transition-colors cursor-pointer mb-1">
                    {pub.title}
                </h3>

                {pub.authors?.length > 0 && (
                    <p className="text-[12px] text-slate-500 mb-1.5 leading-relaxed">
                        {pub.authors.map((a, i) => (
                            <span key={i}>
                                <span className={`cursor-pointer hover:underline text-blue-500/80 ${a.toLowerCase().includes(highlight?.toLowerCase() || "") ? "font-bold text-blue-600" : ""}`}>
                                    {a}
                                </span>
                                {i < pub.authors.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                    <span className="text-blue-500 font-medium hover:underline cursor-pointer">{pub.journal}</span>
                    <span>, {pub.meta}</span>
                    <span>({pub.indexes.join(", ")})</span>

                    {/* İkonlar */}
                    <div className="flex items-center gap-2 ml-1">
                        {pub.doi && (
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" title="DOI">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                            </a>
                        )}
                        <a href="#" className="text-blue-400 hover:text-blue-600">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                        <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center text-white text-[8px] font-bold">SC</div>
                        <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold tracking-tighter">İD</div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                            <span className="text-[9px] font-bold text-slate-500">PlumX Metrics</span>
                        </div>
                    </div>
                </div>

                {pub.tldr && (
                    <div className="mt-3">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 hover:bg-violet-100 transition-colors"
                        >
                            <Sparkles className="w-3 h-3" /> AI ile Özetle {open ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {open && (
                            <div className="mt-2 text-xs text-violet-800/80 bg-violet-50/60 border border-violet-100 rounded-xl p-3 italic leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                                &ldquo;{pub.tldr}&rdquo;
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const MOCK_PUBS = [
    {
        id: "1",
        title: "Quantile spillover connectedness among CO2 emission sources: An empirical analysis in European Union",
        authors: ["Rehman M. A.", "Ayhan KAYA"],
        journal: "Gondwana Research",
        meta: "cilt.152, ss.18-31, 2024",
        doi: "10.1016/j.gres.2024.123",
        indexes: ["SCI-Expanded", "Scopus"],
        tldr: "Bu çalışma, AB ülkelerinde CO2 emisyon kaynakları arasındaki yayılma etkilerini kuantil bazlı yaklaşımlarla analiz eder. Enerji üretim kaynaklarının birbirleri üzerindeki asimetrik etkilerini ve politika sonuçlarını vurgular.",
        type: "Makale"
    },
    {
        id: "2",
        title: "Linking geopolitical risk, load capacity factor, income, labor, population, and trade on natural resources: Evidence from top oil-producing countries",
        authors: ["Erdoğan S.", "Kartal M. T.", "Ayhan KAYA"],
        journal: "Natural Resources Forum",
        meta: "cilt.50, sa.1, ss.139-156, 2024",
        doi: "10.1111/nrf.12345",
        indexes: ["SCI-Expanded", "SSCI", "Scopus"],
        tldr: "Jeopolitik risklerin petrol üreten temel ülkelerde doğal kaynak tüketimi ve yük kapasite faktörü üzerindeki etkilerini inceler. Gelir ve nüfus değişkenlerinin çevresel sürdürülebilirliğe etkisini modeller.",
        type: "Makale"
    },
    {
        id: "3",
        title: "Nonlinear impacts of environmental transport taxes and biofuel consumption on greenhouse emissions in the four largest European Union countries",
        authors: ["Ayhan KAYA", "Erdoğan S.", "Karlılar Pata S.", "Kartal M. T."],
        journal: "Natural Resources Forum",
        meta: "cilt.50, sa.1, ss.157-183, 2024",
        doi: "10.1111/nrf.12346",
        indexes: ["SCI-Expanded", "SSCI", "Scopus"],
        tldr: "Çevresel ulaşım vergilerinin ve biyoyakıt tüketiminin emisyonlar üzerindeki doğrusal olmayan etkilerini AB'nin en büyük 4 ülkesi için karşılaştırmalı olarak analiz eder.",
        type: "Makale"
    },
    {
        id: "4",
        title: "Role of Environmental Policy Stringency on Sectoral CO2 Emissions in EU-5 Countries: Disaggregated Level Evidence by Novel Quantile-Based Approaches",
        authors: ["Kartal M. T.", "Kirikkaleli D.", "Ayhan KAYA"],
        journal: "Energy and Environment",
        meta: "cilt.37, sa.1, ss.336-361, 2024",
        doi: "10.1177/0958305X24000123",
        indexes: ["SSCI", "Scopus"],
        tldr: "Çevresel politika katılığı endeksinin (EPS) sektörel bazda emisyonlar üzerindeki etkisini yeni kuantil teknikleri kullanarak ortaya koyar.",
        type: "Makale"
    },
];

import WorksSection from "@/components/WorksSection";

function YayinlarPanel({ name, orcid, openAlexWorks }) {
    return (
        <div className="space-y-4">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Yayınlar & Eserler</h2>
                <div className="mt-1.5 w-14 h-1 bg-slate-800 rounded-full" />
            </div>

            {orcid ? (
                <WorksSection
                    initialWorks={openAlexWorks}
                    orcid={orcid}
                    totalCount={openAlexWorks?.meta?.count || 0}
                />
            ) : (
                <div className="bg-white/70 backdrop-blur-sm border border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
                    <BookOpen className="w-10 h-10 text-slate-200" />
                    <p className="text-sm font-bold text-hmku-muted">ORCID Bilgisi Bulunamadı</p>
                    <p className="text-xs text-hmku-muted/60">Yayınların çekilebilmesi için akademisyen profilinde ORCID ID tanımlı olmalıdır.</p>
                </div>
            )}
        </div>
    );
}

function ProjelerPanel() {
    const projeler = [
        {
            period: "2024 - 2026",
            title: "Yapay Zeka Destekli Siber Tehdit Tespiti: Gerçek Zamanlı Ağ Trafiği Analizi ile Saldırı Sınıflandırma",
            funder: "TÜBİTAK Projesi , 1001 - Bilimsel ve Teknolojik Araştırma Projelerini Destekleme Programı",
            researchers: [{ name: "A. Kaya", role: "Yürütücü" }, { name: "M. Yılmaz", role: "Araştırmacı" }],
        },
        {
            period: "2023 - 2025",
            title: "Federe Öğrenme Tabanlı Sağlık Verisi Gizlilik Koruması: Dağıtık Ortamlarda Hasta Verilerinin Güvenli Analizi",
            funder: "Yükseköğretim Kurumları Destekli Proje , BAP Alt Yapı",
            researchers: [{ name: "A. Kaya", role: "Yürütücü" }],
        },
        {
            period: "2021 - 2023",
            title: "IoT Cihazları için Hafif Şifreleme Protokolleri Geliştirme ve Güvenlik Analizi",
            funder: "HMKÜ Bilimsel Araştırma Projeleri Komisyonu , BAP Standart",
            researchers: [{ name: "A. Kaya", role: "Yürütücü" }, { name: "H. Arslan", role: "Araştırmacı" }],
        },
    ];

    return (
        <div className="space-y-4">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Desteklenen Projeler</h2>
                <div className="mt-1.5 w-14 h-1 bg-slate-800 rounded-full" />
            </div>


            <AccordionSection title="Desteklenen Projeler" count={projeler.length}>
                <div className="space-y-7">
                    {projeler.map((p, i) => (
                        <div key={i}>
                            <p className="text-[11px] text-slate-400 font-medium mb-1">{p.period}</p>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-1">{p.title}</p>
                            <p className="text-[12px] text-slate-500 mb-1.5">{p.funder}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                {p.researchers.map((r) => (
                                    <span key={r.name} className="text-[12px]">
                                        <span className="text-blue-500 font-medium hover:underline cursor-pointer">{r.name}</span>
                                        <span className="text-slate-400"> ({r.role})</span>
                                    </span>
                                ))}
                            </div>
                            {i < projeler.length - 1 && <hr className="mt-6 border-slate-100" />}
                        </div>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}


function FaaliyetlerPanel() {
    const dergiFaaliyetleri = [
        { period: "2024 - Devam Ediyor", journal: "IEEE Transactions on Neural Networks and Learning Systems", role: "Hakemlik" },
        { period: "2024 - Devam Ediyor", journal: "Expert Systems with Applications", role: "Hakemlik" },
        { period: "2023 - Devam Ediyor", journal: "IEEE Access", role: "Editörler Kurulu Üyesi" },
        { period: "2022 - Devam Ediyor", journal: "Journal of Cybersecurity", role: "Hakemlik" },
        { period: "2021 - Devam Ediyor", journal: "Applied Soft Computing", role: "Hakemlik" },
    ];

    const konferansFaaliyetleri = [
        { period: "2024", journal: "IEEE International Conference on Machine Learning (ICML 2024)", role: "Program Komitesi Üyesi" },
        { period: "2023", journal: "NeurIPS 2023", role: "Hakem" },
        { period: "2022", journal: "ACM CCS 2022", role: "Hakem" },
    ];

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Bilimsel & Mesleki Faaliyetler</h2>
                <div className="mt-1.5 w-16 h-1 bg-slate-800 rounded-full" />
            </div>


            <AccordionSection title="Bilimsel Dergilerdeki Faaliyetler" count={dergiFaaliyetleri.length}>
                <div className="space-y-5">
                    {dergiFaaliyetleri.map((f, i) => (
                        <div key={i}>
                            <p className="text-[11px] text-slate-400 font-medium mb-0.5">{f.period}</p>
                            <p className="text-sm font-bold text-slate-800">{f.journal}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{f.role}</p>
                            {i < dergiFaaliyetleri.length - 1 && <hr className="mt-4 border-slate-100" />}
                        </div>
                    ))}
                </div>
            </AccordionSection>

            <AccordionSection title="Konferans Faaliyetleri" count={konferansFaaliyetleri.length}>
                <div className="space-y-5">
                    {konferansFaaliyetleri.map((f, i) => (
                        <div key={i}>
                            <p className="text-[11px] text-slate-400 font-medium mb-0.5">{f.period}</p>
                            <p className="text-sm font-bold text-slate-800">{f.journal}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{f.role}</p>
                            {i < konferansFaaliyetleri.length - 1 && <hr className="mt-4 border-slate-100" />}
                        </div>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}

function BaskilarPanel({ stats }) {
    const chartData = [
        { year: "2016", publications: 5, citations: 20 },
        { year: "2017", publications: 14, citations: 50 },
        { year: "2018", publications: 14, citations: 120 },
        { year: "2019", publications: 7, citations: 180 },
        { year: "2020", publications: 26, citations: 300 },
        { year: "2021", publications: 12, citations: 550 },
        { year: "2022", publications: 21, citations: 1100 },
        { year: "2023", publications: 58, citations: 2200 },
        { year: "2024", publications: 69, citations: 3800 },
        { year: "2025", publications: 37, citations: 4100 },
        { year: "2026", publications: 4, citations: 0 },
    ];

    const metrikler = [
        { label: "Yayın", value: stats?.totalPublications ?? 267, badge: null },
        { label: "Yayın (WoS)", value: 197, badge: null },
        { label: "Yayın (Scopus)", value: 201, badge: null },
        { label: "Atıf (WoS)", value: 11117, badge: null },
        { label: "H-İndeks (WoS)", value: 56, badge: null },
        { label: "Atıf (Scopus)", value: 12144, badge: null },
        { label: "H-İndeks (Scopus)", value: 57, badge: null },
        { label: "Atıf (Scholar)", value: 15674, badge: null },
        { label: "H-İndeks (Scholar)", value: 62, badge: null },
        { label: "Atıf (TrDizin)", value: 10, badge: null },
        { label: "H-İndeks (TrDizin)", value: 2, badge: null },
        { label: "Atıf (Sobiad)", value: 594, badge: null },
        { label: "H-İndeks (Sobiad)", value: 13, badge: null },
        { label: "Atıf (Diğer Toplam)", value: 21, badge: null },
        { label: "Proje", value: 2, badge: null },
        {
            label: "Açık Erişim",
            value: 9,
            badge: (
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-500 flex-shrink-0" fill="currentColor">
                    <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Başarılar & Tanınırlık</h2>
                <div className="mt-1.5 w-14 h-1 bg-slate-800 rounded-full" />
            </div>


            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-center text-slate-600 mb-6">Yıllara Göre Yayın ve Atıf Sayıları</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 10, fill: "#64748b" }}
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tick={{ fontSize: 10, fill: "#64748b" }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Yayın', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 10, fill: "#64748b" }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Atıf', angle: 90, position: 'insideRight', fontSize: 11, fill: '#64748b' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                            <Bar
                                yAxisId="left"
                                dataKey="publications"
                                name="Yayın Sayısı"
                                fill="#38bdf8"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="citations"
                                name="Atıf Sayısı (SCOPUS)"
                                stroke="#1e293b"
                                strokeWidth={3}
                                dot={{ fill: '#1e293b', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {metrikler.map(({ label, value, badge }) => (
                        <div key={label} className="bg-white p-4 flex items-start justify-between gap-2">
                            <div>
                                <p className="text-[11px] text-slate-500 leading-tight mb-1">{label}</p>
                                <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
                            </div>
                            {badge && (
                                <div className="flex-shrink-0 mt-0.5">{badge}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BaskilarPanelPlaceholder() {
    const awards = [
        { title: "TÜBİTAK Teşvik Ödülü", org: "TÜBİTAK", year: "2023", icon: "🏆" },
        { title: "En İyi Bildiri Ödülü", org: "IEEE ICSME 2022", year: "2022", icon: "🥇" },
        { title: "HMKÜ Araştırmacı Teşvik Ödülü", org: "HMKÜ Rektörlük", year: "2021", icon: "🎖️" },
    ];
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-hmku-dark">Başarılar & Tanınırlık</h2>
            {awards.map((a, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">{a.icon}</div>
                    <div className="flex-1">
                        <h3 className="font-black text-hmku-dark text-sm">{a.title}</h3>
                        <p className="text-xs text-hmku-muted mt-0.5">{a.org}</p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">{a.year}</span>
                </div>
            ))}
        </div>
    );
}

function PlaceholderPanel({ title, icon: Icon }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-hmku-dark">{title}</h2>
            <div className="bg-white/70 backdrop-blur-sm border border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
                <Icon className="w-10 h-10 text-slate-300" />
                <p className="text-sm font-bold text-hmku-muted">Bu bölüm yakında eklenecek</p>
                <p className="text-xs text-hmku-muted/60">Veriler yönetici paneli üzerinden güncellenebilir.</p>
            </div>
        </div>
    );
}

function IletisimPanel({ akademisyen }) {
    return (
        <div className="space-y-4">
            {/* Sayfa başlığı */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">İletişim</h2>
                <div className="mt-1.5 w-12 h-1 bg-slate-800 rounded-full" />
            </div>


            {/* Adres Bilgileri */}
            <AccordionSection title="Adres Bilgileri">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <a href="https://avesis.mku.edu.tr/ayhan.kaya" target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-blue-500 transition-colors">
                        https://avesis.mku.edu.tr/ayhan.kaya
                    </a>
                </div>
            </AccordionSection>

            {/* E-posta Bilgileri */}
            <AccordionSection title="E-posta Bilgileri">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>
                    <a href={`mailto:${akademisyen?.email}`} className="text-sm text-slate-500 hover:text-blue-500 transition-colors">
                        {akademisyen?.email}
                    </a>
                </div>
            </AccordionSection>

            {/* Uluslararası Araştırmacı ID'leri */}
            <AccordionSection title="Uluslararası Araştırmacı ID'leri">
                <div className="flex items-center gap-4">
                    {/* Google Scholar ikonu (kırmızı G benzeri) */}
                    <div className="w-6 h-6 flex items-center justify-center font-bold text-red-500 text-sm italic">G</div>
                    {/* Scopus ikonu (turuncu SC) */}
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">SC</div>
                    {/* ORCID ikonu (yeşil ID) */}
                    <div className="w-8 h-8 rounded-lg bg-[#A6CE39] flex items-center justify-center text-white text-[10px] font-bold">İD</div>
                    {/* Publons/WoS ikonu (mavi P) */}
                    <div className="w-8 h-8 rounded-lg bg-[#005595] flex items-center justify-center text-white text-[10px] font-bold">P</div>
                    {/* YÖK ikonu (kırmızı Y/K benzeri) */}
                    <div className="w-8 h-8 rounded-lg bg-[#E30613] flex items-center justify-center text-white text-[10px] font-bold tracking-tighter">YİK</div>
                </div>
            </AccordionSection>

            {/* Sosyal Medya Hesapları */}
            <AccordionSection title="Sosyal Medya Hesapları">
                <div className="flex items-center gap-3">
                    {["facebook", "linkedin", "researchgate", "instagram"].map((social) => (
                        <div key={social} className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white cursor-pointer hover:bg-slate-600 transition-colors">
                            {social === "facebook" && <span className="font-bold text-sm">f</span>}
                            {social === "linkedin" && <span className="font-bold text-sm">in</span>}
                            {social === "researchgate" && <span className="font-bold text-xs italic">R<sup>G</sup></span>}
                            {social === "instagram" && (
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// ANA SHELL BİLEŞENİ
// ═══════════════════════════════════════════════════════════════════
export default function ProfileShell({ akademisyen, stats, openAlexWorks, authorTopics = [] }) {
    const [activeTab, setActiveTab] = useState("anasayfa");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const gradient = getGradient(akademisyen?.name);
    const initials = getInitials(akademisyen?.name);


    const renderPanel = () => {
        switch (activeTab) {
            case "anasayfa": return <AnaSayfaPanel akademisyen={akademisyen} stats={stats} />;
            case "egitim": return <EgitimPanel />;
            case "arastirma": return <ArastirmaPanel authorTopics={authorTopics} />;
            case "idari": return <IdariPanel />;
            case "yayinlar": return (
                <YayinlarPanel
                    name={akademisyen?.name}
                    orcid={akademisyen?.orcid_id}
                    openAlexWorks={openAlexWorks}
                />
            );
            case "projeler": return <ProjelerPanel />;
            case "faaliyetler": return <FaaliyetlerPanel />;
            case "basarilar": return <BaskilarPanel stats={stats} />;
            case "duyurular": return <PlaceholderPanel title="Duyurular & Dokümanlar" icon={Bell} />;
            case "iletisim": return <IletisimPanel akademisyen={akademisyen} />;
            default: return <AnaSayfaPanel akademisyen={akademisyen} stats={stats} />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-hmku-bg">
            {/* ════════════════════ MOBİL HEADER (< lg) ════════════════════ */}
            <header className="lg:hidden grid grid-cols-3 items-center px-4 h-16 bg-hmku-dark text-white shrink-0 z-50 shadow-lg border-b border-white/5">
                <div className="flex justify-start">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white active:scale-95 transition-transform"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <TTOLogo size="w-5 h-5" fontSize="text-[5px]" />
                        <h1 className="text-[10px] font-black tracking-widest text-slate-500 uppercase leading-none mt-0.5">Bibliyografya</h1>
                    </div>
                    <span className="text-[11px] font-bold truncate w-full text-center px-2">{akademisyen?.name}</span>
                </div>

                <div className="flex justify-end pr-2">
                    {/* Placeholder for symmetry */}
                </div>
            </header>



            {/* ════════════════════ MOBİL MENU SIDEBAR ════════════════════ */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Backdrop Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

                {/* Sidebar Panel */}
                <div className={`absolute inset-y-0 left-0 w-72 h-full bg-hmku-dark shadow-2xl transition-transform duration-300 ease-out border-r border-white/10 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Akademik Profil</span>
                                <span className="text-sm font-bold text-white mt-0.5 truncate max-w-[180px]">{akademisyen?.name}</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
                            <p className="px-3 mb-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Navigasyon</p>
                            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                                const active = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            setActiveTab(id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] transition-all duration-200 ${active
                                            ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-slate-500"}`} />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer / User Area */}
                        <div className="p-4 border-t border-white/10">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Download className="w-4 h-4" />
                                CV Dosyası İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* ════════════════════ SOL SIDEBAR (lg+) ════════════════════ */}
            <aside className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col h-full overflow-y-auto bg-hmku-dark hide-scrollbar border-r border-white/5">

                {/* Branding row */}
                <div className="flex flex-col items-center justify-center pt-8 pb-4">
                    <div className="flex items-center gap-2.5 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <TTOLogo size="w-8 h-8" fontSize="text-[7px]" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">Bibliyografya</span>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center px-5 pb-5 pt-2">


                    <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl ring-4 ring-white/10 mb-4`}>
                        <span className="text-white text-4xl font-black">{initials}</span>
                    </div>
                    <h2 className="text-sm font-black text-white text-center leading-tight">{akademisyen?.name || "Akademisyen"}</h2>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 text-center">{akademisyen?.role || "Akademisyen"}</p>
                </div>

                {/* Sosyal medya ikonları */}
                <div className="px-5 pb-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {SOCIAL_ICONS.map(({ label, title, bg, textColor, href }) => (
                            <a key={title} href={href} title={title}
                                className={`w-9 h-9 rounded-full ${bg} ${textColor} flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform shadow-md`}>
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Ayırıcı */}
                <div className="mx-5 border-t border-white/10 mb-2" />

                {/* Navigasyon linkleri */}
                <nav className="flex-1 px-2 py-2 space-y-0.5">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 rounded-lg ${active
                                    ? "text-white font-black bg-white/10 shadow-sm"
                                    : "text-slate-400 font-normal hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* CV İndir */}
                <div className="px-5 py-4 border-t border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-white/8 border border-white/15 rounded-xl hover:bg-white/15 hover:text-white transition-all duration-200">
                        <Download className="w-3.5 h-3.5" />
                        Özgeçmiş Dosyası İndir
                    </button>
                </div>
            </aside>

            {/* ════════════════════ SAĞ İÇERİK ════════════════════ */}
            <main className="flex-1 h-full overflow-y-auto bg-hmku-bg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    {renderPanel()}
                </div>
            </main>
        </div>

    );
}
