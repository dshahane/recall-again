// main-content.tsx
'use client'
import { ReactNode } from 'react'
import {DynamicBreadcrumb} from "@/components/dynamic-breadcrumb";

export function MainContent({ children }: { children: ReactNode }) {
    return (
        <main
            className="flex-1 mt-[var(--header-height)]  w-auto overflow-auto"
        >
            <DynamicBreadcrumb />
            <div className="min-h-screen px-6 lg:px-8">
                {children}
            </div>
        </main>
    )
}

