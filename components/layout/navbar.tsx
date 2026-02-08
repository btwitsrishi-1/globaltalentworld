"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import dynamic from "next/dynamic";

const NavbarLogo3D = dynamic(
    () => import('@/components/ui/navbar-logo-3d').then(mod => ({ default: mod.NavbarLogo3D })),
    {
        ssr: false,
        loading: () => (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
            </div>
        ),
    }
);

// Magnetic hover — link pulls toward cursor
const MagneticLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
    };

    return (
        <motion.div style={{ x: xSpring, y: ySpring }}>
            <Link
                ref={ref}
                href={href}
                className={cn(
                    "relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors",
                    isActive ? "text-white" : "text-white/50 hover:text-white"
                )}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
            >
                {children}
                {isActive && (
                    <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </Link>
        </motion.div>
    );
};

const MobileNavLink = ({ href, children, onClick, isActive }: { href: string; children: React.ReactNode; onClick: () => void; isActive?: boolean }) => (
    <Link
        href={href}
        onClick={onClick}
        className={cn(
            "block py-3 text-2xl font-light tracking-wide transition-all duration-300",
            isActive ? "text-white translate-x-2" : "text-white/40 hover:text-white hover:translate-x-2"
        )}
    >
        {children}
    </Link>
);

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Don't show navbar on admin pages
    const isAdminPage = pathname?.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMobileMenuOpen(false);
                setShowProfileMenu(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    if (isAdminPage) return null;

    const isRecruiter = user?.role === 'recruiter' && (user as { recruiterStatus?: string })?.recruiterStatus === 'approved';

    return (
        <>
            {/* Floating pill navbar */}
            <header
                className={cn(
                    "fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-full w-[calc(100%-2rem)] md:w-auto md:max-w-4xl",
                    "transition-[background,border,box-shadow,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    scrolled
                        ? "bg-white/[0.04] backdrop-blur-3xl border border-white/[0.06]"
                        : "bg-white/[0.02] backdrop-blur-xl border border-white/[0.04]"
                )}
                style={scrolled ? {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                } : undefined}
            >
                {/* Gradient border accent line — blue→transparent→green */}
                {scrolled && (
                    <div
                        className="absolute top-0 left-8 right-8 h-px"
                        style={{
                            background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent 30%, transparent 70%, rgba(16,185,129,0.4))',
                        }}
                    />
                )}

                <nav
                    className="flex items-center justify-between px-5 md:px-6 h-12 md:h-12"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    {/* Logo — 3D spinning */}
                    <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
                        <NavbarLogo3D />
                        <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
                            GTW
                        </span>
                    </Link>

                    {/* Center Nav — Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        <MagneticLink href="/about" isActive={pathname === "/about"}>About</MagneticLink>
                        <MagneticLink href="/careers" isActive={pathname === "/careers"}>Careers</MagneticLink>
                        <MagneticLink href="/community" isActive={pathname === "/community"}>Community</MagneticLink>
                        <MagneticLink href="/insights" isActive={pathname === "/insights"}>Insights</MagneticLink>
                        {isRecruiter && (
                            <MagneticLink href="/recruiter" isActive={pathname?.startsWith("/recruiter")}>Recruiter</MagneticLink>
                        )}
                    </div>

                    {/* Right — Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                                    aria-label="Open profile menu"
                                    aria-expanded={showProfileMenu}
                                    aria-haspopup="true"
                                >
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-full h-full rounded-full object-cover" />
                                    ) : user.name.charAt(0)}
                                </button>
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-12 right-0 bg-[#111] border border-white/[0.08] rounded-xl p-1.5 w-48 shadow-2xl shadow-black/50"
                                            role="menu"
                                        >
                                            <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                                <p className="text-xs text-white/40 truncate">{user.handle}</p>
                                            </div>
                                            <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="block w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors" role="menuitem">
                                                Profile
                                            </Link>
                                            <button onClick={() => { logout(); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-red-400/80 hover:text-red-400 hover:bg-white/[0.05] rounded-lg transition-colors" role="menuitem">
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/login" className="btn-embossed-primary text-[12px] tracking-wide text-white px-4 py-1.5 rounded-full">
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="flex md:hidden items-center gap-3">
                        {user && (
                            <Link href="/profile" className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.name} width={28} height={28} className="w-full h-full rounded-full object-cover" />
                                ) : user.name.charAt(0)}
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-white/60 hover:text-white transition-colors"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Full-screen Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex flex-col justify-center h-full px-8">
                            <nav className="space-y-1">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/about", label: "About" },
                                    { href: "/careers", label: "Careers" },
                                    { href: "/community", label: "Community" },
                                    { href: "/insights", label: "Insights" },
                                    ...(isRecruiter ? [{ href: "/recruiter", label: "Recruiter" }] : []),
                                ].map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                    >
                                        <MobileNavLink href={link.href} onClick={() => setMobileMenuOpen(false)} isActive={pathname === link.href}>
                                            {link.label}
                                        </MobileNavLink>
                                    </motion.div>
                                ))}
                            </nav>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 pt-8 border-t border-white/[0.06]">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                                {user.avatar ? (
                                                    <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-full h-full rounded-full object-cover" />
                                                ) : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-white/30 text-sm">{user.handle}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-400/60 hover:text-red-400 text-sm transition-colors">
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="inline-block text-sm font-medium text-white btn-embossed-primary px-6 py-3 rounded-full transition-colors">
                                        Get Started
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
