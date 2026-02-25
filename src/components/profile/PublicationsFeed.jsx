import { Filter } from "lucide-react";
import PublicationCard from "./PublicationCard";

// Filtre seçenekleri
const YEAR_FILTERS = ["Tümü", "2024", "2023", "2022", "2021", "2020", "2019 ve Öncesi"];
const TYPE_FILTERS = ["Tümü", "Makale", "Konferans", "Kitap Bölümü", "Patent"];
const ACCESS_FILTERS = ["Tümü", "Açık Erişim", "Kapalı Erişim"];

// Mock yayın verisi (gerçek Supabase entegrasyonuna hazır yapı)
const MOCK_PUBLICATIONS = [
    {
        id: "1",
        title:
            "Derin Öğrenme Tabanlı Siber Saldırı Tespiti: Bir Sistematik Derleme ve Karşılaştırmalı Analiz",
        authors: ["A. Kaya", "M. Yılmaz", "S. Demir", "F. Özkan"],
        year: 2024,
        journal: "Expert Systems with Applications",
        doi: "10.1016/j.eswa.2024.123456",
        tldr:
            "Bu çalışma, derin öğrenme modellerinin ağ saldırısı tespitindeki performansını 20+ veri kümesi üzerinde karşılaştırmalı olarak ele almakta ve hibrit LSTM-CNN mimarisinin en yüksek doğruluğu sağladığını göstermektedir.",
        citationCount: 34,
        isOpenAccess: false,
        indexes: ["WoS", "Scopus"],
        type: "Makale",
    },
    {
        id: "2",
        title:
            "Transformer Tabanlı Doğal Dil İşleme Modelleri ile Türkçe Duygu Analizi",
        authors: ["A. Kaya", "E. Çelik"],
        year: 2023,
        journal: "IEEE Access",
        doi: "10.1109/ACCESS.2023.9876543",
        tldr:
            "BERTürk ve XLM-RoBERTa'nın Türkçe sosyal medya verisi üzerindeki karşılaştırmalı değerlendirmesi; domain-specific fine-tuning'in doğruluğu %12 artırdığını ortaya koymaktadır.",
        citationCount: 89,
        isOpenAccess: true,
        indexes: ["WoS", "Scopus", "DOAJ"],
        type: "Makale",
    },
    {
        id: "3",
        title:
            "IoT Ortamlarında Anomali Tespiti için Hafif Federe Öğrenme Çerçevesi",
        authors: ["A. Kaya", "H. Arslan", "T. Güneş"],
        year: 2023,
        journal: "International Conference on Machine Learning and Applications (ICMLA)",
        tldr:
            "Merkezileşmemiş öğrenme ile gizlilik koruyan anomali tespiti yapan bu çerçeve, bant genişliği kullanımını %60 azaltırken base-line'a kıyasla F1 skorunu korumaktadır.",
        citationCount: 22,
        isOpenAccess: true,
        indexes: ["Scopus"],
        type: "Konferans",
    },
    {
        id: "4",
        title:
            "Yapay Zeka Destekli Erken Uyarı Sistemleri: Tarım Sektöründe Uygulama Örnekleri",
        authors: ["A. Kaya", "B. Kara"],
        year: 2022,
        journal: "Computers and Electronics in Agriculture",
        doi: "10.1016/j.compag.2022.567890",
        tldr:
            "Bitki hastalığı tahmininde YOLO ve çoklu sensör füzyonunu birleştiren bu sistem, tarla denemeleri sonucunda erken tespit hassasiyetini %91'e çıkarmaktadır.",
        citationCount: 67,
        isOpenAccess: false,
        indexes: ["WoS", "Scopus"],
        type: "Makale",
    },
    {
        id: "5",
        title: "Enerji Verimli Akıllı Bina Yönetimi için Pekiştirmeli Öğrenme",
        authors: ["A. Kaya", "C. May", "L. Demir"],
        year: 2022,
        journal: "Energy and Buildings",
        doi: "10.1016/j.enbuild.2022.112233",
        citationCount: 43,
        isOpenAccess: false,
        indexes: ["WoS", "Scopus"],
        type: "Makale",
    },
    {
        id: "6",
        title:
            "Sağlık Verilerinde Federe Öğrenme: Hasta Mahremiyeti ve Model Performansı Dengesi",
        authors: ["A. Kaya"],
        year: 2021,
        journal: "Journal of Biomedical Informatics",
        doi: "10.1016/j.jbi.2021.103789",
        tldr:
            "Farklı hastanelerdeki EHR verisi üzerinde parametrik paylaşım ve diferansiyel gizlilik kullanan bu çerçeve, merkezi modele benzer doğrulukla klinische çıkarımlar sağlamaktadır.",
        citationCount: 112,
        isOpenAccess: true,
        indexes: ["WoS", "Scopus", "PubMed"],
        type: "Makale",
    },
];

function StickyFilterBar() {
    return (
        <div className="sticky top-0 z-20 -mx-0 pt-0">
            {/* Glassmorphism toolbar */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-white/60 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] rounded-2xl mb-4">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Filter className="w-3.5 h-3.5 text-hmku-muted" />
                            <span className="text-[11px] font-bold text-hmku-muted uppercase tracking-wider hidden sm:inline">
                                Filtrele
                            </span>
                        </div>

                        {/* Yıl filtresi */}
                        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar flex-1">
                            {YEAR_FILTERS.map((f) => (
                                <button
                                    key={f}
                                    className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all duration-200 ${f === "Tümü"
                                            ? "bg-hmku-primary text-white border-hmku-primary shadow-sm shadow-hmku-primary/20"
                                            : "bg-white text-hmku-muted border-slate-200/80 hover:bg-rose-50 hover:text-hmku-primary hover:border-rose-200"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Tür filtresi — sadece md+ */}
                        <div className="hidden md:flex gap-1.5 overflow-x-auto hide-scrollbar flex-shrink-0">
                            {TYPE_FILTERS.slice(0, 3).map((f) => (
                                <button
                                    key={f}
                                    className="flex-shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-lg border bg-white text-hmku-muted border-slate-200/80 hover:bg-rose-50 hover:text-hmku-primary hover:border-rose-200 transition-all duration-200"
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Bu bir Server Component olabilir (yayın verisi için)
export default function PublicationsFeed({ akademisyenName, publications }) {
    const pubs = publications && publications.length > 0 ? publications : MOCK_PUBLICATIONS;

    return (
        <section id="yayinlar" className="mt-6">
            {/* Bölüm başlığı */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-black text-hmku-dark tracking-tight">
                        Yayınlar & Eserler
                    </h2>
                    <p className="text-xs text-hmku-muted mt-0.5">
                        {pubs.length} yayın listeleniyor
                    </p>
                </div>
                <span className="text-[11px] font-bold text-hmku-primary bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                    {pubs.filter((p) => p.isOpenAccess).length} açık erişim
                </span>
            </div>

            {/* Sticky filtreleme çubuğu */}
            <StickyFilterBar />

            {/* Yayın kartları listesi */}
            <div className="space-y-3">
                {pubs.map((pub) => (
                    <PublicationCard
                        key={pub.id}
                        publication={pub}
                        highlightAuthor={akademisyenName}
                    />
                ))}
            </div>

            {/* Daha fazla yükle */}
            <div className="mt-6 flex justify-center">
                <button className="px-6 py-3 text-sm font-semibold text-hmku-primary bg-white border border-rose-200/80 rounded-xl hover:bg-rose-50 hover:shadow-md transition-all duration-200 shadow-sm">
                    Daha Fazla Yayın Göster
                </button>
            </div>
        </section>
    );
}
