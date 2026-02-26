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
