"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
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

    return (
        <section ref={ref} className="py-28 md:py-36 px-6 bg-[#060608] relative overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/[0.06]">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center md:px-8 group"
                        >
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} inView={isInView} />
                            </div>
                            <div className="text-white/25 text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] group-hover:text-white/40 transition-colors duration-500">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </section>
    );
};
