"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    UserCheck,
    UserX,
    Shield,
    MoreHorizontal,
    ChevronDown,
    Mail,
    MapPin,
    CheckCircle,
    XCircle,
    Ban,
    Undo2,
} from "lucide-react";

interface MockUser {
    id: string;
    name: string;
    email: string;
    handle: string;
    avatar: string;
    role: "candidate" | "employer" | "recruiter" | "admin";
    recruiterStatus?: "pending" | "approved" | "rejected";
    recruiterCompany?: string;
    location: string;
    joinedDate: string;
    isBanned: boolean;
}

const mockUsers: MockUser[] = [
    { id: "1", name: "Sarah Chen", email: "sarah@example.com", handle: "@sarahchen", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=3b82f6&color=fff", role: "candidate", location: "San Francisco, CA", joinedDate: "2024-01-15", isBanned: false },
    { id: "2", name: "James Wilson", email: "james@techcorp.com", handle: "@jameswilson", avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=10b981&color=fff", role: "employer", location: "New York, NY", joinedDate: "2024-02-20", isBanned: false },
    { id: "3", name: "Alex Morgan", email: "alex@hireright.com", handle: "@alexmorgan", avatar: "https://ui-avatars.com/api/?name=Alex+Morgan&background=8b5cf6&color=fff", role: "recruiter", recruiterStatus: "pending", recruiterCompany: "HireRight Inc.", location: "London, UK", joinedDate: "2024-03-10", isBanned: false },
    { id: "4", name: "Maya Patel", email: "maya@talentsol.com", handle: "@mayapatel", avatar: "https://ui-avatars.com/api/?name=Maya+Patel&background=f59e0b&color=fff", role: "recruiter", recruiterStatus: "approved", recruiterCompany: "Talent Solutions", location: "Berlin, DE", joinedDate: "2024-01-28", isBanned: false },
    { id: "5", name: "Emily Zhang", email: "emily@example.com", handle: "@emilyzhang", avatar: "https://ui-avatars.com/api/?name=Emily+Zhang&background=ec4899&color=fff", role: "candidate", location: "Toronto, CA", joinedDate: "2024-04-05", isBanned: false },
    { id: "6", name: "David Brown", email: "david@startupx.com", handle: "@davidbrown", avatar: "https://ui-avatars.com/api/?name=David+Brown&background=06b6d4&color=fff", role: "employer", location: "Austin, TX", joinedDate: "2024-03-22", isBanned: true },
    { id: "7", name: "Priya Sharma", email: "priya@recruit.io", handle: "@priyasharma", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=14b8a6&color=fff", role: "recruiter", recruiterStatus: "pending", recruiterCompany: "Recruit.io", location: "Mumbai, IN", joinedDate: "2024-04-12", isBanned: false },
    { id: "8", name: "Liam O'Brien", email: "liam@design.co", handle: "@liamobrien", avatar: "https://ui-avatars.com/api/?name=Liam+OBrien&background=f97316&color=fff", role: "candidate", location: "Dublin, IE", joinedDate: "2024-02-14", isBanned: false },
    { id: "9", name: "Nina Kowalski", email: "nina@example.com", handle: "@ninakowalski", avatar: "https://ui-avatars.com/api/?name=Nina+Kowalski&background=a855f7&color=fff", role: "candidate", location: "Warsaw, PL", joinedDate: "2024-05-01", isBanned: false },
    { id: "10", name: "Carlos Diaz", email: "carlos@recruit.es", handle: "@carlosdiaz", avatar: "https://ui-avatars.com/api/?name=Carlos+Diaz&background=ef4444&color=fff", role: "recruiter", recruiterStatus: "rejected", recruiterCompany: "Recruit ES", location: "Madrid, ES", joinedDate: "2024-04-20", isBanned: false },
];

const roleColors: Record<string, string> = {
    candidate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    employer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    recruiter: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    approved: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<MockUser[]>(mockUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            !searchQuery ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleApproveRecruiter = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, recruiterStatus: "approved" as const } : u
            )
        );
        setActiveMenu(null);
    };

    const handleRejectRecruiter = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, recruiterStatus: "rejected" as const } : u
            )
        );
        setActiveMenu(null);
    };

    const handleToggleBan = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, isBanned: !u.isBanned } : u
            )
        );
        setActiveMenu(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">User Management</h2>
                    <p className="text-white/40 text-sm">{filteredUsers.length} users found</p>
                </div>
            </div>

            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users by name, email, or handle..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white hover:border-white/[0.12] transition-all"
                    >
                        <Filter className="w-4 h-4" />
                        {roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                        {showFilterDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full mt-2 right-0 w-44 bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-1 shadow-2xl z-20"
                            >
                                {["all", "candidate", "employer", "recruiter"].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => { setRoleFilter(role); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            roleFilter === role ? "bg-blue-500/10 text-blue-400" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                    >
                                        {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Users table */}
            <div className="card-embossed overflow-hidden">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-wider">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table body */}
                <div className="divide-y divide-white/[0.04]">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${user.isBanned ? "opacity-50" : ""}`}
                        >
                            {/* User info */}
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-9 h-9 rounded-lg shrink-0"
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                        {user.isBanned && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Banned</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/30">
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="col-span-2 flex items-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${roleColors[user.role]}`}>
                                    {user.role === "recruiter" && <Shield className="w-3 h-3" />}
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex items-center">
                                {user.role === "recruiter" && user.recruiterStatus ? (
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusColors[user.recruiterStatus]}`}>
                                        {user.recruiterStatus === "approved" && <CheckCircle className="w-3 h-3" />}
                                        {user.recruiterStatus === "rejected" && <XCircle className="w-3 h-3" />}
                                        {user.recruiterStatus.charAt(0).toUpperCase() + user.recruiterStatus.slice(1)}
                                    </span>
                                ) : (
                                    <span className="text-xs text-white/20">Active</span>
                                )}
                            </div>

                            {/* Location */}
                            <div className="col-span-2 flex items-center gap-1 text-xs text-white/40">
                                <MapPin className="w-3 h-3" />
                                {user.location}
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end relative">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {activeMenu === user.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-1 w-48 bg-[#0f0f15] border border-white/[0.08] rounded-xl p-1 shadow-2xl z-20"
                                        >
                                            {user.role === "recruiter" && user.recruiterStatus === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveRecruiter(user.id)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/[0.08] transition-colors"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                        Approve Recruiter
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRecruiter(user.id)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                        Reject Recruiter
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleToggleBan(user.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    user.isBanned
                                                        ? "text-emerald-400 hover:bg-emerald-500/[0.08]"
                                                        : "text-red-400 hover:bg-red-500/[0.08]"
                                                }`}
                                            >
                                                {user.isBanned ? (
                                                    <>
                                                        <Undo2 className="w-4 h-4" />
                                                        Unban User
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban className="w-4 h-4" />
                                                        Ban User
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="text-white/30 text-sm">No users found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
