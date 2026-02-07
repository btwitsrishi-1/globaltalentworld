"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
    { value: 50000, label: "Global Talents", suffix: "+" },
    { value: 150, label: "Countries", suffix: "+" },
    { value: 2500, label: "Companies", suffix: "+" },
    { value: 98, label: "Success Rate", suffix: "%" },
];

const AnimatedNumber = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, inView]);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
        }
        return num.toString();
    };

    return (
        <span>
            {formatNumber(displayValue)}{suffix}
        </span>
    );
};

export const Stats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 px-6 bg-gradient-to-b from-blue-950/20 via-slate-900/80 to-black border-y border-emerald-500/10 relative overflow-hidden">
            {/* Background glow effects with green */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/12 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={isInView} />
                            </div>
                            <div className="text-slate-300 text-sm md:text-base font-medium">{stat.label}</div>
                            {/* Progress bar indicator with green */}
                            <motion.div
                                className="mt-3 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full mx-auto"
                                initial={{ width: 0 }}
                                animate={isInView ? { width: "60%" } : {}}
                                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
