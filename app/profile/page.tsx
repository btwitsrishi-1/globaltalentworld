"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useAuth } from "@/lib/auth-context";
import { isValidUrl } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Save, Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, updateProfile, isLoading } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        website: "",
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [websiteError, setWebsiteError] = useState("");

    // Sync form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                bio: user.bio || "",
                location: user.location || "",
                website: user.website || "",
            });
        }
    }, [user]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user && !isLoading) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (!user) {
        return (
            <main className="min-h-screen bg-[#060608] text-white flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setSaveMessage({ type: "error", text: "Image must be under 5MB" });
                return;
            }
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ avatar: reader.result as string });
                setIsUploading(false);
                setSaveMessage({ type: "success", text: "Avatar updated!" });
                setTimeout(() => setSaveMessage(null), 3000);
            };
            reader.onerror = () => {
                setIsUploading(false);
                setSaveMessage({ type: "error", text: "Failed to upload image" });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setSaveMessage({ type: "error", text: "CV must be under 10MB" });
                return;
            }
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ cv: file.name });
                setIsUploading(false);
                setSaveMessage({ type: "success", text: "CV uploaded!" });
                setTimeout(() => setSaveMessage(null), 3000);
            };
            reader.onerror = () => {
                setIsUploading(false);
                setSaveMessage({ type: "error", text: "Failed to upload CV" });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        // Validate website URL
        if (formData.website && !isValidUrl(formData.website)) {
            setWebsiteError("Please enter a valid URL (e.g., https://example.com)");
            return;
        }
        setWebsiteError("");

        // Validate name
        if (!formData.name.trim()) {
            setSaveMessage({ type: "error", text: "Name cannot be empty" });
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile(formData);
            setSaveMessage({ type: "success", text: "Profile saved successfully!" });
        } catch {
            setSaveMessage({ type: "error", text: "Failed to save profile. Please try again." });
        }
        setIsSaving(false);
        setTimeout(() => setSaveMessage(null), 3000);
    };

    return (
        <main className="min-h-screen bg-[#060608] text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div>
                        <h1 className="font-sans font-light text-4xl sm:text-5xl text-white mb-2">Your Profile</h1>
                        <p className="text-slate-400">Manage your public profile and settings</p>
                    </div>

                    {/* Save Toast */}
                    <AnimatePresence>
                        {saveMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                                    saveMessage.type === "success"
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                            >
                                {saveMessage.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium">{saveMessage.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 space-y-8">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">
                                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-[#060608]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    disabled={isUploading}
                                    aria-label="Change profile picture"
                                >
                                    {isUploading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                                <p className="text-blue-400">{user.handle}</p>
                                <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="profile-name" className="block text-sm font-medium text-slate-300 mb-2">
                                    Name
                                </label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    id="profile-bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                    maxLength={500}
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="profile-location" className="block text-sm font-medium text-slate-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        id="profile-location"
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="profile-website" className="block text-sm font-medium text-slate-300 mb-2">
                                        Website
                                    </label>
                                    <input
                                        id="profile-website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => {
                                            setFormData({ ...formData, website: e.target.value });
                                            if (websiteError) setWebsiteError("");
                                        }}
                                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            websiteError ? "border-red-500/50" : "border-white/10"
                                        }`}
                                        placeholder="https://yoursite.com"
                                    />
                                    {websiteError && (
                                        <p className="text-xs text-red-400 mt-1">{websiteError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CV/Resume Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                CV / Resume
                            </label>
                            <div className="flex items-center gap-4">
                                {user.cv ? (
                                    <div className="flex-1 flex items-center justify-between px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm text-slate-300">{user.cv}</span>
                                        </div>
                                        <button
                                            onClick={() => updateProfile({ cv: undefined })}
                                            className="p-1 hover:bg-white/10 rounded transition-colors"
                                            aria-label="Remove CV"
                                        >
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => cvInputRef.current?.click()}
                                        className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                                        disabled={isUploading}
                                    >
                                        <Upload className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm text-slate-300">Upload CV/Resume</span>
                                    </button>
                                )}
                                <input
                                    ref={cvInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCVUpload}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">PDF, DOC, or DOCX (Max 10MB)</p>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
