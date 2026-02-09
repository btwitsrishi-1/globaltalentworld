import { supabase } from "./supabase";

const BUCKET = "ST1";

/**
 * Upload a file to Supabase Storage.
 * @param folder  Subfolder inside the media bucket (e.g. "posts", "insights", "reviews", "avatars", "cvs")
 * @param file    The File object to upload
 * @param customName Optional custom filename (defaults to timestamp-originalname)
 * @returns       The public URL of the uploaded file, or null on failure
 */
export async function uploadFile(
    folder: string,
    file: File,
    customName?: string
): Promise<string | null> {
    try {
        const ext = file.name.split(".").pop() || "bin";
        const fileName = customName || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = `${folder}/${fileName}`;

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        return getPublicUrl(filePath);
    } catch (err) {
        console.error("Upload failed:", err);
        return null;
    }
}

/**
 * Delete a file from Supabase Storage.
 * @param filePath  The full path within the bucket (e.g. "posts/12345.jpg")
 * @returns         True if deletion was successful
 */
export async function deleteFile(filePath: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET)
            .remove([filePath]);

        if (error) {
            console.error("Delete error:", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Delete failed:", err);
        return false;
    }
}

/**
 * Get the public URL of a file in Supabase Storage.
 * @param filePath  The full path within the bucket
 * @returns         The public URL string
 */
export function getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Extract the storage path from a full Supabase public URL.
 * Useful for deleting a file when you only have the public URL.
 */
export function extractPathFromUrl(publicUrl: string): string | null {
    try {
        const match = publicUrl.match(/\/storage\/v1\/object\/public\/ST1\/(.+)$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}
