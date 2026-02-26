import {
    Search,
    UserCheck,
    UserX,
    GraduationCap,
    Clock,
    CheckCircle2,
} from "lucide-react";
import AkademisyenEkleModal from "@/components/admin/AkademisyenEkleModal";
import AkademisyenActions from "@/components/admin/AkademisyenActions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AkademisyenYonetimiPage() {
    const supabase = await createClient();

    const { data: akademisyenlerData, error } = await supabase
        .from('akademisyenler')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Akademisyen fetch error:", error);
    }

    const akademisyenler = (akademisyenlerData || []).map((hoca) => ({
        id: hoca.id,
        name: hoca.ad_soyad,
        department: hoca.uzmanlik_alanlari?.join(", ") || "Belirtilmemiş",
        email: hoca.email,
        projects: hoca.proje_sayisi || 0,
        pending: 0,
        published: hoca.yayin_sayisi || 0,
        status: hoca.is_active ? "Aktif" : "Pasif",
        lastLogin: new Date(hoca.created_at).toLocaleDateString("tr-TR"),
    }));

    const summaryCards = [
        {
            label: "Toplam Akademisyen",
            value: akademisyenler.length.toString(),
            icon: GraduationCap,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
        {
            label: "Aktif Hesap",
            value: akademisyenler.length.toString(), // Şimdilik hepsi aktif varsayıyoruz
            icon: UserCheck,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            label: "Bekleyen Projeler",
            value: "0",
            icon: Clock,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            label: "Onaylanan Projeler",
            value: "0",
            icon: CheckCircle2,
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4">

                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        Akademisyen Yönetimi
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Akademisyen hesaplarını ve proje durumlarını yönetin.
                    </p>
                </div>
                {/* Modal Bileşenini Buraya Ekledik */}
                <AkademisyenEkleModal />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-xl shadow-modern p-4 flex items-center gap-3 border border-slate-100"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-xl font-black text-hmku-dark">
                                    {card.value}
                                </p>
                                <p className="text-[10px] font-bold text-hmku-muted uppercase tracking-wider">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hmku-muted" />
                <input
                    type="text"
                    placeholder="Akademisyen ara (ad, bölüm, e-posta)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-hmku-dark outline-none focus:border-hmku-primary focus:ring-2 focus:ring-hmku-primary/10 transition"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-modern border border-slate-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="text-left px-5 py-3 text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    Akademisyen
                                </th>
                                <th className="text-left px-5 py-3 text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    Projeler
                                </th>
                                <th className="text-left px-5 py-3 text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="text-left px-5 py-3 text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    Son Giriş
                                </th>
                                <th className="text-right px-5 py-3 text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {akademisyenler.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-hmku-muted">
                                        Henüz akademisyen bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                akademisyenler.map((hoca) => (
                                    <tr
                                        key={hoca.id}
                                        className="hover:bg-slate-50/50 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-hmku-primary to-rose-400 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-[11px] font-bold uppercase">
                                                        {hoca.name
                                                            .split(" ")
                                                            .filter(
                                                                (w) =>
                                                                    !["Prof.", "Dr.", "Doç.", "Öğr.", "Üyesi", "Arş.", "Gör."].includes(w)
                                                            )
                                                            .map((w) => w[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-hmku-dark">
                                                        {hoca.name}
                                                    </p>
                                                    <p className="text-[11px] text-hmku-muted">
                                                        {hoca.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3 text-[12px]">
                                                <span className="text-hmku-dark font-semibold">
                                                    {hoca.projects} toplam
                                                </span>
                                                <span className="text-amber-600">
                                                    {hoca.pending} bekliyor
                                                </span>
                                                <span className="text-emerald-600">
                                                    {hoca.published} yayında
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full ${hoca.status === "Aktif"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {hoca.status === "Aktif" ? (
                                                    <UserCheck className="w-3 h-3" />
                                                ) : (
                                                    <UserX className="w-3 h-3" />
                                                )}
                                                {hoca.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[12px] text-hmku-muted">
                                            {hoca.lastLogin}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <AkademisyenActions hoca={hoca} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                    {akademisyenler.length === 0 ? (
                        <div className="p-4 text-center text-sm text-hmku-muted">
                            Henüz akademisyen bulunmuyor.
                        </div>
                    ) : (
                        akademisyenler.map((hoca) => (
                            <div key={hoca.id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-hmku-primary to-rose-400 flex items-center justify-center">
                                            <span className="text-white text-[11px] font-bold uppercase">
                                                {hoca.name
                                                    .split(" ")
                                                    .filter(
                                                        (w) =>
                                                            !["Prof.", "Dr.", "Doç.", "Öğr.", "Üyesi", "Arş.", "Gör."].includes(w)
                                                    )
                                                    .map((w) => w[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-hmku-dark">
                                                {hoca.name}
                                            </p>
                                            <p className="text-[11px] text-hmku-muted">
                                                {hoca.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${hoca.status === "Aktif"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {hoca.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] text-hmku-muted">
                                    <span>{hoca.projects} proje</span>
                                    <span className="text-amber-600">
                                        {hoca.pending} bekliyor
                                    </span>
                                    <span className="text-emerald-600">
                                        {hoca.published} yayında
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
