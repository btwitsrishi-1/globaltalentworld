"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Star,
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    X,
    Save,
    MessageSquare,
    Clock,
    Filter,
    ChevronDown,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import { fetchAdminReviews, createReview, updateReview, deleteReview as deleteReviewApi } from "@/lib/admin-data";

interface Review {
    id: string;
    author: string;
    authorAvatar: string;
    rating: number;
    title: string;
    content: string;
    company?: string;
    date: string;
    isVisible: boolean;
    isFlagged: boolean;
    flagReason?: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [showNewReview, setShowNewReview] = useState(false);

    // Form state
    const [formAuthor, setFormAuthor] = useState("");
    const [formRating, setFormRating] = useState(5);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCompany, setFormCompany] = useState("");

    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await fetchAdminReviews();
                const mapped: Review[] = data.map((r: any) => ({
                    id: r.id,
                    author: r.author_name || "Unknown",
                    authorAvatar: r.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author_name || 'U')}&background=3b82f6&color=fff`,
                    rating: r.rating,
                    title: r.title,
                    content: r.content,
                    company: r.company || undefined,
                    date: new Date(r.created_at).toLocaleDateString(),
                    isVisible: r.is_visible ?? true,
                    isFlagged: r.is_flagged ?? false,
                    flagReason: r.flag_reason || undefined,
                }));
                setReviews(mapped);
            } catch (err) {
                console.error("Failed to load reviews:", err);
            } finally {
                setLoading(false);
            }
        }
        loadReviews();
    }, []);

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            !searchQuery ||
            review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (review.company && review.company.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "visible" && review.isVisible && !review.isFlagged) ||
            (statusFilter === "hidden" && !review.isVisible) ||
            (statusFilter === "flagged" && review.isFlagged);

        return matchesSearch && matchesStatus;
    });

    const handleToggleVisibility = async (reviewId: string) => {
        const review = reviews.find((r) => r.id === reviewId);
        if (!review) return;
        const success = await updateReview(reviewId, { is_visible: !review.isVisible });
        if (success) {
            setReviews((prev) =>
                prev.map((r) => r.id === reviewId ? { ...r, isVisible: !r.isVisible } : r)
            );
        }
    };

    const handleDelete = async (reviewId: string) => {
        const success = await deleteReviewApi(reviewId);
        if (success) {
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        }
    };

    const handleDismissFlag = async (reviewId: string) => {
        const success = await updateReview(reviewId, { is_flagged: false, flag_reason: null });
        if (success) {
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === reviewId ? { ...r, isFlagged: false, flagReason: undefined } : r
                )
            );
        }
    };

    const resetForm = () => {
        setFormAuthor("");
        setFormRating(5);
        setFormTitle("");
        setFormContent("");
        setFormCompany("");
    };

    const openNewReview = () => {
        resetForm();
        setEditingReview(null);
        setShowNewReview(true);
    };

    const openEditReview = (review: Review) => {
        setFormAuthor(review.author);
        setFormRating(review.rating);
        setFormTitle(review.title);
        setFormContent(review.content);
        setFormCompany(review.company || "");
        setEditingReview(review);
        setShowNewReview(true);
    };

    const handleSaveReview = async () => {
        if (!formAuthor.trim() || !formTitle.trim() || !formContent.trim()) return;

        if (editingReview) {
            const success = await updateReview(editingReview.id, {
                author_name: formAuthor,
                rating: formRating,
                title: formTitle,
                content: formContent,
                company: formCompany || null,
            });
            if (success) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === editingReview.id
                            ? { ...r, author: formAuthor, rating: formRating, title: formTitle, content: formContent, company: formCompany || undefined }
                            : r
                    )
                );
            }
        } else {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formAuthor)}&background=${Math.floor(Math.random() * 16777215).toString(16)}&color=fff`;
            const created = await createReview({
                author_name: formAuthor,
                author_avatar: avatarUrl,
                rating: formRating,
                title: formTitle,
                content: formContent,
                company: formCompany || undefined,
            });
            if (created) {
                const newReview: Review = {
                    id: created.id,
                    author: created.author_name,
                    authorAvatar: created.author_avatar || avatarUrl,
                    rating: created.rating,
                    title: created.title,
                    content: created.content,
                    company: created.company || undefined,
                    date: new Date(created.created_at).toLocaleDateString(),
                    isVisible: true,
                    isFlagged: false,
                };
                setReviews((prev) => [newReview, ...prev]);
            }
        }

        setShowNewReview(false);
        setEditingReview(null);
        resetForm();
    };

    const flaggedCount = reviews.filter((r) => r.isFlagged).length;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Reviews Management</h2>
                    <p className="text-white/40 text-sm">
                        {reviews.length} reviews &middot; {avgRating} avg rating
                        {flaggedCount > 0 && ` · ${flaggedCount} flagged`}
                    </p>
                </div>
                <button
                    onClick={openNewReview}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Post Review
                </button>
            </div>

            {/* Flagged alert */}
            {flaggedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">{flaggedCount} flagged review{flaggedCount > 1 ? "s" : ""} requiring moderation</span>
                </div>
            )}

            {reviews.length === 0 && !showNewReview && (
                <div className="card-embossed p-16 text-center">
                    <Star className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">No Reviews Yet</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto mb-6">
                        Post reviews to showcase platform testimonials and user feedback. You can manage visibility, edit content, and moderate flagged reviews.
                    </p>
                    <button
                        onClick={openNewReview}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Post First Review
                    </button>
                </div>
            )}

            {reviews.length > 0 && (
                <>
                    {/* Search and filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search reviews by title, content, author, or company..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white transition-all"
                            >
                                <Filter className="w-4 h-4" />
                                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute top-full mt-2 right-0 w-40 bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-1 shadow-2xl z-20"
                                    >
                                        {["all", "visible", "hidden", "flagged"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => { setStatusFilter(status); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    statusFilter === status ? "bg-blue-500/10 text-blue-400" : "text-white/60 hover:bg-white/[0.04]"
                                                }`}
                                            >
                                                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Reviews grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`card-embossed p-5 ${!review.isVisible ? "opacity-60" : ""}`}
                            >
                                {/* Flag banner */}
                                {review.isFlagged && review.flagReason && (
                                    <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                        <span className="text-xs text-red-400">{review.flagReason}</span>
                                    </div>
                                )}

                                {/* Author and rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.authorAvatar}
                                            alt={review.author}
                                            className="w-8 h-8 rounded-lg"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">{review.author}</p>
                                            {review.company && (
                                                <p className="text-[11px] text-white/30">{review.company}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3.5 h-3.5 ${
                                                    star <= review.rating
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-white/10"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Review content */}
                                <h4 className="text-sm font-semibold text-white/80 mb-1.5">{review.title}</h4>
                                <p className="text-sm text-white/50 mb-4 line-clamp-3 leading-relaxed">
                                    {review.content}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-3 mb-4 text-xs text-white/25">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {review.date}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                        review.isFlagged
                                            ? "bg-red-500/10 text-red-400"
                                            : review.isVisible
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-amber-500/10 text-amber-400"
                                    }`}>
                                        {review.isFlagged ? "Flagged" : review.isVisible ? "Visible" : "Hidden"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                    <button
                                        onClick={() => handleToggleVisibility(review.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all"
                                    >
                                        {review.isVisible ? (
                                            <><EyeOff className="w-3.5 h-3.5" /> Hide</>
                                        ) : (
                                            <><Eye className="w-3.5 h-3.5" /> Show</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEditReview(review)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    {review.isFlagged && (
                                        <button
                                            onClick={() => handleDismissFlag(review.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all"
                                        >
                                            <Star className="w-3.5 h-3.5" />
                                            Dismiss Flag
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all ml-auto"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredReviews.length === 0 && (
                        <div className="card-embossed p-16 text-center">
                            <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No reviews found matching your criteria.</p>
                        </div>
                    )}
                </>
            )}

            {/* New / Edit review modal */}
            <AnimatePresence>
                {showNewReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => { setShowNewReview(false); setEditingReview(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">
                                    {editingReview ? "Edit Review" : "Post New Review"}
                                </h3>
                                <button
                                    onClick={() => { setShowNewReview(false); setEditingReview(null); }}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Author Name</label>
                                        <input
                                            type="text"
                                            value={formAuthor}
                                            onChange={(e) => setFormAuthor(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Company (optional)</label>
                                        <input
                                            type="text"
                                            value={formCompany}
                                            onChange={(e) => setFormCompany(e.target.value)}
                                            placeholder="Acme Corp"
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Rating</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setFormRating(star)}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${
                                                        star <= formRating
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-white/10 hover:text-white/20"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-xs text-white/30 ml-2">{formRating}/5</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Review Title</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Great platform for finding talent"
                                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Review Content</label>
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        rows={4}
                                        placeholder="Write the review content here..."
                                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { setShowNewReview(false); setEditingReview(null); }}
                                    className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveReview}
                                    disabled={!formAuthor.trim() || !formTitle.trim() || !formContent.trim()}
                                    className="flex-1 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingReview ? "Save Changes" : "Post Review"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
