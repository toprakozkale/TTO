"use client";

/**
 * TTO Puzzle Logo Component
 * @param {string} className - Optional tailwind classes for the container
 * @param {string} size - Size of the container (e.g., 'w-14 h-14', 'w-9 h-9')
 * @param {string} fontSize - Font size of the "TTO" text (e.g., 'text-[9px]', 'text-[7px]')
 */
export default function TTOLogo({ className = "", size = "w-14 h-14", fontSize = "text-[9px]" }) {
    return (
        <div
            className={`relative ${size} flex items-center justify-center shrink-0 ${className}`}
            style={{ filter: "drop-shadow(0 4px 6px rgba(190, 18, 60, 0.3))" }}
        >
            <div
                className="absolute inset-0 bg-hmku-primary -rotate-90"
                style={{
                    maskImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 20 h60 v20 a10 10 0 0 0 0 20 v20 h-20 a10 10 0 0 1 -20 0 h-20 v-20 a10 10 0 0 1 0 -20 z'/></svg>\")",
                    WebkitMaskImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 20 h60 v20 a10 10 0 0 0 0 20 v20 h-20 a10 10 0 0 1 -20 0 h-20 v-20 a10 10 0 0 1 0 -20 z'/></svg>\")",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }}
            />
            <span
                className={`${fontSize} font-black text-white relative z-10 -translate-y-[0.5px]`}
            >
                TTO
            </span>
        </div>
    );
}
