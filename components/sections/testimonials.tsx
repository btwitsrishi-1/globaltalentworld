"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "Global Talent World connected me with my dream role at a Silicon Valley startup. The quality of opportunities here is unmatched.",
        author: "Maria Santos",
        role: "Senior Product Designer",
        company: "Previously at Google",
        initials: "MS",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        quote: "We hired 15 incredible engineers through GTW. The talent pool is exceptional and the matching is remarkably accurate.",
        author: "James Chen",
        role: "CTO",
        company: "Fintech Startup",
        initials: "JC",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        quote: "Finally, a platform that understands great talent exists everywhere. I found opportunities I never would have discovered otherwise.",
        author: "Aisha Patel",
        role: "Full Stack Developer",
        company: "Remote from Mumbai",
        initials: "AP",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        quote: "The recruiter tools are incredible. We went from weeks of screening to finding perfect candidates in days.",
        author: "Thomas Berg",
        role: "Head of Talent",
        company: "Series B Startup",
        initials: "TB",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        quote: "GTW gave me the confidence to go fully remote. Now I work with teams across 3 continents from my home in Lisbon.",
        author: "Elena Kowalski",
        role: "UX Engineer",
        company: "Design Systems Lead",
        initials: "EK",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        quote: "The community aspect sets GTW apart. It's not just job listings — it's mentorship, knowledge sharing, and real connections.",
        author: "David Okonjo",
        role: "Engineering Manager",
        company: "Previously at Meta",
        initials: "DO",
        gradient: "from-cyan-500 to-blue-500",
    },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[number] }) {
    return (
        <div className="group flex-shrink-0 w-[340px] md:w-[400px] bg-white/[0.02] border border-white/[0.04] rounded-2xl p-7 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
            {/* Stars */}
            <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400/80 text-amber-400/80" />
                ))}
            </div>

            <p className="text-white/45 mb-7 leading-relaxed text-[14px] group-hover:text-white/55 transition-colors duration-500">
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.04]">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-[11px] font-semibold`}>
                    {testimonial.initials}
                </div>
                <div>
                    <div className="font-medium text-white text-sm">{testimonial.author}</div>
                    <div className="text-white/25 text-xs">{testimonial.role} &middot; {testimonial.company}</div>
                </div>
            </div>
        </div>
    );
}

export const Testimonials = () => {
    // Double the array for seamless marquee
    const marqueeItems = [...testimonials, ...testimonials];

    return (
        <section className="py-32 md:py-44 bg-[#060608] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

            {/* Section header */}
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 md:mb-20"
                >
                    <p className="text-[13px] font-medium tracking-[0.3em] uppercase text-blue-400/60 mb-6">
                        Testimonials
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Loved by talent
                        <br />
                        <span className="text-white/30">worldwide</span>
                    </h2>
                </motion.div>
            </div>

            {/* Marquee row 1 — left to right */}
            <div className="relative mb-4">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#060608] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#060608] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-4"
                    animate={{ x: [0, -(testimonials.length * 416)] }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeItems.map((testimonial, i) => (
                        <TestimonialCard key={`row1-${i}`} testimonial={testimonial} />
                    ))}
                </motion.div>
            </div>

            {/* Marquee row 2 — right to left */}
            <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#060608] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#060608] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-4"
                    animate={{ x: [-(testimonials.length * 416), 0] }}
                    transition={{
                        x: {
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeItems.map((testimonial, i) => (
                        <TestimonialCard key={`row2-${i}`} testimonial={testimonial} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
