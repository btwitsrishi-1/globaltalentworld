"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/community/sidebar";
import { PostCard } from "@/components/community/post-card";
import { CreatePost } from "@/components/community/create-post";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageSquare } from "lucide-react";
import Link from "next/link";

const BackgroundLogo3D = dynamic(() => import('@/components/ui/background-logo-3d').then(mod => ({ default: mod.BackgroundLogo3D })), { ssr: false });

const INITIAL_POSTS = [
    {
        id: 1,
        author: { name: "Sarah Jenkins", handle: "@sarah.design", avatar: "" },
        content: "Just shipped the new glassmorphic design system for our client. The depth layering with backdrop-filter is a game changer for spatial interfaces. #UI #Design",
        likes: 245,
        comments: 42,
        timestamp: "2h ago"
    },
    {
        id: 2,
        author: { name: "David Chen", handle: "@david_dev", avatar: "" },
        content: "Exploring the limits of WebGPU in Next.js 15. The performance gains for 3D rendering are insane compared to traditional WebGL context switching.",
        likes: 890,
        comments: 112,
        timestamp: "5h ago"
    },
    {
        id: 3,
        author: { name: "Mira Patel", handle: "@mira_ux", avatar: "" },
        content: "Just wrapped up a 3-month UX research project on accessibility in fintech apps. The findings were eye-opening - over 40% of users struggled with basic navigation patterns we considered 'standard'.",
        likes: 567,
        comments: 89,
        timestamp: "8h ago"
    },
    {
        id: 4,
        author: { name: "Alex Turner", handle: "@alex.motion", avatar: "" },
        content: "Published my new open-source library for spring-based animations in React. It handles interrupted animations gracefully without the jank. Check it out!",
        likes: 1204,
        comments: 156,
        timestamp: "12h ago"
    },
];

const ADDITIONAL_POSTS = [
    {
        id: 5,
        author: { name: "Luna Reyes", handle: "@luna_codes", avatar: "" },
        content: "Finished migrating our entire frontend to server components. The initial load time dropped by 60%. Still amazed by how well RSC handles data fetching at the component level.",
        likes: 432,
        comments: 67,
        timestamp: "1d ago"
    },
    {
        id: 6,
        author: { name: "James Wright", handle: "@jwright", avatar: "" },
        content: "Hot take: The best UI is the one users don't notice. We spend too much time on flashy interactions and not enough on reducing cognitive load.",
        likes: 789,
        comments: 203,
        timestamp: "1d ago"
    },
];

const EmptyState = () => (
    <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            Be the first to share something with the community!
        </p>
    </div>
);

const LoginPrompt = () => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Join the conversation</h3>
        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            Sign in to create posts, like content, and connect with other talented professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
                Sign In
            </Link>
            <Link href="/signup" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors">
                Create Account
            </Link>
        </div>
    </div>
);

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const handleNewPost = (content: string, image?: string) => {
        if (!user) return;
        const newPost = {
            id: Date.now(),
            author: { name: user.name, handle: user.handle, avatar: user.avatar || "" },
            content,
            image,
            likes: 0,
            comments: 0,
            timestamp: "Just now"
        };
        setPosts([newPost, ...posts]);
    };

    const handleLoadMore = () => {
        if (!hasMorePosts) return;
        setIsLoading(true);
        setTimeout(() => {
            setPosts((prev) => [...prev, ...ADDITIONAL_POSTS]);
            setHasMorePosts(false);
            setIsLoading(false);
        }, 800);
    };

    return (
        <main className="min-h-screen bg-[#060608] text-slate-200 flex flex-col">
            <CustomCursor />
            <Navbar />
            <BackgroundLogo3D className="fixed inset-0 z-0 opacity-30" />
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 flex gap-8 relative z-10 w-full">
                <Sidebar />
                <div className="flex-1 max-w-2xl mx-auto space-y-6">
                    <div className="mb-8">
                        <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">Community Feed</h1>
                        <p className="text-slate-400">See what the world&apos;s top talent is creating.</p>
                    </div>
                    {user ? <CreatePost onPost={handleNewPost} /> : <LoginPrompt />}
                    {posts.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {posts.map((post) => (
                                <PostCard key={post.id} {...post} />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <EmptyState />
                    )}
                    {posts.length > 0 && (
                        <div className="h-24 flex items-center justify-center">
                            {isLoading ? (
                                <PostCardSkeleton />
                            ) : hasMorePosts ? (
                                <button
                                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-6 py-2 rounded-full border border-white/10 hover:border-white/20"
                                    onClick={handleLoadMore}
                                >
                                    Load more posts
                                </button>
                            ) : (
                                <p className="text-slate-500 text-sm">You&apos;ve reached the end</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="hidden xl:block w-80" />
            </div>
            <Footer />
        </main>
    );
}
