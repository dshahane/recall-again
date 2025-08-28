'use client'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { PageProvider } from "@/app/context/page-context"
import { ClientLayout } from "@/components/layout/client-layout"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="h-screen flex flex-col overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PageProvider>
                <ClientLayout>{children}</ClientLayout>
            </PageProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
