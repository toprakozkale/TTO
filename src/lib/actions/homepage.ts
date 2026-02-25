'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Tüm homepage ayarlarını getir ────────────────────────────────
export async function getHomepageSettings() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('homepage_settings')
        .select('key, value')

    if (error) {
        console.error('homepage_settings fetch error:', error)
        return null
    }

    // key-value map'e dönüştür
    const settings: Record<string, string | null> = {}
    data?.forEach((row: { key: string; value: string | null }) => {
        settings[row.key] = row.value
    })

    return settings
}

// ── Partial update — sadece dolu alanları güncelle ───────────────
export async function updateHomepageSettings(
    updates: Record<string, string | null>
) {
    const supabase = await createClient()

    const promises = Object.entries(updates).map(([key, value]) =>
        supabase
            .from('homepage_settings')
            .upsert(
                { key, value, updated_at: new Date().toISOString() },
                { onConflict: 'key' }
            )
    )

    const results = await Promise.all(promises)
    const anyError = results.find((r) => r.error)

    if (anyError?.error) {
        console.error('homepage_settings update error:', anyError.error)
        return { error: 'Ayarlar güncellenirken bir hata oluştu.' }
    }

    revalidatePath('/')
    revalidatePath('/haberler')
    revalidatePath('/iletisim')
    return { success: 'Ayarlar başarıyla güncellendi.' }
}

// ── Varsayılana dön — _default_ prefix'li değerleri normal key'lere yaz ──
export async function resetHomepageToDefaults() {
    const supabase = await createClient()

    // Tüm ayarları çek
    const { data, error } = await supabase
        .from('homepage_settings')
        .select('key, value')

    if (error || !data) {
        console.error('homepage_settings fetch error:', error)
        return { error: 'Varsayılan değerler alınırken hata oluştu.' }
    }

    // _default_ prefix'li key'leri bul ve normal karşılıklarını güncelle
    const defaults: Record<string, string | null> = {}
    data.forEach((row: { key: string; value: string | null }) => {
        if (row.key.startsWith('_default_')) {
            const normalKey = row.key.replace('_default_', '')
            defaults[normalKey] = row.value
        }
    })

    const promises = Object.entries(defaults).map(([key, value]) =>
        supabase
            .from('homepage_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('key', key)
    )

    const results = await Promise.all(promises)
    const anyError = results.find((r) => r.error)

    if (anyError?.error) {
        console.error('homepage_settings reset error:', anyError.error)
        return { error: 'Varsayılana dönerken hata oluştu.' }
    }

    revalidatePath('/')
    revalidatePath('/haberler')
    revalidatePath('/iletisim')
    return { success: 'Tüm ayarlar varsayılan değerlere döndürüldü.' }
}

// ── Hero görseli yükle — Supabase Storage ────────────────────────
export async function uploadHeroImage(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    if (!file) {
        return { error: 'Dosya seçilmedi.' }
    }

    // Server-side format check
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return { error: 'Sadece PNG, JPG ve WEBP formatları desteklenir.' }
    }

    // Server-side size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'Dosya boyutu 5MB\'ı aşamaz.' }
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `hero-bg-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('homepage-assets')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
        })

    if (uploadError) {
        console.error('Image upload error:', uploadError)
        return { error: 'Görsel yüklenirken bir hata oluştu.' }
    }

    // Public URL al
    const { data: urlData } = supabase.storage
        .from('homepage-assets')
        .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // hero_bg_image_url'i güncelle
    const { error: updateError } = await supabase
        .from('homepage_settings')
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq('key', 'hero_bg_image_url')

    if (updateError) {
        console.error('hero_bg_image_url update error:', updateError)
        return { error: 'Görsel URL\'si kaydedilirken hata oluştu.' }
    }

    revalidatePath('/')
    return { success: 'Görsel başarıyla yüklendi.', url: publicUrl }
}
