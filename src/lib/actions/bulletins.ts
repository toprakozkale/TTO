'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Slug üretimi ─────────────────────────────────────────────────
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
}

// ── Benzersiz slug garantisi ─────────────────────────────────────
async function ensureUniqueSlug(supabase: any, baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (true) {
        let query = supabase.from('bulletins').select('id').eq('slug', slug)
        if (excludeId) query = query.neq('id', excludeId)
        const { data } = await query.maybeSingle()
        if (!data) return slug
        counter++
        slug = `${baseSlug}-${counter}`
    }
}

// ── Tüm bültenleri getir ─────────────────────────────────────────
export async function getBulletins() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bulletins')
        .select('*')
        .order('published_at', { ascending: false })

    if (error) {
        console.error('bulletins fetch error:', error)
        return []
    }
    return data || []
}

// ── Öne çıkan bülteni getir ──────────────────────────────────────
export async function getFeaturedBulletin() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bulletins')
        .select('*')
        .eq('is_featured', true)
        .single()

    if (error) {
        console.error('featured bulletin fetch error:', error)
        return null
    }
    return data
}

// ── Slug ile bülten getir ────────────────────────────────────────
export async function getBulletinBySlug(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bulletins')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('bulletin by slug error:', error)
        return null
    }
    return data
}

// ── Bülten ekle ──────────────────────────────────────────────────
export async function createBulletin(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const coverImageUrl = formData.get('cover_image_url') as string
    const publishedAt = formData.get('published_at') as string

    if (!title || !summary || !content || !coverImageUrl) {
        return { error: 'Zorunlu alanlar eksik.' }
    }

    const baseSlug = generateSlug(title)
    const slug = await ensureUniqueSlug(supabase, baseSlug)

    const { error } = await supabase.from('bulletins').insert({
        title,
        slug,
        summary,
        content,
        cover_image_url: coverImageUrl,
        category: category || null,
        published_at: publishedAt || new Date().toISOString(),
    })

    if (error) {
        console.error('bulletin insert error:', error)
        return { error: 'Bülten eklenirken hata oluştu.' }
    }

    revalidatePath('/haberler')
    revalidatePath('/')
    return { success: 'Bülten başarıyla eklendi.' }
}

// ── Bülten güncelle ──────────────────────────────────────────────
export async function updateBulletin(bulletinId: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const coverImageUrl = formData.get('cover_image_url') as string
    const publishedAt = formData.get('published_at') as string

    if (!title || !summary || !content) {
        return { error: 'Zorunlu alanlar eksik.' }
    }

    const baseSlug = generateSlug(title)
    const slug = await ensureUniqueSlug(supabase, baseSlug, bulletinId)

    const updates: Record<string, any> = {
        title,
        slug,
        summary,
        content,
        category: category || null,
        published_at: publishedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    if (coverImageUrl) {
        updates.cover_image_url = coverImageUrl
    }

    const { error } = await supabase
        .from('bulletins')
        .update(updates)
        .eq('id', bulletinId)

    if (error) {
        console.error('bulletin update error:', error)
        return { error: 'Bülten güncellenirken hata oluştu.' }
    }

    revalidatePath('/haberler')
    revalidatePath('/')
    return { success: 'Bülten başarıyla güncellendi.' }
}

// ── Bülten sil ───────────────────────────────────────────────────
export async function deleteBulletin(bulletinId: string, coverImageUrl?: string) {
    const supabase = await createClient()

    // Storage'daki görseli sil (varsa, Supabase Storage URL ise)
    if (coverImageUrl && coverImageUrl.includes('supabase.co/storage')) {
        try {
            const pathMatch = coverImageUrl.match(/bulletin-assets\/(.+)$/)
            if (pathMatch) {
                await supabase.storage.from('bulletin-assets').remove([pathMatch[1]])
            }
        } catch (err) {
            console.error('Storage delete error:', err)
        }
    }

    const { error } = await supabase
        .from('bulletins')
        .delete()
        .eq('id', bulletinId)

    if (error) {
        console.error('bulletin delete error:', error)
        return { error: 'Bülten silinirken hata oluştu.' }
    }

    revalidatePath('/haberler')
    revalidatePath('/')
    return { success: 'Bülten başarıyla silindi.' }
}

// ── Featured bülten değiştir ─────────────────────────────────────
export async function setFeaturedBulletin(bulletinId: string) {
    const supabase = await createClient()

    // Önce tüm bültenlerin featured'ını kaldır
    const { error: resetError } = await supabase
        .from('bulletins')
        .update({ is_featured: false })
        .eq('is_featured', true)

    if (resetError) {
        console.error('featured reset error:', resetError)
        return { error: 'Featured sıfırlanırken hata oluştu.' }
    }

    // Yeni featured'ı set et
    const { error } = await supabase
        .from('bulletins')
        .update({ is_featured: true, updated_at: new Date().toISOString() })
        .eq('id', bulletinId)

    if (error) {
        console.error('set featured error:', error)
        return { error: 'Öne çıkan bülten seçilirken hata oluştu.' }
    }

    revalidatePath('/haberler')
    revalidatePath('/')
    return { success: 'Öne çıkan bülten güncellendi.' }
}

// ── Bülten görseli yükle ─────────────────────────────────────────
export async function uploadBulletinImage(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    if (!file) {
        return { error: 'Dosya seçilmedi.' }
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return { error: 'Sadece PNG, JPG ve WEBP formatları desteklenir.' }
    }

    if (file.size > 5 * 1024 * 1024) {
        return { error: 'Dosya boyutu 5MB\'ı aşamaz.' }
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `bulletin-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('bulletin-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
        console.error('Bulletin image upload error:', uploadError)
        return { error: 'Görsel yüklenirken hata oluştu.' }
    }

    const { data: urlData } = supabase.storage
        .from('bulletin-assets')
        .getPublicUrl(fileName)

    return { success: 'Görsel yüklendi.', url: urlData.publicUrl }
}
