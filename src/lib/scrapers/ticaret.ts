import * as cheerio from 'cheerio'
import { parseTurkishDate, parseDotDate, BASE_HEADERS } from './utils'

export async function scrapeTicaret() {
    const res = await fetch('https://ticaret.gov.tr/duyurular', {
        headers: BASE_HEADERS,
        cache: 'no-store'
    })
    if (!res.ok) throw new Error(`Ticaret fetch failed: ${res.status}`)
    const $ = cheerio.load(await res.text())
    const items: any[] = []

    $('article, .duyuru-item, .list-group-item, ul.news-list li').each((_, el) => {
        const $el = $(el)
        const titleEl = $el.find('a, h2, h3').first()
        const title = titleEl.text().trim()
        const relUrl = $el.find('a').first().attr('href')
        if (!title || !relUrl) return

        const url = relUrl.startsWith('http') ? relUrl : `https://ticaret.gov.tr${relUrl}`
        const dateText = $el.find('time, .date, .tarih').text().trim()

        items.push({
            source: 'bakanlik',
            title,
            description: $el.find('p').first().text().trim().slice(0, 500) || null,
            url,
            image_url: null,
            date: parseTurkishDate(dateText) ?? parseDotDate(dateText),
            badge: 'TİCARET BAKANLIĞI',
        })
    })

    return items
}
