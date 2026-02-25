"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import TTOLogo from "@/components/ui/TTOLogo";

export default function MobileMenuButton({ userEmail }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userEmail={userEmail}
            />

            {/* Mobile topbar */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/90 backdrop-blur-md border-b border-slate-200/60 md:hidden">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-xl text-hmku-dark hover:bg-slate-100 transition active:scale-95"
                    aria-label="Menüyü aç"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <TTOLogo size="w-9 h-9" fontSize="text-[7px]" />
                    <span className="text-sm font-bold text-hmku-dark">Admin</span>
                </div>
                <div className="w-9" />
            </header>
        </>
    );
}
