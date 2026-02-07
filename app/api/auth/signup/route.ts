import { NextRequest, NextResponse } from "next/server";

// Shared in-memory store (in production, use a database)
const users = new Map<string, { name: string; email: string; handle: string; avatar?: string; password: string }>();

export async function POST(request: NextRequest) {
    try {
        const { name, email, handle } = await request.json();

        // Validate inputs
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Name must be at least 2 characters" },
                { status: 400 }
            );
        }

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (!handle || typeof handle !== "string") {
            return NextResponse.json(
                { error: "Handle is required" },
                { status: 400 }
            );
        }

        const cleanHandle = handle.replace(/^@/, "");
        if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
            return NextResponse.json(
                { error: "Handle can only contain letters, numbers, and underscores" },
                { status: 400 }
            );
        }

        // Check if user already exists
        if (users.has(email)) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const formattedHandle = `@${cleanHandle}`;
        const newUser = {
            name: name.trim(),
            email: email.trim(),
            handle: formattedHandle,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3b82f6&color=fff`,
            password: "",
        };

        users.set(email, newUser);

        const { password: _, ...safeUser } = newUser;
        return NextResponse.json({ user: safeUser }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
