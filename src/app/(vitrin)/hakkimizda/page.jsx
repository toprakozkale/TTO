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

// Akademik meta verileri (email → veri eşleştirmesi)
const AKADEMIK_META = {
    "ayhan.kaya@mku.edu.tr": {
        expertise: ["Yapay Zeka", "Makine Öğrenmesi", "Siber Güvenlik"],
        publications: 42,
        hIndex: 14,
        projects: 8,
        bio: "Derin öğrenme ve siber güvenlik alanlarında 15+ yıllık deneyime sahip, ulusal ve uluslararası projelerde yürütücü.",
        featured: true,
    },
    "elif.demir@mku.edu.tr": {
        expertise: ["Proje Yönetimi", "TÜBİTAK", "AB H2020"],
        publications: 28,
        hIndex: 9,
        projects: 12,
        bio: "AB ve TÜBİTAK destekli projelerde koordinatörlük, teknoloji transfer süreçlerinde uzman.",
        featured: false,
    },
    "mehmet.yilmaz@mku.edu.tr": {
        expertise: ["Patent Hukuku", "Fikri Mülkiyet", "Ticarileştirme"],
        publications: 15,
        hIndex: 6,
        projects: 5,
        bio: "200+ patent başvurusu sürecinde danışmanlık, üniversite-sanayi lisans anlaşmaları.",
        featured: false,
    },
    "fatma.ozkan@mku.edu.tr": {
        expertise: ["Sanayi İşbirliği", "Spin-off", "KOBİ Desteği"],
        publications: 19,
        hIndex: 7,
        projects: 9,
        bio: "Üniversite-sanayi köprüsünde 10 yıllık deneyim, spin-off şirket kuruluş süreçleri.",
        featured: false,
    },
};

