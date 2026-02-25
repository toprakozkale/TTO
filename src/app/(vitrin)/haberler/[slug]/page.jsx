import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function calculateReadTime(content) {
    if (!content) return "1 dk";
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} dk`;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// ── Static params for build ─────────────────────────────────────
export async function generateStaticParams() {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from("bulletins").select("slug");
        return (data || []).map((b) => ({ slug: b.slug }));
    } catch {
        return [];
    }
}

// ── SEO Metadata ────────────────────────────────────────────────
export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("bulletins")
            .select("title, summary")
            .eq("slug", slug)
            .single();

        if (data) {
            return {
                title: `${data.title} | TTO Bülten`,
                description: data.summary || "",
            };
        }
    } catch { }
    return { title: "Bülten | TTO" };
}

// ── Page ────────────────────────────────────────────────────────
export default async function BultenDetayPage({ params }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: bulletin, error } = await supabase
        .from("bulletins")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !bulletin) {
        notFound();
    }

    const readTime = calculateReadTime(bulletin.content);

    return (
        <main className="min-h-screen bg-slate-50 pt-20">
            {/* ───── Cover Image ───── */}
            {bulletin.cover_image_url && (
                <div className="relative w-full h-[350px] md:h-[500px] bg-hmku-dark">
                    <Image
                        src={bulletin.cover_image_url}
                        alt={bulletin.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/30" />
                </div>
            )}

            {/* ───── Content ───── */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
                {/* Back navigation */}
                <Link
                    href="/haberler"
                    className="inline-flex items-center gap-2 text-sm font-bold text-hmku-muted hover:text-hmku-dark transition mb-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Tüm Bültenler
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
                    {/* Category Badge */}
                    {bulletin.category && (
                        <span className="inline-block px-3 py-1 bg-rose-50 text-hmku-primary text-[10px] font-black rounded-lg uppercase tracking-wider mb-6">
                            {bulletin.category}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-hmku-dark leading-tight tracking-tight mb-6">
                        {bulletin.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium mb-8">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(bulletin.published_at)}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {readTime} okuma
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            TTO Yayın Kurulu
                        </div>
                    </div>

                    {/* Summary */}
                    {bulletin.summary && (
                        <p className="text-lg text-slate-500 italic leading-relaxed mb-8 pb-8 border-b border-slate-100">
                            {bulletin.summary}
                        </p>
                    )}

                    {/* Content */}
                    <div className="prose prose-slate max-w-none text-hmku-dark leading-[1.8] whitespace-pre-wrap">
                        {bulletin.content}
                    </div>
                </div>
            </div>
        </main>
    );
}
