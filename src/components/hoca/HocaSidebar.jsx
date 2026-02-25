"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    UserCircle,
    X,
    LogOut,
} from "lucide-react";
import TTOLogo from "@/components/ui/TTOLogo";
import { signOut } from "@/lib/actions/auth";

const menuItems = [
    { label: "Panelim", href: "/akademisyen", icon: LayoutDashboard },
    { label: "Projelerim", href: "/akademisyen/projelerim", icon: FolderKanban },
    { label: "Profilim", href: "/akademisyen/profil", icon: UserCircle },
];

export default function HocaSidebar({ open, onClose }) {
    const pathname = usePathname();

    const isActive = (href) =>
        href === "/akademisyen"
            ? pathname === "/akademisyen"
            : pathname.startsWith(href);

    const sidebar = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <TTOLogo size="w-9 h-9" fontSize="text-[7px]" />
                    <div>
                        <p className="text-sm font-bold text-hmku-dark leading-none">
                            Akademisyen
                        </p>
                        <p className="text-[10px] text-hmku-muted mt-0.5">
                            Akademisyen Panel
                        </p>
                    </div>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1.5 rounded-lg text-hmku-muted hover:text-hmku-dark hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                                ? "bg-rose-50 text-hmku-primary"
                                : "text-hmku-dark hover:bg-gray-50"
                                }`}
                        >
                            <Icon
                                className={`w-[18px] h-[18px] ${active ? "text-hmku-primary" : "text-hmku-muted"
                                    }`}
                            />
                            {item.label}
                            {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-hmku-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-hmku-primary to-rose-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AK</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-hmku-dark truncate">
                            Prof. Dr. Ayhan Kaya
                        </p>
                        <p className="text-[11px] text-hmku-muted truncate">
                            Bilgisayar Mühendisliği
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-hmku-muted hover:text-hmku-primary hover:bg-rose-50 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
                {sidebar}
            </aside>

            {/* Mobile drawer overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebar}
            </aside>
        </>
    );
}
