import {
    FolderKanban,
    Clock,
    Globe,
    CheckCircle2,
    AlertTriangle,
    Info,
    FileText,
    Bell,
} from "lucide-react";

const statsCards = [
    {
        label: "Toplam Projem",
        value: "8",
        icon: FolderKanban,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        change: "+2 bu dönem",
        changeColor: "text-emerald-600",
    },
    {
        label: "Onay Bekleyenler",
        value: "3",
        icon: Clock,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        change: "Son gönderim: 2 gün önce",
        changeColor: "text-hmku-muted",
    },
    {
        label: "Yayındaki Projeler",
        value: "4",
        icon: Globe,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        change: "Vitrinde aktif",
        changeColor: "text-emerald-600",
    },
];

const recentActivity = [
    {
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
        text: '"Yapay Zeka Erken Uyarı" projeniz yayına alındı.',
        time: "1 saat önce",
    },
    {
        icon: AlertTriangle,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
        text: '"Nano Malzeme Araştırması" projeniz revizyon bekliyor.',
        time: "3 saat önce",
    },
    {
        icon: Bell,
        iconColor: "text-hmku-primary",
        iconBg: "bg-rose-50",
        text: "Admin projenize yorum ekledi: \"Özet bölümünü genişletin.\"",
        time: "5 saat önce",
    },
    {
        icon: Info,
        iconColor: "text-sky-500",
        iconBg: "bg-sky-50",
        text: "Yeni dönem proje başvuruları 15 Mart'ta kapanıyor.",
        time: "1 gün önce",
    },
    {
        icon: FileText,
        iconColor: "text-violet-500",
        iconBg: "bg-violet-50",
        text: '"Otonom İHA Kontrol" projenizin raporu oluşturuldu.',
        time: "2 gün önce",
    },
];

export default function HocaDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-hmku-dark tracking-tight">
                    Hoş Geldiniz,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-hmku-primary to-rose-400">
                        Prof. Dr. Ayhan Kaya
                    </span>
                </h1>
                <p className="mt-1 text-sm text-hmku-muted">
                    Projelerinizi ve aktivitelerinizi buradan takip edebilirsiniz.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {statsCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-xl shadow-modern p-5 flex items-start justify-between border border-slate-100 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div>
                                <p className="text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                                    {card.label}
                                </p>
                                <p className="mt-2 text-3xl font-black text-hmku-dark">
                                    {card.value}
                                </p>
                                <p className={`mt-1 text-[11px] font-medium ${card.changeColor}`}>
                                    {card.change}
                                </p>
                            </div>
                            <div
                                className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-modern border border-slate-100">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-hmku-dark">
                        Son Proje Hareketleri
                    </h2>
                    <span className="text-[11px] font-semibold text-hmku-primary cursor-pointer hover:text-rose-800 transition">
                        Tümünü Gör →
                    </span>
                </div>

                <div className="divide-y divide-slate-50">
                    {recentActivity.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-3.5 px-5 py-4 hover:bg-slate-50/50 transition"
                            >
                                <div
                                    className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                >
                                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-hmku-dark leading-snug">
                                        {item.text}
                                    </p>
                                    <p className="text-[11px] text-hmku-muted mt-1">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick tip */}
            <div className="bg-gradient-to-r from-hmku-dark to-slate-800 rounded-xl p-5 text-white">
                <p className="text-sm font-bold flex items-center gap-2">
                    💡 Hatırlatma
                </p>
                <p className="mt-1 text-[13px] text-slate-300 leading-relaxed">
                    Projelerinizi göndermeden önce tüm alanların eksiksiz
                    doldurulduğundan emin olun. Admin ekibimiz projelerinizi en kısa
                    sürede değerlendirecektir.
                </p>
            </div>
        </div>
    );
}
