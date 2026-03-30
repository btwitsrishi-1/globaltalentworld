"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDeviceConfig } from "@/lib/device-context";

const ReactLenis = dynamic(
    () => import("@studio-freight/react-lenis").then((mod) => mod.ReactLenis),
    { ssr: false }
);

export function SmoothScroll({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const { enableLenisSmooth } = useDeviceConfig();

    useEffect(() => {
        if (!enableLenisSmooth) return;
        // Delay smooth scroll initialization to not block first paint
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, [enableLenisSmooth]);

    if (!enableLenisSmooth || !isReady) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children as any}
        </ReactLenis>
    );
}
