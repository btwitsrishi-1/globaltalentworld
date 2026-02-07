"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { Logo3DIcon } from "@/components/ui/logo-3d-icon";

const MagneticLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        x.set((clientX - centerX) * 0.3);
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div style={{ x: xSpring, y: ySpring }}>
            <Link
                ref={ref}
                href={href}
                className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors block",
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {children}
                {(isHovered || isActive) && (
                    <motion.div
                        layoutId="nav-spotlight"
                        className={cn(
                            "absolute inset-0 rounded-full -z-10",
                            isActive ? "bg-white/15" : "bg-white/10 blur-sm"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
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
            "block px-4 py-3 text-lg font-medium transition-colors rounded-xl",
            isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
        )}
    >
        {children}
    </Link>
);

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Close mobile menu on escape key
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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                <nav
                    className="pointer-events-auto flex items-center gap-4 md:gap-8 px-4 md:px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-900/20 max-w-2xl w-full justify-between"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Left Links - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <MagneticLink href="/about" isActive={pathname === "/about"}>About Us</MagneticLink>
                        <MagneticLink href="/insights" isActive={pathname === "/insights"}>Insights</MagneticLink>
                    </div>

                    {/* Center 3D Logo - Spinning Anchor */}
                    <div className="relative group cursor-pointer">
                        <Link href="/" aria-label="Go to homepage">
                            <div className="relative z-10">
                                <Logo3DIcon />
                            </div>
                            {/* Green Glow Effect */}
                            <div className="absolute inset-0 bg-emerald-500/50 blur-xl rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Right Links - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <MagneticLink href="/careers" isActive={pathname === "/careers"}>Careers</MagneticLink>
                        <MagneticLink href="/community" isActive={pathname === "/community"}>Community</MagneticLink>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold border border-white/10 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                                    aria-label="Open profile menu"
                                    aria-expanded={showProfileMenu}
                                    aria-haspopup="true"
                                >
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </button>
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-12 right-0 bg-slate-900 border border-white/10 rounded-xl p-2 w-40 shadow-xl"
                                            role="menu"
                                            aria-label="Profile menu"
                                        >
                                            <div className="px-4 py-2 border-b border-white/10 mb-2">
                                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.handle}</p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors"
                                                role="menuitem"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                                role="menuitem"
                                            >
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <MagneticLink href="/login" isActive={pathname === "/login"}>Log In</MagneticLink>
                        )}
                    </div>

                    {/* Mobile User Avatar / Login */}
                    <div className="md:hidden">
                        {user ? (
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold border border-white/10"
                                aria-label="Open profile menu"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                            >
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            id="mobile-menu"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-24 left-4 right-4 z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation menu"
                        >
                            <nav className="space-y-1">
                                <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)} isActive={pathname === "/"}>
                                    Home
                                </MobileNavLink>
                                <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)} isActive={pathname === "/about"}>
                                    About Us
                                </MobileNavLink>
                                <MobileNavLink href="/insights" onClick={() => setMobileMenuOpen(false)} isActive={pathname === "/insights"}>
                                    Insights
                                </MobileNavLink>
                                <MobileNavLink href="/careers" onClick={() => setMobileMenuOpen(false)} isActive={pathname === "/careers"}>
                                    Careers
                                </MobileNavLink>
                                <MobileNavLink href="/community" onClick={() => setMobileMenuOpen(false)} isActive={pathname === "/community"}>
                                    Community
                                </MobileNavLink>

                                {user ? (
                                    <div className="pt-4 mt-4 border-t border-white/10">
                                        <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-sm text-slate-400">{user.handle}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-left px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-colors mb-2"
                                        >
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
