import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white/10 dark:bg-white/10",
                className
            )}
            {...props}
        />
    );
}

export function PostCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-8" />
            </div>
        </div>
    );
}

export function JobCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <Skeleton className="h-1 w-full rounded-full" />
        </div>
    );
}

export function InsightCardSkeleton({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
    const sizeClasses = {
        small: "aspect-square",
        medium: "aspect-[4/3]",
        large: "aspect-[16/9]",
    };

    return (
        <div className={cn("relative rounded-2xl overflow-hidden border border-white/10", sizeClasses[size])}>
            <Skeleton className="absolute inset-0" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <Skeleton className="h-5 w-20 rounded-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
            </div>
        </div>
    );
}
