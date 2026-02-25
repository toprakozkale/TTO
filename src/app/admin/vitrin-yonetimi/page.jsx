"use client";

import { useState, useEffect, useRef } from "react";
import {
    Layout,
    Newspaper,
    Mail,
    Save,
    Image as ImageIcon,
    Type,
    Link as LinkIcon,
    MapPin,
    Clock,
    Hash,
    Settings2,
    CheckCircle2,
    Eye,
    RotateCcw,
    AlertTriangle,
    X,
    Upload,
    Plus,
    Trash2,
    Edit3,
    Loader2,
    Star,
    ArrowLeft,
    Calendar,
} from "lucide-react";
import {
    getHomepageSettings,
    updateHomepageSettings,
    resetHomepageToDefaults,
    uploadHeroImage,
} from "@/lib/actions/homepage";
import {
    getBulletins,
    createBulletin,
    updateBulletin,
    deleteBulletin,
    setFeaturedBulletin,
    uploadBulletinImage,
} from "@/lib/actions/bulletins";

export default function VitrinYonetimiPage() {
    const [activeTab, setActiveTab] = useState("anasayfa");
    const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        async function load() {
            try {
                const settings = await getHomepageSettings();
                if (settings) {
                    setFormData(settings);
                    setInitialData(settings);
                }
            } catch (err) {
                console.error("Settings load error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaveStatus("saving");
        try {
            // Değişen tüm alanları bul (_default_ ve _system prefix'li key'leri hariç tut)
            const updates = {};
            Object.keys(formData).forEach((key) => {
                if (key.startsWith("_default_") || key.startsWith("_system_")) return;
                const val = formData[key];
                if (val !== undefined && val !== initialData[key]) {
                    updates[key] = val;
                }
            });

            if (Object.keys(updates).length === 0) {
                // No changes
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
                return;
            }

            const result = await updateHomepageSettings(updates);
            if (result.error) {
                console.error(result.error);
                setSaveStatus("error");
            } else {
                setInitialData({ ...initialData, ...updates });
                setSaveStatus("saved");
            }
        } catch (err) {
            console.error(err);
            setSaveStatus("error");
        }
        setTimeout(() => setSaveStatus("idle"), 3000);
    };

    const updateField = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { id: "anasayfa", label: "Anasayfa", icon: Layout },
        { id: "bulten", label: "TTO Bülten", icon: Newspaper },
        { id: "iletisim", label: "İletişim", icon: Mail },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* ───── Header ───── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-hmku-dark tracking-tight">
                        Vitrin Yönetimi
                    </h1>
                    <p className="mt-1 text-sm text-hmku-muted">
                        Web sitesindeki tüm sayfaların içerik ve görsellerini buradan
                        yönetin.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.open("/", "_blank")}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-hmku-dark bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
                    >
                        <Eye size={18} />
                        Siteyi Görüntüle
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveStatus !== "idle"}
                        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 ${saveStatus === "saved"
                            ? "bg-emerald-500 shadow-emerald-500/20"
                            : saveStatus === "error"
                                ? "bg-red-500 shadow-red-500/20"
                                : "bg-hmku-primary shadow-hmku-primary/20 hover:bg-rose-800"
                            }`}
                    >
                        {saveStatus === "saving" ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saveStatus === "saved" ? (
                            <CheckCircle2 size={18} />
                        ) : saveStatus === "error" ? (
                            <AlertTriangle size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {saveStatus === "saving"
                            ? "Kaydediliyor..."
                            : saveStatus === "saved"
                                ? "Değişiklikler Kaydedildi"
                                : saveStatus === "error"
                                    ? "Hata Oluştu"
                                    : "Değişiklikleri Kaydet"}
                    </button>
                </div>
            </div>

            {/* ───── Tab Navigation ───── */}
            <div className="flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-hmku-primary text-white shadow-md shadow-hmku-primary/20"
                                : "text-hmku-muted hover:text-hmku-dark hover:bg-slate-50"
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ───── Tab Content ───── */}
            <div className="transition-all duration-300">
                {activeTab === "anasayfa" && (
                    <AnasayfaYonetimi
                        formData={formData}
                        updateField={updateField}
                        loading={loading}
                    />
                )}
                {activeTab === "bulten" && <BultenYonetimi formData={formData} updateField={updateField} />}
                {activeTab === "iletisim" && <IletisimYonetimi formData={formData} updateField={updateField} />}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANASAYFA YÖNETİMİ — Supabase'e bağlı
// ─────────────────────────────────────────────────────────────────────────────

function AnasayfaYonetimi({ formData, updateField, loading }) {
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetStatus, setResetStatus] = useState("idle");
    const [imageUploadStatus, setImageUploadStatus] = useState("idle");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const currentBgUrl = formData.hero_bg_image_url;

    const handleResetDefaults = async () => {
        setResetStatus("resetting");
        try {
            const result = await resetHomepageToDefaults();
            if (result.error) {
                console.error(result.error);
                setResetStatus("error");
            } else {
                // Reload data
                const settings = await getHomepageSettings();
                if (settings) {
                    Object.keys(settings).forEach((key) => updateField(key, settings[key]));
                }
                setImagePreview(null);
                setResetStatus("done");
            }
        } catch (err) {
            console.error(err);
            setResetStatus("error");
        }
        setTimeout(() => {
            setResetStatus("idle");
            setShowResetConfirm(false);
        }, 2000);
    };

    const validateAndUploadImage = async (file) => {
        // Format check
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Sadece PNG, JPG ve WEBP formatları desteklenir.");
            return;
        }

        // Size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya boyutu 5MB'ı aşamaz.");
            return;
        }

        // Resolution check (min 1920×600)
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = async () => {
            URL.revokeObjectURL(objectUrl);

            if (img.width < 1920 || img.height < 600) {
                alert(
                    `Minimum çözünürlük 1920×600px olmalıdır. Seçilen görsel: ${img.width}×${img.height}px`
                );
                return;
            }

            // Validation passed — upload
            setImageUploadStatus("uploading");
            setImagePreview(URL.createObjectURL(file));

            try {
                const fd = new FormData();
                fd.append("file", file);
                const result = await uploadHeroImage(fd);

                if (result.error) {
                    alert(result.error);
                    setImageUploadStatus("error");
                    setImagePreview(null);
                } else {
                    updateField("hero_bg_image_url", result.url);
                    setImageUploadStatus("done");
                }
            } catch (err) {
                console.error(err);
                setImageUploadStatus("error");
                setImagePreview(null);
            }
            setTimeout(() => setImageUploadStatus("idle"), 2000);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            alert("Görsel okunamadı. Lütfen geçerli bir dosya seçin.");
        };

        img.src = objectUrl;
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) validateAndUploadImage(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndUploadImage(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-hmku-primary/30 border-t-hmku-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <AdminSection
                title="Ana Başlık Bölümü"
                icon={Layout}
                action={
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                    >
                        <RotateCcw size={14} />
                        Varsayılana Dön
                    </button>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Ana Başlık Metni"
                        placeholder="GELECEĞİN TEKNOLOJİLERİ BURADA"
                        value={formData.hero_title || ""}
                        onChange={(v) => updateField("hero_title", v)}
                    />
                    <InputField
                        label="Alt Başlık Metni"
                        placeholder="Üniversitemizin Teknoloji Transfer Ofisi olarak..."
                        value={formData.hero_subtitle || ""}
                        onChange={(v) => updateField("hero_subtitle", v)}
                    />
                    <div className="md:col-span-2">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                                Ana Başlık Arkaplan Görseli
                            </label>

                            {/* Current image preview */}
                            {(imagePreview || currentBgUrl) && (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 mb-3">
                                    <img
                                        src={imagePreview || currentBgUrl}
                                        alt="Mevcut arkaplan"
                                        className="w-full h-full object-cover"
                                    />
                                    {imageUploadStatus === "uploading" && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                    {imageUploadStatus === "done" && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg">
                                            Yüklendi ✓
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-hmku-primary/30 transition-all group cursor-pointer"
                            >
                                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload
                                        className="text-slate-400 group-hover:text-hmku-primary transition-colors"
                                        size={24}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-hmku-dark">
                                        Tıklayın veya görseli buraya sürükleyin
                                    </p>
                                    <p className="text-xs text-hmku-muted mt-1">
                                        PNG, JPG veya WEBP (Max 5MB, Min 1920×600px)
                                    </p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </AdminSection>

            <AdminSection title="İstatistikler" icon={Hash}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Aktif Proje"
                        placeholder="150+"
                        value={formData.stat_active_projects || ""}
                        onChange={(v) => updateField("stat_active_projects", v)}
                    />
                    <InputField
                        label="Akademisyen"
                        placeholder="45"
                        value={formData.stat_academics || ""}
                        onChange={(v) => updateField("stat_academics", v)}
                    />
                    <InputField
                        label="Araştırma Birimi"
                        placeholder="12"
                        value={formData.stat_research_units || ""}
                        onChange={(v) => updateField("stat_research_units", v)}
                    />
                </div>
            </AdminSection>

            <AdminSection title="Öne Çıkan Bölümler" icon={Settings2}>
                <div className="space-y-4">
                    <SwitchItem
                        title="Duyurular Yayında"
                        description="Anasayfadaki güncel duyurular şeridini göster/gizle."
                        defaultChecked
                    />
                    <SwitchItem
                        title="Hızlı Erişim Paneli"
                        description="Kısayol butonlarını anasayfada alt bölümde göster."
                        defaultChecked
                    />
                </div>
            </AdminSection>

            {/* Reset Confirm Dialog */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-xl">
                                <AlertTriangle className="text-amber-600" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-hmku-dark">
                                Varsayılana Dön
                            </h3>
                        </div>
                        <p className="text-sm text-hmku-muted mb-6">
                            Tüm anasayfa ayarları varsayılan değerlere döndürülecek.
                            Arkaplan görseli kaldırılacak ve animasyon geri gelecek. Bu
                            işlem geri alınamaz.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 text-sm font-bold text-hmku-dark bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleResetDefaults}
                                disabled={resetStatus !== "idle"}
                                className="px-4 py-2 text-sm font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-500/20"
                            >
                                {resetStatus === "resetting"
                                    ? "Sıfırlanıyor..."
                                    : resetStatus === "done"
                                        ? "Tamamlandı ✓"
                                        : "Evet, Varsayılana Dön"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BÜLTEN YÖNETİMİ — Supabase'e bağlı
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Ar-Ge", "İnovasyon", "Haber", "Girişimcilik", "Etkinlik", "Fonlama", "Raporlar"];

function BultenYonetimi({ formData, updateField }) {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("list"); // list, form
    const [editingBulletin, setEditingBulletin] = useState(null);
    const [showFeaturedPicker, setShowFeaturedPicker] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(null);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formSummary, setFormSummary] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
    const [formImageUrl, setFormImageUrl] = useState("");
    const [formImagePreview, setFormImagePreview] = useState("");
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const bulletinFileRef = useRef(null);

    useEffect(() => {
        loadBulletins();
    }, []);

    const loadBulletins = async () => {
        setLoading(true);
        const data = await getBulletins();
        setBulletins(data);
        setLoading(false);
    };

    const resetForm = () => {
        setFormTitle("");
        setFormSummary("");
        setFormContent("");
        setFormCategory("");
        setFormDate(new Date().toISOString().split("T")[0]);
        setFormImageUrl("");
        setFormImagePreview("");
        setFormError("");
        setEditingBulletin(null);
    };

    const openAddForm = () => {
        resetForm();
        setView("form");
    };

    const openEditForm = (b) => {
        setEditingBulletin(b);
        setFormTitle(b.title);
        setFormSummary(b.summary || "");
        setFormContent(b.content || "");
        setFormCategory(b.category || "");
        setFormDate(b.published_at ? b.published_at.split("T")[0] : "");
        setFormImageUrl(b.cover_image_url || "");
        setFormImagePreview(b.cover_image_url || "");
        setFormError("");
        setView("form");
    };

    const handleImageUpload = async (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setFormError("Sadece PNG, JPG ve WEBP formatları desteklenir.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFormError("Dosya boyutu 5MB'ı aşamaz.");
            return;
        }

        // Resolution check
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = async () => {
            URL.revokeObjectURL(objectUrl);
            if (img.width < 1200 || img.height < 630) {
                setFormError(`Minimum çözünürlük 1200×630px. Seçilen: ${img.width}×${img.height}px`);
                return;
            }
            setImageUploading(true);
            setFormImagePreview(URL.createObjectURL(file));
            const fd = new FormData();
            fd.append("file", file);
            const result = await uploadBulletinImage(fd);
            if (result.error) {
                setFormError(result.error);
                setFormImagePreview("");
            } else {
                setFormImageUrl(result.url);
            }
            setImageUploading(false);
        };
        img.onerror = () => { URL.revokeObjectURL(objectUrl); setFormError("Görsel okunamadı."); };
        img.src = objectUrl;
    };

    const handleSubmitForm = async () => {
        if (!formTitle.trim()) { setFormError("Başlık zorunludur."); return; }
        if (!formSummary.trim()) { setFormError("Özet zorunludur."); return; }
        if (!formContent.trim()) { setFormError("İçerik zorunludur."); return; }
        if (!editingBulletin && !formImageUrl) { setFormError("Kapak görseli zorunludur."); return; }

        setFormSubmitting(true);
        setFormError("");

        const fd = new FormData();
        fd.append("title", formTitle);
        fd.append("summary", formSummary);
        fd.append("content", formContent);
        fd.append("category", formCategory);
        fd.append("published_at", formDate);
        if (formImageUrl) fd.append("cover_image_url", formImageUrl);

        const result = editingBulletin
            ? await updateBulletin(editingBulletin.id, fd)
            : await createBulletin(fd);

        setFormSubmitting(false);

        if (result.error) {
            setFormError(result.error);
        } else {
            setView("list");
            resetForm();
            loadBulletins();
        }
    };

    const handleDelete = async (b) => {
        if (!window.confirm(`"${b.title}" bülteni kalıcı olarak silinecek. Emin misiniz?`)) return;
        setDeletingId(b.id);
        await deleteBulletin(b.id, b.cover_image_url);
        setDeletingId(null);
        loadBulletins();
    };

    const handleSetFeatured = async (b) => {
        setFeaturedLoading(b.id);
        await setFeaturedBulletin(b.id);
        setFeaturedLoading(null);
        setShowFeaturedPicker(false);
        loadBulletins();
    };

    const featured = bulletins.find((b) => b.is_featured);

    // ── FORM VIEW ────────────────────────────────────────────────
    if (view === "form") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <button
                    onClick={() => { setView("list"); resetForm(); }}
                    className="flex items-center gap-2 text-sm font-bold text-hmku-muted hover:text-hmku-dark transition"
                >
                    <ArrowLeft size={16} />
                    Listeye Dön
                </button>

                <AdminSection title={editingBulletin ? "Bülteni Düzenle" : "Yeni Bülten Ekle"} icon={Newspaper}>
                    <div className="space-y-6">
                        <InputField
                            label="Başlık *"
                            placeholder="Bülten başlığını girin"
                            value={formTitle}
                            onChange={setFormTitle}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                                    Kategori
                                </label>
                                <select
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark text-sm"
                                >
                                    <option value="">Kategori seçin</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <InputField
                                label="Yayın Tarihi"
                                type="date"
                                value={formDate}
                                onChange={setFormDate}
                            />
                        </div>

                        {/* Kapak Görseli */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                                Kapak Görseli *
                            </label>
                            {formImagePreview && (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 mb-3">
                                    <img src={formImagePreview} alt="Kapak" className="w-full h-full object-cover" />
                                    {imageUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div
                                onClick={() => bulletinFileRef.current?.click()}
                                onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files?.[0]); }}
                                onDragOver={(e) => e.preventDefault()}
                                className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 hover:border-hmku-primary/30 transition-all group cursor-pointer"
                            >
                                <Upload className="text-slate-400 group-hover:text-hmku-primary transition-colors" size={20} />
                                <p className="text-xs font-bold text-hmku-dark">Tıklayın veya sürükleyin</p>
                                <p className="text-[10px] text-hmku-muted">PNG, JPG, WEBP (Max 5MB, Min 1200×630px)</p>
                            </div>
                            <input
                                ref={bulletinFileRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                                className="hidden"
                            />
                        </div>

                        {/* Özet */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                                Özet * ({formSummary.length}/300)
                            </label>
                            <textarea
                                rows={3}
                                maxLength={300}
                                placeholder="Kısa özet yazın..."
                                value={formSummary}
                                onChange={(e) => setFormSummary(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark text-sm resize-none"
                            />
                        </div>

                        {/* İçerik */}
                        <TextareaField
                            label="İçerik *"
                            placeholder="Bülten içeriğini yazın..."
                            value={formContent}
                            onChange={setFormContent}
                        />

                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                                {formError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => { setView("list"); resetForm(); }}
                                className="px-5 py-2.5 text-sm font-bold text-hmku-dark bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSubmitForm}
                                disabled={formSubmitting || imageUploading}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-hmku-primary rounded-xl hover:bg-rose-800 transition shadow-lg shadow-hmku-primary/20 disabled:opacity-50"
                            >
                                {formSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                {editingBulletin ? "Güncelle" : "Kaydet"}
                            </button>
                        </div>
                    </div>
                </AdminSection>
            </div>
        );
    }

    // ── LIST VIEW ────────────────────────────────────────────────
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Sayfa Başlığı Ayarları */}
            <AdminSection
                title="Bülten Sayfası Ayarları"
                icon={Settings2}
                action={
                    <button
                        onClick={async () => {
                            const settings = await getHomepageSettings();
                            if (settings) {
                                const defaultTitle = settings._default_bulletin_page_title || "TTO BÜLTEN";
                                const defaultSubtitle = settings._default_bulletin_page_subtitle || "";
                                updateField("bulletin_page_title", defaultTitle);
                                updateField("bulletin_page_subtitle", defaultSubtitle);
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                    >
                        <RotateCcw size={14} />
                        Varsayılana Dön
                    </button>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Bülten Sayfası Başlığı"
                        placeholder="TTO BÜLTEN"
                        value={formData.bulletin_page_title || ""}
                        onChange={(v) => updateField("bulletin_page_title", v)}
                    />
                    <InputField
                        label="Bülten Alt Başlığı"
                        placeholder="İnovasyon dünyasından en son haberler..."
                        value={formData.bulletin_page_subtitle || ""}
                        onChange={(v) => updateField("bulletin_page_subtitle", v)}
                    />
                </div>
            </AdminSection>

            {/* Öne Çıkan Bülten */}
            <AdminSection title="Öne Çıkan Bülten" icon={Eye}>
                {featured ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                {featured.cover_image_url && (
                                    <img src={featured.cover_image_url} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-hmku-dark truncate">{featured.title}</p>
                                <p className="text-[10px] text-hmku-muted">
                                    {featured.category} · {featured.published_at ? new Date(featured.published_at).toLocaleDateString("tr-TR") : ""}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFeaturedPicker(true)}
                            className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 transition flex-shrink-0"
                        >
                            Değiştir
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-6 text-sm text-hmku-muted">
                        Henüz öne çıkan bülten seçilmedi.
                        <button
                            onClick={() => setShowFeaturedPicker(true)}
                            className="ml-2 text-hmku-primary font-bold hover:underline"
                        >
                            Seç
                        </button>
                    </div>
                )}
            </AdminSection>

            {/* Featured Picker Modal */}
            {showFeaturedPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-hmku-dark">Öne Çıkan Bülten Seç</h3>
                            <button onClick={() => setShowFeaturedPicker(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {bulletins.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => handleSetFeatured(b)}
                                    disabled={featuredLoading === b.id}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition hover:bg-slate-50 ${b.is_featured ? "border-amber-300 bg-amber-50" : "border-slate-100"
                                        }`}
                                >
                                    <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                        {b.cover_image_url && <img src={b.cover_image_url} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-hmku-dark truncate">{b.title}</p>
                                        <p className="text-[10px] text-hmku-muted">{b.category}</p>
                                    </div>
                                    {featuredLoading === b.id ? (
                                        <Loader2 size={16} className="animate-spin text-amber-500" />
                                    ) : b.is_featured ? (
                                        <Star size={16} className="text-amber-500 fill-amber-500" />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bülten Listesi */}
            <AdminSection
                title="Tüm Bültenler"
                icon={Newspaper}
                action={
                    <button
                        onClick={openAddForm}
                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-white bg-hmku-primary rounded-lg hover:bg-rose-800 transition shadow-lg shadow-hmku-primary/20"
                    >
                        <Plus size={14} />
                        Yeni Bülten
                    </button>
                }
            >
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-hmku-primary" />
                    </div>
                ) : bulletins.length === 0 ? (
                    <div className="text-center py-12 text-sm text-hmku-muted">
                        Henüz bülten bulunmuyor.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {bulletins.map((b) => (
                            <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition rounded-xl">
                                {/* Thumbnail */}
                                <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                    {b.cover_image_url && (
                                        <img src={b.cover_image_url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-hmku-dark truncate">{b.title}</p>
                                        {b.is_featured && (
                                            <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-100 text-amber-700 rounded-full">ÖNE ÇIKAN</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        {b.category && (
                                            <span className="text-[10px] font-bold text-hmku-primary">{b.category}</span>
                                        )}
                                        <span className="text-[10px] text-hmku-muted">
                                            {b.published_at ? new Date(b.published_at).toLocaleDateString("tr-TR") : ""}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => openEditForm(b)}
                                        title="Düzenle"
                                        className="p-2 rounded-lg text-hmku-muted hover:text-hmku-primary hover:bg-rose-50 transition"
                                    >
                                        <Edit3 size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(b)}
                                        disabled={deletingId === b.id}
                                        title="Sil"
                                        className="p-2 rounded-lg text-hmku-muted hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                    >
                                        {deletingId === b.id ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={15} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminSection>
        </div>
    );
}

function IletisimYonetimi({ formData, updateField }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <AdminSection title="İletişim Bilgileri" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Telefon Numarası"
                        placeholder="+90 (326) 245 58 45"
                        value={formData.contact_phone || ""}
                        onChange={(v) => updateField("contact_phone", v)}
                    />
                    <InputField
                        label="E-posta Adresi"
                        placeholder="tto@university.edu.tr"
                        value={formData.contact_email || ""}
                        onChange={(v) => updateField("contact_email", v)}
                    />
                    <div className="md:col-span-2">
                        <TextareaField
                            label="Tam Adres"
                            placeholder="Merkez Kampüs Girişi, Tayfur Sökmen Kampüsü, 31000 Antakya/Hatay"
                            value={formData.contact_address || ""}
                            onChange={(v) => updateField("contact_address", v)}
                        />
                    </div>
                </div>
            </AdminSection>

            <AdminSection title="Harita Entegrasyonu" icon={MapPin}>
                <div className="space-y-4">
                    <InputField
                        label="Google Maps Embed URL"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        value={formData.contact_maps_url || ""}
                        onChange={(v) => updateField("contact_maps_url", v)}
                    />
                    <p className="text-[10px] text-hmku-muted italic">
                        Not: Google Maps&apos;ten aldığınız iframe &apos;src&apos; değerini
                        buraya yapıştırın.
                    </p>
                </div>
            </AdminSection>

            <AdminSection title="Çalışma Saatleri" icon={Clock}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Hafta İçi"
                        placeholder="08:30 - 17:30"
                        value={formData.contact_hours_weekday || ""}
                        onChange={(v) => updateField("contact_hours_weekday", v)}
                    />
                    <InputField
                        label="Hafta Sonu"
                        placeholder="Kapalı"
                        value={formData.contact_hours_weekend || ""}
                        onChange={(v) => updateField("contact_hours_weekend", v)}
                    />
                </div>
            </AdminSection>

            <AdminSection title="Sosyal Medya Linkleri" icon={LinkIcon}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Instagram"
                        placeholder="https://instagram.com/tto"
                        value={formData.contact_instagram || ""}
                        onChange={(v) => updateField("contact_instagram", v)}
                    />
                    <InputField
                        label="LinkedIn"
                        placeholder="https://linkedin.com/company/tto"
                        value={formData.contact_linkedin || ""}
                        onChange={(v) => updateField("contact_linkedin", v)}
                    />
                    <InputField
                        label="X (Twitter)"
                        placeholder="https://x.com/tto"
                        value={formData.contact_twitter || ""}
                        onChange={(v) => updateField("contact_twitter", v)}
                    />
                </div>
            </AdminSection>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function AdminSection({ title, icon: Icon, children, action }) {
    return (
        <div className="bg-white rounded-2xl shadow-modern border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-hmku-primary border border-slate-100">
                        <Icon size={18} />
                    </div>
                    <h2 className="text-[15px] font-extrabold text-hmku-dark tracking-tight">
                        {title}
                    </h2>
                </div>
                {action && action}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function InputField({ label, placeholder, type = "text", value, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative group">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    readOnly={!onChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark text-sm"
                />
            </div>
        </div>
    );
}

function TextareaField({ label, placeholder, value, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                {label}
            </label>
            <textarea
                rows={4}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                readOnly={!onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark text-sm resize-none"
            />
        </div>
    );
}

function StaticImageUpload({ label }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-hmku-dark uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-hmku-primary/30 transition-all group cursor-pointer">
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <ImageIcon
                        className="text-slate-400 group-hover:text-hmku-primary transition-colors"
                        size={24}
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-hmku-dark">
                        Tıklayın veya görseli buraya sürükleyin
                    </p>
                    <p className="text-xs text-hmku-muted mt-1">
                        PNG, JPG veya WEBP (Max. 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
}

function SwitchItem({ title, description, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="max-w-[80%]">
                <p className="text-sm font-bold text-hmku-dark">{title}</p>
                <p className="text-[11px] text-hmku-muted mt-0.5">
                    {description}
                </p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-emerald-500" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}
