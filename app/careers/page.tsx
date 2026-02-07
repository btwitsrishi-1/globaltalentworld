"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobCard } from "@/components/careers/job-card";
import { SearchFilter } from "@/components/careers/search-filter";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Briefcase, LayoutDashboard, Users, SearchX, Loader2 } from "lucide-react";

export default function CareersPage() {
    const { jobs, isLoading, searchQuery, locationQuery } = useJobs();
    const { user } = useAuth();
    const hasFilters = searchQuery || locationQuery;

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="font-script text-5xl sm:text-6xl md:text-8xl mb-4">Open Roles</h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                        Join the teams building the future. Find your next role.
                    </p>
                </header>

                {/* Employer Quick Links */}
                {user && (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <Link
                            href="/careers/dashboard"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-slate-300 hover:text-white transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/careers/actives"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-slate-300 hover:text-white transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            Active Candidates
                        </Link>
                    </div>
                )}

                {/* Search Bar */}
                <SearchFilter />

                {/* Results Count */}
                {!isLoading && (
                    <div className="mb-6 text-sm text-slate-500">
                        {hasFilters ? (
                            <span>Showing {jobs.length} result{jobs.length !== 1 ? "s" : ""}</span>
                        ) : (
                            <span>{jobs.length} open position{jobs.length !== 1 ? "s" : ""}</span>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                        <p className="text-slate-400">Loading positions...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <JobCard key={job.id} {...job} delay={index * 0.1} />
                        ))}
                    </div>
                ) : hasFilters ? (
                    /* No Results for Filter */
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <SearchX className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No matching roles found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            Try adjusting your search terms or clearing the filters.
                        </p>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No open positions</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            Check back soon for new opportunities.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
