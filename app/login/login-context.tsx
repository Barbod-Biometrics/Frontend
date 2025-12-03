"use client";

import React, { createContext, useContext, useState } from "react";

interface LoginContextType {
    isHovered: boolean;
    setIsHovered: (value: boolean) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: React.ReactNode }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <LoginContext.Provider value={{ isHovered, setIsHovered }}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLoginContext() {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error("useLoginContext must be used within a LoginProvider");
    }
    return context;
}
