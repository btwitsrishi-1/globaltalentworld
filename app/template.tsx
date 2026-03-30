"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Brand flash overlay — brief blue pulse on route change */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="fixed inset-0 z-[9999] bg-blue-500/10 pointer-events-none"
            />

            {/* Expanding circle reveal */}
            <motion.div
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(150% at 50% 50%)" }}
                transition={{ duration: 0.8, ease: EASE }}
            >
                {/* Content fade + slide */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </>
    );
}
