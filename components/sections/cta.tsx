"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const CTA = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setEmail("");
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 bg-[#060608] overflow-hidden">
            {/* Aurora background */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 80% 60% at 20% 40%, rgba(59,130,246,0.15), transparent),
                        radial-gradient(ellipse 60% 80% at 80% 60%, rgba(16,185,129,0.12), transparent),
                        radial-gradient(ellipse 70% 50% at 50% 30%, rgba(6,182,212,0.1), transparent)
                    `,
                    animation: "aurora-shift 15s ease-in-out infinite",
                }}
            />

            {/* Grain overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />

            {/* Radial fade from center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,#060608_80%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Label */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[13px] font-medium tracking-[0.3em] uppercase text-blue-400/60 mb-10"
                >
                    Get started
                </motion.p>

                {/* Massive serif heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-white mb-8 tracking-tight leading-[1.05]"
                >
                    Ready to join
                    <br />
                    the <span className="text-gradient">movement</span>?
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white/45 text-lg md:text-xl max-w-xl mx-auto mb-14 font-light leading-relaxed"
                >
                    Whether you&apos;re world-class talent or a company
                    building an exceptional team.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                >
                    <Link
                        href="/signup"
                        className="btn-embossed-primary group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white text-sm font-medium rounded-full"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                        href="/careers"
                        className="btn-embossed-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white/60 text-sm font-medium rounded-full border border-white/[0.08] hover:text-white/80"
                    >
                        Browse Opportunities
                    </Link>
                </motion.div>

                {/* Newsletter inline input */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    <p className="text-white/25 text-xs uppercase tracking-[0.2em] mb-4">
                        Or stay in the loop
                    </p>
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full py-3 pl-5 pr-28 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] transition-colors duration-300"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-white/70 hover:text-white text-xs font-medium px-5 py-2 rounded-full transition-all duration-300"
                        >
                            {submitted ? "Subscribed!" : "Subscribe"}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Trust logos */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-16 left-0 right-0 px-6"
            >
                <div className="max-w-4xl mx-auto pt-12 border-t border-white/[0.04]">
                    <p className="text-center text-white/15 text-[10px] uppercase tracking-[0.3em] mb-6">
                        Trusted by teams at
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 sibling-fade">
                        {["Stripe", "Vercel", "Linear", "Notion", "Figma", "Airbnb"].map((company) => (
                            <span
                                key={company}
                                className="text-white/15 font-medium text-sm hover:text-white/40 transition-colors duration-300 cursor-default"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
