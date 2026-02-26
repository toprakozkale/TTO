import { createClient } from "@/lib/supabase/server";
import ProfileShell from "@/components/profile/ProfileShell";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabase = await createClient();
    const { data } = await supabase
        .from("akademisyenler")
        .select("ad_soyad")
        .eq("id", id)
        .single();

    return {
        title: `${data?.ad_soyad || "Akademisyen"} — Akademisyen Profili | HMKÜ TTO`,
        description: `Akademisyen profili — yayınlar, projeler ve araştırma alanları.`,
    };
}

export default async function AkademisyenProfilPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Akademisyen bilgisini Supabase'den çek
    const supabase = await createClient();
    const { data: akademisyen, error } = await supabase
        .from("akademisyenler")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !akademisyen) {
        return (
            <ProfileShell
                akademisyen={{ name: "Bulunamadı", role: "Akademisyen", email: "" }}
                stats={{ totalPublications: 0, openAccess: 0, citations: 0, hIndex: 0 }}
            />
        );
    }

    const filteredAkademisyen = {
        name: akademisyen.ad_soyad,
        email: akademisyen.email,
        role: akademisyen.rol_etiketi || "Akademisyen",
        bio: akademisyen.biyografi,
        expertise: akademisyen.uzmanlik_alanlari || [],
    };

    // İstatistikler
    const stats = {
        totalPublications: akademisyen.yayin_sayisi || 0,
        openAccess: 0, // Bu alan şimdilik veritabanında yok
        citations: 0,  // Bu alan şimdilik veritabanında yok
        hIndex: akademisyen.h_indeks || 0,
        projects: akademisyen.proje_sayisi || 0,
    };

    return <ProfileShell akademisyen={filteredAkademisyen} stats={stats} />;
}
