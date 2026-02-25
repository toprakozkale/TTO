import { createClient } from "@/lib/supabase/server";
import MobileMenuButton from "@/components/admin/MobileMenuButton";

export default async function AdminLayout({ children }) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userEmail = data?.claims?.email ?? "";

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-hmku-bg">
            <MobileMenuButton userEmail={userEmail} />

            <div className="flex-1 flex flex-col min-h-dvh min-w-0">
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">

                    {children}
                </main>
            </div>
        </div>
    );
}
