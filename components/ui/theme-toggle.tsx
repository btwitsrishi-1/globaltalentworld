"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                aria-label="Toggle theme"
            >
                <div className="w-4 h-4 bg-slate-600 rounded-full animate-pulse" />
            </button>
        );
    }

    const themes: { value: string; icon: LucideIcon; label: string }[] = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ];

    const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                aria-label={`Current theme: ${theme}. Click to change theme.`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <CurrentIcon className="w-4 h-4" aria-hidden="true" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-12 right-0 z-50 bg-slate-900 border border-white/10 rounded-xl p-1 shadow-xl min-w-[120px]"
                            role="menu"
                            aria-label="Theme options"
                        >
                            {themes.map(({ value, icon: Icon, label }) => (
                                <button
                                    key={value}
                                    onClick={() => {
                                        setTheme(value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                        theme === value
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                    role="menuitem"
                                    aria-current={theme === value ? "true" : undefined}
                                >
                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
