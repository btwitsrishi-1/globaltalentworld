"use client";

import Link from "next/link";
import { Star, Github, Twitter, Linkedin, Mail } from "lucide-react";

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
        <footer className="bg-slate-900/50 border-t border-white/5" role="contentinfo">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4" aria-label="Go to homepage">
                            <Star className="w-6 h-6 text-blue-500 fill-blue-500/20" aria-hidden="true" />
                            <span className="font-script text-2xl text-white">Global Talent World</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                            A digital sanctuary for the world&apos;s most exceptional minds.
                            Connecting global talent with extraordinary opportunities.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {currentYear} Global Talent World. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm">
                        Built with care for talent everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
};
