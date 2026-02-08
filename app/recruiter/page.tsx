"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { formatDate, toISODateString } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Plus,
    MapPin,
    DollarSign,
    Calendar,
    Users,
    Share2,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Eye,
    Loader2,
    ShieldCheck,
    FolderOpen,
    Inbox,
} from "lucide-react";
import type { Job, ListingAccessRequest } from "@/lib/types";

export default function RecruiterDashboard() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const {
        getJobsByEmployer,
        getSharedListings,
        getAccessRequests,
        approveAccessRequest,
        rejectAccessRequest,
        deleteJob,
    } = useJobs();

    const [activeTab, setActiveTab] = useState<"listings" | "shared" | "requests">("listings");
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    // Auth guard: must be approved recruiter
    useEffect(() => {
        if (!authLoading && (!user || user.role !== "recruiter" || user.recruiterStatus !== "approved")) {
            router.push("/careers");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <main className="min-h-screen bg-[#060608] text-white flex flex-col">
                <CustomCursor />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <Footer />
            </main>
        );
    }

    if (!user || user.role !== "recruiter" || user.recruiterStatus !== "approved") {
        return null;
    }

    const myListings: Job[] = getJobsByEmployer(user.id || "");
    const sharedListings: Job[] = getSharedListings(user.id || "");
    const accessRequests: ListingAccessRequest[] = getAccessRequests(user.id || "");
    const pendingRequests = accessRequests.filter((r) => r.status === "pending");

    const handleDeleteJob = (jobId: string) => {
        setDeletingJobId(jobId);
        setTimeout(() => {
            deleteJob(jobId);
            setDeletingJobId(null);
        }, 300);
    };

    const tabs = [
        { id: "listings" as const, label: "My Listings", icon: Briefcase, count: myListings.length },
        { id: "shared" as const, label: "Shared Listings", icon: Share2, count: sharedListings.length },
        { id: "requests" as const, label: "Access Requests", icon: Inbox, count: pendingRequests.length },
    ];

    return (
        <main className="min-h-screen bg-[#060608] text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="w-6 h-6 text-blue-400" />
                                <span className="text-sm text-blue-400 font-medium">Approved Recruiter</span>
                            </div>
                            <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">
                                Recruiter Dashboard
                            </h1>
                            <p className="text-slate-400">
                                Manage your job listings, shared access, and incoming requests
                            </p>
                        </div>
                        <Link
                            href="/recruiter/create"
                            className="btn-embossed-primary px-6 py-3 rounded-xl text-white flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Listing
                        </Link>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="card-embossed p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-slate-400">My Listings</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{myListings.length}</p>
                        </div>
                        <div className="card-embossed p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Share2 className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm text-slate-400">Shared With Me</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{sharedListings.length}</p>
                        </div>
                        <div className="card-embossed p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm text-slate-400">Pending Requests</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{pendingRequests.length}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Recruiter sections">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "btn-embossed-primary text-white"
                                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span
                                        className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                                            activeTab === tab.id
                                                ? "bg-white/20 text-white"
                                                : "bg-blue-500/20 text-blue-400"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {/* My Listings Tab */}
                        {activeTab === "listings" && (
                            <motion.div
                                key="listings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                role="tabpanel"
                            >
                                {myListings.length === 0 ? (
                                    <div className="card-embossed p-12 text-center">
                                        <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            No listings yet
                                        </h3>
                                        <p className="text-slate-400 mb-6">
                                            Create your first job listing to start receiving applications.
                                        </p>
                                        <Link
                                            href="/recruiter/create"
                                            className="btn-embossed-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Create Your First Listing
                                        </Link>
                                    </div>
                                ) : (
                                    myListings.map((job) => (
                                        <motion.div
                                            key={job.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: deletingJobId === job.id ? 0.5 : 1 }}
                                            className="card-embossed p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white mb-1">
                                                        {job.role}
                                                    </h3>
                                                    <p className="text-blue-400 text-sm mb-3">{job.company}</p>
                                                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3" />
                                                            {job.salary}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            {job.type}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <time dateTime={toISODateString(job.postedDate)}>
                                                                {formatDate(job.postedDate)}
                                                            </time>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/recruiter/listings/${job.id}`}
                                                        className="btn-embossed-primary px-4 py-2 rounded-xl text-white text-sm flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-xl transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* Shared Listings Tab */}
                        {activeTab === "shared" && (
                            <motion.div
                                key="shared"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                role="tabpanel"
                            >
                                {sharedListings.length === 0 ? (
                                    <div className="card-embossed p-12 text-center">
                                        <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            No shared listings
                                        </h3>
                                        <p className="text-slate-400">
                                            Listings shared with you by other recruiters will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    sharedListings.map((job) => (
                                        <motion.div
                                            key={job.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="card-embossed p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {job.role}
                                                        </h3>
                                                        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                                                            Shared
                                                        </span>
                                                    </div>
                                                    <p className="text-blue-400 text-sm mb-3">{job.company}</p>
                                                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3" />
                                                            {job.salary}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            {job.type}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <time dateTime={toISODateString(job.postedDate)}>
                                                                {formatDate(job.postedDate)}
                                                            </time>
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/recruiter/listings/${job.id}`}
                                                    className="btn-embossed-primary px-4 py-2 rounded-xl text-white text-sm flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* Access Requests Tab */}
                        {activeTab === "requests" && (
                            <motion.div
                                key="requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                                role="tabpanel"
                            >
                                {accessRequests.length === 0 ? (
                                    <div className="card-embossed p-12 text-center">
                                        <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            No access requests
                                        </h3>
                                        <p className="text-slate-400">
                                            When other recruiters request access to your listings, they will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    accessRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="card-embossed p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                                            <Users className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-semibold">
                                                                {request.requesterName}
                                                            </h3>
                                                            <p className="text-xs text-slate-400">
                                                                Requested access to listing{" "}
                                                                <span className="text-blue-400">
                                                                    {request.listingId}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar className="w-3 h-3" />
                                                        <time dateTime={toISODateString(request.requestedAt)}>
                                                            {formatDate(request.requestedAt)}
                                                        </time>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {request.status === "pending" ? (
                                                        <>
                                                            <button
                                                                onClick={() => approveAccessRequest(request.id)}
                                                                className="btn-embossed-primary px-4 py-2 rounded-xl text-white text-sm flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => rejectAccessRequest(request.id)}
                                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-xl transition-colors flex items-center gap-2"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                                                request.status === "approved"
                                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                                    : "bg-red-500/20 text-red-400"
                                                            }`}
                                                        >
                                                            {request.status === "approved" ? "Approved" : "Rejected"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
