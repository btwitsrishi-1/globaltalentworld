"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface CreatePostProps {
    onPost: (content: string, image?: string) => void;
}

export const CreatePost = ({ onPost }: CreatePostProps) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!content.trim() && !imagePreview) return;
        onPost(content, imagePreview || undefined);
        setContent("");
        setImagePreview(null);
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 group focus-within:border-blue-500/50 transition-colors"
        >
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex-shrink-0 overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
                    )}
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your latest creation or thought..."
                        className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 resize-none min-h-[80px]"
                    />

                    <AnimatePresence>
                        {imagePreview && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative mt-4 rounded-xl overflow-hidden border border-white/10 max-h-64 w-fit"
                            >
                                <img src={imagePreview} alt="Preview" className="max-h-64 object-contain" />
                                <button
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && !imagePreview}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                        >
                            <span>Post</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
