"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { formatDate, toISODateString } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    DollarSign,
    Briefcase,
    Calendar,
    CheckCircle,
    XCircle,
    Users,
    MessageSquare,
    Send,
    X,
    FileText,
    Globe,
    ExternalLink,
    Loader2,
    Star,
    AlertCircle,
} from "lucide-react";
import type { Application } from "@/lib/types";

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const {
        jobs,
        getApplicationsForJob,
        shortlistApplication,
        rejectApplication,
        addNoteToApplication,
    } = useJobs();

    const listingId = params.listingId as string;
    const job = jobs.find((j) => j.id === listingId);
    const applications = job ? getApplicationsForJob(job.id) : [];

    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [newNote, setNewNote] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "shortlisted" | "rejected">("all");

    // Auth guard: must be a recruiter (approved)
    useEffect(() => {
        if (!authLoading && (!user || user.role !== "recruiter" || user.recruiterStatus !== "approved")) {
            router.push("/careers");
        }
    }, [user, authLoading, router]);

    // Keep selectedApplication in sync
    useEffect(() => {
        if (selectedApplication) {
            const updated = applications.find((app) => app.id === selectedApplication.id);
            if (updated) {
                setSelectedApplication(updated);
            }
        }
    }, [applications, selectedApplication?.id]);

    // ESC key handler for modal
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedApplication(null);
            }
        },
        []
    );

    useEffect(() => {
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [handleEscape]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedApplication) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedApplication]);

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

    if (!job) {
        return (
            <main className="min-h-screen bg-[#060608] text-white flex flex-col">
                <CustomCursor />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
                        <p className="text-slate-400 mb-6">
                            This listing may have been removed or does not exist.
                        </p>
                        <Link
                            href="/recruiter"
                            className="btn-embossed-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const filteredApplications =
        filterStatus === "all"
            ? applications
            : applications.filter((app) => app.status === filterStatus);

    const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        shortlisted: applications.filter((app) => app.status === "shortlisted").length,
        rejected: applications.filter((app) => app.status === "rejected").length,
    };

    const handleAddNote = () => {
        if (!selectedApplication || !newNote.trim()) return;

        const authorId = user?.id || user?.email || "recruiter";
        const authorName = user?.name || "Recruiter";

        addNoteToApplication(selectedApplication.id, newNote, authorId, authorName);
        setNewNote("");
    };

    const handleViewCV = (cvName: string) => {
        window.open(`#cv-${cvName}`, "_blank");
    };

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
                    {/* Back Link */}
                    <Link
                        href="/recruiter"
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    {/* Job Details Card */}
                    <div className="card-embossed p-8">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    {job.role}
                                </h1>
                                <p className="text-xl text-blue-400 mb-4">{job.company}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                        {job.salary}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                        {job.type}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <time dateTime={toISODateString(job.postedDate)}>
                                            Posted {formatDate(job.postedDate)}
                                        </time>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {job.description && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h2 className="text-lg font-semibold text-white mb-3">About the Role</h2>
                                <p className="text-slate-300 leading-relaxed">{job.description}</p>
                            </div>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h2 className="text-lg font-semibold text-white mb-3">Requirements</h2>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-300 text-sm">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h2 className="text-lg font-semibold text-white mb-3">Benefits</h2>
                                <ul className="space-y-2">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Star className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-300 text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Applications Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                                <Users className="w-6 h-6 text-blue-400" />
                                Applications
                                <span className="text-sm font-normal text-slate-400">
                                    ({applications.length} total)
                                </span>
                            </h2>
                        </div>

                        {/* Application Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="card-embossed p-4 text-center">
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-xs text-slate-400">Total</p>
                            </div>
                            <div className="card-embossed p-4 text-center border-yellow-500/20">
                                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                                <p className="text-xs text-slate-400">Pending</p>
                            </div>
                            <div className="card-embossed p-4 text-center border-emerald-500/20">
                                <p className="text-2xl font-bold text-emerald-400">{stats.shortlisted}</p>
                                <p className="text-xs text-slate-400">Shortlisted</p>
                            </div>
                            <div className="card-embossed p-4 text-center border-red-500/20">
                                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                                <p className="text-xs text-slate-400">Rejected</p>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Application filters">
                            {(["all", "pending", "shortlisted", "rejected"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterStatus(tab)}
                                    role="tab"
                                    aria-selected={filterStatus === tab}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                        filterStatus === tab
                                            ? "btn-embossed-primary text-white"
                                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Applications List */}
                        <div className="space-y-4" role="tabpanel">
                            {filteredApplications.length === 0 ? (
                                <div className="card-embossed p-12 text-center">
                                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        No applications
                                    </h3>
                                    <p className="text-slate-400">
                                        {filterStatus === "all"
                                            ? "No one has applied to this listing yet."
                                            : `No ${filterStatus} applications for this listing.`}
                                    </p>
                                </div>
                            ) : (
                                filteredApplications.map((application) => (
                                    <motion.div
                                        key={application.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="card-embossed p-6 hover:border-blue-500/20 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Candidate Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                                        {application.candidateAvatar ? (
                                                            <Image
                                                                src={application.candidateAvatar}
                                                                alt={application.candidateName}
                                                                width={48}
                                                                height={48}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-lg font-bold text-white">
                                                                {application.candidateName.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-white mb-0.5">
                                                            {application.candidateName}
                                                        </h3>
                                                        <p className="text-sm text-blue-400 mb-1">
                                                            {application.candidateHandle}
                                                        </p>
                                                        <p className="text-sm text-slate-400">
                                                            {application.candidateEmail}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                                            application.status === "shortlisted"
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : application.status === "rejected"
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                    >
                                                        {application.status.charAt(0).toUpperCase() +
                                                            application.status.slice(1)}
                                                    </span>
                                                </div>

                                                {/* Bio */}
                                                {application.candidateBio && (
                                                    <p className="text-sm text-slate-300 mb-3">
                                                        {application.candidateBio}
                                                    </p>
                                                )}

                                                {/* Meta */}
                                                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                                    {application.candidateLocation && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {application.candidateLocation}
                                                        </span>
                                                    )}
                                                    {application.candidateWebsite && (
                                                        <a
                                                            href={application.candidateWebsite}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                                        >
                                                            <Globe className="w-3 h-3" />
                                                            Website
                                                        </a>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <time dateTime={toISODateString(application.appliedDate)}>
                                                            Applied {formatDate(application.appliedDate)}
                                                        </time>
                                                    </span>
                                                    {application.notes && application.notes.length > 0 && (
                                                        <span className="flex items-center gap-1 text-blue-400">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {application.notes.length} note
                                                            {application.notes.length !== 1 ? "s" : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => setSelectedApplication(application)}
                                                    className="btn-embossed-primary flex-1 sm:flex-initial px-4 py-2 rounded-xl text-white text-sm flex items-center justify-center gap-2"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Details</span>
                                                </button>
                                                {application.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                shortlistApplication(application.id)
                                                            }
                                                            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="hidden sm:inline">
                                                                Shortlist
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                rejectApplication(application.id)
                                                            }
                                                            className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="hidden sm:inline">
                                                                Reject
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                                {application.candidateCV && (
                                                    <button
                                                        onClick={() =>
                                                            handleViewCV(application.candidateCV!)
                                                        }
                                                        className="flex-1 sm:flex-initial px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        <span className="hidden sm:inline">CV</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Application Details Modal */}
            <AnimatePresence>
                {selectedApplication && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#060608]/60 backdrop-blur-sm z-50"
                            onClick={() => setSelectedApplication(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-4 sm:inset-10 z-50 overflow-auto"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="details-modal-title"
                        >
                            <div className="min-h-full flex items-center justify-center p-4">
                                <div className="bg-[#0a0a0f] border border-blue-500/20 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2
                                                id="details-modal-title"
                                                className="text-2xl font-semibold text-white mb-1"
                                            >
                                                {selectedApplication.candidateName}
                                            </h2>
                                            <p className="text-sm text-blue-400">
                                                {selectedApplication.candidateHandle}
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {selectedApplication.candidateEmail}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedApplication(null)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            aria-label="Close details"
                                        >
                                            <X className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-6">
                                        <span
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                                selectedApplication.status === "shortlisted"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : selectedApplication.status === "rejected"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                        >
                                            {selectedApplication.status.charAt(0).toUpperCase() +
                                                selectedApplication.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Candidate Details */}
                                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400">
                                        {selectedApplication.candidateLocation && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {selectedApplication.candidateLocation}
                                            </span>
                                        )}
                                        {selectedApplication.candidateWebsite && (
                                            <a
                                                href={selectedApplication.candidateWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Website
                                            </a>
                                        )}
                                        {selectedApplication.candidateCV && (
                                            <button
                                                onClick={() =>
                                                    handleViewCV(selectedApplication.candidateCV!)
                                                }
                                                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                {selectedApplication.candidateCV}
                                            </button>
                                        )}
                                    </div>

                                    {selectedApplication.candidateBio && (
                                        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                                            {selectedApplication.candidateBio}
                                        </p>
                                    )}

                                    {/* Applied Date */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                                        <p className="text-xs text-slate-500 mb-1">Applied:</p>
                                        <time
                                            dateTime={toISODateString(selectedApplication.appliedDate)}
                                            className="text-sm text-white"
                                        >
                                            {formatDate(selectedApplication.appliedDate)}
                                        </time>
                                    </div>

                                    {/* Actions */}
                                    {selectedApplication.status === "pending" && (
                                        <div className="flex gap-3 mb-6">
                                            <button
                                                onClick={() =>
                                                    shortlistApplication(selectedApplication.id)
                                                }
                                                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Shortlist
                                            </button>
                                            <button
                                                onClick={() =>
                                                    rejectApplication(selectedApplication.id)
                                                }
                                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {/* Notes Section */}
                                    <div className="space-y-4 border-t border-white/10 pt-6">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-blue-400" />
                                            Notes
                                        </h3>

                                        {/* Existing Notes */}
                                        {selectedApplication.notes &&
                                        selectedApplication.notes.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedApplication.notes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-white">
                                                                {note.authorName}
                                                            </span>
                                                            <time
                                                                dateTime={toISODateString(note.createdAt)}
                                                                className="text-xs text-slate-500"
                                                            >
                                                                {formatDate(note.createdAt)}
                                                            </time>
                                                        </div>
                                                        <p className="text-sm text-slate-300">
                                                            {note.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500">
                                                No notes yet. Add one below.
                                            </p>
                                        )}

                                        {/* Add Note */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" && handleAddNote()
                                                }
                                                placeholder="Add a note about this applicant..."
                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={handleAddNote}
                                                disabled={!newNote.trim()}
                                                className="btn-embossed-primary px-4 py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Add note"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
