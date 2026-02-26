-- ADIM 1: Yeni akademisyenler Tablosu Oluştur
CREATE TABLE IF NOT EXISTS public.akademisyenler (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- allowed_users ile bağlantı (opsiyonel - akademisyen sisteme giriş yapmıyor olabilir)
  user_id uuid REFERENCES public.allowed_users(id) ON DELETE SET NULL,

  -- Temel profil bilgileri
  ad_soyad text NOT NULL,
  unvan text,           -- "Prof. Dr.", "Doç. Dr.", "Dr.", "Arş. Gör. Dr." vb.
  rol_etiketi text,     -- "TTO Direktörü", "Proje Koordinatörü", "Patent Uzmanı" vb.
  email text,
  biyografi text,
  fotograf_url text,

  -- Durum
  aktif_arastirmaci boolean DEFAULT true,
  is_active boolean DEFAULT true,   -- sitede gösterilsin mi
  display_order integer DEFAULT 0,  -- sıralama

  -- Uzmanlık etiketleri (array olarak)
  uzmanlik_alanlari text[],  -- ["Yapay Zeka", "Makine Öğrenmesi", "Siber Güvenlik"]

  -- İleriye dönük alanlar (şimdilik boş kalabilir)
  orcid_id text,  -- OpenAlex entegrasyonu için hazırlık

  -- Manuel girilen akademik metrikler (OpenAlex gelene kadar)
  yayin_sayisi integer,
  h_indeks integer,
  proje_sayisi integer,

  -- Zaman damgaları
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT akademisyenler_pkey PRIMARY KEY (id)
);

-- RLS politikaları
ALTER TABLE public.akademisyenler ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public sayfada gösterilecek)
DROP POLICY IF EXISTS "Akademisyenler herkese açık" ON public.akademisyenler;
CREATE POLICY "Akademisyenler herkese açık" ON public.akademisyenler
  FOR SELECT USING (true);

-- Sadece authenticated admin kullanıcılar yazabilir
DROP POLICY IF EXISTS "Sadece adminler düzenleyebilir" ON public.akademisyenler;
CREATE POLICY "Sadece adminler düzenleyebilir" ON public.akademisyenler
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.allowed_users
      WHERE email = auth.jwt() ->> 'email'
      AND role = 'admin'
    )
  );

-- ADIM 2: Mevcut Akademisyenleri Tabloya Ekle
INSERT INTO public.akademisyenler (user_id, ad_soyad, email, is_active, display_order)
SELECT
  id,
  COALESCE(name, email) as ad_soyad,
  email,
  true,
  ROW_NUMBER() OVER (ORDER BY created_at)
FROM public.allowed_users
WHERE role = 'akademisyen'
ON CONFLICT DO NOTHING;
