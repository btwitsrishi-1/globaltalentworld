"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    Lightbulb,
    Image,
    Tag,
    Type,
    Eye,
    ExternalLink,
} from "lucide-react";

interface Insight {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    excerpt?: string;
}

const STORAGE_KEY = "gtw_admin_insights";

const defaultInsights: Insight[] = [
    { id: "1", title: "The Future of Remote Work in 2025", category: "Trends", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop", excerpt: "How remote work is reshaping the global workforce and what it means for talent acquisition." },
    { id: "2", title: "AI in Recruitment: A Complete Guide", category: "Technology", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop", excerpt: "Leveraging artificial intelligence to streamline your hiring process and find top talent." },
    { id: "3", title: "Building Inclusive Teams Across Borders", category: "Culture", imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop", excerpt: "Strategies for creating diverse and inclusive teams in a globalized workplace." },
    { id: "4", title: "Salary Benchmarks for Tech Roles 2025", category: "Data", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", excerpt: "Comprehensive salary data for the most in-demand technology positions worldwide." },
];

const categories = ["Trends", "Technology", "Culture", "Data", "Strategy", "Career", "Industry"];

export default function AdminInsightsPage() {
    const [insights, setInsights] = useState<Insight[]>(defaultInsights);
    const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [previewInsight, setPreviewInsight] = useState<Insight | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formCategory, setFormCategory] = useState("Trends");
    const [formImageUrl, setFormImageUrl] = useState("");
    const [formExcerpt, setFormExcerpt] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setInsights(JSON.parse(stored));
            }
        } catch {
            // Use defaults
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
        } catch {
            // localStorage not available
        }
    }, [insights]);

    const openCreate = () => {
        setIsCreating(true);
        setEditingInsight(null);
        setFormTitle("");
        setFormCategory("Trends");
        setFormImageUrl("");
        setFormExcerpt("");
    };

    const openEdit = (insight: Insight) => {
        setEditingInsight(insight);
        setIsCreating(false);
        setFormTitle(insight.title);
        setFormCategory(insight.category);
        setFormImageUrl(insight.imageUrl);
        setFormExcerpt(insight.excerpt || "");
    };

    const handleSave = () => {
        if (!formTitle.trim()) return;

        if (isCreating) {
            const newInsight: Insight = {
                id: `insight-${Date.now()}`,
                title: formTitle.trim(),
                category: formCategory,
                imageUrl: formImageUrl.trim() || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
                excerpt: formExcerpt.trim(),
            };
            setInsights((prev) => [...prev, newInsight]);
        } else if (editingInsight) {
            setInsights((prev) =>
                prev.map((i) =>
                    i.id === editingInsight.id
                        ? { ...i, title: formTitle.trim(), category: formCategory, imageUrl: formImageUrl.trim(), excerpt: formExcerpt.trim() }
                        : i
                )
            );
        }

        setIsCreating(false);
        setEditingInsight(null);
    };

    const handleDelete = (insightId: string) => {
        setInsights((prev) => prev.filter((i) => i.id !== insightId));
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingInsight(null);
    };

    const showForm = isCreating || editingInsight;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Insights Management</h2>
                    <p className="text-white/40 text-sm">{insights.length} insight cards</p>
                </div>
                <button
                    onClick={openCreate}
                    className="btn-embossed-primary px-4 py-2.5 rounded-xl text-sm text-white font-medium flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    Add Insight
                </button>
            </div>

            {/* Form (create/edit) */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="card-embossed p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-white">
                                    {isCreating ? "Create New Insight" : "Edit Insight"}
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Form fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                            <Type className="w-3 h-3" /> Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            placeholder="Insight title..."
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                            <Tag className="w-3 h-3" /> Category
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat} className="bg-[#0a0a0f]">{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                            <Image className="w-3 h-3" /> Image URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formImageUrl}
                                            onChange={(e) => setFormImageUrl(e.target.value)}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                            Excerpt
                                        </label>
                                        <textarea
                                            value={formExcerpt}
                                            onChange={(e) => setFormExcerpt(e.target.value)}
                                            placeholder="Brief description..."
                                            rows={3}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={!formTitle.trim()}
                                        className="btn-embossed-primary px-4 py-2.5 rounded-xl text-sm text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isCreating ? "Create Insight" : "Save Changes"}
                                    </button>
                                </div>

                                {/* Live preview */}
                                <div>
                                    <p className="text-xs font-medium text-white/40 mb-3">Live Preview</p>
                                    <div className="card-embossed overflow-hidden">
                                        <div className="aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                                            {formImageUrl ? (
                                                <img
                                                    src={formImageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Image className="w-8 h-8 text-white/10" />
                                                </div>
                                            )}
                                            {formCategory && (
                                                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[10px] font-medium text-blue-400 backdrop-blur-sm">
                                                    {formCategory}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-sm font-semibold text-white mb-1">
                                                {formTitle || "Insight Title"}
                                            </h4>
                                            <p className="text-xs text-white/40 line-clamp-2">
                                                {formExcerpt || "Brief description will appear here..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Insights grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-embossed overflow-hidden group"
                    >
                        {/* Image */}
                        <div className="aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                            <img
                                src={insight.imageUrl}
                                alt={insight.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[10px] font-medium text-blue-400 backdrop-blur-sm">
                                {insight.category}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{insight.title}</h3>
                            {insight.excerpt && (
                                <p className="text-xs text-white/40 line-clamp-2 mb-3">{insight.excerpt}</p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setPreviewInsight(insight)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all"
                                >
                                    <Eye className="w-3 h-3" />
                                    Preview
                                </button>
                                <button
                                    onClick={() => openEdit(insight)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all"
                                >
                                    <Pencil className="w-3 h-3" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(insight.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all ml-auto"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {insights.length === 0 && (
                <div className="card-embossed p-16 text-center">
                    <Lightbulb className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No insights yet. Create your first one.</p>
                </div>
            )}

            {/* Preview modal */}
            <AnimatePresence>
                {previewInsight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewInsight(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-md w-full overflow-hidden"
                        >
                            <div className="aspect-video bg-white/[0.02] relative">
                                <img
                                    src={previewInsight.imageUrl}
                                    alt={previewInsight.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[11px] font-medium text-blue-400 backdrop-blur-sm">
                                    {previewInsight.category}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-white mb-2">{previewInsight.title}</h3>
                                {previewInsight.excerpt && (
                                    <p className="text-sm text-white/50 leading-relaxed mb-4">{previewInsight.excerpt}</p>
                                )}
                                <button
                                    onClick={() => setPreviewInsight(null)}
                                    className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
