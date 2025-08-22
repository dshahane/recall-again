// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { PageProvider } from "@/app/context/page-context"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb" // Import the new component

export const metadata: Metadata = {
    title: "My App",
    description: "Dashboard with persistent sidebar",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PageProvider>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                    className="py-4"
                >
                    <AppSidebar />
                    <SidebarInset>
                        <div className="main gap-2 px-4">
                            <SiteHeader />
                            <DynamicBreadcrumb />
                            <div className="flex flex-1 flex-col py-4">
                                {children}
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </PageProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}