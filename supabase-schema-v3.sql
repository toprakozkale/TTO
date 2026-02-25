-- ================================================================
-- BULLETINS TABLOSU VE HOMEPAGE_SETTINGS EKLEMELERİ
-- ================================================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın.
-- ================================================================

-- ─── 1. bulletins tablosu ───────────────────────────────────────
create table public.bulletins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  cover_image_url text,
  category text,
  is_featured boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS aç
alter table public.bulletins enable row level security;

-- Herkes okuyabilir
create policy "Anyone can read bulletins"
  on public.bulletins
  for select
  using (true);

-- Authenticated kullanıcılar CRUD
create policy "Authenticated users can insert bulletins"
  on public.bulletins
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update bulletins"
  on public.bulletins
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete bulletins"
  on public.bulletins
  for delete
  using (auth.role() = 'authenticated');

-- ─── 2. homepage_settings'e bülten ayarları ekle ────────────────
insert into public.homepage_settings (key, value) values
  ('bulletin_page_title', 'TTO BÜLTEN'),
  ('bulletin_page_subtitle', 'Üniversite-sanayi iş birliği, teknoloji transferi, inovasyon ve girişimcilik dünyasından en son haberler, analizler ve duyurular.'),
  ('_default_bulletin_page_title', 'TTO BÜLTEN'),
  ('_default_bulletin_page_subtitle', 'Üniversite-sanayi iş birliği, teknoloji transferi, inovasyon ve girişimcilik dünyasından en son haberler, analizler ve duyurular.');

-- ─── 3. Seed data — mevcut hardcoded bültenler ─────────────────
insert into public.bulletins (title, slug, summary, content, cover_image_url, category, is_featured, published_at) values
  (
    'Geleceğin Teknolojilerine Yön Veren Projeler: TTO Bülten - Ocak 2026',
    'gelecegin-teknolojilerine-yon-veren-projeler-tto-bulten-ocak-2026',
    'Yapay zeka, biyoteknoloji ve ileri malzemeler alanındaki en son üniversite araştırmalarını, sanayi ortaklıklarını ve girişimcilik fırsatlarını keşfedin.',
    'Yapay zeka, biyoteknoloji ve ileri malzemeler alanındaki en son üniversite araştırmalarını, sanayi ortaklıklarını ve girişimcilik fırsatlarını keşfedin. Bu ayın bülteni, sürdürülebilirlik ve dijital dönüşüm odaklı çığır açan çalışmaları ele alıyor.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    'Ar-Ge',
    true,
    '2026-01-15T00:00:00Z'
  ),
  (
    'Yapay Zeka Destekli Sağlık Çözümleri',
    'yapay-zeka-destekli-saglik-cozumleri',
    'Kanser teşhisinde yeni algoritmalar geliştirildi. Üniversitemiz hastanesinde test aşamasına geçilen sistem %98 başarı oranı sağladı.',
    'Kanser teşhisinde yeni algoritmalar geliştirildi. Üniversitemiz hastanesinde test aşamasına geçilen sistem %98 başarı oranı sağladı.',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2070&auto=format&fit=crop',
    'Ar-Ge',
    false,
    '2026-01-10T00:00:00Z'
  ),
  (
    'Akıllı Şehirler İçin Sürdürülebilir Enerji',
    'akilli-sehirler-icin-surdurulebilir-enerji',
    'Güneş panelleri ve enerji depolama sistemlerinde son gelişmeler. Yeni nesil lityum-iyon batarya prototipimiz tanıtıldı.',
    'Güneş panelleri ve enerji depolama sistemlerinde son gelişmeler. Yeni nesil lityum-iyon batarya prototipimiz tanıtıldı.',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    'İnovasyon',
    false,
    '2026-01-05T00:00:00Z'
  ),
  (
    'Üniversitemizden 5 Yeni Patent Başvurusu',
    'universitemizden-5-yeni-patent-basvurusu',
    'Malzeme bilimi ve nanoteknoloji alanındaki buluşlar tescilleniyor. TTO patent ofisi rekor bir yılı geride bıraktı.',
    'Malzeme bilimi ve nanoteknoloji alanındaki buluşlar tescilleniyor. TTO patent ofisi rekor bir yılı geride bıraktı.',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop',
    'Haber',
    false,
    '2025-12-28T00:00:00Z'
  ),
  (
    'Teknopark''ta Yeni Kuluçka Merkezi Açıldı',
    'teknoparkta-yeni-kulucka-merkezi-acildi',
    'Start-up''lar için mentorluk ve finansman desteği. Genç girişimciler için 2000 m2''lik yeni teknoloji üssü hizmete girdi.',
    'Start-up''lar için mentorluk ve finansman desteği. Genç girişimciler için 2000 m2''lik yeni teknoloji üssü hizmete girdi.',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop',
    'Girişimcilik',
    false,
    '2025-12-20T00:00:00Z'
  ),
  (
    'Sanayi İş Birliği Zirvesi 2026',
    'sanayi-is-birligi-zirvesi-2026',
    'Şirket temsilcileri ve araştırmacılar bir araya geliyor. Üniversite-sanayi köprüsü teknolojik dönüşümü hızlandırıyor.',
    'Şirket temsilcileri ve araştırmacılar bir araya geliyor. Üniversite-sanayi köprüsü teknolojik dönüşümü hızlandırıyor.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
    'Etkinlik',
    false,
    '2025-12-15T00:00:00Z'
  ),
  (
    'AB Destekli Proje Başvuruları Başladı',
    'ab-destekli-proje-basvurulari-basladi',
    'Araştırma fonlarına nasıl başvurulacağına dair rehber yayınlandı. Horizon Europe kapsamında yeni konsorsiyum fırsatları.',
    'Araştırma fonlarına nasıl başvurulacağına dair rehber yayınlandı. Horizon Europe kapsamında yeni konsorsiyum fırsatları.',
    'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2014&auto=format&fit=crop',
    'Fonlama',
    false,
    '2025-12-10T00:00:00Z'
  );
