import { NextRequest, NextResponse } from "next/server";

// Same jobs data (in production, this comes from a database)
const jobs = [
    {
        id: "1",
        role: "Senior Product Designer",
        company: "Stripe",
        location: "Remote (US)",
        salary: "$160k - $220k",
        type: "Full-time",
        description: "We're looking for an experienced product designer to join our team and shape the future of online payments. You'll work closely with engineers and product managers to create intuitive, delightful experiences that millions of businesses rely on every day.",
        requirements: ["5+ years of product design experience", "Strong portfolio demonstrating end-to-end design process", "Figma expertise and proficiency with design systems", "Experience with user research and usability testing", "Excellent communication and collaboration skills"],
        benefits: ["Comprehensive health, dental, and vision insurance", "401(k) with company match", "Flexible remote work policy", "Annual learning and development budget", "Home office stipend"],
        employerId: "employer1",
        postedDate: "2024-01-15",
    },
    {
        id: "2",
        role: "Creative Technologist",
        company: "Vercel",
        location: "San Francisco",
        salary: "$180k - $250k",
        type: "Full-time",
        description: "Join our creative team to build the future of web development. As a Creative Technologist, you'll bridge the gap between design and engineering, creating stunning demos, prototypes, and experiences that showcase the power of the Vercel platform.",
        requirements: ["Expert-level React and Next.js skills", "Strong knowledge of WebGL, Three.js, or similar", "Creative mindset with an eye for design", "Experience building interactive web experiences", "Passion for performance and accessibility"],
        benefits: ["Competitive equity packages", "Comprehensive health insurance", "$5,000 annual learning budget", "Flexible PTO policy", "Regular team offsites"],
        employerId: "employer2",
        postedDate: "2024-01-20",
    },
    {
        id: "3",
        role: "Frontend Engineer (WebGL)",
        company: "Spline",
        location: "Remote",
        salary: "$140k - $190k",
        type: "Contract",
        description: "Build cutting-edge 3D experiences for the web. You'll work on our core rendering engine and help make 3D design accessible to everyone, pushing the boundaries of what's possible in the browser.",
        requirements: ["Deep expertise in Three.js and WebGL", "Strong JavaScript/TypeScript skills", "Performance optimization experience", "Understanding of 3D mathematics and shaders", "Experience with real-time rendering"],
        benefits: ["Flexible working hours", "Fully remote position", "Access to cutting-edge 3D tools", "Collaborative and creative team culture"],
        employerId: "employer3",
        postedDate: "2024-02-01",
    },
    {
        id: "4",
        role: "UX Researcher",
        company: "Figma",
        location: "New York",
        salary: "$130k - $175k",
        type: "Full-time",
        description: "Help us understand our users better. You'll conduct research that directly influences product decisions, working with designers and engineers to create tools that empower millions of creators worldwide.",
        requirements: ["3+ years of UX research experience", "Strong quantitative and qualitative research skills", "Experience with research tools (UserTesting, Maze, etc.)", "Excellent presentation and storytelling abilities", "Background in HCI or related field"],
        benefits: ["Health, dental, and vision coverage", "Generous equity package", "Annual conference budget", "Wellness stipend", "Parental leave"],
        employerId: "employer4",
        postedDate: "2024-02-10",
    },
    {
        id: "5",
        role: "Full Stack Developer",
        company: "Linear",
        location: "Remote (Worldwide)",
        salary: "$150k - $200k",
        type: "Full-time",
        description: "Build the future of project management. We're looking for a full stack developer who cares deeply about craft and user experience to help us build tools that software teams love.",
        requirements: ["Strong TypeScript and React experience", "Backend experience with Node.js or similar", "Database design and optimization skills", "Understanding of real-time systems", "Passion for developer tools"],
        benefits: ["Competitive salary and equity", "Fully remote with async-first culture", "Top-tier health insurance", "Yearly team retreats", "Equipment budget"],
        employerId: "employer5",
        postedDate: "2024-02-15",
    },
    {
        id: "6",
        role: "Motion Designer",
        company: "Lottie",
        location: "Los Angeles",
        salary: "$120k - $160k",
        type: "Full-time",
        description: "Create beautiful animations that bring interfaces to life. You'll design motion systems, micro-interactions, and animated illustrations that make digital products feel magical.",
        requirements: ["Expert in After Effects and Lottie animations", "Strong understanding of motion principles", "Experience with CSS/JS animations", "Portfolio showcasing UI animation work", "Collaboration skills with engineering teams"],
        benefits: ["Creative studio environment", "Health and wellness benefits", "Annual creative tools budget", "Flexible schedule", "Professional development fund"],
        employerId: "employer6",
        postedDate: "2024-02-20",
    },
];

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;
        const job = jobs.find((j) => j.id === jobId);

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ job });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
