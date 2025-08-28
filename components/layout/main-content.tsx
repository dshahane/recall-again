// main-content.tsx
'use client'
import { ReactNode } from 'react'

export function MainContent({ children }: { children: ReactNode }) {
    return (
        <main
            className="flex-1 mt-[var(--header-height)]  w-auto overflow-auto"
        >
            <div className="min-h-screen px-6 lg:px-8">
                {children}
            </div>
        </main>
    )
}
