import {
    Cpu,
    Microscope,
    BrainCircuit,
    Sparkles,
    Leaf,
    Shield,
    Wifi,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import FeaturedCarousel from "./FeaturedCarousel";
import HeroSection from "./HeroSection";

// ── Icon mapping (DB'den gelen renk → icon + gradient map) ──────
const ICON_MAP = {
    emerald: { icon: Microscope, gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/15", tag: "bg-emerald-100 text-emerald-700" },
    amber: { icon: Cpu, gradient: "from-amber-500 to-orange-600", glow: "shadow-amber-500/15", tag: "bg-amber-100 text-amber-700" },
    rose: { icon: Shield, gradient: "from-rose-500 to-pink-600", glow: "shadow-rose-500/15", tag: "bg-rose-100 text-rose-700" },
    violet: { icon: BrainCircuit, gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-500/15", tag: "bg-violet-100 text-violet-700" },
    lime: { icon: Leaf, gradient: "from-lime-500 to-green-600", glow: "shadow-lime-500/15", tag: "bg-lime-100 text-lime-700" },
    sky: { icon: Wifi, gradient: "from-sky-500 to-blue-600", glow: "shadow-sky-500/15", tag: "bg-sky-100 text-sky-700" },
};

const DEFAULT_ICON = { icon: Sparkles, gradient: "from-slate-500 to-slate-600", glow: "shadow-slate-500/15", tag: "bg-slate-100 text-slate-700" };

// ── Hardcoded fallback projects ─────────────────────────────────
const FALLBACK_PROJECTS = [
    {
        id: "fallback-1",
        title: "Yapay Zeka Destekli Erken Uyarı Sistemi",
        category: "Yapay Zeka",
        description: "Makine öğrenmesi algoritmaları kullanarak doğal afetlere karşı erken uyarı sağlayan akıllı sistem.",
        icon_bg_color: "violet",
    },
    {
        id: "fallback-2",
        title: "Nano Malzeme Araştırma Projesi",
        category: "Malzeme Bilimi",
        description: "Yeni nesil nano malzemelerin endüstriyel uygulamalarına yönelik deneysel çalışma ve üretim süreçleri.",
        icon_bg_color: "emerald",
    },
    {
        id: "fallback-3",
        title: "Otonom İHA Kontrol Sistemi",
        category: "Savunma Teknoloji",
        description: "İnsansız hava araçları için otonom uçuş ve görev planlama kontrol yazılımı geliştirme.",
        icon_bg_color: "amber",
    },
    {
        id: "fallback-4",
        title: "Biyomedikal Sensör Geliştirme",
        category: "Biyomedikal",
        description: "Hasta takibi ve erken teşhis için giyilebilir biyomedikal sensör teknolojileri üzerine Ar-Ge çalışması.",
        icon_bg_color: "rose",
    },
    {
        id: "fallback-5",
        title: "Akıllı Tarım IoT Platformu",
        category: "Tarım Teknoloji",
        description: "IoT sensörleri ve yapay zeka ile tarımsal üretimi optimize eden akıllı tarım yönetim platformu.",
        icon_bg_color: "lime",
    },
    {
        id: "fallback-6",
        title: "5G Ağ Güvenliği Altyapısı",
        category: "Siber Güvenlik",
        description: "Yeni nesil 5G iletişim ağlarında güvenlik açıklarını tespit eden ve önleyen altyapı çözümü.",
        icon_bg_color: "sky",
    },
];

// ── Hardcoded fallback values ───────────────────────────────────
const FALLBACK = {
    hero_title: "GELECEĞİN TEKNOLOJİLERİ BURADA",
    hero_subtitle: "Üniversitemizin Teknoloji Transfer Ofisi olarak, akademik bilgiyi ticarileştirilebilir ürünlere dönüştürüyor, inovasyon ekosistemini güçlendiriyoruz.",
    stat_active_projects: "150+",
    stat_academics: "45",
    stat_research_units: "12",
};

// ── Helper: projeyi kart verisine dönüştür ──────────────────────
function mapProjectToCard(project) {
    const style = ICON_MAP[project.icon_bg_color] || DEFAULT_ICON;
    return {
        id: project.id,
        title: project.title,
        category: project.category || "",
        description: project.description || "",
        iconName: style.icon.displayName || "Sparkles",
        gradient: style.gradient,
        glow: style.glow,
        tag: style.tag,
    };
}

// ── Server Component: data fetch + render ───────────────────────
export default async function AnasayfaPage() {
    let settings = {};
    let dbProjects = [];

    try {
        const supabase = await createClient();

        // Homepage settings
        const { data: settingsData } = await supabase
            .from("homepage_settings")
            .select("key, value");

        if (settingsData) {
            settingsData.forEach((row) => {
                settings[row.key] = row.value;
            });
        }

        // Featured projects
        const { data: projectsData } = await supabase
            .from("projects")
            .select("*")
            .eq("is_featured", true)
            .order("featured_order", { ascending: true });

        if (projectsData && projectsData.length > 0) {
            dbProjects = projectsData;
        }
    } catch (err) {
        console.error("Homepage data fetch error:", err);
    }

    // Resolve values with fallbacks
    const heroTitle = settings.hero_title || FALLBACK.hero_title;
    const heroSubtitle = settings.hero_subtitle || FALLBACK.hero_subtitle;
    const heroBgImageUrl = settings.hero_bg_image_url || null;
    const statActiveProjects = settings.stat_active_projects || FALLBACK.stat_active_projects;
    const statAcademics = settings.stat_academics || FALLBACK.stat_academics;
    const statResearchUnits = settings.stat_research_units || FALLBACK.stat_research_units;

    // Use DB projects or fallback
    const projectsSource = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;
    const featuredProjects = projectsSource.map(mapProjectToCard);

    const stats = [
        { value: statActiveProjects, label: "Aktif Proje", iconName: "Lightbulb" },
        { value: statAcademics, label: "Akademisyen", iconName: "GraduationCap" },
        { value: statResearchUnits, label: "Araştırma Birimi", iconName: "Users" },
    ];

    // Parse hero title into words for styled rendering
    const titleWords = heroTitle.split(" ");

    return (
        <div>
            {/* ───── Hero Section ───── */}
            <HeroSection
                titleWords={titleWords}
                subtitle={heroSubtitle}
                bgImageUrl={heroBgImageUrl}
                stats={stats}
            />

            {/* ───── Featured Projects — Carousel ───── */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black text-hmku-primary bg-rose-50 rounded-full tracking-[0.15em] uppercase">
                        Öne Çıkan Projeler
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-hmku-dark tracking-tight">
                        Son Geliştirmelerimiz
                    </h2>
                    <p className="mt-3 text-sm text-hmku-muted max-w-lg mx-auto">
                        Akademisyenlerimiz tarafından yürütülen güncel araştırma ve
                        geliştirme projelerimiz
                    </p>
                </div>

                <FeaturedCarousel projects={featuredProjects} />
            </section>
        </div>
    );
}
