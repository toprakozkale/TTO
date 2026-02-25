-- ================================================================
-- EXTERNAL BULLETINS TABLE
-- ================================================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın.
-- ================================================================

CREATE TABLE external_bulletins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('tubitak', 'erasmus', 'kosgeb', 'bakanlik')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  date DATE,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX external_bulletins_source_date_idx 
ON external_bulletins(source, date DESC);

-- RLS: herkes okuyabilir, sadece service_role yazabilir
ALTER TABLE external_bulletins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes okuyabilir" ON external_bulletins
  FOR SELECT USING (true);

CREATE POLICY "Service role yazabilir" ON external_bulletins
  FOR ALL USING (auth.role() = 'service_role');
