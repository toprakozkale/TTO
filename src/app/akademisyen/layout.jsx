"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import HocaSidebar from "@/components/hoca/HocaSidebar";
import TTOLogo from "@/components/ui/TTOLogo";

export default function HocaPaneliLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-hmku-bg">
            {/* Sidebar */}
            <HocaSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Topbar */}
                <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-hmku-dark hover:bg-gray-100 transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <TTOLogo size="w-7 h-7" fontSize="text-[6px]" />
                        <span className="text-sm font-bold text-hmku-dark">
                            Akademisyen Panel
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
