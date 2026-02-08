"use client";

import React, { useState } from "react";
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
    Plus,
    Save,
} from "lucide-react";

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
}

const mockListings: AdminListing[] = [
    { id: "1", role: "Senior React Developer", company: "TechCorp", location: "San Francisco, CA", salary: "$150k - $200k", type: "Full-time", description: "We're looking for a Senior React Developer to join our growing team and help build cutting-edge web applications.", applications: 23, postedDate: "2024-03-15", isActive: true },
    { id: "2", role: "UI/UX Designer", company: "DesignCo", location: "London, UK", salary: "$90k - $130k", type: "Full-time", description: "Join our design team to create beautiful and intuitive user experiences for our platform.", applications: 18, postedDate: "2024-03-20", isActive: true },
    { id: "3", role: "Backend Engineer", company: "DataFlow", location: "Berlin, DE", salary: "$120k - $160k", type: "Full-time", description: "Build scalable backend systems with Node.js and PostgreSQL for our data analytics platform.", applications: 31, postedDate: "2024-02-28", isActive: true },
    { id: "4", role: "Product Manager", company: "StartupX", location: "Remote", salary: "$130k - $170k", type: "Full-time", description: "Lead product strategy and development for our AI-powered productivity tool.", applications: 45, postedDate: "2024-03-01", isActive: false },
    { id: "5", role: "DevOps Engineer", company: "CloudBase", location: "Toronto, CA", salary: "$110k - $150k", type: "Contract", description: "Help us build and maintain our cloud infrastructure on AWS and Kubernetes.", applications: 12, postedDate: "2024-04-01", isActive: true },
    { id: "6", role: "Freelance Content Writer", company: "MediaHub", location: "Remote", salary: "$50/hr - $80/hr", type: "Freelance", description: "Create engaging content for tech companies including blog posts, case studies, and white papers.", applications: 56, postedDate: "2024-03-25", isActive: true },
    { id: "7", role: "Data Scientist", company: "AnalyticsIQ", location: "New York, NY", salary: "$140k - $180k", type: "Full-time", description: "Apply machine learning techniques to solve business problems with our data science team.", applications: 28, postedDate: "2024-03-18", isActive: false },
    { id: "8", role: "Mobile Developer (iOS)", company: "AppFactory", location: "Singapore", salary: "$100k - $140k", type: "Full-time", description: "Build native iOS applications using Swift and SwiftUI for our mobile-first platform.", applications: 15, postedDate: "2024-04-05", isActive: true },
];

const typeColors: Record<string, string> = {
    "Full-time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Part-time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Contract": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Freelance": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function AdminListingsPage() {
    const [listings, setListings] = useState<AdminListing[]>(mockListings);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [editingListing, setEditingListing] = useState<AdminListing | null>(null);
    const [previewListing, setPreviewListing] = useState<AdminListing | null>(null);

    // Edit form state
    const [editRole, setEditRole] = useState("");
    const [editCompany, setEditCompany] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editSalary, setEditSalary] = useState("");
    const [editType, setEditType] = useState<AdminListing["type"]>("Full-time");
    const [editDescription, setEditDescription] = useState("");

    const filteredListings = listings.filter((listing) => {
        const matchesSearch =
            !searchQuery ||
            listing.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" || listing.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleToggleActive = (listingId: string) => {
        setListings((prev) =>
            prev.map((l) =>
                l.id === listingId ? { ...l, isActive: !l.isActive } : l
            )
        );
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

    const handleSaveEdit = () => {
        if (!editingListing) return;
        setListings((prev) =>
            prev.map((l) =>
                l.id === editingListing.id
                    ? { ...l, role: editRole, company: editCompany, location: editLocation, salary: editSalary, type: editType, description: editDescription }
                    : l
            )
        );
        setEditingListing(null);
    };

    const activeCount = listings.filter((l) => l.isActive).length;
    const totalApplications = listings.reduce((sum, l) => sum + l.applications, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Listing Management</h2>
                    <p className="text-white/40 text-sm">{filteredListings.length} listings &middot; {activeCount} active &middot; {totalApplications} total applications</p>
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search listings by role, company, or location..."
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
                                <span className="flex items-center gap-1 text-xs text-white/30">
                                    <Users className="w-3 h-3" /> {listing.applications} apps
                                </span>

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
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{previewListing.applications} applications</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
                                <p className="text-sm text-white/60 leading-relaxed">{previewListing.description}</p>
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
        </div>
    );
}
