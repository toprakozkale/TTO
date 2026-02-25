-- ================================================================
-- ALLOWED_USERS TABLOSU VE RLS POLİTİKALARI
-- ================================================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın.
-- ================================================================

-- 1. Tablo oluştur
create table public.allowed_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  role text not null check (role in ('admin', 'akademisyen')),
  created_at timestamp default now()
);

-- 2. Row Level Security (RLS) aç
alter table public.allowed_users enable row level security;

-- 3. Authenticated kullanıcılar sadece kendi satırını görebilsin
create policy "Users can read own row"
  on public.allowed_users
  for select
  using (auth.jwt() ->> 'email' = email);

-- ================================================================
-- TEST VERİLERİ (İsteğe bağlı — test için kullanın)
-- ================================================================
-- Aşağıdaki satırları kendi email adreslerinizle değiştirin:
--
-- insert into public.allowed_users (email, role)
-- values
--   ('admin@university.edu.tr', 'admin'),
--   ('hoca@university.edu.tr', 'akademisyen');
-- ================================================================
