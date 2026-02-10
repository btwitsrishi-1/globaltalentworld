"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Briefcase,
    MapPin,
    DollarSign,
    Users,
    ToggleLeft,
    ToggleRight,
    Eye,
    Pencil,
    X,
    Clock,
    Building2,
    Filter,
    ChevronDown,
    Save,
    FileText,
    User,
    ChevronRight,
    ExternalLink,
    Trash2,
    Loader2,
} from "lucide-react";
import { fetchAdminListings, fetchListingApplicants, updateJob, deleteJob as deleteJobApi, updateApplicationStatus } from "@/lib/admin-data";

interface Applicant {
    id: string;
    name: string;
    email: string;
    handle: string;
    avatar: string;
    cv?: string;
    location?: string;
    appliedDate: string;
    status: "pending" | "shortlisted" | "rejected";
}

interface AdminListing {
    id: string;
    role: string;
    company: string;
    location: string;
    salary: string;
    type: "Full-time" | "Part-time" | "Contract" | "Freelance";
    description: string;
    applications: number;
    postedDate: string;
    isActive: boolean;
    createdBy: {
        name: string;
        email: string;
        avatar: string;
        handle: string;
    };
    applicants: Applicant[];
}

const typeColors: Record<string, string> = {
    "Full-time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Part-time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Contract": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Freelance": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    shortlisted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminListingsPage() {
    const [listings, setListings] = useState<AdminListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [editingListing, setEditingListing] = useState<AdminListing | null>(null);
    const [previewListing, setPreviewListing] = useState<AdminListing | null>(null);
    const [viewingApplicants, setViewingApplicants] = useState<AdminListing | null>(null);
    const [viewingResume, setViewingResume] = useState<Applicant | null>(null);

    // Edit form state
    const [editRole, setEditRole] = useState("");
    const [editCompany, setEditCompany] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editSalary, setEditSalary] = useState("");
    const [editType, setEditType] = useState<AdminListing["type"]>("Full-time");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        async function loadListings() {
            try {
                const data = await fetchAdminListings();
                const mapped: AdminListing[] = data.map((j: any) => ({
                    id: j.id,
                    role: j.role,
                    company: j.company,
                    location: j.location,
                    salary: j.salary,
                    type: j.type,
                    description: j.description || "",
                    applications: 0, // Will be filled when viewing applicants
                    postedDate: new Date(j.posted_date || j.created_at).toLocaleDateString(),
                    isActive: j.is_active ?? true,
                    createdBy: {
                        name: j.employer?.name || "Unknown",
                        email: j.employer?.email || "",
                        avatar: j.employer?.avatar || `https://ui-avatars.com/api/?name=U&background=3b82f6&color=fff`,
                        handle: j.employer?.handle || "",
                    },
                    applicants: [], // Loaded on demand
                }));
                setListings(mapped);
            } catch (err) {
                console.error("Failed to load listings:", err);
            } finally {
                setLoading(false);
            }
        }
        loadListings();
    }, []);

    const filteredListings = listings.filter((listing) => {
        const matchesSearch =
            !searchQuery ||
            listing.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" || listing.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleToggleActive = async (listingId: string) => {
        const listing = listings.find((l) => l.id === listingId);
        if (!listing) return;
        const success = await updateJob(listingId, { is_active: !listing.isActive });
        if (success) {
            setListings((prev) =>
                prev.map((l) =>
                    l.id === listingId ? { ...l, isActive: !l.isActive } : l
                )
            );
        }
    };

    const handleDeleteListing = async (listingId: string) => {
        const success = await deleteJobApi(listingId);
        if (success) {
            setListings((prev) => prev.filter((l) => l.id !== listingId));
            if (previewListing?.id === listingId) setPreviewListing(null);
        }
    };

    const openEdit = (listing: AdminListing) => {
        setEditingListing(listing);
        setEditRole(listing.role);
        setEditCompany(listing.company);
        setEditLocation(listing.location);
        setEditSalary(listing.salary);
        setEditType(listing.type);
        setEditDescription(listing.description);
    };

    const handleSaveEdit = async () => {
        if (!editingListing) return;
        const success = await updateJob(editingListing.id, {
            role: editRole,
            company: editCompany,
            location: editLocation,
            salary: editSalary,
            type: editType,
            description: editDescription,
        });
        if (success) {
            setListings((prev) =>
                prev.map((l) =>
                    l.id === editingListing.id
                        ? { ...l, role: editRole, company: editCompany, location: editLocation, salary: editSalary, type: editType, description: editDescription }
                        : l
                )
            );
        }
        setEditingListing(null);
    };

    const handleViewApplicants = async (listing: AdminListing) => {
        const appData = await fetchListingApplicants(listing.id);
        const mappedApplicants: Applicant[] = appData.map((a: any) => ({
            id: a.id,
            name: a.candidate?.name || "Unknown",
            email: a.candidate?.email || "",
            handle: a.candidate?.handle || "",
            avatar: a.candidate?.avatar || `https://ui-avatars.com/api/?name=U&background=3b82f6&color=fff`,
            cv: a.candidate?.cv || undefined,
            location: a.candidate?.location || undefined,
            appliedDate: new Date(a.applied_date || a.created_at).toLocaleDateString(),
            status: a.status || "pending",
        }));
        const updatedListing = { ...listing, applicants: mappedApplicants };
        setViewingApplicants(updatedListing);
        // Also update the listing in the array
        setListings((prev) =>
            prev.map((l) =>
                l.id === listing.id ? { ...l, applicants: mappedApplicants, applications: mappedApplicants.length } : l
            )
        );
    };

    const handleUpdateApplicantStatus = async (listingId: string, applicantId: string, newStatus: Applicant["status"]) => {
        const success = await updateApplicationStatus(applicantId, newStatus);
        if (success) {
            setListings((prev) =>
                prev.map((l) =>
                    l.id === listingId
                        ? { ...l, applicants: l.applicants.map((a) => a.id === applicantId ? { ...a, status: newStatus } : a) }
                        : l
                )
            );
            if (viewingApplicants?.id === listingId) {
                setViewingApplicants((prev) =>
                    prev ? { ...prev, applicants: prev.applicants.map((a) => a.id === applicantId ? { ...a, status: newStatus } : a) } : null
                );
            }
        }
    };

    const activeCount = listings.filter((l) => l.isActive).length;
    const totalApplications = listings.reduce((sum, l) => sum + l.applications, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Listing Management</h2>
                    <p className="text-white/40 text-sm">
                        {filteredListings.length} listings &middot; {activeCount} active &middot; {totalApplications} total applications
                    </p>
                </div>
            </div>

            {listings.length === 0 && (
                <div className="card-embossed p-16 text-center">
                    <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">No Listings Yet</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto">
                        Job listings will appear here when recruiters post them through the platform. You&apos;ll be able to see who created each listing, view all applicants, and access their resumes.
                    </p>
                </div>
            )}

            {listings.length > 0 && (
                <>
                    {/* Search and filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by role, company, location, or creator..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white transition-all"
                            >
                                <Filter className="w-4 h-4" />
                                {typeFilter === "all" ? "All Types" : typeFilter}
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
                                        {["all", "Full-time", "Part-time", "Contract", "Freelance"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => { setTypeFilter(type); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    typeFilter === type ? "bg-blue-500/10 text-blue-400" : "text-white/60 hover:bg-white/[0.04]"
                                                }`}
                                            >
                                                {type === "all" ? "All Types" : type}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Listings grid */}
                    <div className="space-y-3">
                        {filteredListings.map((listing, index) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className={`card-embossed p-5 ${!listing.isActive ? "opacity-50" : ""}`}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Top row: listing info + actions */}
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Listing info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-semibold text-white truncate">{listing.role}</h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/30">
                                                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{listing.company}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location}</span>
                                                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{listing.salary}</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{listing.postedDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta and actions */}
                                        <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${typeColors[listing.type]}`}>
                                                {listing.type}
                                            </span>

                                            {/* View applicants */}
                                            <button
                                                onClick={() => handleViewApplicants(listing)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-cyan-400 hover:bg-cyan-500/[0.06] transition-all"
                                            >
                                                <Users className="w-3.5 h-3.5" />
                                                {listing.applicants.length} applicants
                                            </button>

                                            {/* Toggle active */}
                                            <button
                                                onClick={() => handleToggleActive(listing.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                                    listing.isActive
                                                        ? "text-emerald-400 hover:bg-emerald-500/[0.08]"
                                                        : "text-white/30 hover:bg-white/[0.04]"
                                                }`}
                                            >
                                                {listing.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                {listing.isActive ? "Active" : "Inactive"}
                                            </button>

                                            {/* Preview */}
                                            <button
                                                onClick={() => setPreviewListing(listing)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => openEdit(listing)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDeleteListing(listing.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Created by row */}
                                    <div className="flex items-center gap-2 pl-13 ml-[52px] border-t border-white/[0.04] pt-3">
                                        <span className="text-[11px] text-white/20 uppercase tracking-wider">Created by</span>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={listing.createdBy.avatar}
                                                alt={listing.createdBy.name}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span className="text-xs text-white/50">{listing.createdBy.name}</span>
                                            <span className="text-xs text-white/20">{listing.createdBy.handle}</span>
                                            <span className="text-xs text-white/20">&middot; {listing.createdBy.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredListings.length === 0 && (
                        <div className="card-embossed p-16 text-center">
                            <Briefcase className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No listings found matching your criteria.</p>
                        </div>
                    )}
                </>
            )}

            {/* Edit modal */}
            <AnimatePresence>
                {editingListing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingListing(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Edit Listing</h3>
                                <button
                                    onClick={() => setEditingListing(null)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Role Title</label>
                                    <input
                                        type="text"
                                        value={editRole}
                                        onChange={(e) => setEditRole(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            value={editCompany}
                                            onChange={(e) => setEditCompany(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Location</label>
                                        <input
                                            type="text"
                                            value={editLocation}
                                            onChange={(e) => setEditLocation(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Salary</label>
                                        <input
                                            type="text"
                                            value={editSalary}
                                            onChange={(e) => setEditSalary(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/40 mb-1.5">Type</label>
                                        <select
                                            value={editType}
                                            onChange={(e) => setEditType(e.target.value as AdminListing["type"])}
                                            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                                        >
                                            <option value="Full-time" className="bg-[#0a0a0f]">Full-time</option>
                                            <option value="Part-time" className="bg-[#0a0a0f]">Part-time</option>
                                            <option value="Contract" className="bg-[#0a0a0f]">Contract</option>
                                            <option value="Freelance" className="bg-[#0a0a0f]">Freelance</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Description</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setEditingListing(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview modal */}
            <AnimatePresence>
                {previewListing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewListing(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-lg w-full p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{previewListing.role}</h3>
                                    <p className="text-sm text-white/40 mt-1">{previewListing.company}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${typeColors[previewListing.type]}`}>
                                    {previewListing.type}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4 text-xs text-white/40">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{previewListing.location}</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{previewListing.salary}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{previewListing.applicants.length} applicants</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
                                <p className="text-sm text-white/60 leading-relaxed">{previewListing.description}</p>
                            </div>

                            {/* Created by */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
                                <img src={previewListing.createdBy.avatar} alt="" className="w-8 h-8 rounded-lg" />
                                <div>
                                    <p className="text-xs font-medium text-white/70">Created by {previewListing.createdBy.name}</p>
                                    <p className="text-[11px] text-white/30">{previewListing.createdBy.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-white/20 mb-4">
                                <Clock className="w-3 h-3" />
                                Posted: {previewListing.postedDate}
                                <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-medium ${previewListing.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                    {previewListing.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <button
                                onClick={() => setPreviewListing(null)}
                                className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                            >
                                Close Preview
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Applicants modal */}
            <AnimatePresence>
                {viewingApplicants && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingApplicants(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Applicants</h3>
                                    <p className="text-xs text-white/30 mt-1">{viewingApplicants.role} at {viewingApplicants.company} &middot; {viewingApplicants.applicants.length} applicants</p>
                                </div>
                                <button
                                    onClick={() => setViewingApplicants(null)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {viewingApplicants.applicants.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                    <p className="text-white/30 text-sm">No applicants yet for this listing.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {viewingApplicants.applicants.map((applicant) => (
                                        <div
                                            key={applicant.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <img src={applicant.avatar} alt="" className="w-9 h-9 rounded-lg shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{applicant.name}</p>
                                                    <p className="text-xs text-white/30 truncate">{applicant.email}</p>
                                                    {applicant.location && (
                                                        <p className="text-xs text-white/20 flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-2.5 h-2.5" />{applicant.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:shrink-0">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-medium border ${statusColors[applicant.status]}`}>
                                                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                                                </span>

                                                {/* Status change buttons */}
                                                {applicant.status !== "shortlisted" && (
                                                    <button
                                                        onClick={() => handleUpdateApplicantStatus(viewingApplicants.id, applicant.id, "shortlisted")}
                                                        className="px-2 py-1 rounded-lg text-[11px] text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/[0.08] transition-all"
                                                    >
                                                        Shortlist
                                                    </button>
                                                )}
                                                {applicant.status !== "rejected" && (
                                                    <button
                                                        onClick={() => handleUpdateApplicantStatus(viewingApplicants.id, applicant.id, "rejected")}
                                                        className="px-2 py-1 rounded-lg text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                )}

                                                {/* View resume */}
                                                {applicant.cv && (
                                                    <button
                                                        onClick={() => setViewingResume(applicant)}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-blue-400/60 hover:text-blue-400 hover:bg-blue-500/[0.08] transition-all"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Resume
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resume viewer modal */}
            <AnimatePresence>
                {viewingResume && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={() => setViewingResume(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card-embossed max-w-lg w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <img src={viewingResume.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{viewingResume.name}</h3>
                                        <p className="text-xs text-white/30">{viewingResume.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingResume(null)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium text-white/70">Resume / CV</span>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed break-all">{viewingResume.cv}</p>
                            </div>

                            {viewingResume.cv && (viewingResume.cv.startsWith("http://") || viewingResume.cv.startsWith("https://")) && (
                                <a
                                    href={viewingResume.cv}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl btn-embossed-primary text-sm text-white font-medium mb-3"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open Resume Link
                                </a>
                            )}

                            <button
                                onClick={() => setViewingResume(null)}
                                className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
