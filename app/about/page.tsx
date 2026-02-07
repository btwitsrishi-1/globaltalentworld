"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ArrowRight } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20%", once: true }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative z-10"
        >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                {title}
            </h2>
            <div className="text-lg md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-light">
                {children}
            </div>
        </motion.section>
    );
};

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animate the background graphic based on scroll
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const reverseRotate = useTransform(scrollYProgress, [0, 1], [360, 0]);

    return (
        <main ref={containerRef} className="bg-slate-950 text-white overflow-hidden relative">
            <CustomCursor />
            <Navbar />

            {/* Fixed Background Graphic (The "Lens") */}
            <div
                className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-20 motion-reduce:opacity-10"
                aria-hidden="true"
            >
                <motion.div
                    style={{ rotate, scale }}
                    className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border-[1px] border-blue-500/30 blur-3xl bg-gradient-to-tr from-blue-900/20 to-purple-900/20 motion-reduce:blur-none"
                />
                <motion.div
                    style={{ rotate: reverseRotate }}
                    className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] border border-white/10 rounded-full"
                />
            </div>

            <div className="pt-20">
                <Section title="The Vision">
                    <p>
                        We believe talent is universal, but opportunity is not.
                        <strong className="text-blue-400 font-medium ml-2">Global Talent World</strong> bridges that gap.
                    </p>
                    <p className="mt-8">
                        We are building a digital sanctuary where geography dissolves,
                        and pure capability reigns supreme.
                    </p>
                </Section>

                <Section title="The Craft">
                    <p>
                        Every pixel matters. We don&apos;t just build software; we architect experiences.
                        From the <span className="italic text-white">fluidity of our animations</span> to the
                        precision of our matching algorithms, quality is our north star.
                    </p>
                </Section>

                <Section title="Join the Movement">
                    <p>
                        This is more than a platform. It&apos;s a new paradigm for the global workforce.
                    </p>
                    <Link
                        href="/careers"
                        className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-blue-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                        Explore Open Roles
                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                </Section>
            </div>

            <Footer />
        </main>
    );
}
