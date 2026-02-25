"use client";

import { useState, useTransition } from "react";
import { X, Loader2, UserPlus, ChevronDown } from "lucide-react";
import { addAkademisyen } from "@/lib/actions/auth";

const UNVANLAR = [
    "Dr.",
    "Prof. Dr.",
    "Doç. Dr.",
    "Dr. Öğr. Üyesi",
    "Arş. Gör. Dr.",
    "Arş. Gör.",
    "Öğr. Gör.",
];

export default function AkademisyenEkleModal({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleClose() {
        setOpen(false);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await addAkademisyen(formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(result.success);
                setTimeout(() => {
                    handleClose();
                    onSuccess?.();
                }, 1500);
            }
        });
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-hmku-primary text-white text-sm font-bold rounded-xl hover:bg-rose-800 transition-all duration-200 shadow-lg shadow-hmku-primary/20 active:scale-[0.97]"
            >
                <UserPlus className="w-4 h-4" />
                Yeni Akademisyen Ekle
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-hmku-dark/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-black text-hmku-dark">
                                    Yeni Akademisyen Ekle
                                </h2>
                                <p className="text-xs text-hmku-muted mt-0.5">
                                    Akademisyen sisteme eklendikten sonra kendi şifresini belirleyebilir.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg text-hmku-muted hover:text-hmku-dark hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Error / Success */}
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

                            {/* Unvan */}
                            <div>
                                <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                    Unvan
                                </label>
                                <div className="relative">
                                    <select
                                        name="title"
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition cursor-pointer"
                                        defaultValue=""
                                    >
                                        <option value="">— Unvan seçin (isteğe bağlı) —</option>
                                        {UNVANLAR.map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hmku-muted pointer-events-none" />
                                </div>
                            </div>

                            {/* Ad Soyad */}
                            <div>
                                <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                    Ad Soyad <span className="text-hmku-primary">*</span>
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Örn: Ayhan Kaya"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition placeholder:text-slate-400"
                                />
                            </div>

                            {/* E-posta */}
                            <div>
                                <label className="block text-[13px] font-semibold text-hmku-dark mb-1.5">
                                    E-posta Adresi <span className="text-hmku-primary">*</span>
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="ornek@university.edu.tr"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition placeholder:text-slate-400"
                                />
                            </div>

                            {/* Info Note */}
                            <div className="px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-[12px] text-violet-700 leading-relaxed">
                                    Akademisyen eklendikten sonra bu e-posta ile{" "}
                                    <strong>/auth/akademisyen-login</strong> adresinden
                                    şifresini belirleyebilir.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-hmku-muted hover:bg-slate-50 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 py-2.5 rounded-xl bg-hmku-primary text-white text-sm font-bold hover:bg-rose-800 transition shadow-lg shadow-hmku-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isPending ? "Ekleniyor..." : "Akademisyen Ekle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
