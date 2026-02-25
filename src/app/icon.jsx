import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'TTO Logo';
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {/* Puzzle Shape Background */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 100 100"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >
                    <path
                        d="M20 20 h60 v20 a10 10 0 0 0 0 20 v20 h-20 a10 10 0 0 1 -20 0 h-20 v-20 a10 10 0 0 1 0 -20 z"
                        fill="#BE123C"
                        transform="rotate(-90 50 50)"
                    />
                </svg>

                {/* TTO Text */}
                <div
                    style={{
                        fontSize: 7,
                        color: 'white',
                        fontWeight: 900,
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                    }}
                >
                    TTO
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
