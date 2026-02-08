import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ui-avatars.com",
                pathname: "/api/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
        ],
    },
    // Transpile Three.js packages for compatibility
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
