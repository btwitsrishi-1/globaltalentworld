"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export const CustomCursor = () => {
    const [isPointerDevice, setIsPointerDevice] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only show custom cursor on devices with fine pointer (desktop)
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setIsPointerDevice(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        }
    }, []);

    useEffect(() => {
        if (!isPointerDevice) return;

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isPointerDevice, handleMouseMove]);

    if (!isPointerDevice) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed left-0 top-0 w-8 h-8 rounded-full border-2 border-emerald-400/50 pointer-events-none z-[9999] hidden md:block"
            style={{ willChange: "transform" }}
        />
    );
};
