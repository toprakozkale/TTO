"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Loader2, Edit, ChevronDown, Save } from "lucide-react";
import { updateAkademisyenProfile } from "@/lib/actions/akademisyen";
import { createClient } from "@/lib/supabase/client";

const UNVANLAR = [
    "Dr.",
    "Prof. Dr.",
    "Doç. Dr.",
    "Dr. Öğr. Üyesi",
    "Arş. Gör. Dr.",
    "Arş. Gör.",
    "Öğr. Gör.",
];

export default function AkademisyenDuzenleModal({ hocaId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (open && hocaId) {
            fetchData();
        }
    }, [open, hocaId]);

    async function fetchData() {
        setLoading(true);
        const supabase = createClient();
        const { data: profile, error: fetchError } = await supabase
            .from("akademisyenler")
            .select("*")
            .eq("id", hocaId)
            .single();

        if (fetchError) {
            setError("Veri çekilemedi.");
        } else {
            setData(profile);
        }
        setLoading(false);
    }

    function handleClose() {
        setOpen(false);
        setError("");
        setSuccess("");
        setData(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateAkademisyenProfile(hocaId, formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(result.success);
                setTimeout(() => {
                    handleClose();
                    window.location.reload(); // Revalidate alternative for client
                }, 1500);
            }
        });
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="Profili Düzenle"
                className="p-2 rounded-lg text-hmku-muted hover:text-hmku-primary hover:bg-rose-50 transition"
            >
                <Edit className="w-4 h-4" />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-hmku-dark/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-lg font-black text-hmku-dark">
                                    Profili Düzenle
                                </h2>
                                <p className="text-xs text-hmku-muted mt-0.5">
                                    Akademisyen profil bilgilerini güncelleyin.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg text-hmku-muted hover:text-hmku-dark hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-hmku-primary" />
                                    <p className="mt-4 text-sm text-hmku-muted">Bilgiler yükleniyor...</p>
                                </div>
                            ) : data ? (
                                <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                                            <p className="text-sm text-red-600 font-medium">{error}</p>
                                        </div>
                                    )}
                                    {success && (
                                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                            <p className="text-sm text-emerald-600 font-medium">{success}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                                Unvan
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="unvan"
                                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition cursor-pointer"
                                                    defaultValue={data.unvan || ""}
                                                >
                                                    <option value="">— Seçin —</option>
                                                    {UNVANLAR.map((u) => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hmku-muted pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                                Ad Soyad
                                            </label>
                                            <input
                                                name="ad_soyad"
                                                type="text"
                                                defaultValue={data.ad_soyad}
                                                required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                                Rol Etiketi (Örn: Bölüm Başkanı)
                                            </label>
                                            <input
                                                name="rol_etiketi"
                                                type="text"
                                                defaultValue={data.rol_etiketi}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                                Uzmanlık Alanları (Virgülle ayırın)
                                            </label>
                                            <input
                                                name="uzmanlik_alanlari"
                                                type="text"
                                                defaultValue={data.uzmanlik_alanlari?.join(", ")}
                                                placeholder="Yapay Zeka, Veri Analizi"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                            Biyografi
                                        </label>
                                        <textarea
                                            name="biyografi"
                                            rows={4}
                                            defaultValue={data.biyografi}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-hmku-muted uppercase mb-1.5">
                                                Yayın Sayısı
                                            </label>
                                            <input
                                                name="yayin_sayisi"
                                                type="number"
                                                defaultValue={data.yayin_sayisi || 0}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-hmku-muted uppercase mb-1.5">
                                                H-İndeks
                                            </label>
                                            <input
                                                name="h_indeks"
                                                type="number"
                                                defaultValue={data.h_indeks || 0}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-hmku-muted uppercase mb-1.5">
                                                Proje Sayısı
                                            </label>
                                            <input
                                                name="proje_sayisi"
                                                type="number"
                                                defaultValue={data.proje_sayisi || 0}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            name="aktif_arastirmaci"
                                            id="aktif_arastirmaci"
                                            type="checkbox"
                                            defaultChecked={data.aktif_arastirmaci}
                                            className="accent-hmku-primary w-4 h-4 rounded"
                                        />
                                        <label htmlFor="aktif_arastirmaci" className="text-sm font-semibold text-hmku-dark animate-none transition-none cursor-pointer">
                                            Aktif Araştırmacı Olarak Göster
                                        </label>
                                    </div>
                                </form>
                            ) : null}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-hmku-muted hover:bg-white transition"
                                >
                                    İptal
                                </button>
                                <button
                                    form="edit-form"
                                    type="submit"
                                    disabled={isPending || loading}
                                    className="flex-1 py-2.5 rounded-xl bg-hmku-primary text-white text-sm font-bold hover:bg-rose-800 transition shadow-lg shadow-hmku-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
