"use client";

import { useState } from "react";
import { Save, Camera } from "lucide-react";

export default function ProfilPage() {
    const [form, setForm] = useState({
        ad: "Ayhan",
        soyad: "Kaya",
        unvan: "Prof. Dr.",
        email: "ayhan.kaya@university.edu.tr",
        telefon: "0326 XXX XX XX",
        bolum: "Bilgisayar Mühendisliği",
        fakulte: "Mühendislik Fakültesi",
        uzmanlik: "Yapay Zeka, Makine Öğrenmesi, Derin Öğrenme",
        bio: "20 yılı aşkın akademik deneyim ile yapay zeka ve makine öğrenmesi alanlarında çalışmalar yürütmekteyim. Birçok ulusal ve uluslararası projede yer aldım.",
    });

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-hmku-dark tracking-tight">
                    Profilim
                </h1>
                <p className="mt-1 text-sm text-hmku-muted">
                    Kişisel bilgilerinizi güncelleyin.
                </p>
            </div>

            {/* Avatar Section */}
            <div className="bg-white rounded-xl shadow-modern border border-slate-100 p-5 flex items-center gap-5">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-hmku-primary to-rose-400 flex items-center justify-center">
                        <span className="text-white text-2xl font-black">AK</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-hmku-muted hover:text-hmku-primary hover:border-hmku-primary transition">
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div>
                    <p className="text-lg font-bold text-hmku-dark">
                        {form.unvan} {form.ad} {form.soyad}
                    </p>
                    <p className="text-sm text-hmku-muted">{form.bolum}</p>
                    <p className="text-[11px] text-hmku-muted mt-0.5">
                        {form.email}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-modern border border-slate-100 p-6">
                <h2 className="text-base font-bold text-hmku-dark mb-5">
                    Kişisel Bilgiler
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Unvan */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Unvan
                        </label>
                        <select
                            value={form.unvan}
                            onChange={(e) => handleChange("unvan", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        >
                            <option>Prof. Dr.</option>
                            <option>Doç. Dr.</option>
                            <option>Dr. Öğr. Üyesi</option>
                            <option>Arş. Gör. Dr.</option>
                            <option>Arş. Gör.</option>
                            <option>Öğr. Gör.</option>
                        </select>
                    </div>

                    {/* Ad */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Ad
                        </label>
                        <input
                            type="text"
                            value={form.ad}
                            onChange={(e) => handleChange("ad", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Soyad */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Soyad
                        </label>
                        <input
                            type="text"
                            value={form.soyad}
                            onChange={(e) => handleChange("soyad", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* E-posta */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Telefon */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Telefon
                        </label>
                        <input
                            type="text"
                            value={form.telefon}
                            onChange={(e) => handleChange("telefon", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Fakülte */}
                    <div>
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Fakülte
                        </label>
                        <input
                            type="text"
                            value={form.fakulte}
                            onChange={(e) => handleChange("fakulte", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Bölüm */}
                    <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Bölüm
                        </label>
                        <input
                            type="text"
                            value={form.bolum}
                            onChange={(e) => handleChange("bolum", e.target.value)}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Uzmanlık Alanları */}
                    <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Uzmanlık Alanları
                        </label>
                        <input
                            type="text"
                            value={form.uzmanlik}
                            onChange={(e) => handleChange("uzmanlik", e.target.value)}
                            placeholder="Virgülle ayırarak yazın"
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                        />
                    </div>

                    {/* Bio */}
                    <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-hmku-muted mb-1.5">
                            Biyografi
                        </label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2.5 bg-hmku-bg border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition resize-none"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-hmku-primary text-white text-sm font-bold rounded-xl hover:bg-rose-800 transition-all duration-200 shadow-lg shadow-hmku-primary/20 active:scale-[0.97]">
                        <Save className="w-4 h-4" />
                        Bilgileri Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
