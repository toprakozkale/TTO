import { createClient } from "@/lib/supabase/server";
import ProfileShell from "@/components/profile/ProfileShell";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const id = decodeURIComponent(resolvedParams.id);
    return {
        title: `${id.split("@")[0]} — Akademisyen Profili | HMKÜ TTO`,
        description: `Akademisyen profili — yayınlar, projeler ve araştırma alanları.`,
    };
}

export default async function AkademisyenProfilPage({ params }) {
    const resolvedParams = await params;
    const rawId = decodeURIComponent(resolvedParams.id);

    // Akademisyen bilgisini Supabase'den çek
    let akademisyen = {
        name: rawId.includes("@") ? rawId.split("@")[0] : rawId,
        email: rawId.includes("@") ? rawId : null,
        role: "Akademisyen",
    };

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("allowed_users")
            .select("name, email, role")
            .eq("email", rawId)
            .single();

        if (!error && data) {
            akademisyen = {
                name: data.name || rawId.split("@")[0],
                email: data.email,
                role: data.role === "akademisyen" ? "Akademisyen" : data.role,
            };
        }
    } catch (err) {
        console.error("Profil fetch error:", err);
    }

    // İstatistikler (ileride Supabase yayın tablosundan çekilecek)
    const stats = {
        totalPublications: 24,
        openAccess: 9,
        citations: 412,
        hIndex: 11,
    };

    return <ProfileShell akademisyen={akademisyen} stats={stats} />;
}
