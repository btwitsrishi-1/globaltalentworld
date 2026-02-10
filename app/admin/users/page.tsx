"use client";

import React, { useState, useEffect } from "react";
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
    Trash2,
    CheckSquare,
    Square,
    MinusSquare,
    Users,
    AlertTriangle,
    X,
    Loader2,
    Plus,
    Pencil,
    Save,
} from "lucide-react";
import {
    fetchAdminUsers,
    updateUserBanStatus,
    updateRecruiterStatus,
    deleteUsers as deleteUsersApi,
    updateUserProfile,
    createUser,
} from "@/lib/admin-data";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    handle: string;
    avatar: string;
    role: "candidate" | "employee" | "recruiter" | "admin";
    recruiterStatus?: "pending" | "approved" | "rejected";
    recruiterCompany?: string;
    location: string;
    joinedDate: string;
    isBanned: boolean;
}

const roleColors: Record<string, string> = {
    candidate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    employee: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    recruiter: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const roleLabels: Record<string, string> = {
    candidate: "Candidate",
    employee: "Employee",
    recruiter: "Recruiter",
    admin: "Admin",
};

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    approved: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Edit user modal
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editHandle, setEditHandle] = useState("");
    const [editRole, setEditRole] = useState<string>("candidate");
    const [editSaving, setEditSaving] = useState(false);

    // Create user modal
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createHandle, setCreateHandle] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createRole, setCreateRole] = useState<string>("candidate");
    const [createSaving, setCreateSaving] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchAdminUsers();
                const mapped: AdminUser[] = data.map((u: any) => ({
                    id: u.id,
                    name: u.name || "Unknown",
                    email: u.email || "",
                    handle: u.handle || "",
                    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=3b82f6&color=fff`,
                    role: u.recruiter_status ? "recruiter" : u.role === "employer" ? "employee" : u.role === "employee" ? "employee" : u.role || "candidate",
                    recruiterStatus: u.recruiter_status || undefined,
                    recruiterCompany: u.recruiter_company || undefined,
                    location: u.location || "Not specified",
                    joinedDate: new Date(u.created_at).toLocaleDateString(),
                    isBanned: u.is_banned || false,
                }));
                setUsers(mapped);
            } catch (err) {
                console.error("Failed to load users:", err);
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            !searchQuery ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleApproveRecruiter = async (userId: string) => {
        const success = await updateRecruiterStatus(userId, "approved");
        if (success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, recruiterStatus: "approved" as const } : u
                )
            );
        }
        setActiveMenu(null);
    };

    const handleRejectRecruiter = async (userId: string) => {
        const success = await updateRecruiterStatus(userId, "rejected");
        if (success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, recruiterStatus: "rejected" as const } : u
                )
            );
        }
        setActiveMenu(null);
    };

    const handleToggleBan = async (userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;
        const success = await updateUserBanStatus(userId, !user.isBanned);
        if (success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, isBanned: !u.isBanned } : u
                )
            );
        }
        setActiveMenu(null);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
        }
    };

    const handleDeleteSelected = async () => {
        const success = await deleteUsersApi(Array.from(selectedUsers));
        if (success) {
            setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.id)));
            setSelectedUsers(new Set());
        }
        setShowDeleteConfirm(false);
    };

    // Edit user handlers
    const openEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditHandle(user.handle);
        setEditRole(user.role);
        setActiveMenu(null);
    };

    const handleSaveEdit = async () => {
        if (!editingUser || !editName.trim() || !editEmail.trim() || !editHandle.trim()) return;
        setEditSaving(true);

        // Map "employee" display role back to "employer" for DB storage
        const dbRole = editRole === "employee" ? "employer" : editRole;

        // Build update payload
        const updatePayload: Record<string, unknown> = {
            name: editName.trim(),
            email: editEmail.trim(),
            handle: editHandle.startsWith("@") ? editHandle.trim() : `@${editHandle.trim()}`,
            role: dbRole,
        };

        // When changing to recruiter, set recruiter_status
        if (editRole === "recruiter" && editingUser.role !== "recruiter") {
            updatePayload.recruiter_status = "pending";
        }
        // When changing away from recruiter, clear recruiter fields
        if (editRole !== "recruiter" && editingUser.role === "recruiter") {
            updatePayload.recruiter_status = null;
            updatePayload.recruiter_company = null;
        }

        const success = await updateUserProfile(editingUser.id, updatePayload);
        if (success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === editingUser.id
                        ? {
                            ...u,
                            name: editName.trim(),
                            email: editEmail.trim(),
                            handle: editHandle.startsWith("@") ? editHandle.trim() : `@${editHandle.trim()}`,
                            role: editRole as AdminUser["role"],
                            recruiterStatus: editRole === "recruiter" && editingUser.role !== "recruiter" ? "pending" as const : editRole !== "recruiter" ? undefined : u.recruiterStatus,
                        }
                        : u
                )
            );
            setEditingUser(null);
        }
        setEditSaving(false);
    };

    // Create user handlers
    const openCreateUser = () => {
        setCreateName("");
        setCreateEmail("");
        setCreateHandle("");
        setCreatePassword("");
        setCreateRole("candidate");
        setCreateError("");
        setShowCreateUser(true);
    };

    const handleCreateUser = async () => {
        if (!createName.trim() || !createEmail.trim() || !createHandle.trim() || !createPassword.trim()) return;
        if (createPassword.length < 6) {
            setCreateError("Password must be at least 6 characters.");
            return;
        }
        setCreateSaving(true);
        setCreateError("");

        // Map "employee" display role back to "employer" for DB storage
        const dbRole = createRole === "employee" ? "employer" : createRole;

        const result = await createUser(
            createEmail.trim(),
            createPassword,
            createName.trim(),
            createHandle.trim(),
            dbRole
        );

        if (result.error) {
            setCreateError(result.error);
            setCreateSaving(false);
            return;
        }

        if (result.user) {
            const formattedHandle = createHandle.startsWith("@") ? createHandle.trim() : `@${createHandle.trim()}`;
            const newUser: AdminUser = {
                id: result.user.id,
                name: createName.trim(),
                email: createEmail.trim(),
                handle: formattedHandle,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(createName.trim())}&background=3b82f6&color=fff`,
                role: createRole as AdminUser["role"],
                location: "Not specified",
                joinedDate: new Date().toLocaleDateString(),
                isBanned: false,
            };
            setUsers((prev) => [newUser, ...prev]);
        }

        setShowCreateUser(false);
        setCreateSaving(false);
    };

    const isAllSelected = filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length;
    const isSomeSelected = selectedUsers.size > 0 && selectedUsers.size < filteredUsers.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">User Management</h2>
                    <p className="text-white/40 text-sm">{filteredUsers.length} users found</p>
                </div>
                <button
                    onClick={openCreateUser}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium w-fit"
                >
                    <Plus className="w-4 h-4" />
                    Create User
                </button>
            </div>

            {users.length === 0 && (
                <div className="card-embossed p-16 text-center">
                    <Users className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">No Users Yet</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto mb-6">
                        Create your first user or wait for people to sign up through the platform.
                    </p>
                    <button
                        onClick={openCreateUser}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create First User
                    </button>
                </div>
            )}

            {users.length > 0 && (
                <>
                    {/* Search, filter, and bulk actions bar */}
                    <div className="flex flex-col gap-3">
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
                                            {["all", "candidate", "employee", "recruiter"].map((role) => (
                                                <button
                                                    key={role}
                                                    onClick={() => { setRoleFilter(role); setShowFilterDropdown(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        roleFilter === role ? "bg-blue-500/10 text-blue-400" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                                                    }`}
                                                >
                                                    {role === "all" ? "All Roles" : roleLabels[role] || role}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Bulk action bar */}
                        <AnimatePresence>
                            {selectedUsers.size > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/20"
                                >
                                    <span className="text-sm text-blue-400 font-medium">
                                        {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""} selected
                                    </span>
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => setSelectedUsers(new Set())}
                                        className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
                                    >
                                        Clear Selection
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/[0.1] transition-all font-medium"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete Selected
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Users table */}
                    <div className="card-embossed overflow-visible">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-wider">
                            <div className="col-span-1 flex items-center">
                                <button onClick={toggleSelectAll} className="text-white/30 hover:text-white transition-colors">
                                    {isAllSelected ? (
                                        <CheckSquare className="w-4 h-4 text-blue-400" />
                                    ) : isSomeSelected ? (
                                        <MinusSquare className="w-4 h-4 text-blue-400" />
                                    ) : (
                                        <Square className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <div className="col-span-3">User</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Location</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-white/[0.04]">
                            {filteredUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${user.isBanned ? "opacity-50" : ""} ${selectedUsers.has(user.id) ? "bg-blue-500/[0.04]" : ""}`}
                                >
                                    <div className="hidden md:flex col-span-1 items-center">
                                        <button onClick={() => toggleUserSelection(user.id)} className="text-white/30 hover:text-white transition-colors">
                                            {selectedUsers.has(user.id) ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                                        <button onClick={() => toggleUserSelection(user.id)} className="md:hidden text-white/30 hover:text-white transition-colors shrink-0">
                                            {selectedUsers.has(user.id) ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                                        </button>
                                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg shrink-0" />
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

                                    <div className="col-span-2 flex items-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${roleColors[user.role]}`}>
                                            {user.role === "recruiter" && <Shield className="w-3 h-3" />}
                                            {roleLabels[user.role] || user.role}
                                        </span>
                                    </div>

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

                                    <div className="col-span-2 flex items-center gap-1 text-xs text-white/40">
                                        <MapPin className="w-3 h-3" />
                                        {user.location}
                                    </div>

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
                                                    className={`absolute right-0 w-48 bg-[#0f0f15] border border-white/[0.08] rounded-xl p-1 shadow-2xl z-20 ${
                                                        index >= filteredUsers.length - 2 ? "bottom-full mb-1" : "top-full mt-1"
                                                    }`}
                                                >
                                                    <button onClick={() => openEditUser(user)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-400 hover:bg-blue-500/[0.08] transition-colors">
                                                        <Pencil className="w-4 h-4" /> Edit User
                                                    </button>
                                                    {user.role === "recruiter" && user.recruiterStatus === "pending" && (
                                                        <>
                                                            <button onClick={() => handleApproveRecruiter(user.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/[0.08] transition-colors">
                                                                <UserCheck className="w-4 h-4" /> Approve Recruiter
                                                            </button>
                                                            <button onClick={() => handleRejectRecruiter(user.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors">
                                                                <UserX className="w-4 h-4" /> Reject Recruiter
                                                            </button>
                                                        </>
                                                    )}
                                                    {user.role === "recruiter" && user.recruiterStatus === "approved" && (
                                                        <button onClick={() => handleRejectRecruiter(user.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors">
                                                            <UserX className="w-4 h-4" /> Revoke Recruiter
                                                        </button>
                                                    )}
                                                    {user.role === "recruiter" && user.recruiterStatus === "rejected" && (
                                                        <button onClick={() => handleApproveRecruiter(user.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/[0.08] transition-colors">
                                                            <UserCheck className="w-4 h-4" /> Approve Recruiter
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleToggleBan(user.id)}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${user.isBanned ? "text-emerald-400 hover:bg-emerald-500/[0.08]" : "text-red-400 hover:bg-red-500/[0.08]"}`}
                                                    >
                                                        {user.isBanned ? <><Undo2 className="w-4 h-4" /> Unban User</> : <><Ban className="w-4 h-4" /> Ban User</>}
                                                    </button>
                                                    <button
                                                        onClick={async () => { const success = await deleteUsersApi([user.id]); if (success) setUsers((prev) => prev.filter((u) => u.id !== user.id)); setActiveMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete User
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
                </>
            )}

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card-embossed max-w-lg w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <Pencil className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Edit User</h3>
                                        <p className="text-xs text-white/30">Modify user details and role</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingUser(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Full Name</label>
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Email Address</label>
                                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Handle</label>
                                    <input type="text" value={editHandle} onChange={(e) => setEditHandle(e.target.value)} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Role</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {["candidate", "employee", "recruiter", "admin"].map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setEditRole(role)}
                                                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${editRole === role ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-white/[0.02] text-white/40 border-white/[0.08] hover:border-white/[0.15]"}`}
                                            >
                                                {roleLabels[role] || role}
                                            </button>
                                        ))}
                                    </div>
                                    {editRole === "recruiter" && editingUser?.role !== "recruiter" && (
                                        <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1.5">
                                            <Shield className="w-3 h-3" />
                                            User will be set as pending recruiter. Approve from the actions menu after saving.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">Cancel</button>
                                <button onClick={handleSaveEdit} disabled={editSaving || !editName.trim() || !editEmail.trim() || !editHandle.trim()} className="flex-1 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                    {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create User Modal */}
            <AnimatePresence>
                {showCreateUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateUser(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card-embossed max-w-lg w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Create New User</h3>
                                        <p className="text-xs text-white/30">Add a user to the platform</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCreateUser(false)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {createError && (
                                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/[0.08] border border-red-500/20">
                                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                    <span className="text-sm text-red-400">{createError}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Full Name</label>
                                        <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Handle</label>
                                        <input type="text" value={createHandle} onChange={(e) => setCreateHandle(e.target.value)} placeholder="@johndoe" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Email Address</label>
                                    <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} placeholder="john@example.com" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Password</label>
                                    <input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Role</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {["candidate", "employee", "recruiter", "admin"].map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setCreateRole(role)}
                                                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${createRole === role ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-white/[0.02] text-white/40 border-white/[0.08] hover:border-white/[0.15]"}`}
                                            >
                                                {roleLabels[role] || role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowCreateUser(false)} className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">Cancel</button>
                                <button onClick={handleCreateUser} disabled={createSaving || !createName.trim() || !createEmail.trim() || !createHandle.trim() || !createPassword.trim()} className="flex-1 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                    {createSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Create User
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete confirmation modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card-embossed max-w-md w-full p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
                                    <p className="text-xs text-white/30">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">{selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""}</span>? This will permanently remove their accounts and all associated data.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">Cancel</button>
                                <button onClick={handleDeleteSelected} className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete {selectedUsers.size} User{selectedUsers.size > 1 ? "s" : ""}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
