"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
    return (
        <section className="py-32 px-6 bg-gradient-to-b from-black via-emerald-950/20 to-black relative overflow-hidden border-t border-emerald-500/10">
            {/* Background Effects - Stronger with Green */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/12 rounded-full blur-[80px]" />
            </div>
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `linear-gradient(rgba(59,130,246,.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(59,130,246,.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to join the{" "}
                        <span className="font-script text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                            movement
                        </span>
                        ?
                    </h2>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 drop-shadow-lg">
                        Whether you&apos;re a world-class talent seeking your next opportunity or a company
                        looking to build an exceptional team, we&apos;re here for you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/careers"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all hover:scale-105"
                        >
                            Browse Opportunities
                        </Link>
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 pt-16 border-t border-white/10"
                >
                    <p className="text-center text-slate-400 text-sm mb-8 font-medium">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-opacity">
                        {["Stripe", "Vercel", "Linear", "Notion", "Figma", "Airbnb"].map((company) => (
                            <span key={company} className="text-white/80 font-semibold text-lg hover:text-cyan-400 transition-colors cursor-default">
                                {company}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
