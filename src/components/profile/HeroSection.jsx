import {
    Mail,
    Globe,
    BookMarked,
    Unlock,
    TrendingUp,
    GraduationCap,
    Building2,
    ExternalLink,
} from "lucide-react";

function StatBadge({ icon: Icon, label, value, color }) {
    return (
        <div
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border ${color} text-center min-w-[100px]`}
        >
            <Icon className="w-5 h-5 opacity-80" />
            <span className="text-xl font-black leading-none">{value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70 leading-tight">
                {label}
            </span>
        </div>
    );
}

export default function HeroSection({ akademisyen, stats }) {
    const name = akademisyen?.name || "Akademisyen";
    const role = akademisyen?.role || "Akademisyen";
    const department = akademisyen?.department || "";
    const email = akademisyen?.email || "";

    // Deterministik gradient
    const GRADIENTS = [
        "from-hmku-primary to-rose-400",
        "from-violet-500 to-purple-500",
        "from-emerald-500 to-teal-500",
        "from-amber-500 to-orange-500",
        "from-sky-500 to-blue-500",
    ];
    const hash = name.split("").reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0);
    const gradient = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

    const initials = name
        .split(" ")
        .filter((p) =>
            !["prof.", "doç.", "dr.", "arş.", "gör.", "uzm.", "öğr."].includes(p.toLowerCase())
        )
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();

    const statItems = [
        {
            icon: BookMarked,
            label: "Toplam Yayın",
            value: stats?.totalPublications ?? "—",
            color: "bg-rose-50/80 border-rose-200/60 text-hmku-primary",
        },
        {
            icon: Unlock,
            label: "Açık Erişim",
            value: stats?.openAccess ?? "—",
            color: "bg-emerald-50/80 border-emerald-200/60 text-emerald-600",
        },
        {
            icon: TrendingUp,
            label: "Etkili Atıf",
            value: stats?.citations ?? "—",
            color: "bg-amber-50/80 border-amber-200/60 text-amber-600",
        },
        {
            icon: GraduationCap,
            label: "H-İndeks",
            value: stats?.hIndex ?? "—",
            color: "bg-sky-50/80 border-sky-200/60 text-sky-600",
        },
    ];

    return (
        <section id="profil" className="relative overflow-hidden rounded-3xl">
            {/* Arka plan derinlik efektleri */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-hmku-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-rose-400/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-amber-400/6 rounded-full blur-[40px] pointer-events-none" />

            {/* Glassmorphism kartı */}
            <div className="relative bg-white/65 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Üst kısım — gradient çizgisi */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

                <div className="p-5 sm:p-7 lg:p-8">
                    {/* Profil üst satır */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Büyük avatar */}
                        <div className="relative flex-shrink-0">
                            <div
                                className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}
                            >
                                <span className="text-white text-3xl sm:text-4xl font-black">
                                    {initials}
                                </span>
                            </div>
                            {/* Verified badge */}
                            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-hmku-primary rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                <GraduationCap className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        {/* İsim & Meta */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-black text-hmku-primary bg-rose-50 border border-rose-200/60 rounded-full uppercase tracking-[0.12em]">
                                    TTO Akademisyeni
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-hmku-dark tracking-tight leading-tight">
                                {name}
                            </h1>
                            <p className="mt-1 text-sm sm:text-base text-hmku-muted font-medium">
                                {role}
                            </p>
                            {department && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-hmku-muted flex-shrink-0" />
                                    <p className="text-xs text-hmku-muted">{department}</p>
                                </div>
                            )}

                            {/* İletişim butonları */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-hmku-dark bg-white/80 border border-slate-200/80 rounded-lg hover:bg-rose-50 hover:text-hmku-primary hover:border-rose-200 transition-all duration-200 shadow-sm"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        {email}
                                    </a>
                                )}
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-hmku-dark bg-white/80 border border-slate-200/80 rounded-lg hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all duration-200 shadow-sm"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    Akademik Sayfa
                                    <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ─── Floating Stats ─── */}
                    <div className="mt-6 pt-5 border-t border-white/40">
                        {/* Masaüstü: tek satır flex | Mobil: 2×2 grid */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 overflow-x-auto hide-scrollbar pb-0.5">
                            {statItems.map((stat) => (
                                <StatBadge key={stat.label} {...stat} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
