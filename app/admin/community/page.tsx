"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Eye,
    EyeOff,
    Trash2,
    MessageSquare,
    Heart,
    Flag,
    Clock,
    AlertTriangle,
    CheckCircle,
    Filter,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { fetchAdminPosts, updatePost, deletePost as deletePostApi } from "@/lib/admin-data";

interface CommunityPost {
    id: string;
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp: string;
    status: "visible" | "hidden" | "flagged";
    flagReason?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    visible: { label: "Visible", color: "bg-emerald-500/10 text-emerald-400", icon: Eye },
    hidden: { label: "Hidden", color: "bg-amber-500/10 text-amber-400", icon: EyeOff },
    flagged: { label: "Flagged", color: "bg-red-500/10 text-red-400", icon: Flag },
};

export default function AdminCommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [previewPost, setPreviewPost] = useState<CommunityPost | null>(null);

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await fetchAdminPosts();
                const mapped: CommunityPost[] = data.map((p: any) => ({
                    id: p.id,
                    author: {
                        name: p.author?.name || "Unknown",
                        handle: p.author?.handle || "",
                        avatar: p.author?.avatar || `https://ui-avatars.com/api/?name=U&background=3b82f6&color=fff`,
                    },
                    content: p.content || "",
                    image: p.image || undefined,
                    likes: p.likes_count || 0,
                    comments: p.comments_count || 0,
                    timestamp: new Date(p.created_at).toLocaleDateString(),
                    status: (p.status || "visible") as CommunityPost["status"],
                    flagReason: p.flag_reason || undefined,
                }));
                setPosts(mapped);
            } catch (err) {
                console.error("Failed to load posts:", err);
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, []);

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            !searchQuery ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || post.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleToggleVisibility = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;
        const newStatus = post.status === "hidden" ? "visible" : "hidden";
        const success = await updatePost(postId, { status: newStatus });
        if (success) {
            setPosts((prev) =>
                prev.map((p) => p.id === postId ? { ...p, status: newStatus as CommunityPost["status"] } : p)
            );
        }
    };

    const handleDelete = async (postId: string) => {
        const success = await deletePostApi(postId);
        if (success) {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            if (previewPost?.id === postId) setPreviewPost(null);
        }
    };

    const handleDismissFlag = async (postId: string) => {
        const success = await updatePost(postId, { status: "visible", flag_reason: null });
        if (success) {
            setPosts((prev) =>
                prev.map((p) => p.id === postId ? { ...p, status: "visible" as const, flagReason: undefined } : p)
            );
        }
    };

    const flaggedCount = posts.filter((p) => p.status === "flagged").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading community posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Community Moderation</h2>
                    <p className="text-white/40 text-sm">{filteredPosts.length} posts total</p>
                </div>
                {flaggedCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400 font-medium">{flaggedCount} flagged post{flaggedCount > 1 ? "s" : ""} requiring review</span>
                    </div>
                )}
            </div>

            {posts.length === 0 && (
                <div className="card-embossed p-16 text-center">
                    <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">No Community Posts Yet</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto">
                        Community posts will appear here as users share content on the platform. You&apos;ll be able to moderate, flag, and manage visibility.
                    </p>
                </div>
            )}

            {posts.length > 0 && (<>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts by content or author..."
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

            {/* Posts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredPosts.map((post, index) => {
                    const statusInfo = statusConfig[post.status];
                    const StatusIcon = statusInfo.icon;
                    return (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`card-embossed p-5 ${post.status === "hidden" ? "opacity-60" : ""}`}
                        >
                            {/* Flag banner */}
                            {post.status === "flagged" && post.flagReason && (
                                <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                    <span className="text-xs text-red-400">{post.flagReason}</span>
                                </div>
                            )}

                            {/* Author and status */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-8 h-8 rounded-lg"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-white">{post.author.name}</p>
                                        <p className="text-[11px] text-white/30">{post.author.handle}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium ${statusInfo.color}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {statusInfo.label}
                                </span>
                            </div>

                            {/* Content preview */}
                            <p className="text-sm text-white/60 mb-4 line-clamp-3 leading-relaxed">
                                {post.content}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center gap-4 mb-4 text-xs text-white/25">
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> {post.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {post.timestamp}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setPreviewPost(post)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    Preview
                                </button>
                                <button
                                    onClick={() => handleToggleVisibility(post.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all"
                                >
                                    {post.status === "hidden" ? (
                                        <><Eye className="w-3.5 h-3.5" /> Show</>
                                    ) : (
                                        <><EyeOff className="w-3.5 h-3.5" /> Hide</>
                                    )}
                                </button>
                                {post.status === "flagged" && (
                                    <button
                                        onClick={() => handleDismissFlag(post.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Dismiss
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all ml-auto"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredPosts.length === 0 && (
                <div className="card-embossed p-16 text-center">
                    <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No posts found matching your criteria.</p>
                </div>
            )}
            </>)}

            {/* Preview modal */}
            <AnimatePresence>
                {previewPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-lg w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={previewPost.author.avatar}
                                    alt={previewPost.author.name}
                                    className="w-10 h-10 rounded-xl"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">{previewPost.author.name}</p>
                                    <p className="text-xs text-white/30">{previewPost.author.handle} &middot; {previewPost.timestamp}</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed mb-4">{previewPost.content}</p>
                            <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {previewPost.likes} likes</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {previewPost.comments} comments</span>
                            </div>
                            <button
                                onClick={() => setPreviewPost(null)}
                                className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                            >
                                Close Preview
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
