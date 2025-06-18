'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const LoadingContext = createContext({
    isLoading: false,
    setLoading: (loading: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setLoading] = useState(false);

    // ローディング中はスクロールを無効化
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isLoading]);

    return <LoadingContext.Provider value={{ isLoading, setLoading }}>{children}</LoadingContext.Provider>;
}
