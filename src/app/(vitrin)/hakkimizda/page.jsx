import {
    Target,
    Eye,
    Rocket,
    Handshake,
    GraduationCap,
    Building2,
    Globe,
    Award,
    TrendingUp,
    Users,
    Lightbulb,
    ArrowRight,
    Quote,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const stats = [
    { value: "300+", label: "Desteklenen Proje", icon: Rocket },
    { value: "180+", label: "Sanayi İşbirliği", icon: Handshake },
    { value: "45", label: "Aktif Akademisyen", icon: GraduationCap },
    { value: "12", label: "Araştırma Birimi", icon: Building2 },
];

const hizmetler = [
    {
        icon: Award,
        title: "Patent & Fikri Mülkiyet",
        desc: "Akademisyenlere patent başvuru süreçlerinde destek, fikri sınai mülkiyet hakları konusunda farkındalık eğitimleri.",
    },
    {
        icon: Handshake,
        title: "Üniversite-Sanayi İşbirliği",
        desc: "Araştırma sonuçlarının sanayiye aktarılması, ortak Ar-Ge projeleri ve teknoloji lisanslama faaliyetleri.",
    },
    {
        icon: TrendingUp,
        title: "Ticarileştirme",
        desc: "Araştırma çıktılarının tescil başvurusu ile korunması ve pazara sunularak ticarileştirilmesi.",
    },
    {
        icon: Globe,
        title: "Uluslararasılaşma",
        desc: "Global ağlarla entegrasyon, uluslararası işbirlikleri ve teknoloji transfer faaliyetlerinin yaygınlaştırılması.",
    },
];

// Gradyan renkleri — isimden deterministik olarak seçilir
const GRADIENTS = [
    "from-hmku-primary to-rose-400",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-sky-500 to-blue-500",
    "from-rose-500 to-pink-500",
    "from-lime-500 to-green-500",
    "from-cyan-500 to-teal-500",
    "from-indigo-500 to-violet-500",
    "from-fuchsia-500 to-pink-500",
];

function getInitials(name) {
    if (!name) return "??";
    const parts = name.split(" ").filter(
        (p) => !["prof.", "doç.", "dr.", "arş.", "gör.", "uzm.", "öğr."].includes(p.toLowerCase())
    );
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function getGradient(name) {
    if (!name) return GRADIENTS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export default async function HakkimizdaPage() {
    const supabase = await createClient();

    // Akademisyenleri Supabase'den çek
    const { data: akademisyenler, error } = await supabase
        .from("akademisyenler")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Akademisyen fetch error:", error);
    }

    const liste = akademisyenler || [];

    // Her üyeye initials ve gradient ekle (UI için gerekli)
    const ekipWithVisuals = liste.map((m) => ({
        ...m,
        name: m.unvan ? `${m.unvan} ${m.ad_soyad}` : m.ad_soyad,
        role: m.rol_etiketi || "Akademisyen",
        initials: getInitials(m.ad_soyad),
        gradient: getGradient(m.ad_soyad),
        // Eski meta yapısını yeni tablo alanlarına eşle (Bento grid kodunu bozmamak için)
        meta: {
            expertise: m.uzmanlik_alanlari || ["Araştırma", "Danışmanlık"],
            publications: m.yayin_sayisi,
            hIndex: m.h_indeks,
            projects: m.proje_sayisi,
            bio: m.biyografi || "",
            featured: false, // Gelecekte eklenebilir
        },
        unvan: m.unvan,
    }));

    return (
        <div>
            {/* ───── Hero — Newspaper headline style ───── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-hmku-dark via-slate-900 to-slate-800 isolate">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-hmku-primary/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                    <span className="inline-block px-3 py-1 mb-6 text-[10px] font-black text-rose-300 bg-hmku-primary/10 border border-hmku-primary/20 rounded-full tracking-[0.15em] uppercase backdrop-blur-sm">
                        Hakkımızda
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
                        Akademik Bilgiyi{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-hmku-primary to-rose-400">
                            Katma Değere
                        </span>{" "}
                        Dönüştürüyoruz
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        Hatay Mustafa Kemal Üniversitesi Teknoloji Transfer Ofisi olarak,
                        araştırma yeniliklerini pazara taşıyor, üniversite ile sanayi
                        arasındaki köprüleri güçlendiriyoruz.
                    </p>
                </div>
            </section>

            {/* ───── Stats row ───── */}
            <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl shadow-modern border border-slate-100 p-5 text-center hover:shadow-lg transition-shadow duration-200"
                            >
                                <Icon className="w-6 h-6 mx-auto text-hmku-primary mb-2" />
                                <p className="text-2xl md:text-3xl font-black text-hmku-dark">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] text-hmku-muted font-semibold mt-1 uppercase tracking-wider">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ───── Uzman Kadromuz ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <style>{`
                    @keyframes ai-breathe {
                        0%, 100% {
                            box-shadow: 0 0 10px 1px rgba(15,23,42,0.15);
                            border-color: rgba(15,23,42,0.25);
                        }
                        50% {
                            box-shadow: 0 0 32px 8px rgba(15,23,42,0.45);
                            border-color: rgba(15,23,42,0.65);
                        }
                    }
                    @keyframes pulse-dot {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50%       { transform: scale(1.5); opacity: 0.5; }
                    }
                    .member-card-arrow {
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        transition: gap 0.2s ease;
                    }
                    .member-card-arrow:hover {
                        gap: 8px;
                    }
                `}</style>

                {/* Header */}
                <div className="mb-14">
                    {/* AI Badge — sol hizalı */}
                    <div className="flex justify-start mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black text-hmku-primary bg-rose-50 border border-rose-200 rounded-full tracking-[0.15em] uppercase">
                            <span
                                className="w-2 h-2 rounded-full bg-hmku-primary flex-shrink-0"
                                style={{ animation: 'pulse-dot 1.8s ease-in-out infinite' }}
                            />
                            YAPAY ZEKA DESTEKLİ
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-hmku-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="4" y="4" width="16" height="16" rx="2" />
                                <rect x="9" y="9" width="6" height="6" />
                                <line x1="9" y1="2" x2="9" y2="4" />
                                <line x1="15" y1="2" x2="15" y2="4" />
                                <line x1="9" y1="20" x2="9" y2="22" />
                                <line x1="15" y1="20" x2="15" y2="22" />
                                <line x1="2" y1="9" x2="4" y2="9" />
                                <line x1="2" y1="15" x2="4" y2="15" />
                                <line x1="20" y1="9" x2="22" y2="9" />
                                <line x1="20" y1="15" x2="22" y2="15" />
                            </svg>
                        </span>
                    </div>
                    {/* Başlık — ortalı */}
                    <h2 className="text-4xl md:text-6xl font-black text-hmku-dark tracking-tight text-center">
                        Uzman Kadromuz
                    </h2>
                    {/* Açıklama — ortalı */}
                    <p className="mt-4 text-base text-hmku-muted max-w-xl mx-auto text-center">
                        <strong>Qoodly AI</strong> ile anlık olarak güncellenen bibliyografya verileri ile
                        multidisipliner ekibimize göz atın.
                    </p>
                </div>

                {/* AI Breathing Frame */}
                {ekipWithVisuals.length > 0 ? (
                    <div
                        className="relative p-5 rounded-2xl border"
                        style={{ animation: 'ai-breathe 3s ease-in-out infinite', borderColor: 'rgba(15,23,42,0.2)' }}
                    >
                        {/* QAI Bibliyografya badge — üst orta */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-hmku-dark text-white text-[10px] font-black rounded-full tracking-widest uppercase whitespace-nowrap">
                            QAI BİBLİYOGRAFYA
                        </div>

                        {/* L-şekilli köşe bracket'lar */}
                        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-hmku-dark rounded-tl" />
                        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-hmku-dark rounded-tr" />
                        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-hmku-dark rounded-bl" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-hmku-dark rounded-br" />

                        {/* Kart Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ekipWithVisuals.map((member) => (
                                <Link
                                    key={member.id}
                                    href={`/hakkimizda/${member.id}?notice=1`}
                                    className="group flex min-h-[180px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Sol taraf — metin içeriği */}
                                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                                        <div>
                                            {/* Role etiketi */}
                                            <p className="text-[10px] font-black text-hmku-muted uppercase tracking-widest mb-1">
                                                {member.role}
                                            </p>
                                            {/* İsim */}
                                            <h3 className="text-xl font-black text-hmku-dark leading-tight mb-2">
                                                {member.name}
                                            </h3>
                                            {/* Bio */}
                                            {member.meta.bio && (
                                                <p className="text-xs text-hmku-muted leading-relaxed line-clamp-2 mb-3">
                                                    {member.meta.bio}
                                                </p>
                                            )}
                                            {/* Uzmanlık etiketleri */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {(member.meta.expertise || []).slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-[10px] font-semibold text-hmku-primary bg-rose-50 rounded-full border border-rose-100"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Alt kısım: istatistikler + link */}
                                        <div>
                                            {/* İstatistikler satırı */}
                                            <div className="flex items-center gap-3 mb-3 text-xs">
                                                <div>
                                                    <span className="font-black text-hmku-dark">{member.meta.publications ?? '—'}</span>
                                                    <span className="text-hmku-muted ml-1">Yayın</span>
                                                </div>
                                                <div className="w-px h-4 bg-slate-200" />
                                                <div>
                                                    <span className="font-black text-hmku-dark">{member.meta.hIndex ?? '—'}</span>
                                                    <span className="text-hmku-muted ml-1">H-İndeks</span>
                                                </div>
                                                <div className="w-px h-4 bg-slate-200" />
                                                <div>
                                                    <span className="font-black text-hmku-dark">{member.meta.projects ?? '—'}</span>
                                                    <span className="text-hmku-muted ml-1">Proje</span>
                                                </div>
                                            </div>
                                            {/* Profili İncele linki */}
                                            <span className="member-card-arrow text-[11px] font-bold text-hmku-primary group-hover:text-rose-700">
                                                Profili İncele
                                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sağ taraf — fotoğraf veya avatar */}
                                    <div className="w-44 flex-shrink-0 relative overflow-hidden">
                                        {member.fotograf_url ? (
                                            <img
                                                src={member.fotograf_url}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${member.gradient} opacity-10 absolute inset-0`} />
                                        )}
                                        {!member.fotograf_url && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                                <div
                                                    className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                                                >
                                                    <span className="text-white text-3xl font-black">{member.initials}</span>
                                                </div>
                                                {/* Aktif badge */}
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                                    <span className="text-[10px] font-bold text-emerald-700">Aktif</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-hmku-dark">Henüz Akademisyen Eklenmemiş</h3>
                        <p className="text-sm text-hmku-muted mt-1">Ekibimiz çok yakında burada paylaşılacaktır.</p>
                    </div>
                )}
            </section>

            {/* ───── Kuruluş Hikayesi — Editorial two-column ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                    {/* Left — Text */}
                    <div>
                        <span className="inline-block px-3 py-1 mb-4 text-[11px] font-black text-hmku-primary bg-rose-50 rounded-full tracking-[0.15em] uppercase">
                            Kuruluş Hikayemiz
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-hmku-dark tracking-tight leading-tight">
                            Fikirler Burada <br className="hidden md:block" />Ürüne Dönüşür
                        </h2>
                        <div className="mt-6 space-y-4 text-base text-hmku-muted leading-relaxed">
                            <p>
                                Hatay Mustafa Kemal Üniversitesi Teknoloji Transfer Ofisi,
                                akademisyenlerimize patent süreçlerinde destek verilmesi ve
                                fikri sınai mülkiyet hakları konularında üniversite içerisinde
                                farkındalık yaratılması amacıyla kurulmuştur.
                            </p>
                            <p>
                                TÜBİTAK 1513 — Teknoloji Transfer Ofisleri Destekleme Programı
                                kapsamında destek alan ofisimiz; üniversiteden çıkan araştırma
                                sonuçlarının tescil başvurusu yapılarak korunmasını ve
                                ticarileştirilmesini, üniversite-sanayi arasında işbirliği
                                çalışmalarının yürütülmesini ve fikri sınai mülkiyet hakları
                                konularında sözleşme desteğinin verilmesini sağlamaktadır.
                            </p>
                        </div>

                        {/* Misyon & Vizyon inline */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-rose-50/60 rounded-xl p-6 border border-rose-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-6 h-6 text-hmku-primary" />
                                    <h3 className="text-base font-black text-hmku-dark">
                                        Misyonumuz
                                    </h3>
                                </div>
                                <p className="text-sm text-hmku-muted leading-relaxed">
                                    Etkin bir teknoloji transfer stratejisi ile araştırma
                                    yeniliklerini pazara taşımak, üniversite ve sanayi arasında
                                    katma değeri yüksek projeler geliştirmek, akademik
                                    girişimcilik çalışmalarını aktif bir şekilde sürdürmek ve
                                    uluslararasılaşma faaliyetlerini yaygınlaştırmak.
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60">
                                <div className="flex items-center gap-2 mb-3">
                                    <Eye className="w-6 h-6 text-hmku-primary" />
                                    <h3 className="text-base font-black text-hmku-dark">
                                        Vizyonumuz
                                    </h3>
                                </div>
                                <p className="text-sm text-hmku-muted leading-relaxed">
                                    Zengin teknoloji portföyü, başarılı ticarileştirme
                                    faaliyetleri ve üniversite-sanayi arasındaki güçlü
                                    işbirlikleri ile dünya çapında tanınan, etkin, girişimci,
                                    öncü ve sürdürülebilir bir teknoloji transfer ofisi olmak.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Visual card collage */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-5 h-full">
                            <div className="flex flex-col gap-5">
                                <div className="bg-gradient-to-br from-hmku-primary to-hmku-dark rounded-2xl p-8 text-white flex-1 flex flex-col items-center justify-center text-center">
                                    <Lightbulb className="w-10 h-10 mb-3 opacity-80" />
                                    <p className="text-xl font-black leading-tight">
                                        İnovasyon Odaklı Yaklaşım
                                    </p>
                                    <p className="text-xs text-white/60 mt-1">
                                        Her bir projeye bireysel çözümler
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-modern border border-slate-100 p-6 text-center">
                                    <Quote className="w-5 h-5 text-hmku-primary mb-2 mx-auto" />
                                    <p className="text-sm text-hmku-dark leading-relaxed italic">
                                        &quot;Üniversitedeki bilimsel birikimi topluma faydalı
                                        ürünlere dönüştürmek en büyük hedefimiz.&quot;
                                    </p>
                                    <p className="mt-3 text-[11px] font-bold text-hmku-muted">
                                        — TTO Direktörü
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div className="bg-white rounded-2xl shadow-modern border border-slate-100 p-8 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                                        <Award className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <p className="text-sm font-bold text-hmku-dark">
                                        TÜBİTAK 1513
                                    </p>
                                    <p className="text-[11px] text-hmku-muted mt-1">
                                        Destekleme Programı Kapsamında
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white flex-1 flex flex-col items-center justify-center text-center">
                                    <Users className="w-10 h-10 mb-3 opacity-80" />
                                    <p className="text-xl font-black leading-tight">
                                        Güçlü Ekip & İşbirliği
                                    </p>
                                    <p className="text-xs text-white/60 mt-1">
                                        Multidisipliner uzman kadro
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Hizmetlerimiz ───── */}
            <section className="bg-hmku-bg py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 mb-4 text-[11px] font-black text-hmku-primary bg-rose-50 rounded-full tracking-[0.15em] uppercase">
                            Hizmetlerimiz
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-hmku-dark tracking-tight">
                            Laboratuvardan Pazara Tam Destek
                        </h2>
                        <p className="mt-3 text-base text-hmku-muted max-w-xl mx-auto">
                            Akademik araştırmadan ticarileştirmeye kadar her aşamada
                            yanınızdayız
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hizmetler.map((h) => {
                            const Icon = h.icon;
                            return (
                                <div
                                    key={h.title}
                                    className="bg-white rounded-xl shadow-modern border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-hmku-primary transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-hmku-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-base font-bold text-hmku-dark">
                                        {h.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-hmku-muted leading-relaxed">
                                        {h.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>



            {/* ───── CTA — Newspaper footer banner ───── */}
            <section className="bg-gradient-to-br from-hmku-dark via-slate-900 to-slate-800 py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                        Projelerinizi Birlikte{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-hmku-primary to-rose-400">
                            Hayata Geçirelim
                        </span>
                    </h2>
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                        Araştırma fikirlerinizi ticarileştirmek veya sanayi ile işbirliği
                        kurmak için bizimle iletişime geçin.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/iletisim"
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-white bg-hmku-primary rounded-xl hover:bg-rose-800 transition-all duration-200 shadow-xl shadow-hmku-primary/25 hover:shadow-2xl hover:shadow-hmku-primary/35 active:scale-[0.97]"
                        >
                            İletişime Geçin
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/teknolojiler"
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-slate-300 border border-white/15 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200 active:scale-[0.97]"
                        >
                            Projeleri İnceleyin
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
