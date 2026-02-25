"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Microscope,
    BrainCircuit,
    Sparkles,
    Leaf,
    Shield,
    Wifi,
} from "lucide-react";

// ── Icon lookup (client-side) ───────────────────────────────────
const ICON_LOOKUP = {
    Microscope,
    Cpu,
    Shield,
    BrainCircuit,
    Leaf,
    Wifi,
    Sparkles,
};

function ProjectCard({ project }) {
    const Icon = ICON_LOOKUP[project.iconName] || Sparkles;
    return (
        <div
            className={`group bg-white rounded-xl p-6 shadow-modern hover:shadow-xl ${project.glow} transition-all duration-300 hover:-translate-y-1 border border-slate-100 h-full`}
        >
            <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-lg ${project.glow} group-hover:scale-110 transition-transform duration-300`}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span
                className={`inline-block mt-4 px-2.5 py-0.5 text-[10px] font-bold rounded-full tracking-wide ${project.tag}`}
            >
                {project.category}
            </span>
            <h3 className="mt-3 text-[15px] font-bold text-hmku-dark leading-snug">
                {project.title}
            </h3>
            <p className="mt-2 text-sm text-hmku-muted leading-relaxed">
                {project.description}
            </p>
            <div className="mt-5 pt-4 border-t border-slate-100">
                <button className="flex items-center gap-1.5 text-xs font-bold text-hmku-primary hover:gap-3 transition-all duration-200">
                    Detayları Gör
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function FeaturedCarousel({ projects }) {
    const scrollRef = useRef(null);
    const timerRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const TOTAL = projects.length;

    const getCardStep = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return 0;
        const firstCard = container.children[0];
        if (!firstCard) return 0;
        const style = window.getComputedStyle(container);
        const gap = parseFloat(style.gap) || 24;
        return firstCard.offsetWidth + gap;
    }, []);

    const scrollToIdx = useCallback(
        (idx) => {
            const container = scrollRef.current;
            if (!container) return;
            const step = getCardStep();
            container.scrollTo({ left: step * idx, behavior: "smooth" });
        },
        [getCardStep]
    );

    const nextCard = useCallback(() => {
        setActiveIdx((prev) => {
            const next = (prev + 1) % TOTAL;
            scrollToIdx(next);
            return next;
        });
    }, [scrollToIdx, TOTAL]);

    const prevCard = useCallback(() => {
        setActiveIdx((prev) => {
            const next = (prev - 1 + TOTAL) % TOTAL;
            scrollToIdx(next);
            return next;
        });
    }, [scrollToIdx, TOTAL]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const onScroll = () => {
            const step = getCardStep();
            if (step === 0) return;
            const idx = Math.round(container.scrollLeft / step);
            setActiveIdx(Math.min(idx, TOTAL - 1));
        };
        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, [getCardStep, TOTAL]);

    useEffect(() => {
        timerRef.current = setInterval(nextCard, 4000);
        return () => clearInterval(timerRef.current);
    }, [nextCard]);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(nextCard, 4000);
    }, [nextCard]);

    return (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation arrows */}
            <button
                onClick={() => {
                    prevCard();
                    resetTimer();
                }}
                className="hidden md:flex absolute -left-2 lg:left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-modern items-center justify-center text-hmku-muted hover:text-hmku-primary hover:shadow-lg transition-all active:scale-90"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => {
                    nextCard();
                    resetTimer();
                }}
                className="hidden md:flex absolute -right-2 lg:right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-modern items-center justify-center text-hmku-muted hover:text-hmku-primary hover:shadow-lg transition-all active:scale-90"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable card track */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onTouchStart={() => clearInterval(timerRef.current)}
                onTouchEnd={resetTimer}
            >
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="w-[85%] sm:w-[70%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start"
                    >
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
                {projects.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setActiveIdx(idx);
                            scrollToIdx(idx);
                            resetTimer();
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${activeIdx === idx
                                ? "w-8 bg-hmku-primary"
                                : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
