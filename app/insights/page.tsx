"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InsightCard } from "@/components/insights/insight-card";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const INSIGHTS = [
    {
        id: 1,
        title: "The Future of Digital Nomadism in 2030",
        category: "Trends",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        size: "large" as const,
    },
    {
        id: 2,
        title: "Mastering Framer Motion for High-Fidelity UIs",
        category: "Engineering",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        size: "medium" as const,
    },
    {
        id: 3,
        title: "Why Minimalist Design Wins",
        category: "Design",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
        size: "small" as const,
    },
    {
        id: 4,
        title: "Building Sustainable Tech Stacks",
        category: "Sustainability",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        size: "small" as const,
    },
    {
        id: 5,
        title: "AI in Creative Workflows",
        category: "Artificial Intelligence",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
        size: "medium" as const,
    },
    {
        id: 6,
        title: "The Psychology of Dark Mode",
        category: "UX Research",
        image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800",
        size: "small" as const,
    },
];

export default function InsightsPage() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [newsletterMessage, setNewsletterMessage] = useState("");

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newsletterEmail.trim()) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newsletterEmail)) {
            setNewsletterStatus("error");
            setNewsletterMessage("Please enter a valid email address.");
            return;
        }

        setNewsletterStatus("loading");

        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert({ email: newsletterEmail.toLowerCase().trim() });

            if (error) {
                if (error.code === "23505") {
                    setNewsletterStatus("success");
                    setNewsletterMessage("You're already subscribed!");
                } else {
                    throw error;
                }
            } else {
                setNewsletterStatus("success");
                setNewsletterMessage("Successfully subscribed!");
                setNewsletterEmail("");
            }
        } catch {
            setNewsletterStatus("error");
            setNewsletterMessage("Something went wrong. Please try again.");
        }

        setTimeout(() => {
            setNewsletterStatus("idle");
            setNewsletterMessage("");
        }, 4000);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                <header className="mb-12 sm:mb-16">
                    <h1 className="font-script text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6">Insights</h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl">
                        Deep dives into the intersection of technology, design, and culture.
                    </p>
                </header>

                {INSIGHTS.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[250px] sm:auto-rows-[300px]">
                        {INSIGHTS.map((insight, index) => (
                            <InsightCard key={insight.id} {...insight} delay={index * 0.1} />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No insights yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            We&apos;re working on new content. Check back soon!
                        </p>
                    </div>
                )}

                {/* Newsletter CTA */}
                <div className="mt-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Stay in the loop</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                        Get the latest insights delivered to your inbox. No spam, just quality content.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                            disabled={newsletterStatus === "loading"}
                        />
                        <button
                            type="submit"
                            disabled={newsletterStatus === "loading" || !newsletterEmail.trim()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center gap-2"
                        >
                            {newsletterStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                            Subscribe
                        </button>
                    </form>
                    <AnimatePresence>
                        {newsletterMessage && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`mt-4 text-sm ${newsletterStatus === "error" ? "text-red-400" : "text-green-400"} flex items-center justify-center gap-2`}
                            >
                                {newsletterStatus === "success" && <CheckCircle className="w-4 h-4" />}
                                {newsletterMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </main>
    );
}
