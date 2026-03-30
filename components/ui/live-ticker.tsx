"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const activities = [
    { name: "Maria S.", action: "just matched with", detail: "Senior Design role" },
    { name: "James C.", action: "hired through", detail: "GTW Premium" },
    { name: "Aisha P.", action: "joined from", detail: "Mumbai, India" },
    { name: "Thomas B.", action: "posted a role for", detail: "Lead Engineer" },
    { name: "Elena K.", action: "started remote at", detail: "a Series B startup" },
    { name: "David O.", action: "connected with", detail: "12 new companies" },
];

export function LiveTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % activities.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const activity = activities[index];

    return (
        <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-1.5 text-xs text-white/35"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse flex-shrink-0" />
                    <span className="text-white/55 font-medium">{activity.name}</span>
                    <span>{activity.action}</span>
                    <span className="text-white/55">{activity.detail}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
