"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { CustomCursor } from "@/components/ui/custom-cursor";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, User, AtSign, Mail, Lock } from "lucide-react";

interface FormErrors {
    name?: string;
    handle?: string;
    email?: string;
    password?: string;
    general?: string;
}

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [handle, setHandle] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Full name is required";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!handle.trim()) {
            newErrors.handle = "Handle is required";
        } else if (!/^@?[a-zA-Z0-9_]+$/.test(handle)) {
            newErrors.handle = "Handle can only contain letters, numbers, and underscores";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;
            const result = await signup(name.trim(), email.trim(), formattedHandle, password);

            if (result.error) {
                setErrors({ general: result.error });
                setIsLoading(false);
            } else {
                router.push("/community");
            }
        } catch {
            setErrors({ general: "An error occurred. Please try again." });
            setIsLoading(false);
        }
    };

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const renderError = (field: keyof FormErrors, id: string) => {
        if (!errors[field]) return null;
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id={id}
                role="alert"
                className="flex items-center gap-2 mt-2 text-sm text-red-400"
            >
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors[field]}</span>
            </motion.div>
        );
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
            <CustomCursor />
            <Navbar />

            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl motion-reduce:opacity-50" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl motion-reduce:opacity-50" aria-hidden="true" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl mx-4 mt-20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Join Global Talent World</h1>
                    <p className="text-slate-400">Create your account to get started.</p>
                </div>

                {errors.general && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="flex items-center gap-2 mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{errors.general}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="name" name="name" type="text" autoComplete="name" required
                                value={name}
                                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${errors.name ? "border-red-500" : "border-white/10"}`}
                                placeholder="John Doe"
                                disabled={isLoading}
                            />
                        </div>
                        {renderError("name", "name-error")}
                    </div>

                    {/* Handle */}
                    <div>
                        <label htmlFor="handle" className="block text-sm font-medium text-slate-300 mb-2">Handle</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="handle" name="handle" type="text" autoComplete="username" required
                                value={handle}
                                onChange={(e) => { setHandle(e.target.value); clearError("handle"); }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${errors.handle ? "border-red-500" : "border-white/10"}`}
                                placeholder="johndoe"
                                disabled={isLoading}
                            />
                        </div>
                        {renderError("handle", "handle-error")}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="email" name="email" type="email" autoComplete="email" required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${errors.email ? "border-red-500" : "border-white/10"}`}
                                placeholder="john@example.com"
                                disabled={isLoading}
                            />
                        </div>
                        {renderError("email", "email-error")}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
                            <input
                                id="password" name="password" type="password" autoComplete="new-password" required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                                className={`w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all ${errors.password ? "border-red-500" : "border-white/10"}`}
                                placeholder="At least 6 characters"
                                disabled={isLoading}
                            />
                        </div>
                        {renderError("password", "password-error")}
                    </div>

                    <button
                        type="submit" disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already a member?{" "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors focus:outline-none focus:underline">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
