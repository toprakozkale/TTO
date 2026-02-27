import { createClient } from "@/lib/supabase/server";
import ProfileShell from "@/components/profile/ProfileShell";
import { getAuthorByOrcid, getAllWorksByOrcid, getIndexesForWorks } from "@/lib/openalex";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabase = await createClient();
    const { data: akademisyen } = await supabase
        .from("akademisyenler")
        .select("ad_soyad")
        .eq("id", id)
        .single();

    return {
        title: `${akademisyen?.ad_soyad || "Profil"} | Akademisyen Profili`,
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

    // OpenAlex Entegrasyonu
    let openAlexWorks = null;
    let authorStats = null;

    if (akademisyen.orcid_id) {
        const [allWorks, authorData] = await Promise.all([
            getAllWorksByOrcid(akademisyen.orcid_id),
            getAuthorByOrcid(akademisyen.orcid_id)
        ]);
        authorStats = authorData;

        // Yayınları dergi endeksleriyle zenginleştir
        if (allWorks.length > 0) {
            const indexMap = await getIndexesForWorks(allWorks);
            const enrichedWorks = allWorks.map(work => ({
                ...work,
                journalIndexes: work.primary_location?.source?.issn_l
                    ? (indexMap.get(work.primary_location.source.issn_l) ?? [])
                    : []
            }));
            // WorksSection beklediği formatta sar
            openAlexWorks = {
                results: enrichedWorks,
                meta: { count: enrichedWorks.length }
            };
        }

        // İstatistikleri Supabase'de asenkron güncelle (beklemiyoruz)
        if (authorStats) {
            supabase
                .from('akademisyenler')
                .update({
                    yayin_sayisi: authorStats.works_count,
                    h_indeks: authorStats.summary_stats?.h_index,
                    // proje_sayisi genelde OpenAlex'te olmaz, manuel kalabilir
                })
                .eq('id', id)
                .then(({ error }) => {
                    if (error) console.error("Stat update error:", error);
                });
        }
    }

    const filteredAkademisyen = {
        id: akademisyen.id,
        name: akademisyen.ad_soyad,
        email: akademisyen.email,
        role: akademisyen.rol_etiketi || "Akademisyen",
        bio: akademisyen.biyografi,
        expertise: akademisyen.uzmanlik_alanlari || [],
        orcid_id: akademisyen.orcid_id,
    };

    // Zenginleştirilmiş yayın listesinden endeks istatistiklerini hesapla
    const enrichedResults = openAlexWorks?.results ?? [];
    const wosCount = enrichedResults.filter(w =>
        w.journalIndexes?.some(i => ['SCIE', 'SSCI', 'AHCI'].includes(i))
    ).length;
    const scopusCount = enrichedResults.filter(w =>
        w.journalIndexes?.includes('SCOPUS')
    ).length;
    const openAccessCount = enrichedResults.filter(w =>
        w.open_access?.is_oa === true
    ).length;

    // İstatistikler
    const stats = {
        totalPublications: authorStats?.works_count || akademisyen.yayin_sayisi || 0,
        openAccess: openAccessCount,
        citations: authorStats?.cited_by_count || 0,
        hIndex: authorStats?.summary_stats?.h_index || akademisyen.h_indeks || 0,
        projects: akademisyen.proje_sayisi || 0,
        wosCount,
        scopusCount,
    };

    return (
        <ProfileShell
            akademisyen={filteredAkademisyen}
            stats={stats}
            openAlexWorks={openAlexWorks}
            authorTopics={authorStats?.topics ?? []}
        />
    );
}
