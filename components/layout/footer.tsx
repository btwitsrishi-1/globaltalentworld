"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Careers", href: "/careers" },
        { label: "Community", href: "/community" },
        { label: "Insights", href: "/insights" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/about" },
        { label: "Terms of Service", href: "/about" },
    ],
};

const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Mail, href: "mailto:hello@globaltalentworld.com", label: "Email" },
];

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#060608] border-t border-white/[0.04]" role="contentinfo">
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-6" aria-label="Go to homepage">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)' }}>
                                <span className="text-white font-bold text-xs">G</span>
                            </div>
                            <span className="font-semibold text-white text-sm tracking-wide">Global Talent World</span>
                        </Link>
                        <p className="text-white/25 text-sm leading-relaxed mb-8 max-w-xs">
                            A digital sanctuary for the world&apos;s most exceptional minds.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-3.5 h-3.5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-medium text-white/50 text-xs uppercase tracking-[0.2em] mb-5">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/25 hover:text-white text-sm transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-medium text-white/50 text-xs uppercase tracking-[0.2em] mb-5">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/25 hover:text-white text-sm transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-medium text-white/50 text-xs uppercase tracking-[0.2em] mb-5">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/25 hover:text-white text-sm transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/15 text-xs">
                        &copy; {currentYear} Global Talent World. All rights reserved.
                    </p>
                    <p className="text-white/15 text-xs flex items-center gap-1.5">
                        Built with <span className="text-gradient inline-block">care</span> for talent everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
};
