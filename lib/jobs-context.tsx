"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { STORAGE_KEYS } from "./constants";
import type { Job, Application, ApplicationNote, ListingAccessRequest } from "./types";

interface JobsContextType {
    jobs: Job[];
    applications: Application[];
    isLoading: boolean;
    searchQuery: string;
    locationQuery: string;
    setSearchQuery: (query: string) => void;
    setLocationQuery: (location: string) => void;
    applyToJob: (jobId: string, candidateData: CandidateData) => void;
    getApplicationsForJob: (jobId: string) => Application[];
    getApplicationsForCandidate: (candidateId: string) => Application[];
    shortlistApplication: (applicationId: string) => void;
    rejectApplication: (applicationId: string) => void;
    addNoteToApplication: (applicationId: string, note: string, authorId: string, authorName: string) => void;
    createJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
    deleteJob: (jobId: string) => void;
    getJobsByEmployer: (employerId: string) => Job[];
    requestListingAccess: (request: Omit<ListingAccessRequest, 'id' | 'requestedAt'>) => void;
    getAccessRequests: (ownerId: string) => ListingAccessRequest[];
    approveAccessRequest: (requestId: string) => void;
    rejectAccessRequest: (requestId: string) => void;
    getSharedListings: (requesterId: string) => Job[];
}

