"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { formatDate, toISODateString } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    DollarSign,
    Briefcase,
    Calendar,
    CheckCircle,
    X,
    Upload,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { jobs, applyToJob, getApplicationsForCandidate } = useJobs();

    const jobId = params.jobId as string;
    const job = jobs.find((j) => j.id === jobId);

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [cvWarning, setCvWarning] = useState(false);

    // ESC key handler for modal
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && showApplyModal && !applicationSubmitted) {
                setShowApplyModal(false);
            }
        },
        [showApplyModal, applicationSubmitted]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [handleEscape]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showApplyModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showApplyModal]);

    if (!job) {
        return (
            <main className="min-h-screen bg-[#060608] text-white flex flex-col">
                <CustomCursor />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                        <Link href="/careers" className="text-emerald-400 hover:underline">
                            Back to careers
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const userApplications = user ? getApplicationsForCandidate(user.email) : [];
    const hasApplied = userApplications.some((app) => app.jobId === jobId);

    const handleApply = () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!user.cv) {
            setCvWarning(true);
            return;
        }

        setCvWarning(false);
        setShowApplyModal(true);
    };

    const confirmApplication = () => {
        if (!user) return;

        applyToJob(jobId, user);
        setApplicationSubmitted(true);
        setTimeout(() => {
            setShowApplyModal(false);
            setApplicationSubmitted(false);
        }, 2500);
    };

    return (
        <main className="min-h-screen bg-[#060608] text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Back Link */}
                    <Link
                        href="/careers"
                        className="inline-flex items-center text-sm text-emerald-400 hover:underline"
                    >
                        ← Back to all jobs
                    </Link>

                    {/* Job Header */}
                    <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-8">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    {job.role}
                                </h1>
                                <p className="text-xl text-emerald-400">{job.company}</p>
                            </div>
                            {hasApplied ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <span className="text-sm text-emerald-400 font-medium">
                                        Applied
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
                                >
                                    Apply Now
                                </button>
                            )}
                        </div>

                        {/* CV Warning */}
                        <AnimatePresence>
                            {cvWarning && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-amber-300 font-medium">
                                                CV/Resume required
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Please upload your CV in your{" "}
                                                <Link
                                                    href="/profile"
                                                    className="text-emerald-400 hover:underline"
                                                >
                                                    profile settings
                                                </Link>{" "}
                                                before applying.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setCvWarning(false)}
                                            className="p-1 hover:bg-white/10 rounded transition-colors"
                                            aria-label="Dismiss warning"
                                        >
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Job Meta */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-emerald-400" />
                                <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <time dateTime={toISODateString(job.postedDate)}>
                                    Posted {formatDate(job.postedDate)}
                                </time>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                About the Role
                            </h2>
                            <p className="text-slate-300 leading-relaxed">{job.description}</p>
                        </div>

                        {job.requirements && job.requirements.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-4">
                                    Requirements
                                </h2>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-300">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.benefits && job.benefits.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-4">Benefits</h2>
                                <ul className="space-y-2">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-300">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Apply CTA */}
                    {!hasApplied && (
                        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-semibold text-white mb-2">
                                Ready to apply?
                            </h3>
                            <p className="text-slate-300 mb-6">
                                Join {job.company} and work on exciting projects
                            </p>
                            <button
                                onClick={handleApply}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
                            >
                                Apply for this position
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#060608]/60 backdrop-blur-sm z-50"
                            onClick={() => !applicationSubmitted && setShowApplyModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="apply-modal-title"
                        >
                            <div className="bg-[#0a0a0f] border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full">
                                {applicationSubmitted ? (
                                    <div className="text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 0.5 }}
                                            className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
                                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                                        </motion.div>
                                        <h3 className="text-2xl font-semibold text-white mb-2">
                                            Application Submitted!
                                        </h3>
                                        <p className="text-slate-300">
                                            We&apos;ve received your application for {job.role} at{" "}
                                            {job.company}. Good luck!
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3
                                                    id="apply-modal-title"
                                                    className="text-2xl font-semibold text-white mb-1"
                                                >
                                                    Confirm Application
                                                </h3>
                                                <p className="text-sm text-slate-400">
                                                    {job.role} at {job.company}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowApplyModal(false)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                aria-label="Close modal"
                                            >
                                                <X className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Upload className="w-5 h-5 text-emerald-400" />
                                                    <span className="font-medium text-white">
                                                        Your CV
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {user?.cv || "No CV uploaded"}
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3 text-sm text-slate-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                                <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <p>
                                                    Your profile information and CV will be shared
                                                    with the employer.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowApplyModal(false)}
                                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmApplication}
                                                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
                                            >
                                                Confirm Application
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
