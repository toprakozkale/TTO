import * as cheerio from 'cheerio'
import { parseTurkishDate, BASE_HEADERS } from './utils'

export async function scrapeKosgeb() {
    const res = await fetch(
        'https://www.kosgeb.gov.tr/site/tr/genel/liste/4/haber',
        {
            headers: BASE_HEADERS,
            cache: 'no-store'
        }
    )
    if (!res.ok) throw new Error(`KOSGEB fetch failed: ${res.status}`)
    const $ = cheerio.load(await res.text())
    const items: any[] = []
    const seen = new Set<string>()

    // KOSGEB haber listesi yapısı: h4 başlıkları ve altındaki tarih/özet
    $('h4').each((_, el) => {
        const $h4 = $(el)
        const titleEl = $h4.find('a').first()
        const title = titleEl.text().trim()
        const relUrl = titleEl.attr('href')
        if (!title || !relUrl) return

        const url = relUrl.startsWith('http') ? relUrl : `https://www.kosgeb.gov.tr${relUrl}`
        if (seen.has(url)) return
        seen.add(url)

        // Tarih ve özet h4'ten sonraki kardeş elementlerde olabilir
        const $nextLinks = $h4.nextAll('a')
        let dateText = ''
        $nextLinks.each((_, link) => {
            const txt = $(link).text().trim()
            if (txt.match(/\d{1,2}\s+\w+\s+\d{4}/)) {
                dateText = txt
                return false
            }
        })

        // Özet metni p veya h4'ten sonraki text node'larında olabilir
        const desc = $h4.next('p').text().trim() ||
            $h4.next().text().trim() ||
            null

        items.push({
            source: 'kosgeb',
            title,
            description: desc || null,
            url,
            image_url: null,
            date: dateText ? parseTurkishDate(dateText) : new Date().toISOString().split('T')[0],
            badge: 'KOSGEB',
        })
    })

    return items
}
