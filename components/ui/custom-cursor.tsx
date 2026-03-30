"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export const CustomCursor = () => {
    const [isPointerDevice, setIsPointerDevice] = useState(false);
    const dotRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setIsPointerDevice(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        pos.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) {
            dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
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
            ref={dotRef}
            className="fixed left-0 top-0 pointer-events-none z-[9999] hidden md:block"
            style={{
                width: 8,
                height: 8,
                marginLeft: -4,
                marginTop: -4,
                borderRadius: "50%",
                backgroundColor: "rgba(96, 165, 250, 0.9)",
                boxShadow: "0 0 12px 4px rgba(59, 130, 246, 0.3)",
                willChange: "transform",
            }}
        />
    );
};
