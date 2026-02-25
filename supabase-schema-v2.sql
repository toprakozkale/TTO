-- ================================================================
-- HOMEPAGE_SETTINGS & PROJECTS TABLOLARI
-- ================================================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın.
-- ================================================================

-- ─── 1. homepage_settings tablosu ───────────────────────────────
create table public.homepage_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

-- RLS aç
alter table public.homepage_settings enable row level security;

-- Herkes okuyabilir (anasayfa public)
create policy "Anyone can read homepage_settings"
  on public.homepage_settings
  for select
  using (true);

-- Authenticated kullanıcılar yazabilir (admin)
create policy "Authenticated users can update homepage_settings"
  on public.homepage_settings
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert homepage_settings"
  on public.homepage_settings
  for insert
  with check (auth.role() = 'authenticated');

-- ─── 2. projects tablosu ────────────────────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  icon_url text,
  icon_bg_color text,
  is_featured boolean default false,
  featured_order integer,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS aç
alter table public.projects enable row level security;

-- Herkes okuyabilir
create policy "Anyone can read projects"
  on public.projects
  for select
  using (true);

-- Authenticated kullanıcılar CRUD
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update projects"
  on public.projects
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- ================================================================
-- SEED DATA
-- ================================================================

-- homepage_settings seed
insert into public.homepage_settings (key, value) values
  ('hero_title', 'GELECEĞİN TEKNOLOJİLERİ BURADA'),
  ('hero_subtitle', 'Üniversitemizin Teknoloji Transfer Ofisi olarak, akademik bilgiyi ticarileştirilebilir ürünlere dönüştürüyor, inovasyon ekosistemini güçlendiriyoruz.'),
  ('hero_bg_image_url', null),
  ('stat_active_projects', '150+'),
  ('stat_academics', '45'),
  ('stat_research_units', '12'),
  ('_default_hero_title', 'GELECEĞİN TEKNOLOJİLERİ BURADA'),
  ('_default_hero_subtitle', 'Üniversitemizin Teknoloji Transfer Ofisi olarak, akademik bilgiyi ticarileştirilebilir ürünlere dönüştürüyor, inovasyon ekosistemini güçlendiriyoruz.'),
  ('_default_hero_bg_image_url', null),
  ('_default_stat_active_projects', '150+'),
  ('_default_stat_academics', '45'),
  ('_default_stat_research_units', '12');

-- projects seed (anasayfadaki ilk 3 featured proje)
insert into public.projects (title, description, category, icon_bg_color, is_featured, featured_order, status) values
  (
    'Nano Malzeme Araştırma Projesi',
    'Yeni nesil nano malzemelerin endüstriyel uygulamalarına yönelik deneysel çalışma ve üretim süreçleri.',
    'Malzeme Bilimi',
    'emerald',
    true,
    1,
    'active'
  ),
  (
    'Otonom İHA Kontrol Sistemi',
    'İnsansız hava araçları için otonom uçuş ve görev planlama kontrol yazılımı geliştirme.',
    'Savunma Teknoloji',
    'amber',
    true,
    2,
    'active'
  ),
  (
    'Biyomedikal Sensör Geliştirme',
    'Hasta takibi ve erken teşhis için giyilebilir biyomedikal sensör teknolojileri üzerine Ar-Ge çalışması.',
    'Biyomedikal',
    'rose',
    true,
    3,
    'active'
  );
