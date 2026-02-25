import * as cheerio from 'cheerio'
import { BASE_HEADERS } from './utils'

export async function scrapeKosgeb() {
    const res = await fetch(
        'https://www.kosgeb.gov.tr/site/tr/genel/liste/2/duyurular',
        { headers: BASE_HEADERS }
    )
    if (!res.ok) throw new Error(`KOSGEB fetch failed: ${res.status}`)
    const $ = cheerio.load(await res.text())
    const items: any[] = []
    const seen = new Set<string>()

    // KOSGEB duyuruları h5 > a veya detay linkli a etiketlerinde
    $('a[href*="/genel/detay/"]').each((_, el) => {
        const $el = $(el)
        const title = $el.text().trim()
        const relUrl = $el.attr('href')
        if (!title || !relUrl || title.length < 10) return

        const url = relUrl.startsWith('http') ? relUrl : `https://www.kosgeb.gov.tr${relUrl}`

        // Aynı URL'yi iki kez ekleme (sayfa aynı linki birden fazla kez içerebilir)
        if (seen.has(url)) return
        seen.add(url)

        items.push({
            source: 'kosgeb',
            title,
            description: null,
            url,
            image_url: null,
            date: null,
            badge: 'KOSGEB',
        })
    })

    return items
}
