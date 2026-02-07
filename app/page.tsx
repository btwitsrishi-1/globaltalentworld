import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollingLogo3DHero } from "@/components/ScrollingLogo3DHero";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <CustomCursor />

            {/* Contrasting gradient background with vibrant green accents */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-900 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_50%)] -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(52,211,153,0.18),transparent_50%)] -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_50%)] -z-10" />

            <Navbar />

            <ScrollingLogo3DHero />
            <Features />
            <Stats />
            <Testimonials />
            <CTA />

            <Footer />
        </main>
    );
}
