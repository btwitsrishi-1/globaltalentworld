"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { formatDate, toISODateString } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    CheckCircle,
    XCircle,
    FileText,
    MapPin,
    Globe,
    Calendar,
    MessageSquare,
    Send,
    X,
    ExternalLink,
} from "lucide-react";
import Image from "next/image";
import type { Application } from "@/lib/types";

export default function EmployerDashboard() {
    const { user } = useAuth();
    const { jobs, applications, shortlistApplication, rejectApplication, addNoteToApplication } =
        useJobs();

    const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "shortlisted" | "rejected">(
        "all"
    );
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [newNote, setNewNote] = useState("");

    // Filter applications based on selected tab
    const filteredApplications =
        selectedTab === "all"
            ? applications
            : applications.filter((app) => app.status === selectedTab);

    // Keep selectedApplication in sync with the applications state
    useEffect(() => {
        if (selectedApplication) {
            const updated = applications.find((app) => app.id === selectedApplication.id);
            if (updated) {
                setSelectedApplication(updated);
            }
        }
    }, [applications, selectedApplication?.id]);

    // ESC key handler for modal
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setSelectedApplication(null);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [handleEscape]);

    const handleAddNote = () => {
        if (!selectedApplication || !newNote.trim()) return;

        const authorId = user?.id || user?.email || "employer";
        const authorName = user?.name || "Employer";

        addNoteToApplication(
            selectedApplication.id,
            newNote,
            authorId,
            authorName
        );

        setNewNote("");
        // Note: selectedApplication syncs automatically via the useEffect above
    };

    const handleViewCV = (cvName: string) => {
        // In production, this would open the actual CV file URL
        // For now, show a notification that CV viewing is available
        window.open(`#cv-${cvName}`, "_blank");
    };

    const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        shortlisted: applications.filter((app) => app.status === "shortlisted").length,
        rejected: applications.filter((app) => app.status === "rejected").length,
    };

    return (
        <main className="min-h-screen bg-[#060608] text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div>
                        <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">
                            Employer Dashboard
                        </h1>
                        <p className="text-slate-400">
                            Manage applications and find your next great hire
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm text-slate-400">Total Applications</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm text-slate-400">Shortlisted</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.shortlisted}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm text-slate-400">Pending</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.pending}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span className="text-sm text-slate-400">Rejected</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Application filters">
                        {(["all", "pending", "shortlisted", "rejected"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                role="tab"
                                aria-selected={selectedTab === tab}
                                className={`px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                                    selectedTab === tab
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Applications List */}
                    <div className="space-y-4" role="tabpanel">
                        {filteredApplications.length === 0 ? (
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No applications in this category</p>
                            </div>
                        ) : (
                            filteredApplications.map((application) => (
                                <motion.div
                                    key={application.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Candidate Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                                    {application.candidateAvatar ? (
                                                        <Image
                                                            src={application.candidateAvatar}
                                                            alt={application.candidateName}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xl font-bold text-white">
                                                            {application.candidateName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white mb-1">
                                                        {application.candidateName}
                                                    </h3>
                                                    <p className="text-sm text-emerald-400 mb-2">
                                                        {application.candidateHandle}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {application.candidateEmail}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            application.status === "shortlisted"
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : application.status === "rejected"
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                    >
                                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2">
                                                {application.candidateBio && (
                                                    <p className="text-sm text-slate-300">
                                                        {application.candidateBio}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                                    {application.candidateLocation && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{application.candidateLocation}</span>
                                                        </div>
                                                    )}
                                                    {application.candidateWebsite && (
                                                        <div className="flex items-center gap-1">
                                                            <Globe className="w-3 h-3" />
                                                            <a
                                                                href={application.candidateWebsite}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:text-emerald-400 transition-colors"
                                                            >
                                                                Website
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <time dateTime={toISODateString(application.appliedDate)}>
                                                            Applied {formatDate(application.appliedDate)}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Job Info */}
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-xs text-slate-500 mb-1">Applied for:</p>
                                                <p className="text-sm text-white font-medium">
                                                    {jobs.find((j) => j.id === application.jobId)?.role ||
                                                        "Unknown Position"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2">
                                            <button
                                                onClick={() => setSelectedApplication(application)}
                                                className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
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
                                                        <span className="hidden sm:inline">Shortlist</span>
                                                    </button>
                                                    <button
                                                        onClick={() => rejectApplication(application.id)}
                                                        className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Reject</span>
                                                    </button>
                                                </>
                                            )}
                                            {application.candidateCV && (
                                                <button
                                                    onClick={() => handleViewCV(application.candidateCV!)}
                                                    className="flex-1 sm:flex-initial px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span className="hidden sm:inline">View CV</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
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
                                <div className="bg-[#0a0a0f] border border-emerald-500/20 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2
                                                id="details-modal-title"
                                                className="text-2xl font-semibold text-white mb-1"
                                            >
                                                {selectedApplication.candidateName}
                                            </h2>
                                            <p className="text-sm text-emerald-400">
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

                                    {/* Candidate Details */}
                                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400">
                                        {selectedApplication.candidateLocation && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{selectedApplication.candidateLocation}</span>
                                            </div>
                                        )}
                                        {selectedApplication.candidateWebsite && (
                                            <a
                                                href={selectedApplication.candidateWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                <span>Website</span>
                                            </a>
                                        )}
                                        {selectedApplication.candidateCV && (
                                            <button
                                                onClick={() => handleViewCV(selectedApplication.candidateCV!)}
                                                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>{selectedApplication.candidateCV}</span>
                                            </button>
                                        )}
                                    </div>

                                    {selectedApplication.candidateBio && (
                                        <p className="text-slate-300 mb-6 text-sm">
                                            {selectedApplication.candidateBio}
                                        </p>
                                    )}

                                    {/* Applied Position */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                                        <p className="text-xs text-slate-500 mb-1">Applied for:</p>
                                        <p className="text-white font-medium">
                                            {jobs.find((j) => j.id === selectedApplication.jobId)?.role ||
                                                "Unknown Position"}
                                        </p>
                                        <time
                                            dateTime={toISODateString(selectedApplication.appliedDate)}
                                            className="text-xs text-slate-500"
                                        >
                                            {formatDate(selectedApplication.appliedDate)}
                                        </time>
                                    </div>

                                    {/* Notes Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Notes</h3>

                                        {/* Existing Notes */}
                                        {selectedApplication.notes && selectedApplication.notes.length > 0 ? (
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
                                                        <p className="text-sm text-slate-300">{note.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">No notes yet</p>
                                        )}

                                        {/* Add Note */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                                                placeholder="Add a note..."
                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={handleAddNote}
                                                disabled={!newNote.trim()}
                                                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
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
