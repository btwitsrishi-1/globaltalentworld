"use client";

import { motion, useInView, useMotionValue, useTransform, animate, useScroll } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
    { value: 50000, label: "Global Talents", suffix: "+", prefix: "" },
    { value: 150, label: "Countries", suffix: "+", prefix: "" },
    { value: 2500, label: "Companies", suffix: "+", prefix: "" },
    { value: 98, label: "Success Rate", suffix: "%", prefix: "" },
];

function AnimatedCounter({ value, suffix, prefix, inView }: { value: number; suffix: string; prefix: string; inView: boolean }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        if (latest >= 1000) return `${(latest / 1000).toFixed(latest >= 10000 ? 0 : 1)}k`;
        return Math.floor(latest).toString();
    });

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, value, {
            duration: 2.5,
            ease: [0.16, 1, 0.3, 1],
        });
        return controls.stop;
    }, [count, value, inView]);

    return (
        <span className="tabular-nums">
            {prefix}<motion.span>{rounded}</motion.span>{suffix}
        </span>
    );
}

export const Stats = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <section ref={containerRef} className="py-20 md:py-28 bg-[#060608] relative overflow-hidden">
            {/* Top divider — gradient */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div ref={ref} className="relative z-10 overflow-hidden">
                <motion.div
                    className="flex items-center gap-0 md:gap-0"
                    style={{ x }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-shrink-0 flex items-center"
                        >
                            <div className="text-center px-8 md:px-16 group">
                                <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-display font-bold text-white/90 mb-2 tracking-tighter leading-none">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} inView={isInView} />
                                </div>
                                <div className="text-white/35 text-[10px] md:text-xs font-medium uppercase tracking-[0.25em] group-hover:text-white/50 transition-colors duration-500">
                                    {stat.label}
                                </div>
                            </div>
                            {/* Gradient divider between stats */}
                            {index < stats.length - 1 && (
                                <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent flex-shrink-0" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom divider — gradient */}
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </section>
    );
};
