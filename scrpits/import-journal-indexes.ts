import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'

// Load env manually since this is a standalone script, not Next.js
import * as dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type IndexRecord = {
    issn: string
    journal_title: string
    indexes: string[]
}

const indexMap = new Map<string, IndexRecord>()

function normalizeISSN(issn: string): string | null {
    if (!issn) return null
    const clean = issn.replace(/[^0-9Xx]/g, '').toUpperCase()
    if (clean.length !== 8) return null
    return `${clean.slice(0, 4)}-${clean.slice(4)}`
}

function addToIndex(issn: string | null, eissn: string | null, title: string, indexName: string) {
    for (const raw of [issn, eissn]) {
        const normalized = normalizeISSN(raw ?? '')
        if (!normalized) continue

        const existing = indexMap.get(normalized)
        if (existing) {
            if (!existing.indexes.includes(indexName)) {
                existing.indexes.push(indexName)
            }
        } else {
            indexMap.set(normalized, {
                issn: normalized,
                journal_title: title || '',
                indexes: [indexName]
            })
        }
    }
}

// ── WoS files — comma separated ──────────────────────────────────
// Columns: "Journal title", "ISSN", "eISSN", ...
function processWosCSV(filePath: string, indexName: string) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filePath}, skipping ${indexName}`)
        return
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        delimiter: ',',
        relax_quotes: true,
    })

    let count = 0
    for (const row of records) {
        const title = row['Journal title'] || ''
        const issn = row['ISSN'] || ''
        const eissn = row['eISSN'] || ''
        addToIndex(issn, eissn, title, indexName)
        count++
    }

    console.log(`✅ ${indexName}: processed ${count} journals`)
}

// ── Scopus — semicolon separated, only Active rows ───────────────
function processScopusCSV(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Scopus file not found: ${filePath}, skipping`)
        return
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        delimiter: ';',  // CRITICAL: Scopus uses semicolon
        relax_quotes: true,
    })

    let count = 0
    let skipped = 0
    for (const row of records) {
        const status = (row['Active or Inactive'] || '').trim()
        if (status && status !== 'Active') {
            skipped++
            continue
        }

        const title = row['Source Title'] || ''
        const issn = row['ISSN'] || ''
        const eissn = row['EISSN'] || ''
        addToIndex(issn, eissn, title, 'SCOPUS')
        count++
    }

    console.log(`✅ SCOPUS: processed ${count} journals (skipped ${skipped} inactive)`)
}

// ── TRDizin — comma separated ────────────────────────────────────
// Columns: "ISSN", "E-ISSN", "Başlık"
function processTRDizinCSV(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  TRDizin file not found: ${filePath}, skipping`)
        return
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        delimiter: ',',
        relax_quotes: true,
        relax_column_count: true,
    })

    let count = 0
    for (const row of records) {
        const title = row['Başlık'] || ''
        const issn = row['ISSN'] || ''
        const eissn = row['E-ISSN'] || ''
        addToIndex(issn, eissn, title, 'TRDIZIN')
        count++
    }

    console.log(`✅ TRDIZIN: processed ${count} journals`)
}

// ── Upload to Supabase ───────────────────────────────────────────
async function uploadToSupabase() {
    const records = Array.from(indexMap.values())
    console.log(`\n📤 Uploading ${records.length} unique ISSNs to Supabase...`)

    const batchSize = 500
    let uploaded = 0

    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize)
        const { error } = await supabase
            .from('journal_indexes')
            .upsert(batch, { onConflict: 'issn' })

        if (error) {
            console.error(`❌ Error uploading batch ${i}-${i + batchSize}:`, error)
            throw error
        }

        uploaded += batch.length
        console.log(`   ${uploaded}/${records.length} uploaded...`)
    }

    console.log('\n🎉 Import complete!')

    // Summary
    const allIndexes = ['SCIE', 'SSCI', 'AHCI', 'ESCI', 'SCOPUS', 'TRDIZIN']
    for (const idx of allIndexes) {
        const count = records.filter(r => r.indexes.includes(idx)).length
        console.log(`   ${idx}: ${count} journals`)
    }
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
    const dataDir = path.join(__dirname, 'data')

    console.log('📂 Reading CSV files from:', dataDir)
    console.log('')

    processWosCSV(path.join(dataDir, 'wos_SCIE.csv'), 'SCIE')
    processWosCSV(path.join(dataDir, 'wos_SSCI.csv'), 'SSCI')
    processWosCSV(path.join(dataDir, 'wos_AHCI.csv'), 'AHCI')
    processWosCSV(path.join(dataDir, 'wos_EHCI.csv'), 'ESCI')  // EHCI file = ESCI index
    processScopusCSV(path.join(dataDir, 'scopus_sources.csv'))
    processTRDizinCSV(path.join(dataDir, 'trdizin_sources.csv'))

    await uploadToSupabase()
}

main().catch(console.error)
