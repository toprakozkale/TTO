'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Tüm projeleri getir ──────────────────────────────────────────
export async function getProjects() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('projects fetch error:', error)
        return []
    }

    return data || []
}

// ── Öne çıkan projeleri getir ────────────────────────────────────
export async function getFeaturedProjects() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('featured_order', { ascending: true })

    if (error) {
        console.error('featured projects fetch error:', error)
        return []
    }

    return data || []
}

// ── Featured toggle ──────────────────────────────────────────────
export async function toggleFeatured(
    projectId: string,
    isFeatured: boolean,
    featuredOrder: number | null
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({
            is_featured: isFeatured,
            featured_order: isFeatured ? featuredOrder : null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)

    if (error) {
        console.error('toggle featured error:', error)
        return { error: 'Proje güncellenirken bir hata oluştu.' }
    }

    revalidatePath('/')
    revalidatePath('/admin/proje-kontrolu')
    return { success: isFeatured ? 'Proje öne çıkarıldı.' : 'Proje öne çıkarmadan kaldırıldı.' }
}