// Fallback ekip verileri (Supabase'den veri çekilemezse)
const fallbackEkip = [
    { name: "Prof. Dr. Ayhan Kaya", role: "TTO Direktörü", email: "ayhan.kaya@mku.edu.tr" },
    { name: "Doç. Dr. Elif Demir", role: "Proje Koordinatörü", email: "elif.demir@mku.edu.tr" },
    { name: "Dr. Mehmet Yılmaz", role: "Patent Uzmanı", email: "mehmet.yilmaz@mku.edu.tr" },
    { name: "Dr. Fatma Özkan", role: "Sanayi İlişkileri", email: "fatma.ozkan@mku.edu.tr" },
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
    const parts = name.split(" ").filter(
        (p) => !["prof.", "doç.", "dr.", "arş.", "gör.", "uzm.", "öğr."].includes(p.toLowerCase())
    );
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function getGradient(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export default async function HakkimizdaPage() {
    // Akademisyenleri Supabase'den çek
    let ekipUyeleri = fallbackEkip;

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("allowed_users")
            .select("name, email")
            .eq("role", "akademisyen")
            .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
            ekipUyeleri = data.map((user) => ({
                name: user.name || user.email.split("@")[0],
                role: "Akademisyen",
                email: user.email,
            }));
        }
    } catch (err) {
        console.error("Akademisyen fetch error:", err);
    }

    // Her üyeye initials, gradient ve akademik meta ekle
    const ekipWithVisuals = ekipUyeleri.map((m) => ({
        ...m,
        initials: getInitials(m.name),
        gradient: getGradient(m.name),
        meta: AKADEMIK_META[m.email] || {
            expertise: ["Araştırma", "Danışmanlık"],
            publications: 0,
            hIndex: 0,
            projects: 0,
            bio: "",
            featured: false,
        },
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

            {/* ───── Ekibimiz — Bento Bento Dağıtık Grid ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="text-center mb-14">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black text-hmku-primary bg-rose-50 rounded-full tracking-[0.15em] uppercase">
                        Akademisyenlerimiz
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-hmku-dark tracking-tight">
                        Uzman Kadromuz
                    </h2>
                    <p className="mt-3 text-sm text-hmku-muted max-w-lg mx-auto">
                        Teknoloji transferinin her aşamasında yanınızda olan
                        multidisipliner ekibimiz
                    </p>
                </div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5 auto-rows-auto">
                    {ekipWithVisuals.map((member, idx) => {
                        // Kart türü: idx'e göre döngüsel bento pattern
                        const pattern = idx % 6;

                        // Büyük öne çıkan kart (ilk veya her 6. eleman)
                        if (pattern === 0) return (
                            <Link
                                key={member.email}
                                href={`/hakkimizda/${encodeURIComponent(member.email)}`}
                                className="group lg:col-span-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-hmku-dark via-slate-800 to-slate-900 p-7 flex flex-col justify-between min-h-[280px] hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
                            >
                                {/* Arka plan glow */}
                                <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${member.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500`} />
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAwIDQwIEwgNDAgMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjMiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />

                                <div className="relative z-10">
                                    <span className="inline-block px-2.5 py-1 text-[10px] font-black text-rose-300 bg-hmku-primary/20 border border-hmku-primary/30 rounded-full tracking-[0.12em] uppercase mb-4">
                                        {member.role}
                                    </span>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                            <span className="text-white text-2xl font-black">{member.initials}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white leading-tight">{member.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <span className="text-[11px] text-slate-400 font-medium">Aktif Araştırmacı</span>
                                            </div>
                                        </div>
                                    </div>

                                    {member.meta.bio && (
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                                            {member.meta.bio}
                                        </p>
                                    )}

                                    {/* İstatistikler */}
                                    <div className="flex gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-xl font-black text-white">{member.meta.publications || "—"}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Yayın</p>
                                        </div>
                                        <div className="w-px bg-white/10"></div>
                                        <div className="text-center">
                                            <p className="text-xl font-black text-white">{member.meta.hIndex || "—"}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">H-İndeks</p>
                                        </div>
                                        <div className="w-px bg-white/10"></div>
                                        <div className="text-center">
                                            <p className="text-xl font-black text-white">{member.meta.projects || "—"}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Proje</p>
                                        </div>
                                    </div>

                                    {/* Uzmanlık etiketleri */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {(member.meta.expertise || []).map(tag => (
                                            <span key={tag} className="px-2 py-1 text-[10px] font-semibold text-slate-300 bg-white/8 rounded-lg border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Profil butonu */}
                                <div className="relative z-10 mt-5 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500 font-medium">{member.email}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-[11px] font-bold group-hover:bg-hmku-primary group-hover:border-hmku-primary transition-all duration-300">
                                        Profili Gör <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        );

                        // Dikey orta boy kart (idx 1, 4)
                        if (pattern === 1 || pattern === 4) return (
                            <Link
                                key={member.email}
                                href={`/hakkimizda/${encodeURIComponent(member.email)}`}
                                className="group lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-modern hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-4"
                            >
                                {/* Üst — avatar + isim */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                        <span className="text-white text-xl font-black">{member.initials}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-black text-hmku-dark leading-snug">{member.name}</h3>
                                        <p className="text-[11px] text-hmku-muted font-medium mt-0.5">{member.role}</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                {member.meta.bio && (
                                    <p className="text-xs text-hmku-muted leading-relaxed line-clamp-2 border-t border-slate-50 pt-3">
                                        {member.meta.bio}
                                    </p>
                                )}

                                {/* Uzmanlık */}
                                <div className="flex flex-wrap gap-1.5">
                                    {(member.meta.expertise || []).slice(0, 2).map(tag => (
                                        <span key={tag} className="px-2 py-1 text-[10px] font-semibold text-hmku-primary bg-rose-50 rounded-lg border border-rose-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Sayılar */}
                                <div className="flex gap-3 pt-2 border-t border-slate-50">
                                    <div>
                                        <p className="text-base font-black text-hmku-dark">{member.meta.publications || "—"}</p>
                                        <p className="text-[10px] text-hmku-muted uppercase tracking-wider font-semibold">Yayın</p>
                                    </div>
                                    <div className="w-px bg-slate-100"></div>
                                    <div>
                                        <p className="text-base font-black text-hmku-dark">{member.meta.hIndex || "—"}</p>
                                        <p className="text-[10px] text-hmku-muted uppercase tracking-wider font-semibold">H-İndeks</p>
                                    </div>
                                    <div className="w-px bg-slate-100"></div>
                                    <div>
                                        <p className="text-base font-black text-hmku-dark">{member.meta.projects || "—"}</p>
                                        <p className="text-[10px] text-hmku-muted uppercase tracking-wider font-semibold">Proje</p>
                                    </div>
                                    <div className="ml-auto flex items-end">
                                        <div className="w-8 h-8 rounded-xl bg-hmku-primary/8 flex items-center justify-center group-hover:bg-hmku-primary transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4 text-hmku-primary group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );

                        // Yatay kompakt kart (idx 2)
                        if (pattern === 2) return (
                            <Link
                                key={member.email}
                                href={`/hakkimizda/${encodeURIComponent(member.email)}`}
                                className="group lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-5 shadow-modern hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px]"
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform duration-300`}>
                                        <span className="text-white text-lg font-black">{member.initials}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-hmku-dark leading-snug">{member.name}</h3>
                                    <p className="text-[11px] text-hmku-muted font-medium mt-0.5">{member.role}</p>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {(member.meta.expertise || []).slice(0, 2).map(tag => (
                                        <span key={tag} className="px-2 py-0.5 text-[9px] font-bold text-hmku-muted bg-slate-50 rounded-full border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[11px] font-black text-hmku-dark">{member.meta.publications || "—"} <span className="text-hmku-muted font-normal">yayın</span></span>
                                    <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-hmku-primary transition-colors duration-300">
                                        <ArrowRight className="w-3.5 h-3.5 text-hmku-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                </div>
                            </Link>
                        );

                        // Renkli istatistik kartı (idx 3)
                        if (pattern === 3) return (
                            <Link
                                key={member.email}
                                href={`/hakkimizda/${encodeURIComponent(member.email)}`}
                                className={`group lg:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br ${member.gradient} p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer`}
                            >
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <span className="text-white text-xl font-black">{member.initials}</span>
                                    </div>
                                    <h3 className="text-base font-black text-white leading-snug">{member.name}</h3>
                                    <p className="text-[11px] text-white/70 font-medium mt-0.5">{member.role}</p>
                                    {member.meta.bio && (
                                        <p className="text-[11px] text-white/60 mt-2 leading-relaxed line-clamp-2">{member.meta.bio}</p>
                                    )}
                                </div>
                                <div className="relative z-10 flex items-center justify-between mt-4">
                                    <div className="flex gap-3">
                                        <span className="text-sm font-black text-white">{member.meta.publications || "—"}<span className="text-[10px] text-white/60 font-normal ml-0.5">yay.</span></span>
                                        <span className="text-white/30">|</span>
                                        <span className="text-sm font-black text-white">{member.meta.hIndex || "—"}<span className="text-[10px] text-white/60 font-normal ml-0.5">H</span></span>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </Link>
                        );

                        // Minimal yatay kart (idx 5)
                        return (
                            <Link
                                key={member.email}
                                href={`/hakkimizda/${encodeURIComponent(member.email)}`}
                                className="group lg:col-span-4 bg-hmku-bg rounded-3xl border border-slate-100 p-5 shadow-modern hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                        <span className="text-white text-xl font-black">{member.initials}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-hmku-dark leading-snug">{member.name}</h3>
                                        <p className="text-[11px] text-hmku-muted font-medium mt-0.5">{member.role}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {(member.meta.expertise || []).slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 text-[9px] font-bold text-hmku-primary bg-rose-50 rounded-full border border-rose-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-hmku-primary transition-colors duration-300 mt-0.5">
                                        <ArrowRight className="w-3.5 h-3.5 text-hmku-muted group-hover:text-white transition-colors duration-300" />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                                    <span className="text-xs text-hmku-muted"><span className="font-black text-hmku-dark">{member.meta.publications || "—"}</span> Yayın</span>
                                    <span className="text-xs text-hmku-muted"><span className="font-black text-hmku-dark">{member.meta.projects || "—"}</span> Proje</span>
                                </div>
                            </Link>
                        );
                    })}
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
