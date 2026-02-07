import { NextRequest, NextResponse } from "next/server";

// In-memory newsletter subscribers (replace with database in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        if (subscribers.has(email.toLowerCase())) {
            return NextResponse.json(
                { message: "You're already subscribed!" },
                { status: 200 }
            );
        }

        subscribers.add(email.toLowerCase());

        return NextResponse.json(
            { message: "Successfully subscribed to the newsletter!" },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
