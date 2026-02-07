"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { CustomCursor } from "@/components/ui/custom-cursor";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email address is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password.trim()) {
            setError("Password is required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                router.push("/community");
            }
        } catch {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
            <CustomCursor />
            <Navbar />

            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl motion-reduce:opacity-50" aria-hidden="true" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl motion-reduce:opacity-50" aria-hidden="true" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl mx-4"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to access your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${
                                    error ? "border-red-500" : "border-white/10 focus:border-blue-500"
                                }`}
                                placeholder="you@example.com"
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={error ? "login-error" : undefined}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError("");
                                }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${
                                    error ? "border-red-500" : "border-white/10 focus:border-blue-500"
                                }`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="login-error"
                            role="alert"
                            className="flex items-center gap-2 text-sm text-red-400"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors focus:outline-none focus:underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
