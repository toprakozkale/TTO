import {
    Plus,
    FolderOpen,
    Search,
    Filter,
    Briefcase,
} from "lucide-react";
import Link from "next/link";

export default function ProjelerimPage() {
    return (
        <div>
            {/* Page header */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-hmku-dark tracking-tight">
                        Projelerim
                    </h1>
                    <p className="mt-1 text-sm text-hmku-muted">
                        Projelerinizi oluşturun, düzenleyin ve takip edin.
                    </p>
                </div>
                <button
                    disabled
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-hmku-primary rounded-xl opacity-50 cursor-not-allowed shadow-lg shadow-hmku-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Proje Oluştur
                </button>
            </div>

            {/* Search & Filter bar (disabled) */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-hmku-dark placeholder-slate-300 opacity-50 cursor-not-allowed"
                    />
                </div>
                <button
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed opacity-50"
                >
                    <Filter className="w-4 h-4" />
                    Filtrele
                </button>
            </div>

            {/* Empty state */}
            <div className="bg-white rounded-2xl shadow-modern border border-slate-100 p-12 md:p-16">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                        <Briefcase className="w-10 h-10 text-slate-200" />
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-lg font-black text-hmku-dark tracking-tight">
                        Henüz Proje Bulunmuyor
                    </h2>
                    <p className="mt-2 text-sm text-hmku-muted leading-relaxed">
                        Bu alan yakında aktif olacaktır. Proje oluşturma ve yönetim sistemi
                        hazırlandığında burada projelerinizi görüntüleyebilecek, düzenleyebilecek
                        ve takip edebileceksiniz.
                    </p>

                    {/* Feature preview cards */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3 mx-auto">
                                <FolderOpen className="w-4.5 h-4.5 text-blue-500" />
                            </div>
                            <p className="text-xs font-bold text-hmku-dark">Proje Oluşturma</p>
                            <p className="text-[11px] text-hmku-muted mt-1">Yeni proje başvuruları</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3 mx-auto">
                                <Search className="w-4.5 h-4.5 text-emerald-500" />
                            </div>
                            <p className="text-xs font-bold text-hmku-dark">Durum Takibi</p>
                            <p className="text-[11px] text-hmku-muted mt-1">Proje süreç yönetimi</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3 mx-auto">
                                <Briefcase className="w-4.5 h-4.5 text-amber-500" />
                            </div>
                            <p className="text-xs font-bold text-hmku-dark">Raporlama</p>
                            <p className="text-[11px] text-hmku-muted mt-1">Proje raporları</p>
                        </div>
                    </div>

                    {/* Coming soon badge */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs font-bold text-amber-700">Yakında Aktif</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
