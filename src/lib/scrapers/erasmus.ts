import * as cheerio from 'cheerio'
import { parseSlashDate, BASE_HEADERS } from './utils'

export async function scrapeErasmus() {
    const res = await fetch(
        'https://epale.ec.europa.eu/tr/calendar?f%5B0%5D=country%3A161',
        { headers: BASE_HEADERS }
    )
    if (!res.ok) throw new Error(`EPALE fetch failed: ${res.status}`)
    const $ = cheerio.load(await res.text())
    const items: any[] = []

    $('.views-row, article.node, .search-result').each((_, el) => {
        const $el = $(el)
        const titleEl = $el.find('h2 a, h3 a, .field--name-title a').first()
        const title = titleEl.text().trim()
        const relUrl = titleEl.attr('href')
        if (!title || !relUrl) return

        const url = relUrl.startsWith('http') ? relUrl : `https://epale.ec.europa.eu${relUrl}`
        const desc = $el.find('.field--name-body, p').first().text().trim()
        const dateText = $el.find('time, .date-display-single').first().text().trim()
        const badge = dateText ? `TARİH: ${dateText}` : null

        items.push({
            source: 'erasmus',
            title,
            description: desc.slice(0, 500) || null,
            url,
            image_url: null,
            date: parseSlashDate(dateText),
            badge,
        })
    })

    return items
}
