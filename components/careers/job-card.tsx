"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

interface JobCardProps {
    id: string | number;
    role: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    delay?: number;
}

export const JobCard = ({ id, role, company, location, salary, type, delay = 0 }: JobCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        x.set(e.clientX - left);
        y.set(e.clientY - top);
    };

    return (
        <Link href={`/careers/${id}`}>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay, duration: 0.5 }}
                onMouseMove={handleMouseMove}
                whileHover={{ y: -5 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden cursor-pointer"
            >
            {/* Magnetic Glow Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [x, y],
                        ([latestX, latestY]) => `radial-gradient(600px circle at ${latestX}px ${latestY}px, rgba(59, 130, 246, 0.15), transparent 40%)`
                    )
                }}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-xl text-white mb-1 group-hover:text-blue-400 transition-colors">{role}</h3>
                        <p className="text-slate-400 font-medium">{company}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {salary}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {location}
                    </span>
                </div>

                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
            </div>
        </motion.div>
        </Link>
    );
};
