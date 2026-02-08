"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    RotateCcw,
    Info,
    Sparkles,
    Target,
    Megaphone,
    CheckCircle,
    Type,
    FileText,
} from "lucide-react";

interface AboutContent {
    visionTitle: string;
    visionText: string;
    craftTitle: string;
    craftText: string;
    ctaText: string;
}

const STORAGE_KEY = "gtw_admin_about";

const defaultContent: AboutContent = {
    visionTitle: "Our Vision",
    visionText: "We believe talent knows no borders. Global Talent World exists to bridge the gap between exceptional people and extraordinary opportunities, creating a world where geography is no longer a barrier to career growth.",
    craftTitle: "Our Craft",
    craftText: "We meticulously design every interaction on our platform to feel intuitive, powerful, and human. From AI-powered matching to seamless communication tools, every feature is built with care to help talent and companies find their perfect match.",
    ctaText: "Join thousands of professionals and companies already transforming the way global talent connects. Start your journey today.",
};

export default function AdminAboutPage() {
    const [content, setContent] = useState<AboutContent>(defaultContent);
    const [saved, setSaved] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Load from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setContent(JSON.parse(stored));
            }
        } catch {
            // Use defaults
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            // localStorage not available
        }
    };

    const handleReset = () => {
        setContent(defaultContent);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
        } catch {
            // localStorage not available
        }
    };

    const updateField = (field: keyof AboutContent, value: string) => {
        setContent((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">About Page Management</h2>
                    <p className="text-white/40 text-sm">Edit the about page content sections.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            showPreview
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white"
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-embossed-primary px-4 py-2.5 rounded-xl text-sm text-white font-medium flex items-center gap-2"
                    >
                        {saved ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${showPreview ? "xl:grid-cols-2" : ""} gap-6`}>
                {/* Editor */}
                <div className="space-y-6">
                    {/* Vision Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-embossed p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Vision Section</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                    <Type className="w-3 h-3" /> Vision Title
                                </label>
                                <input
                                    type="text"
                                    value={content.visionTitle}
                                    onChange={(e) => updateField("visionTitle", e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                    <FileText className="w-3 h-3" /> Vision Text
                                </label>
                                <textarea
                                    value={content.visionText}
                                    onChange={(e) => updateField("visionText", e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Craft Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-embossed p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Craft Section</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                    <Type className="w-3 h-3" /> Craft Title
                                </label>
                                <input
                                    type="text"
                                    value={content.craftTitle}
                                    onChange={(e) => updateField("craftTitle", e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                    <FileText className="w-3 h-3" /> Craft Text
                                </label>
                                <textarea
                                    value={content.craftText}
                                    onChange={(e) => updateField("craftText", e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-embossed p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                <Megaphone className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Call to Action</h3>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                <FileText className="w-3 h-3" /> CTA Text
                            </label>
                            <textarea
                                value={content.ctaText}
                                onChange={(e) => updateField("ctaText", e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Preview panel */}
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="sticky top-24">
                            <p className="text-xs font-medium text-white/30 mb-3 uppercase tracking-wider">Live Preview</p>
                            <div className="card-embossed p-6 space-y-8">
                                {/* Vision preview */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-6 rounded-full bg-blue-500" />
                                        <h3 className="text-lg font-bold text-white">{content.visionTitle || "Vision Title"}</h3>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed pl-4">
                                        {content.visionText || "Vision text will appear here..."}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/[0.06]" />

                                {/* Craft preview */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-6 rounded-full bg-emerald-500" />
                                        <h3 className="text-lg font-bold text-white">{content.craftTitle || "Craft Title"}</h3>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed pl-4">
                                        {content.craftText || "Craft text will appear here..."}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/[0.06]" />

                                {/* CTA preview */}
                                <div className="p-5 rounded-xl bg-gradient-to-r from-blue-500/[0.08] to-emerald-500/[0.08] border border-blue-500/10">
                                    <p className="text-sm text-white/60 leading-relaxed text-center">
                                        {content.ctaText || "Call to action text will appear here..."}
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <div className="px-6 py-2 rounded-xl bg-blue-500/20 text-sm text-blue-400 font-medium">
                                            Get Started
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
