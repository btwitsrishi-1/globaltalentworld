"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { Globe, Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDeviceConfig } from "@/lib/device-context";

const features = [
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connect with opportunities across 150+ countries. Geography is no longer a barrier to finding your dream role.",
        stat: "150+",
        statLabel: "countries",
        gradient: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/[0.08] border-blue-500/[0.1] group-hover:bg-blue-500/[0.15] group-hover:border-blue-500/[0.25]",
        hero: true,
    },
    {
        icon: Users,
        title: "Curated Community",
        description: "A network of exceptional minds. Every member is vetted for quality, expertise, and cultural alignment.",
        stat: "50k+",
        statLabel: "talents",
        gradient: "from-emerald-500/20 to-green-500/20",
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/[0.08] border-emerald-500/[0.1] group-hover:bg-emerald-500/[0.15] group-hover:border-emerald-500/[0.25]",
    },
    {
        icon: Briefcase,
        title: "Premium Opportunities",
        description: "Access roles at world-class companies. From high-growth startups to Fortune 500 enterprises.",
        stat: "2.5k+",
        statLabel: "companies",
        gradient: "from-violet-500/20 to-purple-500/20",
        iconColor: "text-violet-400",
        iconBg: "bg-violet-500/[0.08] border-violet-500/[0.1] group-hover:bg-violet-500/[0.15] group-hover:border-violet-500/[0.25]",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Matching",
        description: "Intelligent algorithms that understand your unique skills to surface the best-fit opportunities.",
        stat: "98%",
        statLabel: "match rate",
        gradient: "from-amber-500/20 to-orange-500/20",
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/[0.08] border-amber-500/[0.1] group-hover:bg-amber-500/[0.15] group-hover:border-amber-500/[0.25]",
    },
];

function FeatureCard({ feature, index, isHero }: { feature: typeof features[number]; index: number; isHero?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const { enable3DTilt } = useDeviceConfig();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!enable3DTilt || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={enable3DTilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative bg-[#060608] transition-all duration-500 cursor-default ${
                isHero ? "p-10 md:p-14" : "p-8 md:p-10"
            }`}
        >
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            {/* Content */}
            <div className="relative z-10">
                <div className={`flex items-start justify-between ${isHero ? "mb-10" : "mb-8"}`}>
                    <div className={`${isHero ? "w-14 h-14 rounded-2xl" : "w-12 h-12 rounded-xl"} ${feature.iconBg} border flex items-center justify-center transition-all duration-500`}>
                        <feature.icon className={`${isHero ? "w-6 h-6" : "w-5 h-5"} ${feature.iconColor}`} />
                    </div>
                    <div className="text-right">
                        <div className={`${isHero ? "text-5xl md:text-6xl" : "text-3xl"} font-display font-bold text-white/90 tabular-nums group-hover:text-white transition-colors duration-300`}>{feature.stat}</div>
                        <div className="text-[10px] text-white/35 uppercase tracking-[0.15em] group-hover:text-white/50 transition-colors duration-300">{feature.statLabel}</div>
                    </div>
                </div>
                <h3 className={`${isHero ? "text-2xl md:text-3xl mb-4" : "text-lg mb-3"} font-semibold text-white tracking-tight group-hover:text-white transition-colors`}>{feature.title}</h3>
                <p className={`text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-500 ${isHero ? "text-base max-w-md" : "text-sm"}`}>{feature.description}</p>

                {/* Subtle arrow on hover */}
                <div className={`${isHero ? "mt-8" : "mt-6"} flex items-center gap-1.5 text-white/0 group-hover:text-white/30 transition-all duration-500`}>
                    <span className="text-xs font-medium">Learn more</span>
                    <ArrowRight className="w-3 h-3 -translate-x-2 group-hover:translate-x-0 transition-transform duration-500" />
                </div>
            </div>
        </motion.div>
    );
}

export const Features = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const heroFeature = features[0];
    const smallFeatures = features.slice(1);

    return (
        <section ref={sectionRef} className="py-32 md:py-44 px-6 bg-[#060608] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 md:mb-28"
                >
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[13px] font-medium tracking-[0.3em] uppercase text-blue-400/60 mb-6"
                    >
                        Why GTW
                    </motion.p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-white mb-6 leading-[1.1]">
                        Built for the
                        <br />
                        <span className="text-gradient">modern workforce</span>
                    </h2>
                    <p className="text-white/45 text-lg md:text-xl max-w-lg font-light leading-relaxed">
                        Reimagining how talent and opportunity connect in the digital age.
                    </p>
                </motion.div>

                {/* Asymmetric bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden shadow-border sibling-fade">
                    {/* Hero card — spans 2 columns */}
                    <div className="md:col-span-2 md:row-span-2">
                        <FeatureCard feature={heroFeature} index={0} isHero />
                    </div>
                    {/* 3 smaller cards */}
                    {smallFeatures.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index + 1} />
                    ))}
                </div>

                {/* Link below */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <Link href="/about" className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm font-medium transition-all duration-300 group">
                        Learn more about our mission
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
