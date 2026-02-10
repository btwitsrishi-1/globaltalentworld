"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { useJobs } from "@/lib/jobs-context";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    MapPin,
    DollarSign,
    FileText,
    ListChecks,
    Gift,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

type JobType = "Full-time" | "Part-time" | "Contract" | "Freelance";

interface FormData {
    role: string;
    company: string;
    location: string;
    salary: string;
    type: JobType;
    description: string;
    requirements: string;
    benefits: string;
}

interface FormErrors {
    role?: string;
    company?: string;
    location?: string;
    salary?: string;
    description?: string;
}

export default function CreateJobPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { createJob } = useJobs();

    const [formData, setFormData] = useState<FormData>({
        role: "",
        company: user?.recruiterCompany || "",
        location: "",
        salary: "",
        type: "Full-time",
        description: "",
        requirements: "",
        benefits: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Auth guard: must be approved recruiter
    useEffect(() => {
        if (!authLoading && (!user || user.role !== "recruiter" || user.recruiterStatus !== "approved")) {
            router.push("/careers");
        }
    }, [user, authLoading, router]);

    // Pre-fill company from recruiter profile
    useEffect(() => {
        if (user?.recruiterCompany && !formData.company) {
            setFormData((prev) => ({ ...prev, company: user.recruiterCompany || "" }));
        }
    }, [user?.recruiterCompany, formData.company]);

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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.role.trim()) {
            newErrors.role = "Job title is required";
        }
        if (!formData.company.trim()) {
            newErrors.company = "Company name is required";
        }
        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }
        if (!formData.salary.trim()) {
            newErrors.salary = "Salary range is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Job description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Parse requirements and benefits from newline-separated text
        const requirements = formData.requirements
            .split("\n")
            .map((r) => r.trim())
            .filter((r) => r.length > 0);

        const benefits = formData.benefits
            .split("\n")
            .map((b) => b.trim())
            .filter((b) => b.length > 0);

        await createJob({
            role: formData.role.trim(),
            company: formData.company.trim(),
            location: formData.location.trim(),
            salary: formData.salary.trim(),
            type: formData.type,
            description: formData.description.trim(),
            requirements,
            benefits,
            employerId: user.id || "",
        });

        setShowSuccess(true);

        setTimeout(() => {
            router.push("/recruiter");
        }, 1500);
    };

    const jobTypes: JobType[] = ["Full-time", "Part-time", "Contract", "Freelance"];

    return (
        <main className="min-h-screen bg-[#060608] text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
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

                    {/* Header */}
                    <div>
                        <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">
                            Create New Listing
                        </h1>
                        <p className="text-slate-400">
                            Fill out the details below to post a new job listing.
                        </p>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-embossed p-6 border-emerald-500/30"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <h3 className="text-white font-semibold">Listing Created Successfully</h3>
                                    <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Form */}
                    {!showSuccess && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Job Title */}
                            <div className="card-embossed p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                    Basic Information
                                </h2>

                                <div className="space-y-4">
                                    {/* Role */}
                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-medium text-slate-300 mb-2"
                                        >
                                            Job Title *
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                id="role"
                                                name="role"
                                                type="text"
                                                value={formData.role}
                                                onChange={handleChange}
                                                placeholder="e.g. Senior Frontend Developer"
                                                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                    errors.role
                                                        ? "border-red-500/50"
                                                        : "border-white/10"
                                                }`}
                                            />
                                        </div>
                                        {errors.role && (
                                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="block text-sm font-medium text-slate-300 mb-2"
                                        >
                                            Company *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                id="company"
                                                name="company"
                                                type="text"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="e.g. Acme Corp"
                                                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                    errors.company
                                                        ? "border-red-500/50"
                                                        : "border-white/10"
                                                }`}
                                            />
                                        </div>
                                        {errors.company && (
                                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.company}
                                            </p>
                                        )}
                                    </div>

                                    {/* Location and Salary Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="block text-sm font-medium text-slate-300 mb-2"
                                            >
                                                Location *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    id="location"
                                                    name="location"
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Remote, San Francisco"
                                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        errors.location
                                                            ? "border-red-500/50"
                                                            : "border-white/10"
                                                    }`}
                                                />
                                            </div>
                                            {errors.location && (
                                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.location}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="salary"
                                                className="block text-sm font-medium text-slate-300 mb-2"
                                            >
                                                Salary Range *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    id="salary"
                                                    name="salary"
                                                    type="text"
                                                    value={formData.salary}
                                                    onChange={handleChange}
                                                    placeholder="e.g. $120k - $180k"
                                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        errors.salary
                                                            ? "border-red-500/50"
                                                            : "border-white/10"
                                                    }`}
                                                />
                                            </div>
                                            {errors.salary && (
                                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.salary}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <label
                                            htmlFor="type"
                                            className="block text-sm font-medium text-slate-300 mb-2"
                                        >
                                            Employment Type
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
                                        >
                                            {jobTypes.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                    className="bg-[#0a0a0f] text-white"
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="card-embossed p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    Job Description *
                                </h2>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                        errors.description
                                            ? "border-red-500/50"
                                            : "border-white/10"
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Requirements */}
                            <div className="card-embossed p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ListChecks className="w-5 h-5 text-blue-400" />
                                    Requirements
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Enter one requirement per line
                                </p>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder={"5+ years of experience with React\nStrong TypeScript skills\nExperience with Next.js\nExcellent communication skills"}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                />
                            </div>

                            {/* Benefits */}
                            <div className="card-embossed p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-emerald-400" />
                                    Benefits
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Enter one benefit per line
                                </p>
                                <textarea
                                    id="benefits"
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder={"Competitive salary and equity\nFlexible work hours\nHealth, dental, and vision insurance\nUnlimited PTO"}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-embossed-primary flex-1 px-8 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Listing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Create Job Listing
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/recruiter"
                                    className="btn-embossed-secondary px-8 py-4 rounded-xl text-slate-300 font-medium text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
