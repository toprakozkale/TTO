import Link from "next/link";
import Image from "next/image";
import {
    Mail,
    ChevronRight,
    Calendar,
    Clock,
    User,
    ArrowUpRight,
    Search,
    Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { bultenHaberleri } from "@/constants/newsData";

// ── Fallback verileri ───────────────────────────────────────────
const FALLBACK_TITLE = "TTO BÜLTEN";
const FALLBACK_SUBTITLE =
    "Üniversite-sanayi iş birliği, teknoloji transferi, inovasyon ve girişimcilik dünyasından en son haberler, analizler ve duyurular.";

function calculateReadTime(content) {
    if (!content) return "1 dk";
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} dk`;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default async function HaberlerPage() {
    let bulletins = [];
    let featured = null;
    let pageTitle = FALLBACK_TITLE;
    let pageSubtitle = FALLBACK_SUBTITLE;
    let useFallback = false;

    try {
        const supabase = await createClient();

        // Sayfa ayarları
        const { data: settingsData } = await supabase
            .from("homepage_settings")
            .select("key, value")
            .in("key", ["bulletin_page_title", "bulletin_page_subtitle"]);

        if (settingsData) {
            settingsData.forEach((row) => {
                if (row.key === "bulletin_page_title" && row.value) pageTitle = row.value;
                if (row.key === "bulletin_page_subtitle" && row.value) pageSubtitle = row.value;
            });
        }

        // Tüm bültenler
        const { data: bulletinsData } = await supabase
            .from("bulletins")
            .select("*")
            .order("published_at", { ascending: false });

        if (bulletinsData && bulletinsData.length > 0) {
            bulletins = bulletinsData;
            featured = bulletins.find((b) => b.is_featured) || bulletins[0];
        } else {
            useFallback = true;
        }
    } catch (err) {
        console.error("Haberler fetch error:", err);
        useFallback = true;
    }

    // Fallback: newsData.js
    if (useFallback) {
        const fallbackFeatured = bultenHaberleri.find((n) => n.id === "featured");
        const fallbackArchive = bultenHaberleri.filter((n) => n.id !== "featured");
        featured = fallbackFeatured
            ? {
                id: "featured",
                title: fallbackFeatured.title,
                summary: fallbackFeatured.excerpt,
                content: fallbackFeatured.excerpt,
                cover_image_url: fallbackFeatured.image,
                category: fallbackFeatured.category,
                published_at: null,
                slug: null,
                _date: fallbackFeatured.date,
                _author: fallbackFeatured.author,
                _readTime: fallbackFeatured.readTime,
            }
            : null;
        bulletins = fallbackArchive.map((n) => ({
            id: n.id,
            title: n.title,
            summary: n.excerpt,
            content: n.excerpt,
            cover_image_url: n.image,
            category: n.category,
            published_at: null,
            slug: null,
            _date: n.date,
            _readTime: n.readTime,
            _link: n.link,
        }));
    }

    const archive = bulletins.filter((b) => b.id !== featured?.id);

    // Title split for styled render
    const titleParts = pageTitle.split(" ");

    return (
        <main className="min-h-screen bg-slate-50 pt-20">
            {/* ───── Hero Section ───── */}
            <section className="relative py-16 md:py-24 overflow-hidden bg-hmku-dark">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-hmku-primary/20 border border-hmku-primary/30 rounded-full mb-6">
                            <span className="w-2 h-2 rounded-full bg-hmku-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                GÜNCEL YAYINLAR
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                            {titleParts.length > 1 ? (
                                <>
                                    {titleParts.slice(0, -1).join(" ")}{" "}
                                    <span className="text-hmku-primary">
                                        {titleParts[titleParts.length - 1]}
                                    </span>
                                </>
                            ) : (
                                pageTitle
                            )}
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                            {pageSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* ───── Featured Content ───── */}
            {featured && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                    <Link
                        href={featured.slug ? `/haberler/${featured.slug}` : "#"}
                        className="group"
                    >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[450px] border border-slate-100 hover:shadow-emerald-500/10 transition-all duration-500">
                            <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-auto overflow-hidden">
                                <Image
                                    src={featured.cover_image_url}
                                    alt={featured.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r" />
                            </div>

                            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-rose-50 text-hmku-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                                        {featured.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {featured._date ||
                                            formatDate(featured.published_at)}
                                    </div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black text-hmku-dark leading-tight mb-4 group-hover:text-hmku-primary transition-colors">
                                    {featured.title}
                                </h2>

                                <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                                    {featured.summary}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-hmku-dark">
                                                {featured._author || "TTO Yayın Kurulu"}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Teknoloji Transfer Ofisi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-hmku-primary group-hover:gap-4 transition-all duration-300">
                                        Bülteni Oku
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* ───── News Grid ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-hmku-dark tracking-tight">
                            Geçmiş Yayınlar
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Bilgi birikimimize ve arşivimize göz atın.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {archive.map((news) => (
                        <Link
                            key={news.id}
                            href={
                                news.slug
                                    ? `/haberler/${news.slug}`
                                    : news._link || "#"
                            }
                            className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-48 sm:h-56 overflow-hidden">
                                <Image
                                    src={news.cover_image_url}
                                    alt={news.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur shadow-sm text-hmku-primary text-[9px] font-black rounded-lg uppercase tracking-wider">
                                        {news.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {news._date ||
                                            formatDate(news.published_at)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {news._readTime ||
                                            calculateReadTime(news.content)}
                                    </div>
                                </div>

                                <h4 className="text-lg font-black text-hmku-dark leading-snug mb-3 group-hover:text-hmku-primary transition-colors line-clamp-2">
                                    {news.title}
                                </h4>

                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {news.summary}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-hmku-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                                        Devamını Oku
                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-4 h-4 text-hmku-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ───── Newsletter Subscription ───── */}
            <section className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-hmku-dark rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-hmku-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <div className="w-16 h-16 bg-hmku-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Mail className="w-8 h-8 text-hmku-primary" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                            TTO Bülten&apos;e Abone Olun
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                            En son teknoloji haberlerini, etkinlik duyurularını ve iş
                            birliği fırsatlarını kaçırmayın.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                            <div className="flex-grow">
                                <input
                                    type="email"
                                    placeholder="E-posta Adresiniz"
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hmku-primary focus:bg-white/10 transition-all font-medium"
                                />
                            </div>
                            <button className="px-10 py-4 bg-hmku-primary text-white font-black rounded-2xl hover:bg-rose-800 transition-all duration-300 shadow-lg shadow-hmku-primary/30 active:scale-95 whitespace-nowrap">
                                Abone Ol
                            </button>
                        </div>

                        <p className="mt-8 text-slate-500 text-xs tracking-wider uppercase font-bold">
                            © 2026 Üniversite TTO. Tüm Hakları Saklıdır.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
