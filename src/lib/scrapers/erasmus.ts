import { parseEnglishDate, BASE_HEADERS } from './utils'

export async function scrapeErasmus() {
    // whats-new sayfası dinamik olduğu için doğrudan API'den veriyi çekiyoruz
    const apiUrl = 'https://erasmus-plus.ec.europa.eu/eac-api/content?language=en&page[limit]=10&page[offset]=0&sortonly=false&type=eac_news'

    const res = await fetch(apiUrl, {
        headers: BASE_HEADERS,
        cache: 'no-store'
    })

    if (!res.ok) throw new Error(`Erasmus+ API fetch failed: ${res.status}`)

    const json = await res.json()
    const items: any[] = []

    if (json && Array.isArray(json.data)) {
        json.data.forEach((item: any) => {
            const title = item.title || ''
            const relUrl = item.url || ''
            if (!title || !relUrl) return

            const url = relUrl.startsWith('http') ? relUrl : `https://erasmus-plus.ec.europa.eu${relUrl}`
            const desc = item.intro || ''
            const dateText = item.publicationDate || '' // Orn: "24 February 2026"

            items.push({
                source: 'erasmus',
                title,
                description: desc.slice(0, 500) || null,
                url,
                image_url: item.image || null,
                date: dateText ? parseEnglishDate(dateText) : new Date().toISOString().split('T')[0],
                badge: dateText ? `GÜNCEL: ${dateText}` : 'ERASMUS+',
            })
        })
    }

    return items
}
