"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse Move Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = e.clientX / innerWidth - 0.5;
            const y = e.clientY / innerHeight - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const springConfig = { damping: 30, stiffness: 200 };
    const xSpring = useSpring(mouseX, springConfig);
    const ySpring = useSpring(mouseY, springConfig);

    // Parallax layers transform (depth)
    const layer1X = useTransform(xSpring, [-0.5, 0.5], [-20, 20]);
    const layer1Y = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);

    const layer2X = useTransform(xSpring, [-0.5, 0.5], [40, -40]);
    const layer2Y = useTransform(ySpring, [-0.5, 0.5], [40, -40]);

    // Additional parallax layers - created at component level
    const layer3X = useTransform(xSpring, [-0.5, 0.5], [-60, 60]);
    const layer3Y = useTransform(ySpring, [-0.5, 0.5], [-30, 30]);

    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 1, ease: [0.2, 0.65, 0.3, 0.9] as const }
        })
    };

    const words = useMemo(() => "Global Talent World".split(" "), []);

    return (
        <div ref={containerRef} className="relative h-[150vh] w-full bg-black overflow-hidden">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Background / "Portal" Effect - More Contrasting */}
                <motion.div
                    style={{ scale }}
                    className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-blue-950/50 to-black"
                    aria-hidden="true"
                >
                    {/* Stronger background pattern */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                            radial-gradient(circle at 75% 75%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)`
                        }}
                    />
                    {/* Grid pattern for more density */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </motion.div>

                {/* Floating Elements (Interactive Parallax) - Brighter */}
                <motion.div
                    style={{ x: layer1X, y: layer1Y }}
                    className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl z-10 mix-blend-screen motion-reduce:hidden"
                    aria-hidden="true"
                />
                <motion.div
                    style={{ x: layer2X, y: layer2Y }}
                    className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl z-10 mix-blend-screen motion-reduce:hidden"
                    aria-hidden="true"
                />

                {/* Additional Depth Elements - More Visible */}
                <motion.div
                    style={{ x: layer3X, y: layer3Y }}
                    className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl z-10 motion-reduce:hidden"
                    aria-hidden="true"
                />
                <motion.div
                    style={{ x: layer1X, y: layer1Y, scale }}
                    className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl z-10 motion-reduce:hidden"
                    aria-hidden="true"
                />
                <motion.div
                    style={{ x: layer2X, y: layer2Y }}
                    className="absolute top-2/3 right-1/3 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl z-10 motion-reduce:hidden"
                    aria-hidden="true"
                />

                {/* Central Window Frame */}
                <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
                    <div className="overflow-hidden mb-6 flex justify-center flex-wrap gap-x-4">
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={titleVariants}
                                initial="hidden"
                                animate="visible"
                                className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-cyan-200 leading-tight block drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light tracking-wide drop-shadow-lg"
                    >
                        A digital sanctuary for the world&apos;s most exceptional minds.
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-reduce:hidden"
                        aria-hidden="true"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
                        >
                            <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Foreground Frame Elements */}
                <div
                    className="absolute inset-0 pointer-events-none z-30 border-[20px] border-slate-950/50 rounded-[3rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};
