export function parseTurkishDate(text: string): string | null {
    const months: Record<string, string> = {
        'Oca': '01', 'Şub': '02', 'Mar': '03', 'Nis': '04',
        'May': '05', 'Haz': '06', 'Tem': '07', 'Ağu': '08',
        'Eyl': '09', 'Eki': '10', 'Kas': '11', 'Ara': '12',
        'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04',
        'Mayıs': '05', 'Haziran': '06', 'Temmuz': '07', 'Ağustos': '08',
        'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12',
    }
    const match = text.match(/(\d{1,2})\s+([\wğüşöçıİĞÜŞÖÇ]+)\s+(\d{4})/i)
    if (!match) return null
    const [, day, monthStr, year] = match
    const month = months[monthStr] ?? months[monthStr.slice(0, 3)]
    if (!month) return null
    return `${year}-${month}-${day.padStart(2, '0')}`
}

export function parseEnglishDate(text: string): string | null {
    const months: Record<string, string> = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12',
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
    }
    const match = text.match(/(\d{1,2})\s+([\w]+)\s+(\d{4})/i)
    if (!match) return null
    const [, day, monthStr, year] = match
    const month = months[monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase()]
    if (!month) return null
    return `${year}-${month}-${day.padStart(2, '0')}`
}

export function parseDotDate(text: string): string | null {
    const match = text.match(/(\d{2})\.(\d{2})\.(\d{4})/)
    if (match) return `${match[3]}-${match[2]}-${match[1]}`
    return null
}

export function parseSlashDate(text: string): string | null {
    const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (match) {
        const [, d, m, y] = match
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }
    return null
}

export const BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
}
