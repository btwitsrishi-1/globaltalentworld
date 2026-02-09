"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    Lightbulb,
    Image as ImageIcon,
    Tag,
    Type,
    Eye,
    EyeOff,
    Upload,
    Loader2,
} from "lucide-react";
import { fetchAdminInsights, createInsight, updateInsight, deleteInsight as deleteInsightApi } from "@/lib/admin-data";
import { uploadFile } from "@/lib/storage";

interface Insight {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    excerpt?: string;
    authorName?: string;
    isPublished: boolean;
}

const categories = ["Trends", "Technology", "Culture", "Data", "Strategy", "Career", "Industry"];

export default function AdminInsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [previewInsight, setPreviewInsight] = useState<Insight | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formCategory, setFormCategory] = useState("Trends");
    const [formImageUrl, setFormImageUrl] = useState("");
    const [formExcerpt, setFormExcerpt] = useState("");
    const [formAuthorName, setFormAuthorName] = useState("");
    const [formPublished, setFormPublished] = useState(true);
    const [saving, setSaving] = useState(false);

    // Image upload
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadInsights() {
            try {
                const data = await fetchAdminInsights();
                const mapped: Insight[] = data.map((i: any) => ({
                    id: i.id,
                    title: i.title,
                    category: i.category || "Trends",
                    imageUrl: i.image_url || "",
                    excerpt: i.excerpt || "",
                    authorName: i.author_name || "",
                    isPublished: i.is_published ?? true,
                }));
                setInsights(mapped);
            } catch (err) {
                console.error("Failed to load insights:", err);
            } finally {
                setLoading(false);
            }
        }
        loadInsights();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB.");
            return;
        }

        setUploading(true);
        const url = await uploadFile("insights", file);
        if (url) {
            setFormImageUrl(url);
        } else {
            alert("Failed to upload image. Make sure the 'media' storage bucket exists in Supabase.");
        }
        setUploading(false);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openCreate = () => {
        setIsCreating(true);
        setEditingInsight(null);
        setFormTitle("");
        setFormCategory("Trends");
        setFormImageUrl("");
        setFormExcerpt("");
        setFormAuthorName("");
        setFormPublished(true);
    };

    const openEdit = (insight: Insight) => {
        setEditingInsight(insight);
        setIsCreating(false);
        setFormTitle(insight.title);
        setFormCategory(insight.category);
        setFormImageUrl(insight.imageUrl);
        setFormExcerpt(insight.excerpt || "");
        setFormAuthorName(insight.authorName || "");
        setFormPublished(insight.isPublished);
    };

    const handleSave = async () => {
        if (!formTitle.trim()) return;
        setSaving(true);

        if (isCreating) {
            const created = await createInsight({
                title: formTitle.trim(),
                category: formCategory,
                image_url: formImageUrl.trim() || undefined,
                excerpt: formExcerpt.trim() || undefined,
                author_name: formAuthorName.trim() || undefined,
                is_published: formPublished,
            });
            if (created) {
                const newInsight: Insight = {
                    id: created.id,
                    title: created.title,
                    category: created.category,
                    imageUrl: created.image_url || "",
                    excerpt: created.excerpt || "",
                    authorName: created.author_name || "",
                    isPublished: created.is_published ?? true,
                };
                setInsights((prev) => [newInsight, ...prev]);
            }
        } else if (editingInsight) {
            const success = await updateInsight(editingInsight.id, {
                title: formTitle.trim(),
                category: formCategory,
                image_url: formImageUrl.trim() || "",
                excerpt: formExcerpt.trim() || "",
                author_name: formAuthorName.trim() || "",
                is_published: formPublished,
            });
            if (success) {
                setInsights((prev) =>
                    prev.map((i) =>
                        i.id === editingInsight.id
                            ? {
                                ...i,
                                title: formTitle.trim(),
                                category: formCategory,
                                imageUrl: formImageUrl.trim(),
                                excerpt: formExcerpt.trim(),
                                authorName: formAuthorName.trim(),
                                isPublished: formPublished,
                            }
                            : i
                    )
                );
            }
        }

        setSaving(false);
        setIsCreating(false);
        setEditingInsight(null);
    };

    const handleDelete = async (insightId: string) => {
        const success = await deleteInsightApi(insightId);
        if (success) {
            setInsights((prev) => prev.filter((i) => i.id !== insightId));
        }
    };

    const handleTogglePublish = async (insight: Insight) => {
        const success = await updateInsight(insight.id, { is_published: !insight.isPublished });
        if (success) {
            setInsights((prev) =>
                prev.map((i) => i.id === insight.id ? { ...i, isPublished: !i.isPublished } : i)
            );
        }
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingInsight(null);
    };

    const showForm = isCreating || editingInsight;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Insights Management</h2>
                    <p className="text-white/40 text-sm">
                        {insights.length} insight{insights.length !== 1 ? "s" : ""} &middot; {insights.filter(i => i.isPublished).length} published
                    </p>
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
                                    <div className="grid grid-cols-2 gap-3">
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
                                                Author Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formAuthorName}
                                                onChange={(e) => setFormAuthorName(e.target.value)}
                                                placeholder="Author name (optional)"
                                                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Image upload */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-1.5">
                                            <ImageIcon className="w-3 h-3" /> Image
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formImageUrl}
                                                onChange={(e) => setFormImageUrl(e.target.value)}
                                                placeholder="Image URL or upload..."
                                                className="flex-1 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/[0.15] transition-all disabled:opacity-40"
                                            >
                                                {uploading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
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

                                    {/* Published toggle */}
                                    <button
                                        onClick={() => setFormPublished(!formPublished)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                                            formPublished
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        }`}
                                    >
                                        {formPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        {formPublished ? "Published" : "Draft"}
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={!formTitle.trim() || saving}
                                        className="btn-embossed-primary px-4 py-2.5 rounded-xl text-sm text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
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
                                                    <ImageIcon className="w-8 h-8 text-white/10" />
                                                </div>
                                            )}
                                            {formCategory && (
                                                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[10px] font-medium text-blue-400 backdrop-blur-sm">
                                                    {formCategory}
                                                </span>
                                            )}
                                            {!formPublished && (
                                                <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500/20 text-[10px] font-medium text-amber-400 backdrop-blur-sm">
                                                    Draft
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
                                            {formAuthorName && (
                                                <p className="text-[10px] text-white/25 mt-2">By {formAuthorName}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Insights grid */}
            {insights.length === 0 && !showForm && (
                <div className="card-embossed p-16 text-center">
                    <Lightbulb className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">No Insights Yet</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto mb-6">
                        Create insights to share knowledge, trends, and data with your audience. Upload images directly to Supabase Storage.
                    </p>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create First Insight
                    </button>
                </div>
            )}

            {insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {insights.map((insight, index) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`card-embossed overflow-hidden group ${!insight.isPublished ? "opacity-60" : ""}`}
                        >
                            {/* Image */}
                            <div className="aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                                {insight.imageUrl ? (
                                    <img
                                        src={insight.imageUrl}
                                        alt={insight.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-white/10" />
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[10px] font-medium text-blue-400 backdrop-blur-sm">
                                    {insight.category}
                                </span>
                                {!insight.isPublished && (
                                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500/20 text-[10px] font-medium text-amber-400 backdrop-blur-sm">
                                        Draft
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{insight.title}</h3>
                                {insight.excerpt && (
                                    <p className="text-xs text-white/40 line-clamp-2 mb-1">{insight.excerpt}</p>
                                )}
                                {insight.authorName && (
                                    <p className="text-[10px] text-white/25 mb-3">By {insight.authorName}</p>
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
                                        onClick={() => handleTogglePublish(insight)}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                                            insight.isPublished
                                                ? "text-white/40 hover:text-amber-400 hover:bg-amber-500/[0.06]"
                                                : "text-white/40 hover:text-emerald-400 hover:bg-emerald-500/[0.06]"
                                        }`}
                                    >
                                        {insight.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        {insight.isPublished ? "Unpublish" : "Publish"}
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
                                {previewInsight.imageUrl ? (
                                    <img
                                        src={previewInsight.imageUrl}
                                        alt={previewInsight.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-white/10" />
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-[11px] font-medium text-blue-400 backdrop-blur-sm">
                                    {previewInsight.category}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-white mb-2">{previewInsight.title}</h3>
                                {previewInsight.excerpt && (
                                    <p className="text-sm text-white/50 leading-relaxed mb-2">{previewInsight.excerpt}</p>
                                )}
                                {previewInsight.authorName && (
                                    <p className="text-xs text-white/30 mb-4">By {previewInsight.authorName}</p>
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
