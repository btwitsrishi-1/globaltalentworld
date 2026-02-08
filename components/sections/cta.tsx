"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
    return (
        <section className="py-32 md:py-44 px-6 bg-[#060608] relative overflow-hidden">
            {/* Background glows — layered */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-500/[0.06] rounded-full blur-[180px]" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Animated gradient border card */}
                <div className="gradient-border-animated rounded-3xl p-px">
                    <div className="bg-[#060608] rounded-3xl px-8 py-16 md:px-16 md:py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center"
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-[13px] font-medium tracking-[0.3em] uppercase text-blue-400/60 mb-8"
                            >
                                Get started
                            </motion.p>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                                Ready to join the
                                <br />
                                <span className="text-gradient">movement</span>?
                            </h2>

                            <p className="text-white/30 text-lg md:text-xl max-w-xl mx-auto mb-12 font-light leading-relaxed">
                                Whether you&apos;re world-class talent or a company building an exceptional team.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Trust logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-20 pt-12 border-t border-white/[0.04]"
                >
                    <p className="text-center text-white/15 text-[10px] uppercase tracking-[0.3em] mb-8">
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
                </motion.div>
            </div>
        </section>
    );
};
