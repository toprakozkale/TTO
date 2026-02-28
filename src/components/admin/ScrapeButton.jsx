"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { runScrapers } from "@/lib/actions/scraper";
import { useRouter } from "next/navigation";

export default function ScrapeButton() {
    const router = useRouter();
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [result, setResult] = useState(null);

    const handleScrape = async () => {
        setStatus("loading");
        setResult(null);
        try {
            const data = await runScrapers();
            if (data.error) {
                setStatus("error");
                setResult(data);
            } else {
                setStatus("success");
                setResult(data);
                router.refresh(); // Sayfadaki Server Component verilerini tazele
            }
        } catch (err) {
            setStatus("error");
            setResult({ error: "Bir hata oluştu." });
        }
        setTimeout(() => setStatus("idle"), 5000);
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <button
                onClick={handleScrape}
                disabled={status === "loading"}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 ${status === "success"
                    ? "bg-emerald-500 text-white"
                    : status === "error"
                        ? "bg-red-500 text-white"
                        : "bg-white border border-slate-200 text-hmku-dark hover:bg-slate-50"
                    }`}
            >
                <RefreshCw
                    size={14}
                    className={status === "loading" ? "animate-spin" : ""}
                />
                {status === "loading"
                    ? "Güncelleniyor..."
                    : status === "success"
                        ? `✓ Güncellendi (${result?.total || 0} kayıt)`
                        : status === "error"
                            ? "Hata!"
                            : "Şimdi Güncelle"}
            </button>
            {status === "success" && result?.summary && (
                <div className="flex gap-2">
                    {result.summary
                        .filter((s) => s.count > 0 || s.status === "rejected")
                        .map((s) => (
                            <span
                                key={s.source}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded ${s.status === "fulfilled"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                    }`}
                            >
                                {s.source}: {s.count}
                            </span>
                        ))}
                </div>
            )}
        </div >
    );
}
