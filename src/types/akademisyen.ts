export interface EgitimBilgisi {
    baslangic_yili: number;
    bitis_yili: number | null; // null = "Devam Ediyor"
    derece: "Lisans" | "Yüksek Lisans" | "Doktora";
    universite: string;
    enstitu_fakulte: string;
    ulke: string;
}

export interface YapilanTez {
    yil: number;
    derece: "Yüksek Lisans" | "Doktora";
    baslik: string;
    universite: string;
    enstitu: string;
}

export interface AkademikUnvan {
    baslangic_yili: number;
    bitis_yili: number | null; // null = "Devam Ediyor"
    unvan: string;
    universite: string;
    fakulte: string;
    bolum: string;
}

export interface YonetimselGorev {
    baslangic_yili: number;
    bitis_yili: number | null; // null = "Devam Ediyor"
    gorev: string;
    universite: string;
    birim: string;
}

export interface Akademisyen {
    id: string;
    ad_soyad: string;
    email: string;
    rol_etiketi: string;
    biyografi: string | null;
    uzmanlik_alanlari: string[];
    orcid_id: string | null;
    unvan: string | null;
    fotograf_url: string | null;

    // Yeni Alanlar
    kurum_bilgisi: string | null;
    arastirma_alanlari: string[];
    yayinlardaki_isimler: string[];
    egitim_bilgileri: EgitimBilgisi[];
    yapilan_tezler: YapilanTez[];
    yabanci_diller: string[];
    akademik_unvanlar: AkademikUnvan[];
    yonetimsel_gorevler: YonetimselGorev[];

    // İletişim ve Sosyal Medya
    avesis_url: string | null;
    iletisim_email: string | null;
    scholar_id: string | null;
    scopus_id: string | null;
    publons_id: string | null;
    yok_akademik_id: string | null;
    facebook_url: string | null;
    linkedin_url: string | null;
    researchgate_url: string | null;
    instagram_url: string | null;

    // Mevcut İstatistikler (DB kolonları)
    yayin_sayisi: number;
    h_indeks: number;
    proje_sayisi: number;

    // Yeni Metrik Kolonları
    atif_wos: number | null;
    hindeks_wos: number | null;
    atif_scopus: number | null;
    hindeks_scopus: number | null;
    atif_trdizin: number | null;
    hindeks_trdizin: number | null;
}
