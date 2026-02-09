import { supabase } from "@/lib/supabase";

// ========== Dashboard Stats ==========

export async function fetchDashboardStats() {
    const [usersRes, jobsRes, postsRes, recruiterRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("recruiter_status", "pending"),
    ]);

    return {
        totalUsers: usersRes.count ?? 0,
        activeListings: jobsRes.count ?? 0,
        communityPosts: postsRes.count ?? 0,
        pendingRecruiters: recruiterRes.count ?? 0,
    };
}

export async function fetchRecentActivity(limit = 8) {
    // Fetch recent profiles (new signups)
    const { data: recentUsers } = await supabase
        .from("profiles")
        .select("id, name, email, role, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

    // Fetch recent jobs
    const { data: recentJobs } = await supabase
        .from("jobs")
        .select("id, role, company, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

    // Fetch recent posts
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("id, content, created_at, author_id")
        .order("created_at", { ascending: false })
        .limit(limit);

    // Merge and sort by created_at descending
    type ActivityItem = {
        id: string;
        action: string;
        detail: string;
        time: string;
        type: "user" | "listing" | "community" | "recruiter";
        created_at: string;
    };

    const activities: ActivityItem[] = [];

    (recentUsers || []).forEach((u) => {
        const isRecruiter = u.role === "employer";
        activities.push({
            id: u.id,
            action: isRecruiter ? "Recruiter registered" : "New user registered",
            detail: `${u.name} joined as ${u.role || "candidate"}`,
            time: formatTimeAgo(u.created_at),
            type: isRecruiter ? "recruiter" : "user",
            created_at: u.created_at,
        });
    });

    (recentJobs || []).forEach((j) => {
        activities.push({
            id: j.id,
            action: "Listing published",
            detail: `${j.role} at ${j.company}`,
            time: formatTimeAgo(j.created_at),
            type: "listing",
            created_at: j.created_at,
        });
    });

    (recentPosts || []).forEach((p) => {
        const content = p.content ?? "";
        activities.push({
            id: p.id,
            action: "Community post created",
            detail: content.substring(0, 60) + (content.length > 60 ? "..." : ""),
            time: formatTimeAgo(p.created_at),
            type: "community",
            created_at: p.created_at,
        });
    });

    // Sort by date descending, take top N
    activities.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return activities.slice(0, limit);
}

// ========== Users ==========

export async function fetchAdminUsers() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data || [];
}

export async function updateUserBanStatus(userId: string, isBanned: boolean) {
    const { error } = await supabase
        .from("profiles")
        .update({ is_banned: isBanned })
        .eq("id", userId);
    return !error;
}

export async function updateRecruiterStatus(userId: string, status: "approved" | "rejected") {
    const { error } = await supabase
        .from("profiles")
        .update({ recruiter_status: status })
        .eq("id", userId);
    return !error;
}

export async function deleteUsers(userIds: string[]) {
    const { error } = await supabase
        .from("profiles")
        .delete()
        .in("id", userIds);
    return !error;
}

// ========== Listings ==========

export async function fetchAdminListings() {
    const { data, error } = await supabase
        .from("jobs")
        .select(`
            *,
            employer:profiles!employer_id(id, name, email, handle, avatar)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching listings:", error);
        return [];
    }
    return data || [];
}

export async function fetchListingApplicants(jobId: string) {
    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            candidate:profiles!candidate_id(id, name, email, handle, avatar, cv, location)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applicants:", error);
        return [];
    }
    return data || [];
}

export async function updateJob(jobId: string, updates: Record<string, unknown>) {
    const { error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", jobId);
    return !error;
}

export async function deleteJob(jobId: string) {
    const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);
    return !error;
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId);
    return !error;
}

// ========== Community ==========

export async function fetchAdminPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            author:profiles!author_id(id, name, handle, avatar)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
    return data || [];
}

export async function updatePost(postId: string, updates: Record<string, unknown>) {
    const { error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", postId);
    return !error;
}

export async function deletePost(postId: string) {
    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
    return !error;
}

// ========== Reviews ==========

export async function fetchAdminReviews() {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
    return data || [];
}

export async function createReview(review: {
    author_name: string;
    author_avatar?: string;
    rating: number;
    title: string;
    content: string;
    company?: string;
}) {
    const { data, error } = await supabase
        .from("reviews")
        .insert([review])
        .select()
        .single();

    if (error) {
        console.error("Error creating review:", error);
        return null;
    }
    return data;
}

export async function updateReview(reviewId: string, updates: Record<string, unknown>) {
    const { error } = await supabase
        .from("reviews")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", reviewId);
    return !error;
}

export async function deleteReview(reviewId: string) {
    const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
    return !error;
}

// ========== Helpers ==========

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
}
