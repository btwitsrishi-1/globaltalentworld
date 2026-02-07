"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
    title: string;
    category: string;
    image: string;
    size?: "small" | "medium" | "large";
    className?: string;
    delay?: number;
}

export const InsightCard = ({ title, category, image, size = "small", className, delay = 0 }: InsightCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 cursor-pointer",
                size === "large" ? "col-span-2 row-span-2" : size === "medium" ? "col-span-2 md:col-span-1 row-span-2 mb-6" : "col-span-1 row-span-1",
                className
            )}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full backdrop-blur-sm border border-blue-500/20">
                            {category}
                        </span>
                        <h3 className={cn(
                            "font-bold text-white leading-tight group-hover:text-blue-200 transition-colors",
                            size === "large" ? "text-3xl md:text-4xl" : "text-xl"
                        )}>
                            {title}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-slate-950 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
