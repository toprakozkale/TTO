-- ================================================================
-- İLETİŞİM AYARLARI — homepage_settings'e ekle
-- ================================================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın.
-- ================================================================

insert into public.homepage_settings (key, value) values
  ('contact_phone', '+90 326 245 58 45'),
  ('contact_email', 'tto@mku.edu.tr'),
  ('contact_address', 'TTO Binası, Kat 3, Merkez Kampüs, Hatay Mustafa Kemal Üniversitesi, 31000 Antakya/Hatay'),
  ('contact_maps_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3230.134371485603!2d36.18567227633512!3d36.315516772822435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152674e79393e179%3A0xe5479ea76939634e!2sHatay%20Mustafa%20Kemal%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1709400000000!5m2!1str!2str'),
  ('contact_hours_weekday', '08:30 - 17:30'),
  ('contact_hours_weekend', 'Kapalı'),
  ('contact_instagram', 'https://instagram.com'),
  ('contact_linkedin', 'https://linkedin.com'),
  ('contact_twitter', 'https://x.com');
