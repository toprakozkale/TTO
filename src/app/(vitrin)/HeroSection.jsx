"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
    Lightbulb,
    GraduationCap,
    Users,
} from "lucide-react";

const DarkVeil = dynamic(() => import("@/components/animations/DarkVeil"), {
    ssr: false,
});

const STAT_ICONS = { Lightbulb, GraduationCap, Users };

export default function HeroSection({ titleWords, subtitle, bgImageUrl, stats }) {
    const hasCustomBg = bgImageUrl && bgImageUrl.trim() !== "";

    return (
        <section className="relative overflow-hidden bg-hmku-dark isolate">
            {/* Background: Custom image OR DarkVeil animation */}
            {hasCustomBg ? (
                <div className="absolute inset-0 -z-10">
                    <Image
                        src={bgImageUrl}
                        alt="Hero background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-hmku-dark/60" />
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 -z-10 opacity-60">
                        <DarkVeil
                            hueShift={-110}
                            noiseIntensity={0.02}
                            scanlineIntensity={0.05}
                            speed={1.2}
                            scanlineFrequency={0.1}
                            warpAmount={0.05}
                        />
                    </div>
                    <div className="absolute inset-0 bg-hmku-dark/20 mix-blend-multiply pointer-events-none -z-10" />
                </>
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
                <div className="max-w-4xl flex flex-col items-start pt-6 sm:pt-12">
                    {/* Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-[72px] lg:text-[84px] font-black text-white leading-[1.05] tracking-tight uppercase">
                        {titleWords.map((word, i) => {
                            const position = i % 3;
                            if (position === 1) {
                                return (
                                    <span key={i} className="block xl:inline-block text-hmku-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] xl:mr-4">
                                        {word}
                                    </span>
                                );
                            }
                            return (
                                <span key={i} className="block xl:inline-block xl:mr-4">
                                    {word}
                                </span>
                            );
                        })}
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 md:mt-8 text-lg sm:text-xl text-white/90 font-medium leading-[1.6] max-w-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {subtitle}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-10 md:mt-12 flex flex-col md:flex-row flex-wrap gap-4 w-full md:w-auto">
                        <Link
                            href="#"
                            className="flex w-full md:w-auto md:inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-[15px] font-black text-white bg-hmku-primary rounded-full hover:bg-rose-800 hover:scale-105 transition-all duration-300 tracking-wider shadow-[0_8px_20px_rgba(190,18,60,0.4)] uppercase"
                        >
                            PROJELERİ KEŞFET
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                href="/iletisim"
                                className="flex w-full sm:w-auto md:inline-flex items-center justify-center gap-2 px-8 py-4 md:py-5 text-[15px] font-bold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-[0.97] backdrop-blur-sm"
                            >
                                İletişime Geç
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-3 gap-6 max-w-md">
                    {stats.map((stat) => {
                        const Icon = STAT_ICONS[stat.iconName] || Lightbulb;
                        return (
                            <div key={stat.label} className="text-center">
                                <Icon className="w-5 h-5 mx-auto mb-2 text-hmku-primary" />
                                <p className="text-2xl md:text-3xl font-black text-white">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
