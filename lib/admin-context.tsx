"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminContextType {
    isAdmin: boolean;
    adminLogin: (username: string, password: string) => boolean;
    adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "gtw_admin_auth";

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
            if (stored === "true") {
                setIsAdmin(true);
            }
        } catch {
            // localStorage not available
        }
    }, []);

    const adminLogin = useCallback((username: string, password: string): boolean => {
        if (username === "dev" && password === "admin") {
            setIsAdmin(true);
            try {
                localStorage.setItem(ADMIN_STORAGE_KEY, "true");
            } catch {
                // localStorage not available
            }
            return true;
        }
        return false;
    }, []);

    const adminLogout = useCallback(() => {
        setIsAdmin(false);
        try {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
        } catch {
            // localStorage not available
        }
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, adminLogin, adminLogout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};
