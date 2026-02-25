import { createClient } from '@/lib/supabase/server'

export async function getExternalBulletins() {
    const supabase = await createClient()

    const [tubitak, erasmus, kosgeb, bakanlik] = await Promise.all([
        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'tubitak')
            .order('date', { ascending: false })
            .limit(8),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'erasmus')
            .order('date', { ascending: false })
            .limit(12),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'kosgeb')
            .order('date', { ascending: false })
            .limit(5),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'bakanlik')
            .order('date', { ascending: false })
            .limit(5),
    ])

    return {
        tubitak: tubitak.data ?? [],
        erasmus: erasmus.data ?? [],
        bakanlik: [...(kosgeb.data ?? []), ...(bakanlik.data ?? [])],
    }
}
