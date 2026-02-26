"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";
import { Loader2, Filter, ChevronDown } from "lucide-react";

const TABS = [
    { label: 'Tümü', filter: null },
    { label: 'Makaleler', filter: 'article' },
    { label: 'Kitap Bölümü', filter: 'book-chapter' },
    { label: 'Konferans', filter: 'proceedings-article' },
    { label: 'Açık Erişim', filter: 'oa' },
];

export default function WorksSection({ initialWorks, orcid, totalCount }) {
    const [works, setWorks] = useState(initialWorks?.results || []);
    const [activeTab, setActiveTab] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialWorks?.results?.length < (initialWorks?.meta?.count || 0));

    const filteredWorks = works.filter(work => {
        if (!activeTab) return true;
        if (activeTab === 'oa') return work.open_access?.is_oa;
        return work.type === activeTab;
    });

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/works?orcid=${orcid}&page=${page + 1}`);
            const data = await res.json();

            if (data?.results) {
                setWorks(prev => [...prev, ...data.results]);
                setPage(prev => prev + 1);
                setHasMore(works.length + data.results.length < (data.meta?.count || 0));
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Load more error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.filter)}
                            className={`px-4 py-2 text-[12px] font-bold rounded-full transition-all border whitespace-nowrap ${activeTab === tab.filter
                                    ? "bg-hmku-primary text-white border-hmku-primary shadow-md shadow-hmku-primary/20"
                                    : "bg-slate-50 text-hmku-muted border-transparent hover:bg-slate-100 hover:text-hmku-dark"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                    {totalCount || 0} Yayın • {works.length} yüklendi
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {filteredWorks.length === 0 ? (
                    <div className="py-12 text-center">
                        <Filter className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-hmku-muted">Bu kategoride yayın bulunamadı.</p>
                    </div>
                ) : (
                    filteredWorks.map((work) => (
                        <WorkCard key={work.id} work={work} />
                    ))
                )}
            </div>

            {hasMore && !activeTab && (
                <div className="pt-8 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-hmku-dark hover:bg-slate-50 hover:border-hmku-primary transition-all shadow-sm flex items-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        )}
                        {loading ? "Yükleniyor..." : "Daha Fazla Yayın Göster"}
                    </button>
                </div>
            )}
        </div>
    );
}
