import * as cheerio from 'cheerio'
import { BASE_HEADERS } from './utils'

export async function scrapeTubitak() {
    const res = await fetch('https://tubitak.gov.tr/tr/duyuru', {
        headers: BASE_HEADERS,
        cache: 'no-store'
    })
    if (!res.ok) throw new Error(`TÜBİTAK fetch failed: ${res.status}`)
    const $ = cheerio.load(await res.text())
    const items: any[] = []
    const seen = new Set<string>()

    // TÜBİTAK duyuruları /tr/duyuru/ alt yolundaki linklerdir
    // "Devamını oku" linklerini atla, sadece başlık linklerini al
    $('a[href*="/tr/duyuru/"]').each((_, el) => {
        const $el = $(el)
        const title = $el.text().trim()
        const relUrl = $el.attr('href')
        if (!title || !relUrl) return

        // "Devamını oku" ve sayfalama linklerini atla
        if (title === 'Devamını oku') return
        if (relUrl.includes('?page=')) return
        // Ana /tr/duyuru sayfasını atla
        if (relUrl === '/tr/duyuru' || relUrl === 'https://tubitak.gov.tr/tr/duyuru') return

        const url = relUrl.startsWith('http') ? relUrl : `https://tubitak.gov.tr${relUrl}`

        // Duplikat kontrolü
        if (seen.has(url)) return
        seen.add(url)

        items.push({
            source: 'tubitak',
            title,
            description: null,
            url,
            image_url: null,
            date: new Date().toISOString().split('T')[0],
            badge: 'TÜBİTAK',
        })
    })

    return items
}
