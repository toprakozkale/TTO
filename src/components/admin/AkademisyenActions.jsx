"use client";

import { useState } from "react";
import { Mail, Shield, Trash2, Loader2 } from "lucide-react";
import { deleteAkademisyen } from "@/lib/actions/akademisyen";

export default function AkademisyenActions({ hoca }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState(null); // { success, error }

    const handleMail = () => {
        window.location.href = `mailto:${hoca.email}?subject=TTO Admin Bildirimi`;
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `${hoca.name} adlı akademisyen sistemden kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?`
        );
        if (!confirmed) return;

        setIsDeleting(true);
        setDeleteResult(null);

        const result = await deleteAkademisyen(hoca.id, hoca.email);
        setIsDeleting(false);

        if (result.success) {
            setDeleteResult({ success: true });
        } else {
            setDeleteResult({ error: result.error });
            // 3 sn sonra hata mesajını temizle
            setTimeout(() => setDeleteResult(null), 3000);
        }
    };

    // Silme başarılıysa row gizlensin (revalidate sonrası zaten kaybolacak)
    if (deleteResult?.success) {
        return null;
    }

    return (
        <div className="flex items-center justify-end gap-1">
            {/* Mail */}
            <button
                onClick={handleMail}
                title="E-posta Gönder"
                className="p-2 rounded-lg text-hmku-muted hover:text-hmku-primary hover:bg-rose-50 transition"
            >
                <Mail className="w-4 h-4" />
            </button>

            {/* Yetki (dokunulmadı) */}
            <button
                title="Yetki Yönetimi"
                className="p-2 rounded-lg text-hmku-muted hover:text-hmku-primary hover:bg-rose-50 transition"
            >
                <Shield className="w-4 h-4" />
            </button>

            {/* Sil */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Akademisyeni Sil"
                className="p-2 rounded-lg text-hmku-muted hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
                {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>

            {/* Hata mesajı */}
            {deleteResult?.error && (
                <span className="text-[10px] text-red-500 font-bold ml-1">
                    {deleteResult.error}
                </span>
            )}
        </div>
    );
}
