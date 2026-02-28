import { createClient } from '@/lib/supabase/server'

export async function getExternalBulletins() {
    const supabase = await createClient()

    const [tubitak, erasmus, kosgeb, yok] = await Promise.all([
        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'tubitak')
            .order('date', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(8),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'erasmus')
            .order('date', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(12),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'kosgeb')
            .order('date', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(5),

        supabase
            .from('external_bulletins')
            .select('*')
            .eq('source', 'yok')
            .order('date', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(8),
    ])

    return {
        tubitak: tubitak.data ?? [],
        erasmus: erasmus.data ?? [],
        bakanlik: kosgeb.data ?? [],
        yok: yok.data ?? [],
    }
}
