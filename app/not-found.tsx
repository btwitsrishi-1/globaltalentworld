import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#060608] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-8xl font-bold text-white/10 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
                <p className="text-slate-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
