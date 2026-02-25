'use server'

import { createClient } from '@supabase/supabase-js'
import { scrapeTubitak } from '@/lib/scrapers/tubitak'
import { scrapeErasmus } from '@/lib/scrapers/erasmus'
import { scrapeKosgeb } from '@/lib/scrapers/kosgeb'
import { scrapeTicaret } from '@/lib/scrapers/ticaret'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function runScrapers() {
    const results = await Promise.allSettled([
        scrapeTubitak(),
        scrapeErasmus(),
        scrapeKosgeb(),
        scrapeTicaret(),
    ])

    const scraperNames = ['tubitak', 'erasmus', 'kosgeb', 'ticaret']
    const allItems = results.flatMap((r, i) => {
        if (r.status === 'fulfilled') return r.value
        console.error(`[scraper:${scraperNames[i]}] failed:`, r.reason?.message)
        return []
    })

    if (allItems.length > 0) {
        const { error } = await supabaseAdmin
            .from('external_bulletins')
            .upsert(allItems, { onConflict: 'url', ignoreDuplicates: true })
        if (error) {
            console.error('DB upsert error:', error)
            return { error: error.message }
        }
    }

    const summary = scraperNames.map((name, i) => ({
        source: name,
        status: results[i].status,
        count: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<any[]>).value.length : 0,
        error: results[i].status === 'rejected' ? (results[i] as PromiseRejectedResult).reason?.message : null,
    }))

    revalidatePath('/admin')

    return { success: true, total: allItems.length, summary }
}
