"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Briefcase,
    MessageSquare,
    UserCheck,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Clock,
} from "lucide-react";

interface StatCard {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    change: string;
    changePositive: boolean;
}

interface RecentActivity {
    id: string;
    action: string;
    detail: string;
    time: string;
    type: "user" | "listing" | "community" | "recruiter";
}

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

const stats: StatCard[] = [
    { label: "Total Users", value: 12847, icon: Users, change: "+12.5%", changePositive: true },
    { label: "Active Listings", value: 3426, icon: Briefcase, change: "+8.2%", changePositive: true },
    { label: "Community Posts", value: 28934, icon: MessageSquare, change: "+23.1%", changePositive: true },
    { label: "Pending Recruiter Apps", value: 47, icon: UserCheck, change: "-5.3%", changePositive: false },
];

const recentActivities: RecentActivity[] = [
    { id: "1", action: "New user registered", detail: "Sarah Chen joined as a candidate", time: "2 min ago", type: "user" },
    { id: "2", action: "Listing published", detail: "Senior React Developer at TechCorp", time: "15 min ago", type: "listing" },
    { id: "3", action: "Recruiter application", detail: "Alex Morgan from HireRight Inc.", time: "32 min ago", type: "recruiter" },
    { id: "4", action: "Community post flagged", detail: "Post #2847 flagged for review", time: "1 hour ago", type: "community" },
    { id: "5", action: "New user registered", detail: "James Wilson joined as employer", time: "1 hour ago", type: "user" },
    { id: "6", action: "Listing expired", detail: "UI/UX Designer at DesignCo", time: "2 hours ago", type: "listing" },
    { id: "7", action: "Recruiter approved", detail: "Maya Patel approved for Talent Solutions", time: "3 hours ago", type: "recruiter" },
    { id: "8", action: "New user registered", detail: "Emily Zhang joined as a candidate", time: "4 hours ago", type: "user" },
];

const typeColors: Record<string, string> = {
    user: "bg-blue-500/10 text-blue-400",
    listing: "bg-emerald-500/10 text-emerald-400",
    community: "bg-amber-500/10 text-amber-400",
    recruiter: "bg-purple-500/10 text-purple-400",
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h2>
                <p className="text-white/40 text-sm">Monitor your platform performance and key metrics.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
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
                                <div className={`flex items-center gap-1 text-xs font-medium ${stat.changePositive ? "text-emerald-400" : "text-red-400"}`}>
                                    <TrendingUp className={`w-3 h-3 ${!stat.changePositive ? "rotate-180" : ""}`} />
                                    {stat.change}
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

            {/* Activity and chart section */}
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
                        <span className="text-xs text-white/30">Live feed</span>
                    </div>

                    <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
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
                </motion.div>

                {/* Quick stats sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="card-embossed p-6 space-y-6"
                >
                    <h3 className="text-lg font-semibold text-white">Platform Health</h3>

                    {/* Health indicators */}
                    <div className="space-y-4">
                        {[
                            { label: "Server Uptime", value: "99.9%", color: "bg-emerald-400" },
                            { label: "Avg Response Time", value: "142ms", color: "bg-blue-400" },
                            { label: "Active Sessions", value: "1,247", color: "bg-cyan-400" },
                            { label: "Error Rate", value: "0.02%", color: "bg-emerald-400" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                    <span className="text-sm text-white/50">{item.label}</span>
                                </div>
                                <span className="text-sm font-medium text-white/80">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/[0.06] pt-4">
                        <h4 className="text-sm font-medium text-white/60 mb-3">Top Locations</h4>
                        <div className="space-y-2">
                            {[
                                { city: "San Francisco", count: 2341 },
                                { city: "London", count: 1876 },
                                { city: "Berlin", count: 1245 },
                                { city: "Singapore", count: 987 },
                                { city: "Toronto", count: 856 },
                            ].map((location) => (
                                <div key={location.city} className="flex items-center justify-between">
                                    <span className="text-xs text-white/40">{location.city}</span>
                                    <span className="text-xs font-medium text-blue-400">{location.count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
