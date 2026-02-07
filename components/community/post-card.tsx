"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PostCardProps {
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    content: string;
    videoUrl?: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp?: string;
}

export const PostCard = ({ author, content, videoUrl, image, likes: initialLikes, comments, timestamp }: PostCardProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentCount, setCommentCount] = useState(comments);
    const [showShareToast, setShowShareToast] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }
    };

    const handleComment = () => {
        setShowCommentInput(!showCommentInput);
    };

    const submitComment = () => {
        if (!commentText.trim()) return;
        setCommentCount(commentCount + 1);
        setCommentText("");
        setShowCommentInput(false);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Post by ${author.name}`,
                    text: content.substring(0, 100),
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 2000);
            }
        } catch {
            // User cancelled share or clipboard failed - silently ignore
        }
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 mb-6"
        >
            {/* Header */}
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden relative">
                        {author.avatar ? (
                            <Image
                                src={author.avatar}
                                alt={`${author.name}'s avatar`}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500" aria-hidden="true" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{author.name}</h3>
                        <p className="text-xs text-slate-400">
                            <span>{author.handle}</span>
                            {timestamp && (
                                <>
                                    <span aria-hidden="true"> • </span>
                                    <time>{timestamp}</time>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                    aria-label="More options"
                >
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                </button>
            </header>

            {/* Content */}
            <p className="text-slate-300 mb-4 leading-relaxed whitespace-pre-wrap">{content}</p>

            {/* Media Rendering */}
            {image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                    <Image
                        src={image}
                        alt="Post content"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                    />
                </div>
            )}

            {videoUrl && (
                <div className="relative aspect-video w-full rounded-xl bg-slate-900/50 mb-4 overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        <span className="text-sm">Video Player Placeholder</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <footer className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6" role="group" aria-label="Post actions">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 transition-colors group/like",
                            isLiked ? "text-red-400" : "text-slate-400 hover:text-red-400"
                        )}
                        aria-label={isLiked ? `Unlike post. ${likes} likes` : `Like post. ${likes} likes`}
                        aria-pressed={isLiked}
                    >
                        <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current scale-110")} aria-hidden="true" />
                        <span className="text-sm font-medium">{likes}</span>
                    </button>
                    <button
                        onClick={handleComment}
                        className={cn(
                            "flex items-center gap-2 transition-colors",
                            showCommentInput ? "text-blue-400" : "text-slate-400 hover:text-blue-400"
                        )}
                        aria-label={`Comment. ${commentCount} comments`}
                        aria-expanded={showCommentInput}
                    >
                        <MessageCircle className="w-5 h-5" aria-hidden="true" />
                        <span className="text-sm font-medium">{commentCount}</span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors"
                            aria-label="Share post"
                        >
                            <Share2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <AnimatePresence>
                            {showShareToast && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg whitespace-nowrap"
                                >
                                    Link copied!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </footer>

            {/* Comment Input */}
            <AnimatePresence>
                {showCommentInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                            <button
                                onClick={submitComment}
                                disabled={!commentText.trim()}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                                aria-label="Submit comment"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setShowCommentInput(false);
                                    setCommentText("");
                                }}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-colors"
                                aria-label="Cancel comment"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
};
