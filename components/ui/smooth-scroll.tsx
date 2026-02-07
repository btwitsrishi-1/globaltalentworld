"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactLenis = dynamic(
    () => import("@studio-freight/react-lenis").then((mod) => mod.ReactLenis),
    { ssr: false }
);

export function SmoothScroll({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Delay smooth scroll initialization to not block first paint
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children as any}
        </ReactLenis>
    );
}
