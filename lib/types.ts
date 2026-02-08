// User and Authentication Types
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    handle: string;
    bio?: string;
    location?: string;
    website?: string;
    cv?: string;
    role?: 'candidate' | 'employer' | 'both' | 'recruiter' | 'admin';
    recruiterStatus?: 'pending' | 'approved' | 'rejected';
    recruiterCompany?: string;
}

// Job Types
export interface Job {
    id: string;
    role: string;
    company: string;
    location: string;
    salary: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
    description?: string;
    requirements?: string[];
    benefits?: string[];
    employerId: string;
    postedDate: Date;
}

// Application Types
export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    candidateAvatar?: string;
    candidateHandle: string;
    candidateCV?: string;
    candidateBio?: string;
    candidateLocation?: string;
    candidateWebsite?: string;
    status: 'pending' | 'shortlisted' | 'rejected';
    appliedDate: Date;
    notes?: ApplicationNote[];
}

export interface ApplicationNote {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
}

// Community Types
export interface Post {
    id: string;
    authorId: string;
    author: {
        name: string;
        handle: string;
        avatar?: string;
    };
    content: string;
    image?: string;
    videoUrl?: string;
    likes: number;
    likedBy: string[];
    comments: Comment[];
    timestamp: Date;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    author: {
        name: string;
        handle: string;
        avatar?: string;
    };
    content: string;
    timestamp: Date;
}

export interface ListingAccessRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    listingId: string;
    ownerId: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: Date;
}
