"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "Global Talent World connected me with my dream role at a Silicon Valley startup. The quality of opportunities here is unmatched.",
        author: "Maria Santos",
        role: "Senior Product Designer",
        company: "Previously at Google",
        avatar: "MS",
    },
    {
        quote: "We&apos;ve hired 15 incredible engineers through GTW. The talent pool is exceptional and the matching is remarkably accurate.",
        author: "James Chen",
        role: "CTO",
        company: "Fintech Startup",
        avatar: "JC",
    },
    {
        quote: "Finally, a platform that understands that great talent exists everywhere. I found opportunities I never would have discovered otherwise.",
        author: "Aisha Patel",
        role: "Full Stack Developer",
        company: "Remote from Mumbai",
        avatar: "AP",
    },
];

export const Testimonials = () => {
    return (
        <section className="py-32 px-6 bg-slate-950 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Loved by talent worldwide
                    </h2>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.author}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{testimonial.author}</div>
                                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                                    <div className="text-xs text-slate-500">{testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
