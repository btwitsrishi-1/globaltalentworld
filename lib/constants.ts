// Storage keys
export const STORAGE_KEYS = {
    USER: "gtw_user",
    APPLICATIONS: "gtw_applications",
    ADMIN_AUTH: "gtw_admin_auth",
    ACCESS_REQUESTS: "gtw_access_requests",
    ADMIN_INSIGHTS: "gtw_admin_insights",
    ADMIN_ABOUT: "gtw_admin_about",
    RECRUITER_APPLICATIONS: "gtw_recruiter_applications",
} as const;

// Default avatar generator
export const getDefaultAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3b82f6&color=fff`;

// URL validation
export const isValidUrl = (url: string): boolean => {
    if (!url) return true; // empty is fine
    try {
        new URL(url.startsWith("http") ? url : `https://${url}`);
        return true;
    } catch {
        return false;
    }
};

// Format date for display
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

// Format ISO date for <time> elements
export const toISODateString = (date: Date): string => {
    return date.toISOString();
};
