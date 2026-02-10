"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { STORAGE_KEYS, getDefaultAvatar } from "./constants";

interface User {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
    handle: string;
    bio?: string;
    location?: string;
    website?: string;
    cv?: string;
    role?: "candidate" | "employer" | "employee" | "both" | "recruiter" | "admin";
    recruiterStatus?: "pending" | "approved" | "rejected";
    recruiterCompany?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    signup: (name: string, email: string, handle: string, password: string, role?: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    applyForRecruiter: (company: string) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            name: data.name,
            email: data.email,
            handle: data.handle,
            avatar: data.avatar,
            bio: data.bio,
            location: data.location,
            website: data.website,
            cv: data.cv,
            role: data.role,
            recruiterStatus: data.recruiter_status,
            recruiterCompany: data.recruiter_company,
        };
    } catch {
        return null;
    }
}

function safeGetLocalStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSetLocalStorage(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        console.warn("Could not write to localStorage");
    }
}

function safeRemoveLocalStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        console.warn("Could not remove from localStorage");
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize: check for existing session
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (profile) {
                        setUser(profile);
                    }
                }
            } catch {
                // Supabase not configured, check localStorage fallback
                const storedUser = safeGetLocalStorage(STORAGE_KEYS.USER);
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        safeRemoveLocalStorage(STORAGE_KEYS.USER);
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (profile) {
                        setUser(profile);
                        safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(profile));
                    }
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                    safeRemoveLocalStorage(STORAGE_KEYS.USER);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    return { error: "Invalid email or password. Please try again." };
                }
                if (error.message.includes("Email not confirmed")) {
                    return { error: "Please verify your email before logging in." };
                }
                return { error: error.message };
            }

            if (data.user) {
                const profile = await fetchProfile(data.user.id);
                if (profile) {
                    setUser(profile);
                    safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(profile));
                }
            }

            return {};
        } catch {
            return { error: "Network error. Please check your connection and try again." };
        }
    }, []);

    const signup = useCallback(async (name: string, email: string, handle: string, password: string, role?: string): Promise<{ error?: string }> => {
        try {
            const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;
            const avatarUrl = getDefaultAvatar(name);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        name: name.trim(),
                        handle: formattedHandle,
                        avatar: avatarUrl,
                        role: role || "candidate",
                        ...(role === "recruiter" ? { recruiter_status: "pending" } : {}),
                    },
                },
            });

            if (error) {
                if (error.message.includes("already registered")) {
                    return { error: "An account with this email already exists. Please log in instead." };
                }
                if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("email rate")) {
                    return { error: "Too many signup attempts. Please wait a few minutes and try again." };
                }
                return { error: error.message };
            }

            if (data.user) {
                // Wait briefly for the trigger to create the profile
                await new Promise((resolve) => setTimeout(resolve, 500));
                const profile = await fetchProfile(data.user.id);
                if (profile) {
                    setUser(profile);
                    safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(profile));
                } else {
                    // Fallback: set user from signup data
                    const fallbackUser: User = {
                        id: data.user.id,
                        name: name.trim(),
                        email,
                        handle: formattedHandle,
                        avatar: avatarUrl,
                    };
                    setUser(fallbackUser);
                    safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(fallbackUser));
                }
            }

            return {};
        } catch {
            return { error: "Network error. Please check your connection and try again." };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
        } catch {
            // Even if Supabase signout fails, clear local state
        }
        setUser(null);
        safeRemoveLocalStorage(STORAGE_KEYS.USER);
        safeRemoveLocalStorage(STORAGE_KEYS.APPLICATIONS);
    }, []);

    const applyForRecruiter = useCallback(async (company: string) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            role: "recruiter" as const,
            recruiterStatus: "pending" as const,
            recruiterCompany: company,
        };
        setUser(updatedUser);
        safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        if (user.id) {
            try {
                await supabase
                    .from("profiles")
                    .update({
                        role: "recruiter",
                        recruiter_status: "pending",
                        recruiter_company: company,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", user.id);
            } catch {
                console.warn("Could not sync recruiter application to Supabase");
            }
        }
    }, [user]);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        safeSetLocalStorage(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        // Update in Supabase if authenticated
        if (user.id) {
            try {
                const { id, email, ...profileUpdates } = updates;
                if (Object.keys(profileUpdates).length > 0) {
                    await supabase
                        .from("profiles")
                        .update({
                            ...profileUpdates,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", user.id);
                }
            } catch {
                console.warn("Could not sync profile to Supabase");
            }
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, applyForRecruiter, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
