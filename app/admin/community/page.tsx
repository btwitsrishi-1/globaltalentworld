"use client";

import React, { useState, useEffect, useRef } from "react";
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
    Loader2,
    MoreHorizontal,
    Repeat2,
    Share,
    BarChart3,
    Image as ImageIcon,
    X,
    ArrowLeft,
    Shield,
    Plus,
    Upload,
    Send,
} from "lucide-react";
import { fetchAdminPosts, updatePost, deletePost as deletePostApi, createAdminPost, fetchAdminUsers } from "@/lib/admin-data";
import { uploadFile } from "@/lib/storage";

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

// Helper to format relative time like Twitter
function formatRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec}s`;
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}

export default function AdminCommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "visible" | "hidden" | "flagged">("all");
    const [expandedPost, setExpandedPost] = useState<CommunityPost | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Compose state
    const [showCompose, setShowCompose] = useState(false);
    const [composeText, setComposeText] = useState("");
    const [composeImageUrl, setComposeImageUrl] = useState("");
    const [composePostAs, setComposePostAs] = useState("");
    const [userList, setUserList] = useState<{ id: string; name: string; handle: string; avatar: string }[]>([]);
    const [composeSending, setComposeSending] = useState(false);
    const [composeUploading, setComposeUploading] = useState(false);
    const composeFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await fetchAdminPosts();
                const mapped: CommunityPost[] = data.map((p: any) => ({
                    id: p.id,
                    author: {
                        name: p.author?.name || "Unknown",
                        handle: p.author?.handle || "@unknown",
                        avatar: p.author?.avatar || `https://ui-avatars.com/api/?name=U&background=1d9bf0&color=fff`,
                    },
                    content: p.content || "",
                    image: p.image || undefined,
                    likes: p.likes_count || 0,
                    comments: p.comments_count || 0,
                    timestamp: p.created_at || new Date().toISOString(),
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

    // Load users for "Post as" selector
    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchAdminUsers();
                setUserList(data.map((u: any) => ({
                    id: u.id,
                    name: u.name || "Unknown",
                    handle: u.handle || "@unknown",
                    avatar: u.avatar || `https://ui-avatars.com/api/?name=U&background=1d9bf0&color=fff`,
                })));
            } catch { /* ignore */ }
        }
        loadUsers();
    }, []);

    const handleComposeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
        setComposeUploading(true);
        const url = await uploadFile("posts", file);
        if (url) setComposeImageUrl(url);
        setComposeUploading(false);
        if (composeFileRef.current) composeFileRef.current.value = "";
    };

    const handleSendPost = async () => {
        if (!composeText.trim() || !composePostAs) return;
        setComposeSending(true);
        const created = await createAdminPost(composePostAs, composeText.trim(), composeImageUrl || undefined);
        if (created) {
            const newPost: CommunityPost = {
                id: created.id,
                author: {
                    name: created.author?.name || "Admin",
                    handle: created.author?.handle || "@admin",
                    avatar: created.author?.avatar || `https://ui-avatars.com/api/?name=A&background=1d9bf0&color=fff`,
                },
                content: created.content || "",
                image: created.image || undefined,
                likes: 0,
                comments: 0,
                timestamp: created.created_at || new Date().toISOString(),
                status: "visible",
            };
            setPosts((prev) => [newPost, ...prev]);
        }
        setComposeText("");
        setComposeImageUrl("");
        setShowCompose(false);
        setComposeSending(false);
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            !searchQuery ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab = activeTab === "all" || post.status === activeTab;

        return matchesSearch && matchesTab;
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
        setActiveMenu(null);
    };

    const handleDelete = async (postId: string) => {
        const success = await deletePostApi(postId);
        if (success) {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            if (expandedPost?.id === postId) setExpandedPost(null);
        }
        setActiveMenu(null);
    };

    const handleDismissFlag = async (postId: string) => {
        const success = await updatePost(postId, { status: "visible", flag_reason: null });
        if (success) {
            setPosts((prev) =>
                prev.map((p) => p.id === postId ? { ...p, status: "visible" as const, flagReason: undefined } : p)
            );
        }
        setActiveMenu(null);
    };

    const flaggedCount = posts.filter((p) => p.status === "flagged").length;
    const tabs = [
        { id: "all" as const, label: "All", count: posts.length },
        { id: "visible" as const, label: "Visible", count: posts.filter((p) => p.status === "visible").length },
        { id: "flagged" as const, label: "Flagged", count: flaggedCount },
        { id: "hidden" as const, label: "Hidden", count: posts.filter((p) => p.status === "hidden").length },
    ];

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
        <div className="max-w-[600px] mx-auto">
            {/* Twitter-style header */}
            <div className="sticky top-0 z-10 bg-[#060608]/80 backdrop-blur-md">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 h-[53px]">
                    <h1 className="text-xl font-bold text-white">Community</h1>
                    {flaggedCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-red-400 font-semibold">{flaggedCount}</span>
                        </div>
                    )}
                </div>

                {/* Tab bar - Twitter style */}
                <div className="flex border-b border-white/[0.08]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 relative py-3 text-center transition-colors hover:bg-white/[0.03]"
                        >
                            <span className={`text-sm font-medium ${
                                activeTab === tab.id ? "text-white" : "text-white/40"
                            }`}>
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`ml-1.5 text-xs ${
                                        activeTab === tab.id ? "text-white/60" : "text-white/20"
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="community-tab-indicator"
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-blue-400"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Search bar */}
                <div className="px-4 py-3 border-b border-white/[0.08]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts"
                            className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-full text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Admin Compose Box */}
            <div className="border-b border-white/[0.08]">
                {!showCompose ? (
                    <button
                        onClick={() => setShowCompose(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-white/30 hover:bg-white/[0.02] transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <span>Create a post as a user...</span>
                    </button>
                ) : (
                    <div className="px-4 py-3">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {/* Post-as selector */}
                                <div className="mb-3">
                                    <label className="text-xs text-white/30 mb-1 block">Post as user:</label>
                                    <select
                                        value={composePostAs}
                                        onChange={(e) => setComposePostAs(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-400/50 transition-all appearance-none"
                                    >
                                        <option value="" className="bg-[#0a0a0f] text-white/40">Select a user...</option>
                                        {userList.map((u) => (
                                            <option key={u.id} value={u.id} className="bg-[#0a0a0f]">
                                                {u.name} ({u.handle})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Text area */}
                                <textarea
                                    value={composeText}
                                    onChange={(e) => setComposeText(e.target.value)}
                                    placeholder="What's happening?"
                                    rows={3}
                                    className="w-full bg-transparent text-[17px] text-white placeholder:text-white/25 outline-none resize-none leading-[24px]"
                                    autoFocus
                                />

                                {/* Image preview */}
                                {composeImageUrl && (
                                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-white/[0.08]">
                                        <img src={composeImageUrl} alt="" className="w-full max-h-48 object-cover" />
                                        <button
                                            onClick={() => setComposeImageUrl("")}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Actions bar */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => composeFileRef.current?.click()}
                                            disabled={composeUploading}
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-colors disabled:opacity-40"
                                        >
                                            {composeUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                        </button>
                                        <input ref={composeFileRef} type="file" accept="image/*" onChange={handleComposeImageUpload} className="hidden" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setShowCompose(false); setComposeText(""); setComposeImageUrl(""); }}
                                            className="px-4 py-1.5 rounded-full text-sm text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendPost}
                                            disabled={!composeText.trim() || !composePostAs || composeSending}
                                            className="px-5 py-1.5 rounded-full bg-blue-500 text-sm text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {composeSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {posts.length === 0 && (
                <div className="px-4 py-20 text-center">
                    <MessageSquare className="w-12 h-12 text-white/[0.06] mx-auto mb-4" />
                    <h3 className="text-[17px] font-bold text-white mb-1">No posts yet</h3>
                    <p className="text-[15px] text-white/40 max-w-[300px] mx-auto leading-relaxed">
                        When users post in the community, their posts will show up here for moderation.
                    </p>
                </div>
            )}

            {/* Posts feed - Twitter style */}
            {filteredPosts.length > 0 && (
                <div>
                    {filteredPosts.map((post) => (
                        <article
                            key={post.id}
                            className={`border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                                post.status === "hidden" ? "opacity-50" : ""
                            }`}
                            onClick={() => setExpandedPost(post)}
                        >
                            {/* Flagged banner */}
                            {post.status === "flagged" && post.flagReason && (
                                <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 ml-[52px]" />
                                    <span className="text-xs text-red-400">{post.flagReason}</span>
                                </div>
                            )}

                            {/* Admin status badge */}
                            {post.status !== "visible" && (
                                <div className="flex items-center gap-2 px-4 pt-2 pb-0">
                                    <div className="ml-[52px] flex items-center gap-1.5">
                                        <Shield className="w-3 h-3 text-white/20" />
                                        <span className={`text-xs font-medium ${
                                            post.status === "hidden" ? "text-amber-400/70" : "text-red-400/70"
                                        }`}>
                                            {post.status === "hidden" ? "Hidden by admin" : "Flagged for review"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 px-4 py-3">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </div>

                                {/* Content area */}
                                <div className="flex-1 min-w-0">
                                    {/* Author line */}
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <span className="text-[15px] font-bold text-white truncate">
                                            {post.author.name}
                                        </span>
                                        <span className="text-[15px] text-white/40 truncate">
                                            {post.author.handle}
                                        </span>
                                        <span className="text-white/20 mx-0.5">&middot;</span>
                                        <span className="text-[15px] text-white/40 shrink-0">
                                            {formatRelativeTime(post.timestamp)}
                                        </span>
                                        {/* More menu */}
                                        <div className="ml-auto relative shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === post.id ? null : post.id);
                                                }}
                                                className="w-8 h-8 -mr-2 rounded-full flex items-center justify-center text-white/20 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>

                                            <AnimatePresence>
                                                {activeMenu === post.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                        className="absolute top-full right-0 mt-1 w-56 bg-[#16181c] border border-white/[0.1] rounded-2xl py-1 shadow-2xl z-30 overflow-hidden"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => handleToggleVisibility(post.id)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-white/80 hover:bg-white/[0.04] transition-colors"
                                                        >
                                                            {post.status === "hidden" ? (
                                                                <><Eye className="w-[18px] h-[18px] text-white/50" /> Show post</>
                                                            ) : (
                                                                <><EyeOff className="w-[18px] h-[18px] text-white/50" /> Hide post</>
                                                            )}
                                                        </button>
                                                        {post.status === "flagged" && (
                                                            <button
                                                                onClick={() => handleDismissFlag(post.id)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-white/80 hover:bg-white/[0.04] transition-colors"
                                                            >
                                                                <CheckCircle className="w-[18px] h-[18px] text-emerald-400" />
                                                                Dismiss flag
                                                            </button>
                                                        )}
                                                        <div className="border-t border-white/[0.06] my-1" />
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-red-400 hover:bg-red-500/[0.06] transition-colors"
                                                        >
                                                            <Trash2 className="w-[18px] h-[18px]" />
                                                            Delete post
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Post text */}
                                    <p className="text-[15px] text-white/90 leading-[20px] whitespace-pre-wrap break-words mb-3">
                                        {post.content}
                                    </p>

                                    {/* Image */}
                                    {post.image && (
                                        <div className="mb-3 rounded-2xl overflow-hidden border border-white/[0.08]">
                                            <img
                                                src={post.image}
                                                alt=""
                                                className="w-full object-cover max-h-[300px]"
                                            />
                                        </div>
                                    )}

                                    {/* Action bar - Twitter style */}
                                    <div className="flex items-center justify-between max-w-[425px] -ml-2" onClick={(e) => e.stopPropagation()}>
                                        {/* Comments */}
                                        <button className="flex items-center gap-1 group">
                                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                                                <MessageSquare className="w-[18px] h-[18px] text-white/30 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <span className="text-[13px] text-white/30 group-hover:text-blue-400 transition-colors">
                                                {post.comments > 0 ? formatNumber(post.comments) : ""}
                                            </span>
                                        </button>

                                        {/* Repost */}
                                        <button className="flex items-center gap-1 group">
                                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                                                <Repeat2 className="w-[18px] h-[18px] text-white/30 group-hover:text-emerald-400 transition-colors" />
                                            </div>
                                            <span className="text-[13px] text-white/30 group-hover:text-emerald-400 transition-colors"></span>
                                        </button>

                                        {/* Likes */}
                                        <button className="flex items-center gap-1 group">
                                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center group-hover:bg-pink-400/10 transition-colors">
                                                <Heart className="w-[18px] h-[18px] text-white/30 group-hover:text-pink-400 transition-colors" />
                                            </div>
                                            <span className="text-[13px] text-white/30 group-hover:text-pink-400 transition-colors">
                                                {post.likes > 0 ? formatNumber(post.likes) : ""}
                                            </span>
                                        </button>

                                        {/* Views */}
                                        <button className="flex items-center gap-1 group">
                                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                                                <BarChart3 className="w-[18px] h-[18px] text-white/30 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        </button>

                                        {/* Share */}
                                        <button className="flex items-center group">
                                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                                                <Share className="w-[18px] h-[18px] text-white/30 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* No results for filter */}
            {posts.length > 0 && filteredPosts.length === 0 && (
                <div className="px-4 py-20 text-center">
                    <Search className="w-10 h-10 text-white/[0.06] mx-auto mb-4" />
                    <h3 className="text-[17px] font-bold text-white mb-1">No results</h3>
                    <p className="text-[15px] text-white/40">
                        Try searching for something else or change the filter.
                    </p>
                </div>
            )}

            {/* Expanded post detail - Twitter-style modal */}
            <AnimatePresence>
                {expandedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
                        onClick={() => setExpandedPost(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0f] w-full max-w-[600px] min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl border border-white/[0.08] overflow-hidden"
                        >
                            {/* Modal header */}
                            <div className="flex items-center gap-6 px-4 h-[53px] border-b border-white/[0.08]">
                                <button
                                    onClick={() => setExpandedPost(null)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                <h2 className="text-[17px] font-bold text-white">Post</h2>
                            </div>

                            {/* Post content */}
                            <div className="px-4 pt-4">
                                {/* Author section */}
                                <div className="flex items-start gap-3 mb-4">
                                    <img
                                        src={expandedPost.author.avatar}
                                        alt={expandedPost.author.name}
                                        className="w-10 h-10 rounded-full shrink-0"
                                    />
                                    <div className="flex-1">
                                        <p className="text-[15px] font-bold text-white leading-tight">
                                            {expandedPost.author.name}
                                        </p>
                                        <p className="text-[15px] text-white/40 leading-tight">
                                            {expandedPost.author.handle}
                                        </p>
                                    </div>
                                </div>

                                {/* Full content */}
                                <p className="text-[17px] text-white/90 leading-[24px] whitespace-pre-wrap break-words mb-4">
                                    {expandedPost.content}
                                </p>

                                {/* Image */}
                                {expandedPost.image && (
                                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/[0.08]">
                                        <img
                                            src={expandedPost.image}
                                            alt=""
                                            className="w-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Timestamp */}
                                <div className="flex items-center gap-1 text-[15px] text-white/40 pb-4 border-b border-white/[0.08]">
                                    <span>{new Date(expandedPost.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                                    <span>&middot;</span>
                                    <span>{new Date(expandedPost.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>

                                {/* Engagement stats */}
                                <div className="flex items-center gap-5 py-3 border-b border-white/[0.08]">
                                    {expandedPost.comments > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[15px] font-bold text-white">{formatNumber(expandedPost.comments)}</span>
                                            <span className="text-[15px] text-white/40">Replies</span>
                                        </div>
                                    )}
                                    {expandedPost.likes > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[15px] font-bold text-white">{formatNumber(expandedPost.likes)}</span>
                                            <span className="text-[15px] text-white/40">Likes</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action bar */}
                                <div className="flex items-center justify-around py-1 border-b border-white/[0.08]">
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400/10 transition-colors">
                                        <MessageSquare className="w-5 h-5 text-white/30 hover:text-blue-400" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-400/10 transition-colors">
                                        <Repeat2 className="w-5 h-5 text-white/30 hover:text-emerald-400" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-400/10 transition-colors">
                                        <Heart className="w-5 h-5 text-white/30 hover:text-pink-400" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400/10 transition-colors">
                                        <BarChart3 className="w-5 h-5 text-white/30 hover:text-blue-400" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400/10 transition-colors">
                                        <Share className="w-5 h-5 text-white/30 hover:text-blue-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Admin moderation actions */}
                            <div className="px-4 py-4">
                                <p className="text-xs font-semibold text-white/20 uppercase tracking-wider mb-3">Admin Actions</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            handleToggleVisibility(expandedPost.id);
                                            setExpandedPost(null);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                            expandedPost.status === "hidden"
                                                ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                        }`}
                                    >
                                        {expandedPost.status === "hidden" ? (
                                            <><Eye className="w-4 h-4" /> Show Post</>
                                        ) : (
                                            <><EyeOff className="w-4 h-4" /> Hide Post</>
                                        )}
                                    </button>
                                    {expandedPost.status === "flagged" && (
                                        <button
                                            onClick={() => {
                                                handleDismissFlag(expandedPost.id);
                                                setExpandedPost(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Dismiss Flag
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleDelete(expandedPost.id);
                                            setExpandedPost(null);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Post
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
