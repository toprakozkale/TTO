"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import TTOLogo from "@/components/ui/TTOLogo";
import dynamic from 'next/dynamic';
import { signIn, signUp } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";

const DarkVeil = dynamic(() => import('@/components/animations/DarkVeil'), { ssr: false });

function LoginForm() {
    const [showPw, setShowPw] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const redirectError = searchParams.get("error");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = isSignUp
                ? await signUp(formData)
                : await signIn(formData);

            // signIn başarılıysa redirect atar, buraya gelmez
            if (result?.error) {
                setError(result.error);
            }
            if (result?.success) {
                setSuccess(result.success);
            }
        } catch (err) {
            // redirect() bir hata fırlatır — bu beklenen davranış
            // NEXT_REDIRECT hatası ise sorun yok
            if (err?.digest?.startsWith("NEXT_REDIRECT")) {
                return;
            }
            setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-hmku-dark overflow-hidden">
            {/* DarkVeil Background Animation */}
            <div className="absolute inset-0 opacity-40">
                <DarkVeil
                    hueShift={-110}
                    noiseIntensity={0.02}
                    scanlineIntensity={0.05}
                    speed={1.2}
                    scanlineFrequency={0.1}
                    warpAmount={0.05}
                />
            </div>

            {/* ── Login Card ── */}
            <div className="relative w-full max-w-md mx-4 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-10 z-10">
                <TTOLogo className="mb-8" />

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    {isSignUp ? "Şifre Belirle" : "Yönetim Paneli"}
                </h1>
                <p className="mt-1 text-sm text-hmku-primary font-bold">
                    {isSignUp ? "İlk Giriş — Hesap Oluştur" : "Admin / Akademisyen Girişi"}
                </p>

                {/* Error / Success Messages */}
                {(error || redirectError === "unauthorized") && (
                    <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30">
                        <p className="text-sm text-red-200">
                            {error || "Bu hesap sisteme erişim yetkisine sahip değil."}
                        </p>
                    </div>
                )}
                {success && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                        <p className="text-sm text-emerald-200">{success}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                    <div className="group">
                        <label className="block text-[13px] text-white/90 mb-1 transition-colors group-focus-within:text-hmku-primary">
                            E-posta Adresi
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="ornek@university.edu.tr"
                            required
                            className="w-full bg-transparent border-b-2 border-white/30 px-0 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-hmku-primary transition-colors"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[13px] text-hmku-muted mb-1 transition-colors group-focus-within:text-hmku-primary">
                            Şifre
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPw ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-transparent border-b-2 border-white/30 px-0 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-white/50 focus:border-hmku-primary transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition"
                            >
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-3 text-sm font-bold text-white bg-hmku-primary rounded-full hover:bg-rose-800 transition-all duration-200 shadow-xl shadow-hmku-primary/25 hover:shadow-2xl hover:shadow-hmku-primary/35 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setSuccess("");
                        }}
                        className="text-[13px] font-semibold text-white/80 hover:text-hmku-primary transition"
                    >
                        {isSignUp ? "Hesabım var, giriş yap" : "İlk kez giriş yapıyorsunuz?"}
                    </button>
                    <Link
                        href="/iletisim"
                        className="text-[13px] font-semibold text-hmku-primary hover:text-rose-300 transition"
                    >
                        Yönetici ile İletişim
                    </Link>
                </div>
            </div>
        </div>
    );
}

// useSearchParams() için Suspense boundary gerekli
export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
