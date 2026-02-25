"use client";

import { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Send,
    Clock,
    Globe,
    ArrowRight,
    CheckCircle2,
    Linkedin,
    Instagram,
} from "lucide-react";

export default function ContactForm({ contactData }) {
    const [formStatus, setFormStatus] = useState("idle");

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus("sending");
        setTimeout(() => setFormStatus("success"), 1500);
    };

    const phone = contactData.contact_phone || "+90 326 245 58 45";
    const email = contactData.contact_email || "tto@mku.edu.tr";
    const address = contactData.contact_address || "TTO Binası, Kat 3, Merkez Kampüs, Hatay Mustafa Kemal Üniversitesi, 31000 Antakya/Hatay";
    const hoursWeekday = contactData.contact_hours_weekday || "08:30 - 17:30";
    const hoursWeekend = contactData.contact_hours_weekend || "Kapalı";
    const mapsUrl = contactData.contact_maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3230.134371485603!2d36.18567227633512!3d36.315516772822435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152674e79393e179%3A0xe5479ea76939634e!2sHatay%20Mustafa%20Kemal%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1709400000000!5m2!1str!2str";
    const instagramUrl = contactData.contact_instagram || "https://instagram.com";
    const linkedinUrl = contactData.contact_linkedin || "https://linkedin.com";

    const phoneClean = phone.replace(/[\s()-]/g, "");

    const contactInfo = [
        {
            icon: MapPin,
            title: "Adres",
            details: address,
            link: "https://maps.google.com",
            linkText: "Haritada Görüntüle",
            color: "bg-blue-50 text-blue-600",
        },
        {
            icon: Phone,
            title: "Telefon",
            details: phone,
            subDetails: `Hafta içi ${hoursWeekday}`,
            link: `tel:${phoneClean}`,
            linkText: "Hemen Ara",
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            icon: Mail,
            title: "E-posta",
            details: email,
            subDetails: "Genel sorular ve iş birlikleri için",
            link: `mailto:${email}`,
            linkText: "Mesaj Gönder",
            color: "bg-rose-50 text-hmku-primary",
        },
    ];

    return (
        <>
            {/* ───── Content Grid ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-6">
                        {contactInfo.map((info, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-hmku-primary/20 transition-all duration-300"
                            >
                                <div className="flex items-start gap-6">
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <info.icon size={28} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-black text-hmku-dark mb-2 tracking-tight">
                                            {info.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                            {info.details}
                                        </p>
                                        {info.subDetails && (
                                            <p className="text-xs text-slate-400 mb-4">
                                                {info.subDetails}
                                            </p>
                                        )}
                                        <a
                                            href={info.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs font-black text-hmku-primary uppercase tracking-widest group-hover:gap-3 transition-all"
                                        >
                                            {info.linkText}
                                            <ArrowRight
                                                size={14}
                                                className="ml-1 opacity-50 group-hover:opacity-100"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Social Links */}
                        <div className="bg-hmku-dark rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-hmku-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                <Globe size={20} className="text-hmku-primary" />
                                Sosyal Medya
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 text-center">
                                {[
                                    {
                                        name: "LinkedIn",
                                        icon: Linkedin,
                                        color: "hover:bg-[#0077b5] hover:border-[#0077b5]",
                                        iconColor: "text-[#0077b5]",
                                        shadow: "hover:shadow-[#0077b5]/20",
                                        link: linkedinUrl,
                                    },
                                    {
                                        name: "Instagram",
                                        icon: Instagram,
                                        color: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent",
                                        iconColor: "text-[#ee2a7b]",
                                        shadow: "hover:shadow-[#ee2a7b]/20",
                                        link: instagramUrl,
                                    },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex flex-col items-center gap-3 px-4 py-5 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg ${social.color} ${social.shadow}`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                                            <social.icon
                                                size={20}
                                                className={`${social.iconColor} group-hover:text-white transition-colors duration-300`}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 h-full">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-hmku-dark tracking-tight mb-4">
                                    Mesaj Gönderin
                                </h2>
                                <p className="text-slate-500">
                                    Tüm sorularınızı uzman ekibimize iletebilirsiniz. En kısa
                                    sürede size geri dönüş sağlayacağız.
                                </p>
                            </div>

                            {formStatus === "success" ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-hmku-dark mb-2">
                                        Mesajınız Alındı!
                                    </h3>
                                    <p className="text-slate-500 max-w-xs mx-auto mb-8">
                                        Bizimle iletişime geçtiğiniz için teşekkürler. En kısa
                                        sürede dönüş yapacağız.
                                    </p>
                                    <button
                                        onClick={() => setFormStatus("idle")}
                                        className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Yeni Mesaj Gönder
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-hmku-dark uppercase tracking-widest ml-1">
                                                Ad Soyad
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Örn: Ahmet Yılmaz"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-hmku-dark uppercase tracking-widest ml-1">
                                                E-posta
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="ahmet@ornekmku.edu.tr"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-hmku-dark uppercase tracking-widest ml-1">
                                            Konu
                                        </label>
                                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark appearance-none">
                                            <option>İş Birliği Talebi</option>
                                            <option>Proje Başvurusu</option>
                                            <option>Patent ve Tescil</option>
                                            <option>Teknopark Hakkında Bilgi</option>
                                            <option>Diğer</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-hmku-dark uppercase tracking-widest ml-1">
                                            Mesajınız
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Mesajınızı buraya yazın..."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-hmku-primary/20 focus:bg-white transition-all font-medium text-hmku-dark resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === "sending"}
                                        className="w-full md:w-auto px-12 py-5 bg-hmku-primary text-white font-black rounded-2xl hover:bg-rose-800 transition-all duration-300 shadow-xl shadow-hmku-primary/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                                    >
                                        {formStatus === "sending"
                                            ? "Gönderiliyor..."
                                            : "Mesajı Gönder"}
                                        <Send
                                            size={18}
                                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                        />
                                    </button>

                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        * Gönder butonuna basarak <strong>KVKK</strong> kapsamında
                                        verilerinizin işlenmesini kabul etmiş sayılırsınız. Kişisel
                                        verileriniz gizlilik politikamız çerçevesinde
                                        korunmaktadır.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Map Section ───── */}
            <section className="bg-hmku-dark py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-slate-900 rounded-[50px] overflow-hidden h-[500px] shadow-2xl relative border border-white/5">
                        <iframe
                            src={mapsUrl}
                            width="100%"
                            height="100%"
                            style={{
                                border: 0,
                                filter: "grayscale(0.5) contrast(1.2) invert(0.9) hue-rotate(180deg)",
                            }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 opacity-60"
                        ></iframe>
                        <div className="absolute inset-0 bg-gradient-to-t from-hmku-dark via-transparent to-transparent pointer-events-none" />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                                <div className="absolute inset-0 bg-hmku-primary blur-2xl opacity-40 animate-pulse scale-150" />
                                <div className="w-16 h-16 bg-hmku-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center relative z-10 animate-bounce">
                                    <MapPin className="text-white" size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-none">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-sm pointer-events-auto">
                                <h5 className="text-white font-black mb-2">
                                    TTO Ofis Konumu
                                </h5>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    {address}
                                </p>
                                <a
                                    href="https://www.google.com/maps/dir//Hatay+Mustafa+Kemal+%C3%9Cniversitesi/@36.3219444,36.1916667,15z"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 bg-hmku-primary text-white text-xs font-black rounded-xl hover:bg-rose-800 transition-all shadow-lg active:scale-95"
                                >
                                    Yol Tarifi Al
                                </a>
                            </div>
                            <div className="inline-flex items-center gap-3 bg-hmku-primary text-white p-4 rounded-full shadow-2xl px-8 pointer-events-auto cursor-help">
                                <Clock size={20} />
                                <span className="text-sm font-bold tracking-tight">
                                    Ofisimiz {hoursWeekend === "Kapalı" ? "Hafta İçi" : ""} Açık: {hoursWeekday}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
