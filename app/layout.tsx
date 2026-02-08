import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { AdminProvider } from "@/lib/admin-context";
import { JobsProvider } from "@/lib/jobs-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { GrainOverlay } from "@/components/ui/grain-overlay";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Global Talent World",
        template: "%s | Global Talent World",
    },
    description: "A window to the world for global talent. Connect with exceptional opportunities and minds worldwide.",
    keywords: ["talent", "jobs", "careers", "global", "remote work", "community"],
    authors: [{ name: "Global Talent World" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://globaltalentworld.com",
        siteName: "Global Talent World",
        title: "Global Talent World",
        description: "A window to the world for global talent",
    },
    twitter: {
        card: "summary_large_image",
        title: "Global Talent World",
        description: "A window to the world for global talent",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    inter.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SmoothScroll>
                        <GrainOverlay />
                        <AuthProvider>
                            <AdminProvider>
                                <JobsProvider>
                                    {children}
                                </JobsProvider>
                            </AdminProvider>
                        </AuthProvider>
                    </SmoothScroll>
                </ThemeProvider>
            </body>
        </html>
    );
}
