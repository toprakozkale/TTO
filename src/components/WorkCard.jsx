"use client";

import { BookOpen, Unlock, Lock, Quote, ExternalLink } from "lucide-react";

export default function WorkCard({ work }) {
    const {
        display_name,
        publication_year,
        publication_date,
        doi,
        cited_by_count,
        type,
        open_access,
        primary_location,
        authorships,
        biblio
    } = work;

    const authors = authorships?.map(a => a.author.display_name).join(", ");
    const journalName = primary_location?.source?.display_name
        || (() => {
            // Try to extract domain from landing page URL as a hint
            const url = primary_location?.landing_page_url;
            if (url) {
                try {
                    const hostname = new URL(url).hostname.replace('www.', '');
                    return hostname;
                } catch { /* ignore */ }
            }
            // Type-based fallback
            if (type === 'proceedings-article' || type === 'conference-paper') return 'Konferans Bildirisi';
            if (type === 'book-chapter') return 'Kitap Bölümü';
            return 'Bilinmeyen Kaynak';
        })();
    const doiUrl = doi ? (doi.startsWith('http') ? doi : `https://doi.org/${doi}`) : null;

    const biblioText = [
        biblio?.volume ? `cilt.${biblio.volume}` : null,
        biblio?.issue ? `sa.${biblio.issue}` : null,
        (biblio?.first_page || biblio?.last_page) ? `ss.${biblio.first_page || ''}-${biblio.last_page || ''}` : null,
        publication_year
    ].filter(Boolean).join(", ");

    return (
        <div className="flex gap-4 group py-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors p-4 rounded-xl">
            {/* İkon */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 bg-white shadow-sm group-hover:border-hmku-primary group-hover:text-hmku-primary transition-all">
                    <BookOpen className="w-5 h-5" />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-hmku-muted rounded-full border border-slate-200/60 uppercase">
                        {type.replace('-', ' ')}
                    </span>
                    {open_access?.is_oa && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200/60">
                            <Unlock className="w-3 h-3" />
                            Açık Erişim
                        </span>
                    )}
                    {!open_access?.is_oa && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-slate-50 text-slate-400 rounded-full border border-slate-100 uppercase">
                            <Lock className="w-3 h-3" />
                            Kapalı
                        </span>
                    )}
                    {cited_by_count > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-full border border-amber-200/60">
                            <Quote className="w-3 h-3" />
                            {cited_by_count} Atıf
                        </span>
                    )}
                </div>

                {doiUrl ? (
                    <a
                        href={doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-hmku-dark leading-snug hover:text-hmku-primary transition-colors block mb-1.5"
                    >
                        {display_name}
                        <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ) : (
                    <h3 className="text-base font-bold text-hmku-dark leading-snug mb-1.5">
                        {display_name}
                    </h3>
                )}

                <p className="text-sm text-hmku-muted mb-2 leading-relaxed italic">
                    {authors}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="text-hmku-primary">{journalName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{biblioText}</span>
                    {work.journalIndexes && work.journalIndexes.length > 0 && (
                        <>
                            <span className="text-slate-300">•</span>
                            {work.journalIndexes.map(index => (
                                <span
                                    key={index}
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${index === 'SCIE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        index === 'SSCI' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            index === 'AHCI' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                index === 'ESCI' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                                    index === 'SCOPUS' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                        index === 'TRDIZIN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {index === 'SCIE' ? 'SCI-E' : index === 'TRDIZIN' ? 'TRDizin' : index}
                                </span>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
