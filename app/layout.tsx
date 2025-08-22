import type { Metadata } from "next"
import "./globals.css"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {SiteHeader} from "@/components/site-header";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "My App",
    description: "Dashboard with persistent sidebar",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
            className="py-4"
        >
            {/* Sidebar always visible */}
            <AppSidebar />

            {/* Main Content with header + breadcrumb */}
            <SidebarInset>
                <SiteHeader />
                <div className="main gap-2 px-4">
                    <div className="flex items-center">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Page Content */}
                    <div className="flex flex-1 flex-col py-4">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
