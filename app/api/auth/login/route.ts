import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo (replace with database in real production)
const users = new Map<string, { name: string; email: string; handle: string; avatar?: string; bio?: string; location?: string; website?: string; cv?: string; role?: string; password: string }>();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

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

        // For demo mode: accept any valid email, create user if not exists
        let user = users.get(email);
        if (!user) {
            // Demo: auto-create user on login
            user = {
                name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                email,
                handle: `@${email.split("@")[0]}`,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=3b82f6&color=fff`,
                password: password || "",
            };
            users.set(email, user);
        }

        // Return user without password
        const { password: _, ...safeUser } = user;
        return NextResponse.json({ user: safeUser }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
