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
        <main className="relative min-h-screen bg-[#060608] text-white selection:bg-blue-500/20">
            <CustomCursor />
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
