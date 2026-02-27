const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY
const BASE_URL = 'https://api.openalex.org'

// Akademisyen ana bilgilerini çek (works_count, cited_by_count, h_index vb.)
export async function getAuthorByOrcid(orcid: string) {
    if (!orcid) return null;
    // ORCID sadece ID kısmını içermeli: 0000-0002-XXXX-XXXX
    const cleanOrcid = orcid.replace('https://orcid.org/', '');
    const url = `${BASE_URL}/authors/https://orcid.org/${cleanOrcid}${OPENALEX_API_KEY ? `?api_key=${OPENALEX_API_KEY}` : ''}`

    try {
        const res = await fetch(url, { next: { revalidate: 86400 } }) // 24 saat cache
        if (!res.ok) {
            console.error(`OpenAlex Author Fetch Error (${res.status}):`, await res.text());
            return null;
        }
        return res.json()
    } catch (err) {
        console.error("OpenAlex Author Fetch Exception:", err);
        return null;
    }
}

// Akademisyenin tüm yayınlarını çek (sayfalama dahil)
export async function getWorksByOrcid(orcid: string, page = 1, perPage = 25) {
    if (!orcid) return null;
    const cleanOrcid = orcid.replace('https://orcid.org/', '');
    const url = `${BASE_URL}/works?filter=author.orcid:${cleanOrcid}&sort=publication_date:desc&page=${page}&per_page=${perPage}${OPENALEX_API_KEY ? `&api_key=${OPENALEX_API_KEY}` : ''}`

    try {
        const res = await fetch(url, { next: { revalidate: 86400 } })
        if (!res.ok) {
            console.error(`OpenAlex Works Fetch Error (${res.status}):`, await res.text());
            return null;
        }
        return res.json()
    } catch (err) {
        console.error("OpenAlex Works Fetch Exception:", err);
        return null;
    }
}

// Akademisyenin TÜM yayınlarını çek (otomatik sayfalama ile)
export async function getAllWorksByOrcid(orcid: string) {
    if (!orcid) return []

    const first = await getWorksByOrcid(orcid, 1, 100)
    if (!first?.results) return []

    const total = first.meta?.count ?? first.results.length
    const allWorks = [...first.results]

    if (total > 100) {
        const remainingPages = Math.ceil((total - 100) / 100)
        const pageNumbers = Array.from({ length: remainingPages }, (_, i) => i + 2)
        const results = await Promise.all(
            pageNumbers.map(page => getWorksByOrcid(orcid, page, 100))
        )
        for (const r of results) {
            if (r?.results) allWorks.push(...r.results)
        }
    }

    return allWorks
}

// ── Yayınların dergi endeks bilgilerini çek ──────────────────────
// Supabase journal_indexes tablosundan ISSN eşleştirmesi yapar
export async function getIndexesForWorks(works: any[]): Promise<Map<string, string[]>> {
    const issns = new Set<string>()
    for (const work of works) {
        const issn = work.primary_location?.source?.issn_l
        if (issn) issns.add(issn)
    }

    if (issns.size === 0) return new Map()

    // Dynamic import to avoid circular dependency issues
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('journal_indexes')
        .select('issn, indexes')
        .in('issn', Array.from(issns))

    if (error || !data) {
        console.error('Journal index lookup error:', error)
        return new Map()
    }

    const result = new Map<string, string[]>()
    for (const row of data) {
        result.set(row.issn, row.indexes)
    }
    return result
}
