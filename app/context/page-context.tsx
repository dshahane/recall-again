// src/context/page-context.tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

// Define your own type for a breadcrumb item
interface BreadcrumbItem {
    children: ReactNode;
    href?: string;
}

interface PageContextType {
    title: string
    breadcrumbs: BreadcrumbItem[]
    setPageInfo: (title: string, breadcrumbs: BreadcrumbItem[]) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState('AI Search System')
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

    const setPageInfo = (newTitle: string, newBreadcrumbs: BreadcrumbItem[]) => {
        setTitle(newTitle)
        setBreadcrumbs(newBreadcrumbs)
    }

    return (
        <PageContext.Provider value={{ title, breadcrumbs, setPageInfo }}>
            {children}
        </PageContext.Provider>
    )
}

export function usePageInfo() {
    const context = useContext(PageContext)
    if (context === undefined) {
        throw new Error('usePageInfo must be used within a PageProvider')
    }
    return context
}