interface CandidateData {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
    handle: string;
    cv?: string;
    bio?: string;
    location?: string;
    website?: string;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

interface SupabaseJobRow {
    id: string;
    role: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    description: string | null;
    requirements: string[] | null;
    benefits: string[] | null;
    employer_id: string | null;
    posted_date: string;
}

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [accessRequests, setAccessRequests] = useState<ListingAccessRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    // Fetch jobs from Supabase on mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from("jobs")
                    .select("*")
                    .eq("is_active", true)
                    .order("posted_date", { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    const mapped: Job[] = (data as SupabaseJobRow[]).map((job) => ({
                        id: job.id,
                        role: job.role,
                        company: job.company,
                        location: job.location,
                        salary: job.salary,
                        type: job.type as Job["type"],
                        description: job.description || undefined,
                        requirements: job.requirements || [],
                        benefits: job.benefits || [],
                        employerId: job.employer_id || "",
                        postedDate: new Date(job.posted_date),
                    }));
                    setAllJobs(mapped);
                }
            } catch {
                console.warn("Could not fetch jobs from Supabase");
            }
            setIsLoading(false);
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search and location
    const jobs = allJobs.filter((job) => {
        const matchesSearch = !searchQuery ||
            job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.description?.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLocation = !locationQuery ||
            job.location.toLowerCase().includes(locationQuery.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    // Load applications from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
            if (stored) {
                const parsed = JSON.parse(stored);
                const withDates: Application[] = parsed.map((app: Record<string, unknown>) => ({
                    ...app,
                    appliedDate: new Date(app.appliedDate as string),
                    notes: (app.notes as Record<string, unknown>[] | undefined)?.map((note) => ({
                        ...note,
                        createdAt: new Date(note.createdAt as string),
                    })) || [],
                }));
                setApplications(withDates);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
        }
    }, []);

    // Load access requests from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS);
            if (stored) {
                const parsed = JSON.parse(stored);
                const withDates: ListingAccessRequest[] = parsed.map((req: Record<string, unknown>) => ({
                    ...req,
                    requestedAt: new Date(req.requestedAt as string),
                }));
                setAccessRequests(withDates);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_REQUESTS);
        }
    }, []);

    // Save applications to localStorage
    useEffect(() => {
        try {
            if (applications.length > 0) {
                localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
            }
        } catch {
            console.warn("Could not save applications to localStorage");
        }
    }, [applications]);

    // Save access requests to localStorage
    useEffect(() => {
        try {
            if (accessRequests.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(accessRequests));
            }
        } catch {
            console.warn("Could not save access requests to localStorage");
        }
    }, [accessRequests]);

    const applyToJob = (jobId: string, candidateData: CandidateData) => {
        const newApplication: Application = {
            id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            jobId,
            candidateId: candidateData.id || candidateData.email,
            candidateName: candidateData.name,
            candidateEmail: candidateData.email,
            candidateAvatar: candidateData.avatar,
            candidateHandle: candidateData.handle,
            candidateCV: candidateData.cv,
            candidateBio: candidateData.bio,
            candidateLocation: candidateData.location,
            candidateWebsite: candidateData.website,
            status: "pending",
            appliedDate: new Date(),
            notes: [],
        };

        setApplications((prev) => [...prev, newApplication]);
    };

    const getApplicationsForJob = useCallback((jobId: string) => {
        return applications.filter((app) => app.jobId === jobId);
    }, [applications]);

    const getApplicationsForCandidate = useCallback((candidateId: string) => {
        return applications.filter(
            (app) => app.candidateId === candidateId || app.candidateEmail === candidateId
        );
    }, [applications]);

    const shortlistApplication = (applicationId: string) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: "shortlisted" as const } : app
            )
        );
    };

    const rejectApplication = (applicationId: string) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: "rejected" as const } : app
            )
        );
    };

    const addNoteToApplication = (
        applicationId: string,
        content: string,
        authorId: string,
        authorName: string
    ) => {
        setApplications((prev) =>
            prev.map((app) => {
                if (app.id === applicationId) {
                    const newNote: ApplicationNote = {
                        id: `note-${Date.now()}`,
                        authorId,
                        authorName,
                        content,
                        createdAt: new Date(),
                    };
                    return {
                        ...app,
                        notes: [...(app.notes || []), newNote],
                    };
                }
                return app;
            })
        );
    };

    const createJob = (job: Omit<Job, 'id' | 'postedDate'>) => {
        const newJob: Job = {
            ...job,
            id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            postedDate: new Date(),
        };
        setAllJobs((prev) => [newJob, ...prev]);
    };

    const deleteJob = (jobId: string) => {
        setAllJobs((prev) => prev.filter((job) => job.id !== jobId));
    };

    const getJobsByEmployer = useCallback((employerId: string) => {
        return allJobs.filter((job) => job.employerId === employerId);
    }, [allJobs]);

    const requestListingAccess = (request: Omit<ListingAccessRequest, 'id' | 'requestedAt'>) => {
        const newRequest: ListingAccessRequest = {
            ...request,
            id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            requestedAt: new Date(),
        };
        setAccessRequests((prev) => [...prev, newRequest]);
    };

    const getAccessRequests = useCallback((ownerId: string) => {
        return accessRequests.filter((req) => req.ownerId === ownerId);
    }, [accessRequests]);

    const approveAccessRequest = (requestId: string) => {
        setAccessRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: "approved" as const } : req
            )
        );
    };

    const rejectAccessRequest = (requestId: string) => {
        setAccessRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: "rejected" as const } : req
            )
        );
    };

    const getSharedListings = useCallback((requesterId: string) => {
        const approvedRequestIds = accessRequests
            .filter((req) => req.requesterId === requesterId && req.status === "approved")
            .map((req) => req.listingId);
        return allJobs.filter((job) => approvedRequestIds.includes(job.id));
    }, [accessRequests, allJobs]);

    return (
        <JobsContext.Provider
            value={{
                jobs,
                applications,
                isLoading,
                searchQuery,
                locationQuery,
                setSearchQuery,
                setLocationQuery,
                applyToJob,
                getApplicationsForJob,
                getApplicationsForCandidate,
                shortlistApplication,
                rejectApplication,
                addNoteToApplication,
                createJob,
                deleteJob,
                getJobsByEmployer,
                requestListingAccess,
                getAccessRequests,
                approveAccessRequest,
                rejectAccessRequest,
                getSharedListings,
            }}
        >
            {children}
        </JobsContext.Provider>
    );
};

export const useJobs = () => {
    const context = useContext(JobsContext);
    if (context === undefined) {
        throw new Error("useJobs must be used within a JobsProvider");
    }
    return context;
};
