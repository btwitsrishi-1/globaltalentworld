import { NextRequest, NextResponse } from "next/server";
import type { Application, ApplicationNote } from "@/lib/types";

// In-memory applications store
const applications: Application[] = [];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get("jobId");
        const candidateId = searchParams.get("candidateId");
        const status = searchParams.get("status");

        let filtered = [...applications];

        if (jobId) {
            filtered = filtered.filter((app) => app.jobId === jobId);
        }

        if (candidateId) {
            filtered = filtered.filter((app) => app.candidateId === candidateId);
        }

        if (status) {
            filtered = filtered.filter((app) => app.status === status);
        }

        return NextResponse.json({ applications: filtered });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId, candidateData } = body;

        if (!jobId || !candidateData) {
            return NextResponse.json(
                { error: "Job ID and candidate data are required" },
                { status: 400 }
            );
        }

        // Check for duplicate application
        const existing = applications.find(
            (app) =>
                app.jobId === jobId &&
                app.candidateId === (candidateData.id || candidateData.email)
        );

        if (existing) {
            return NextResponse.json(
                { error: "You have already applied to this position" },
                { status: 409 }
            );
        }

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

        applications.push(newApplication);

        return NextResponse.json(
            { application: newApplication },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { applicationId, action, note, authorId, authorName } = body;

        if (!applicationId) {
            return NextResponse.json(
                { error: "Application ID is required" },
                { status: 400 }
            );
        }

        const appIndex = applications.findIndex((app) => app.id === applicationId);
        if (appIndex === -1) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        if (action === "shortlist") {
            applications[appIndex].status = "shortlisted";
        } else if (action === "reject") {
            applications[appIndex].status = "rejected";
        } else if (action === "add_note" && note) {
            const newNote: ApplicationNote = {
                id: `note-${Date.now()}`,
                authorId: authorId || "unknown",
                authorName: authorName || "Unknown",
                content: note,
                createdAt: new Date(),
            };
            if (!applications[appIndex].notes) {
                applications[appIndex].notes = [];
            }
            applications[appIndex].notes!.push(newNote);
        }

        return NextResponse.json({ application: applications[appIndex] });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
