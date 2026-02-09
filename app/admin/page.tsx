"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Briefcase,
    MessageSquare,
    UserCheck,
    Activity,
    ArrowUpRight,
    Clock,
    Star,
    FileText,
    Loader2,
} from "lucide-react";
import { fetchDashboardStats, fetchRecentActivity } from "@/lib/admin-data";
import { supabase } from "@/lib/supabase";

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{display.toLocaleString()}</span>;
}

interface DashboardStats {
    totalUsers: number;
    activeListings: number;
    communityPosts: number;
    pendingRecruiters: number;
}

interface ActivityItem {
    id: string;
    action: string;
    detail: string;
    time: string;
    type: "user" | "listing" | "community" | "recruiter";
}

const typeColors: Record<string, string> = {
    user: "bg-blue-500/10 text-blue-400",
    listing: "bg-emerald-500/10 text-emerald-400",
    community: "bg-amber-500/10 text-amber-400",
    recruiter: "bg-purple-500/10 text-purple-400",
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeListings: 0,
        communityPosts: 0,
        pendingRecruiters: 0,
    });
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [extraCounts, setExtraCounts] = useState({ reviews: 0, applications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [dashStats, recentAct, reviewsRes, appsRes] = await Promise.all([
                    fetchDashboardStats(),
                    fetchRecentActivity(8),
                    supabase.from("reviews").select("id", { count: "exact", head: true }),
                    supabase.from("applications").select("id", { count: "exact", head: true }),
                ]);
                setStats(dashStats);
                setActivities(recentAct);
                setExtraCounts({
                    reviews: reviewsRes.count ?? 0,
                    applications: appsRes.count ?? 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: Users },
        { label: "Active Listings", value: stats.activeListings, icon: Briefcase },
        { label: "Community Posts", value: stats.communityPosts, icon: MessageSquare },
        { label: "Pending Recruiters", value: stats.pendingRecruiters, icon: UserCheck },
    ];

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h2>
                <p className="text-white/40 text-sm">Real-time platform metrics from your database.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="card-embossed p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gradient-blue-green mb-1">
                                <AnimatedNumber value={stat.value} />
                            </div>
                            <p className="text-sm text-white/40">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Activity and sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Recent activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="xl:col-span-2 card-embossed p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        </div>
                        <span className="text-xs text-white/30">From database</span>
                    </div>

                    {activities.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No activity yet. Data will appear as users interact with the platform.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.id + index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[activity.type]}`}>
                                        {activity.type === "user" && <Users className="w-3.5 h-3.5" />}
                                        {activity.type === "listing" && <Briefcase className="w-3.5 h-3.5" />}
                                        {activity.type === "community" && <MessageSquare className="w-3.5 h-3.5" />}
                                        {activity.type === "recruiter" && <UserCheck className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/80">{activity.action}</p>
                                        <p className="text-xs text-white/30 truncate">{activity.detail}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-white/20 shrink-0">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-blue-400 transition-colors shrink-0" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Platform Summary sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="card-embossed p-6 space-y-6"
                >
                    <h3 className="text-lg font-semibold text-white">Platform Summary</h3>

                    <div className="space-y-4">
                        {[
                            { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-400" },
                            { label: "Active Listings", value: stats.activeListings.toLocaleString(), icon: Briefcase, color: "text-emerald-400" },
                            { label: "Total Reviews", value: extraCounts.reviews.toLocaleString(), icon: Star, color: "text-amber-400" },
                            { label: "Total Applications", value: extraCounts.applications.toLocaleString(), icon: FileText, color: "text-cyan-400" },
                            { label: "Community Posts", value: stats.communityPosts.toLocaleString(), icon: MessageSquare, color: "text-purple-400" },
                            { label: "Pending Recruiters", value: stats.pendingRecruiters.toLocaleString(), icon: UserCheck, color: "text-amber-400" },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                                        <span className="text-sm text-white/50">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white/80">{item.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
