"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Briefcase,
    Lightbulb,
    Info,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Community", href: "/admin/community", icon: MessageSquare },
    { label: "Listings", href: "/admin/listings", icon: Briefcase },
    { label: "Insights", href: "/admin/insights", icon: Lightbulb },
    { label: "About", href: "/admin/about", icon: Info },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, adminLogout } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAdmin && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [isAdmin, mounted, router, pathname]);

    // Allow the login page to render without the admin layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Don't render admin layout until auth check is done
    if (!mounted || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#060608] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogout = () => {
        adminLogout();
        router.push("/admin/login");
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#060608] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0a0a0f] border-r border-white/[0.06] fixed inset-y-0 left-0 z-30">
                {/* Logo area */}
                <div className="p-6 border-b border-white/[0.06]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">GTW Admin</h2>
                            <p className="text-[10px] text-white/30">Control Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                    active
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? "text-blue-400" : "text-white/40 group-hover:text-white/60"}`} />
                                {item.label}
                                {active && <ChevronRight className="w-3 h-3 ml-auto text-blue-400/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin footer */}
                <div className="p-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3 mb-3 px-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-400">A</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-[10px] text-white/30">Super Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0f] border-r border-white/[0.06] z-50 flex flex-col lg:hidden"
                        >
                            {/* Mobile header */}
                            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-sm font-bold text-white">GTW Admin</h2>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Mobile nav */}
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                active
                                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${active ? "text-blue-400" : "text-white/40"}`} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile footer */}
                            <div className="p-4 border-t border-white/[0.06]">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64">
                {/* Top header */}
                <header className="sticky top-0 z-20 bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.06]">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white"
                            >
                                <Menu className="w-4 h-4" />
                            </button>
                            <div>
                                <h1 className="text-sm font-medium text-white">
                                    {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
                                </h1>
                                <p className="text-[11px] text-white/30">Global Talent World Admin</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-emerald-400 font-medium">Admin</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
