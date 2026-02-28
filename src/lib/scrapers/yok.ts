import * as cheerio from 'cheerio'
import { BASE_HEADERS } from './utils'

async function scrapeYokPage(url: string) {
    const res = await fetch(url, {
        headers: BASE_HEADERS,
        cache: 'no-store'
    })
    if (!res.ok) throw new Error(`YÖK fetch failed for ${url}: ${res.status}`)

    const $ = cheerio.load(await res.text())
    const items: any[] = []
    const today = new Date().toISOString().split('T')[0]

    $('h3').each((_, el) => {
        const $h3 = $(el)
        const titleEl = $h3.find('a').first()
        const title = titleEl.text().trim()
        const relUrl = titleEl.attr('href')

        if (!title || !relUrl) return

        const fullUrl = relUrl.startsWith('http') ? relUrl : `https://www.yok.gov.tr${relUrl}`
        const desc = $h3.next().text().trim() || null

        items.push({
            source: 'yok',
            title,
            description: desc ? desc.slice(0, 500) : null,
            url: fullUrl,
            image_url: null,
            date: today,
            badge: 'YÖK BÜLTEN',
        })
    })
    return items
}

export async function scrapeYok() {
    const [announcements, news] = await Promise.all([
        scrapeYokPage('https://www.yok.gov.tr/tr/announcements'),
        scrapeYokPage('https://www.yok.gov.tr/tr/news')
    ])

    return [...announcements, ...news]
}
