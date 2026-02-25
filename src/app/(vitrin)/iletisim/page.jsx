import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/vitrin/ContactForm";

// Fallback contact data
const DEFAULTS = {
    contact_phone: "+90 326 245 58 45",
    contact_email: "tto@mku.edu.tr",
    contact_address: "TTO Binası, Kat 3, Merkez Kampüs, Hatay Mustafa Kemal Üniversitesi, 31000 Antakya/Hatay",
    contact_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3230.134371485603!2d36.18567227633512!3d36.315516772822435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152674e79393e179%3A0xe5479ea76939634e!2sHatay%20Mustafa%20Kemal%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1709400000000!5m2!1str!2str",
    contact_hours_weekday: "08:30 - 17:30",
    contact_hours_weekend: "Kapalı",
    contact_instagram: "https://instagram.com",
    contact_linkedin: "https://linkedin.com",
    contact_twitter: "https://x.com",
};

export default async function IletisimPage() {
    let contactData = { ...DEFAULTS };

    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("homepage_settings")
            .select("key, value")
            .like("key", "contact_%");

        if (data) {
            data.forEach((row) => {
                if (row.value) contactData[row.key] = row.value;
            });
        }
    } catch (err) {
        console.error("Contact data fetch error:", err);
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-20">
            {/* ───── Hero Section ───── */}
            <section className="relative py-20 bg-hmku-dark overflow-hidden">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-hmku-primary/20 border border-hmku-primary/30 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-hmku-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                            BİZE ULAŞIN
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        Yenilikçi Fikirleri{" "}
                        <span className="text-hmku-primary text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
                            Birlikte Geliştirelim
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Üniversite Teknoloji Transfer Ofisi (TTO) ile bağlantı kurun.
                        Projeleriniz, iş birliği talepleriniz veya sorularınız için
                        yanınızdayız.
                    </p>
                </div>
            </section>

            {/* Client component handles interactive parts */}
            <ContactForm contactData={contactData} />
        </main>
    );
}
