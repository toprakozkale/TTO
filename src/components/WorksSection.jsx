"use client";

import { useState, useMemo } from "react";
import WorkCard from "./WorkCard";
import { Loader2, Filter, ChevronDown } from "lucide-react";

// ── Type filter tabs (existing) ──────────────────────────────────
const TYPE_TABS = [
    { label: 'Tümü', filter: null },
    { label: 'Makaleler', filter: 'article' },
    { label: 'Kitap Bölümü', filter: 'book-chapter' },
    { label: 'Konferans', filter: 'conference' },
    { label: 'Açık Erişim', filter: 'oa' },
];

// ── Index display labels ─────────────────────────────────────────
const INDEX_DISPLAY = {
    SCIE: 'SCI-E',
    SSCI: 'SSCI',
    AHCI: 'AHCI',
    ESCI: 'ESCI',
    SCOPUS: 'Scopus',
    TRDIZIN: 'TRDizin',
};

export default function WorksSection({ initialWorks, orcid, totalCount }) {
    const [works, setWorks] = useState(initialWorks?.results || []);
    const [activeTypeTab, setActiveTypeTab] = useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialWorks?.results?.length < (initialWorks?.meta?.count || 0));

    // ── Index filter tabs with dynamic counts ────────────────────
    const indexTabs = useMemo(() => {
        const isWoSCore = (w) =>
            w.journalIndexes?.some(i => ['SCIE', 'SSCI', 'AHCI'].includes(i));
        const isESCI = (w) => w.journalIndexes?.includes('ESCI');

        return [
            {
                id: 'all',
                label: 'Tümü',
                count: works.length,
                filter: () => true,
            },
            {
                id: 'scie-ssci-ahci',
                label: 'SCI-E, SSCI, AHCI',
                count: works.filter(w => isWoSCore(w)).length,
                filter: (w) => isWoSCore(w),
            },
            {
                id: 'scie-ssci-ahci-esci',
                label: 'SCI-E, SSCI, AHCI, ESCI',
                count: works.filter(w => isWoSCore(w) || isESCI(w)).length,
                filter: (w) => isWoSCore(w) || isESCI(w),
            },
            {
                id: 'esci',
                label: 'ESCI',
                count: works.filter(w => isESCI(w) && !isWoSCore(w)).length,
                filter: (w) => isESCI(w) && !isWoSCore(w),
            },
            {
                id: 'scopus',
                label: 'Scopus',
                count: works.filter(w => w.journalIndexes?.includes('SCOPUS')).length,
                filter: (w) => w.journalIndexes?.includes('SCOPUS'),
            },
            {
                id: 'trdizin',
                label: 'TRDizin',
                count: works.filter(w => w.journalIndexes?.includes('TRDIZIN')).length,
                filter: (w) => w.journalIndexes?.includes('TRDIZIN'),
            },
            {
                id: 'other',
                label: 'Diğer Yayınlar',
                count: works.filter(w => !w.journalIndexes || w.journalIndexes.length === 0).length,
                filter: (w) => !w.journalIndexes || w.journalIndexes.length === 0,
            },
        ];
    }, [works]);

    // ── Apply both filters ───────────────────────────────────────
    const filteredWorks = useMemo(() => {
        const indexFilter = indexTabs.find(t => t.id === activeIndexTab)?.filter ?? (() => true);

        return works.filter(work => {
            // Type filter
            if (activeTypeTab) {
                if (activeTypeTab === 'oa') {
                    if (!work.open_access?.is_oa) return false;
                } else if (activeTypeTab === 'conference') {
                    if (!['proceedings-article', 'conference-paper', 'proceedings'].includes(work.type)) return false;
                } else {
                    if (work.type !== activeTypeTab) return false;
                }
            }
            // Index filter
            return indexFilter(work);
        });
    }, [works, activeTypeTab, activeIndexTab, indexTabs]);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/works?orcid=${orcid}&page=${page + 1}&perPage=100`);
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
            {/* ── Index Filter Tabs (AVESIS-style) ──────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {indexTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveIndexTab(tab.id)}
                        className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all border whitespace-nowrap ${activeIndexTab === tab.id
                            ? "bg-hmku-primary text-white border-hmku-primary shadow-md shadow-hmku-primary/20"
                            : "bg-white text-hmku-muted border-slate-200 hover:bg-slate-50 hover:text-hmku-dark hover:border-slate-300"
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* ── Type Filter + Count ──────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
                    {TYPE_TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTypeTab(tab.filter)}
                            className={`px-4 py-2 text-[12px] font-bold rounded-full transition-all border whitespace-nowrap ${activeTypeTab === tab.filter
                                ? "bg-hmku-primary text-white border-hmku-primary shadow-md shadow-hmku-primary/20"
                                : "bg-slate-50 text-hmku-muted border-transparent hover:bg-slate-100 hover:text-hmku-dark"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="text-[11px] font-bold text-hmku-muted uppercase tracking-wider">
                    {totalCount || 0} Yayın • {filteredWorks.length} gösteriliyor
                </div>
            </div>

            {/* ── Work List ─────────────────────────────────────── */}
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

            {/* ── Load More ────────────────────────────────────── */}
            {hasMore && activeIndexTab === 'all' && !activeTypeTab && (
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
