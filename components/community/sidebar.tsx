"use client";

import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit w-80">
            {/* User Profile Mini */}
            {user ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{user.name}</h3>
                            <p className="text-sm text-slate-400">{user.handle}</p>
                        </div>
                    </div>
                    {user.bio && (
                        <p className="text-sm text-slate-300 mb-4">{user.bio}</p>
                    )}
                    <Link
                        href="/profile"
                        className="block w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10"
                    >
                        Edit Profile
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-slate-400 text-sm mb-4">Sign in to join the community</p>
                    <Link
                        href="/login"
                        className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {/* Trending Topics */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Trending in Design</h4>
                </div>
                <ul className="space-y-4">
                    {["Spatial UI Interfaces", "Neo-Brutalism 2026", "Generative WebGL", "Sustainable Tech Stacks"].map((topic, i) => (
                        <li key={i} className="group cursor-pointer">
                            <p className="text-slate-300 group-hover:text-white transition-colors text-sm font-medium">{topic}</p>
                            <p className="text-xs text-slate-500">{10 + i}.2k posts</p>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
