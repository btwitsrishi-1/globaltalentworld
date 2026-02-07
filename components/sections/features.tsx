"use client";

import { motion } from "framer-motion";
import { Globe, Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connect with opportunities and talent across 150+ countries. Geography is no longer a barrier.",
        color: "blue",
    },
    {
        icon: Users,
        title: "Curated Community",
        description: "Join a network of exceptional minds. Every member is vetted for quality and expertise.",
        color: "purple",
    },
    {
        icon: Briefcase,
        title: "Premium Opportunities",
        description: "Access roles at world-class companies. From startups to Fortune 500, find your perfect match.",
        color: "cyan",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Matching",
        description: "Our algorithms understand your unique skills and preferences to surface the best opportunities.",
        color: "green",
    },
];

const colorClasses = {
    blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        glow: "group-hover:shadow-blue-500/20",
    },
    purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400",
        glow: "group-hover:shadow-purple-500/20",
    },
    cyan: {
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        text: "text-cyan-400",
        glow: "group-hover:shadow-cyan-500/20",
    },
    green: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        glow: "group-hover:shadow-emerald-500/20",
    },
};

export const Features = () => {
    return (
        <section className="py-32 px-6 bg-black relative overflow-hidden">
            {/* Background gradient with green accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-slate-950/80 to-black pointer-events-none" />
            {/* Grid pattern overlay with green tint */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(rgba(16,185,129,.15) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(16,185,129,.15) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />
            {/* Green accent glows */}
            <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">
                        Why Global Talent World
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Built for the{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            modern workforce
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        We&apos;re reimagining how talent and opportunity connect in the digital age.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const colors = colorClasses[feature.color as keyof typeof colorClasses];
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 hover:shadow-2xl ${colors.glow}`}
                            >
                                <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 ${colors.text}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                    >
                        Learn more about our mission
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
