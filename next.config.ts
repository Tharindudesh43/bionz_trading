import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    // Existing headers configuration
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups',
                    },
                ],
            },
        ];
    },

    images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'via.placeholder.com', // already configured
        },
        {
            protocol: 'https',
            hostname: 'picsum.photos',       // already added
        },
        {
            protocol: 'https',
            hostname: 'media.istockphoto.com', // <-- ADD THIS
        },
    ],
},

};

export default nextConfig;