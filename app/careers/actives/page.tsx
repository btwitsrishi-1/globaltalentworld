"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { formatDate, toISODateString } from "@/lib/constants";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Send,
    FileText,
    MapPin,
    Calendar,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ActivesPage() {
    const { user } = useAuth();
    const { jobs, applications, addNoteToApplication } = useJobs();

    // Only show shortlisted applications
    const shortlistedApplications = applications.filter(
        (app) => app.status === "shortlisted"
    );

    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(
        shortlistedApplications[0]?.id || null
    );
    const [newMessage, setNewMessage] = useState("");

    // Keep selected application ID valid when applications change
    useEffect(() => {
        if (selectedApplicationId) {
            const stillExists = shortlistedApplications.some(
                (app) => app.id === selectedApplicationId
            );
            if (!stillExists && shortlistedApplications.length > 0) {
                setSelectedApplicationId(shortlistedApplications[0].id);
            } else if (!stillExists) {
                setSelectedApplicationId(null);
            }
        } else if (shortlistedApplications.length > 0) {
            setSelectedApplicationId(shortlistedApplications[0].id);
        }
    }, [shortlistedApplications, selectedApplicationId]);

    const selectedApplication = shortlistedApplications.find(
        (app) => app.id === selectedApplicationId
    );

    const handleSendMessage = useCallback(() => {
        if (!selectedApplicationId || !newMessage.trim()) return;

        const authorId = user?.id || user?.email || "employer";
        const authorName = user?.name || "Employer";

        addNoteToApplication(
            selectedApplicationId,
            newMessage,
            authorId,
            authorName
        );

        setNewMessage("");
    }, [selectedApplicationId, newMessage, user, addNoteToApplication]);

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
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">
                                Active Candidates
                            </h1>
                            <p className="text-slate-400">
                                Connect with your shortlisted candidates
                            </p>
                        </div>
                        <Link
                            href="/careers/dashboard"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    {shortlistedApplications.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No active candidates yet
                            </h3>
                            <p className="text-slate-400 mb-6">
                                Shortlist candidates from your dashboard to start conversations
                            </p>
                            <Link
                                href="/careers/dashboard"
                                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[60vh] lg:h-[calc(100vh-16rem)]">
                            {/* Candidates List */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 overflow-y-auto max-h-[40vh] lg:max-h-none">
                                <h2 className="text-lg font-semibold text-white mb-4 px-2">
                                    Shortlisted ({shortlistedApplications.length})
                                </h2>
                                <div className="space-y-2">
                                    {shortlistedApplications.map((application) => (
                                        <button
                                            key={application.id}
                                            onClick={() => setSelectedApplicationId(application.id)}
                                            className={`w-full text-left p-4 rounded-xl transition-colors ${
                                                selectedApplicationId === application.id
                                                    ? "bg-emerald-600"
                                                    : "bg-white/5 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                                    {application.candidateAvatar ? (
                                                        <Image
                                                            src={application.candidateAvatar}
                                                            alt={application.candidateName}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold text-white">
                                                            {application.candidateName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {application.candidateName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {jobs.find((j) => j.id === application.jobId)
                                                            ?.role || "Unknown Position"}
                                                    </p>
                                                </div>
                                            </div>
                                            {application.notes && application.notes.length > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <MessageSquare className="w-3 h-3" />
                                                    <span>{application.notes.length} messages</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat/Details Panel */}
                            <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-2xl flex flex-col overflow-hidden min-h-[50vh] lg:min-h-0">
                                {selectedApplication ? (
                                    <>
                                        {/* Header */}
                                        <div className="p-6 border-b border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                                    {selectedApplication.candidateAvatar ? (
                                                        <Image
                                                            src={selectedApplication.candidateAvatar}
                                                            alt={selectedApplication.candidateName}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-bold text-white">
                                                            {selectedApplication.candidateName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {selectedApplication.candidateName}
                                                    </h3>
                                                    <p className="text-sm text-emerald-400">
                                                        {selectedApplication.candidateHandle}
                                                    </p>
                                                </div>
                                                {selectedApplication.candidateCV && (
                                                    <button
                                                        onClick={() => handleViewCV(selectedApplication.candidateCV!)}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        <span className="hidden sm:inline">View CV</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Candidate Details */}
                                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                                                {selectedApplication.candidateLocation && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{selectedApplication.candidateLocation}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <time dateTime={toISODateString(selectedApplication.appliedDate)}>
                                                        Applied {formatDate(selectedApplication.appliedDate)}
                                                    </time>
                                                </div>
                                            </div>

                                            {selectedApplication.candidateBio && (
                                                <p className="mt-4 text-sm text-slate-300">
                                                    {selectedApplication.candidateBio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                            {selectedApplication.notes && selectedApplication.notes.length > 0 ? (
                                                selectedApplication.notes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className={`rounded-xl p-4 max-w-[85%] ${
                                                            note.authorId === (user?.id || user?.email || "employer")
                                                                ? "bg-emerald-600/20 border border-emerald-500/20 ml-auto"
                                                                : "bg-white/5 border border-white/10"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-emerald-400">
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
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                                    <p className="text-slate-400 text-sm">
                                                        No messages yet. Start the conversation!
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-6 border-t border-white/10">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={(e) =>
                                                        e.key === "Enter" && handleSendMessage()
                                                    }
                                                    placeholder="Type a message..."
                                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={handleSendMessage}
                                                    disabled={!newMessage.trim()}
                                                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                                                    aria-label="Send message"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-slate-400">
                                        Select a candidate to view details
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
