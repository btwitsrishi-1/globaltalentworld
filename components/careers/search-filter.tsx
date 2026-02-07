"use client";

import { Search, MapPin, Filter } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useState } from "react";

export const SearchFilter = () => {
    const { searchQuery, setSearchQuery, locationQuery, setLocationQuery } = useJobs();
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [localLocation, setLocalLocation] = useState(locationQuery);

    const handleSearch = () => {
        setSearchQuery(localSearch);
        setLocationQuery(localLocation);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="sticky top-24 z-30 mb-12">
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-full p-2 pl-6 flex items-center shadow-2xl shadow-black/50">
                {/* Search Input */}
                <div className="flex-1 flex items-center gap-3 border-r border-white/10 pr-4">
                    <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for roles (e.g. 'Product Designer')..."
                        className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 w-full"
                        aria-label="Search jobs by role or company"
                    />
                </div>

                {/* Location Input */}
                <div className="hidden md:flex flex-1 items-center gap-3 px-4">
                    <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Location"
                        className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 w-full"
                        aria-label="Filter by location"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                    aria-label="Search jobs"
                >
                    <Filter className="w-4 h-4" />
                    <span>Search</span>
                </button>
            </div>

            {/* Active filters */}
            {(searchQuery || locationQuery) && (
                <div className="max-w-4xl mx-auto mt-3 flex items-center gap-2 px-6">
                    <span className="text-xs text-slate-500">Filters:</span>
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(""); setLocalSearch(""); }}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                        >
                            &quot;{searchQuery}&quot; &times;
                        </button>
                    )}
                    {locationQuery && (
                        <button
                            onClick={() => { setLocationQuery(""); setLocalLocation(""); }}
                            className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                        >
                            {locationQuery} &times;
                        </button>
                    )}
                    <button
                        onClick={() => { setSearchQuery(""); setLocationQuery(""); setLocalSearch(""); setLocalLocation(""); }}
                        className="text-xs text-slate-500 hover:text-white transition-colors ml-2"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
};
