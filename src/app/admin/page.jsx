import {
    Users,
    FolderOpen,
    Clock,
    ArrowRight,
    FileText,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    ExternalLink,
} from "lucide-react";
import { getExternalBulletins } from "@/lib/getExternalBulletins";
import ScrapeButton from "@/components/admin/ScrapeButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// statCards artık AdminPage fonksiyonu içinde oluşturuluyor (dinamik veriler için)

// ── Bülten kartı renk konfigürasyonları ──
const bulletinConfig = {
    tubitak: {
        title: "TÜBİTAK BÜLTEN",
        icon: FileText,
        bg: "bg-blue-600",
        shadow: "shadow-blue-500/20",
        badgeClass: "bg-blue-50 text-blue-600",
        hoverText: "group-hover:text-blue-600",
        badgeTextClass: "text-blue-500",
        footerBtn: "text-blue-700 hover:bg-blue-600",
        footerLabel: "Tüm Listeyi Gör",
    },
    erasmus: {
        title: "ERASMUS+ BÜLTENİ",
        icon: Info,
        bg: "bg-emerald-600",
        shadow: "shadow-emerald-500/20",
        badgeClass: "bg-emerald-50 text-emerald-600",
        hoverText: "group-hover:text-emerald-600",
        badgeTextClass: "text-emerald-500",
        footerBtn: "text-emerald-700 hover:bg-emerald-600",
        footerLabel: "Partner Ağına Katıl",
    },
    bakanlik: {
        title: "BAKANLIK BÜLTENİ",
        icon: Bell,
        bg: "bg-hmku-primary",
        shadow: "shadow-hmku-primary/20",
        badgeClass: "bg-rose-50 text-hmku-primary",
        hoverText: "group-hover:text-hmku-primary",
        badgeTextClass: "text-hmku-primary",
        footerBtn: "text-hmku-primary hover:bg-hmku-primary",
        footerLabel: "Teşvikleri İncele",
    },
};

function BulletinCard({ items, config }) {
    const Icon = config.icon;
    const displayItems = items.slice(0, 10);

    return (
        <div className="bg-white rounded-2xl shadow-modern border border-slate-100 overflow-hidden flex flex-col h-[640px]">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shadow-lg ${config.shadow}`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-black text-hmku-dark tracking-tight uppercase">
                        {config.title}
                    </h3>
                </div>
                <span className={`px-2 py-1 ${config.badgeClass} text-[10px] font-bold rounded-md`}>
                    {items.length > 0 ? `${items.length} Kayıt` : "Veri Yok"}
                </span>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-5">
                {displayItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Icon className="w-10 h-10 text-slate-200 mb-3" />
                        <p className="text-sm text-hmku-muted">Henüz veri bulunmuyor.</p>
                        <p className="text-[11px] text-slate-400 mt-1">&quot;Şimdi Güncelle&quot; ile verileri çekin.</p>
                    </div>
                ) : (
                    displayItems.map((item, idx) => (
                        <a
                            key={item.id || idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block group cursor-pointer ${idx > 0 ? "pt-4 border-t border-slate-50" : ""}`}
                        >
                            <p className={`text-[14px] font-bold text-hmku-dark ${config.hoverText} transition-colors leading-snug flex items-start gap-1.5`}>
                                {item.title}
                                <ExternalLink size={12} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </p>
                            {item.description && (
                                <p className="mt-1.5 text-[12px] text-hmku-muted leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {item.badge && (
                                    <span className={`text-[10px] font-bold ${config.badgeTextClass} uppercase`}>
                                        {item.badge}
                                    </span>
                                )}
                                {item.date && (
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))
                )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button className={`w-full py-2.5 bg-white border border-slate-200 ${config.footerBtn} text-xs font-black rounded-xl hover:text-white transition-all shadow-sm flex items-center justify-center gap-2`}>
                    {config.footerLabel} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}

export default async function AdminPage() {
    let externalData = { tubitak: [], erasmus: [], bakanlik: [] };
    let userCount = 0;

    try {
        const supabase = await createClient();
        const [bulletins, usersResult] = await Promise.all([
            getExternalBulletins(),
            supabase.from('allowed_users').select('id', { count: 'exact', head: true }),
        ]);
        externalData = bulletins;
        userCount = usersResult.count ?? 0;
    } catch (err) {
        console.error("Admin page data fetch error:", err);
    }

    const statCards = [
        {
            label: "Kullanıcı Sayısı",
            value: String(userCount),
            icon: Users,
            gradient: "from-blue-500 to-blue-600",
            glow: "shadow-blue-500/15",
        },
        {
            label: "Aktif Projeler",
            value: "34",
            icon: FolderOpen,
            gradient: "from-emerald-500 to-emerald-600",
            glow: "shadow-emerald-500/15",
        },
        {
            label: "Bekleyen Onaylar",
            value: "7",
            icon: Clock,
            gradient: "from-hmku-accent to-amber-600",
            glow: "shadow-amber-500/15",
        },
    ];

    return (
        <div>
            {/* Page header */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-hmku-dark tracking-tight">
                        Akış Kontrolü
                    </h1>
                    <p className="mt-1 text-sm text-hmku-muted">
                        Sistemdeki güncel durumu ve aktiviteleri takip edin.
                    </p>
                </div>
                <ScrapeButton />
            </div>

            {/* Stat cards — 3 cards, no messages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className={`bg-white rounded-xl shadow-modern p-5 border border-slate-100 hover:shadow-lg ${card.glow} transition-shadow duration-200`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                        {card.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-black text-hmku-dark">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.glow}`}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Project Bulletins Grid — Dynamic from Supabase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                <BulletinCard items={externalData.tubitak} config={bulletinConfig.tubitak} />
                <BulletinCard items={externalData.erasmus} config={bulletinConfig.erasmus} />
                <BulletinCard items={externalData.bakanlik} config={bulletinConfig.bakanlik} />
            </div>
        </div>
    );
}
