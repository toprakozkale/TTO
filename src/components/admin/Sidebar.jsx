"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Globe,
    FolderKanban,
    GraduationCap,
    Briefcase,
    LogOut,
    X,
    ChevronRight,
} from "lucide-react";
import TTOLogo from "@/components/ui/TTOLogo";
import { signOut } from "@/lib/actions/auth";

const menuItems = [
    { href: "/admin", label: "Akış Kontrolü", icon: LayoutDashboard },
    { href: "/admin/vitrin-yonetimi", label: "Vitrin Yönetimi", icon: Globe },
    { href: "/admin/proje-kontrolu", label: "Proje Kontrolü", icon: FolderKanban },
    { href: "/admin/akademisyen-yonetimi", label: "Akademisyen Yönetimi", icon: GraduationCap },
    { href: "/admin/projelerim", label: "Projelerim", icon: Briefcase },
];

export default function Sidebar({ isOpen, onClose, userEmail = "" }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-hmku-dark/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar panel */}
            <aside
                className={`fixed top-0 left-0 z-50 h-dvh w-72 bg-hmku-dark flex flex-col transition-transform duration-300 ease-out md:sticky md:translate-x-0 md:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 md:h-[72px] px-5 border-b border-white/[0.06]">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 group"
                        onClick={onClose}
                    >
                        <TTOLogo size="w-9 h-9" fontSize="text-[7px]" />
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">
                                Admin Panel
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight">
                                Yönetim Merkezi
                            </p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition"
                        aria-label="Kapat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <p className="px-3 mb-3 text-[10px] font-extrabold text-slate-600 uppercase tracking-[0.2em]">
                        Yönetim
                    </p>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 ${isActive
                                    ? "bg-hmku-primary text-white shadow-lg shadow-hmku-primary/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <Icon
                                    className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"
                                        }`}
                                />
                                <span className="flex-1">{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User card + logout */}
                <div className="p-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/[0.04]">
                        <div className="w-8 h-8 rounded-full bg-hmku-primary flex items-center justify-center text-white text-[11px] font-black">
                            {userEmail.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">
                                {userEmail.split("@")[0] || "Kullanıcı"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                                {userEmail || "—"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:text-hmku-primary hover:bg-white/[0.04] transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>
        </>
    );
}
