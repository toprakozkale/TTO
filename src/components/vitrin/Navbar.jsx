"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, GraduationCap, ShieldCheck } from "lucide-react";
import TTOLogo from "@/components/ui/TTOLogo";

const navLinks = [
    { href: "/", label: "ANASAYFA" },
    { href: "/hakkimizda", label: "HAKKIMIZDA" },
    { href: "/haberler", label: "TTO BÜLTEN" },
    { href: "/iletisim", label: "İLETİŞİM" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [erisimOpen, setErisimOpen] = useState(false);
    const erisimRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setErisimOpen(false);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (erisimRef.current && !erisimRef.current.contains(e.target)) {
                setErisimOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-modern"
                    : "bg-white shadow-sm"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px] lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 shrink-0 group">
                            {/* Puzzle Piece Logo Container */}
                            <TTOLogo />
                            <div className="hidden sm:block">
                                <p className="text-sm font-extrabold text-hmku-dark leading-tight">
                                    Teknoloji Transfer
                                </p>
                                <p className="text-[11px] text-hmku-muted leading-tight">
                                    Ofisi
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 px-3 xl:px-4 py-2.5 text-[11px] font-bold tracking-wider rounded-lg transition-all duration-200 group ${active
                                            ? "text-hmku-primary"
                                            : "text-hmku-dark hover:text-hmku-primary hover:bg-rose-50/60"
                                            }`}
                                    >
                                        {/* Bullet dot */}
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${active
                                                ? "bg-hmku-primary"
                                                : "bg-hmku-dark/40 group-hover:bg-hmku-primary"
                                                }`}
                                        />
                                        {link.label}
                                        {/* Active underline */}
                                        {active && (
                                            <span className="absolute -bottom-0.5 left-4 right-4 h-[2px] bg-hmku-primary rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Erişim Dropdown */}
                            <div ref={erisimRef} className="relative">
                                <button
                                    onClick={() => setErisimOpen(!erisimOpen)}
                                    className={`relative flex items-center gap-2 px-3 xl:px-4 py-2.5 text-[11px] font-bold tracking-wider rounded-lg transition-all duration-200 group ${erisimOpen
                                        ? "text-hmku-primary bg-rose-50/60"
                                        : "text-hmku-dark hover:text-hmku-primary hover:bg-rose-50/60"
                                        }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${erisimOpen
                                            ? "bg-hmku-primary"
                                            : "bg-hmku-dark/40 group-hover:bg-hmku-primary"
                                            }`}
                                    />
                                    ERİŞİM
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-300 ${erisimOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Dropdown panel */}
                                <div
                                    className={`absolute top-full left-1/2 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 origin-top -translate-x-1/2 ${erisimOpen
                                        ? "opacity-100 scale-y-100"
                                        : "opacity-0 scale-y-95 pointer-events-none"
                                        }`}
                                >
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/auth/akademisyen-login"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-hmku-dark hover:bg-violet-50 hover:text-violet-700 transition-all duration-200 group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                                                <GraduationCap className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold">Akademisyen Giriş</p>
                                                <p className="text-[10px] text-hmku-muted">Proje &amp; araştırma yönetimi</p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/auth/admin-login"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-hmku-dark hover:bg-rose-50 hover:text-hmku-primary transition-all duration-200 group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                                                <ShieldCheck className="w-4 h-4 text-hmku-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold">Yönetici Girişi</p>
                                                <p className="text-[10px] text-hmku-muted">Admin kontrol paneli</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side — University logo and name */}
                        {/* Right side — University logo and name */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <div>
                                <p className="text-sm font-extrabold text-hmku-dark leading-tight text-right">
                                    Hatay Mustafa Kemal
                                </p>
                                <p className="text-[11px] text-hmku-muted leading-tight text-right">
                                    Üniversitesi
                                </p>
                            </div>
                            <Image
                                src="/assets/logo_mku.png"
                                alt="MKÜ Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>

                        {/* Mobile Center Text */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:hidden text-center pointer-events-none w-max">
                            <p className="text-[10px] font-black text-hmku-dark leading-tight uppercase tracking-tighter">
                                Teknoloji Transfer
                            </p>
                            <p className="text-[9px] font-bold text-hmku-muted leading-tight">
                                Ofisi
                            </p>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-xl text-hmku-dark hover:bg-slate-100 transition active:scale-95"
                            aria-label="Menü"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-hmku-dark/30 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Mobile dropdown */}
            <div
                className={`fixed top-16 left-0 right-0 z-50 bg-white border-t border-slate-100 lg:hidden transition-all duration-300 ease-out origin-top ${mobileOpen
                    ? "opacity-100 scale-y-100 shadow-2xl"
                    : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
            >
                <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto p-4 space-y-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${active
                                    ? "text-hmku-primary bg-rose-50"
                                    : "text-hmku-dark hover:bg-slate-50"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-hmku-primary" : "bg-hmku-dark/30"
                                        }`}
                                />
                                {link.label}
                                {active && (
                                    <span className="ml-auto w-1 h-5 bg-hmku-primary rounded-full" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Mobile Erişim section */}
                    <div className="pt-3 mt-2 border-t border-slate-100">
                        <p className="px-4 py-2 text-[10px] font-black text-hmku-muted uppercase tracking-widest">
                            Erişim
                        </p>
                        <Link
                            href="/auth/akademisyen-login"
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide text-hmku-dark hover:bg-slate-50 transition-all duration-200"
                        >
                            <GraduationCap className="w-5 h-5 text-violet-500" />
                            Akademisyen Giriş
                        </Link>
                        <Link
                            href="/auth/admin-login"
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide text-hmku-dark hover:bg-slate-50 transition-all duration-200"
                        >
                            <ShieldCheck className="w-5 h-5 text-hmku-primary" />
                            Yönetici Girişi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
