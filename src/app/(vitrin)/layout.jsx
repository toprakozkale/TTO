import Navbar from "@/components/vitrin/Navbar";

export default function VitrinLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-hmku-bg">
            <Navbar />
            <main className="flex-grow pt-[68px] lg:pt-20">{children}</main>
        </div>
    );
}
