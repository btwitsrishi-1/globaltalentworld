"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export const CustomCursor = () => {
    const [isPointerDevice, setIsPointerDevice] = useState(false);
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);
    const isHovering = useRef(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setIsPointerDevice(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        pos.current = { x: e.clientX, y: e.clientY };
    }, []);

    useEffect(() => {
        if (!isPointerDevice) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
                isHovering.current = true;
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
                isHovering.current = false;
            }
        };

        document.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseout', handleMouseOut, { passive: true });
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isPointerDevice]);

    useEffect(() => {
        if (!isPointerDevice) return;

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const animate = () => {
            ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
            ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
            }
            if (ringRef.current) {
                const ringScale = isHovering.current ? 1.8 : 1;
                const ringOpacity = isHovering.current ? 0.6 : 0.3;
                ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${ringScale})`;
                ringRef.current.style.opacity = String(ringOpacity);
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${ringPos.current.x - 60}px, ${ringPos.current.y - 60}px)`;
                glowRef.current.style.opacity = isHovering.current ? '0.15' : '0.06';
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [isPointerDevice, handleMouseMove]);

    if (!isPointerDevice) return null;

    return (
        <>
            {/* Dual blue-green ambient glow */}
            <div
                ref={glowRef}
                className="fixed left-0 top-0 w-[120px] h-[120px] rounded-full pointer-events-none z-[9997] hidden md:block"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(16,185,129,0.15) 40%, transparent 70%)',
                    willChange: 'transform',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Outer ring — blue tint */}
            <div
                ref={ringRef}
                className="fixed left-0 top-0 w-10 h-10 rounded-full border border-blue-400/30 pointer-events-none z-[9999] hidden md:block cursor-dot"
                style={{
                    willChange: 'transform, opacity',
                    transition: 'opacity 0.2s ease',
                }}
            />

            {/* Inner dot — blue */}
            <div
                ref={dotRef}
                className="fixed left-0 top-0 w-2 h-2 rounded-full bg-blue-400 pointer-events-none z-[9999] hidden md:block cursor-dot"
                style={{ willChange: 'transform' }}
            />
        </>
    );
};
