'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/nav/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MainContent } from './main-content'


    export function ClientLayout({ children }: { children: React.ReactNode }) {
        return (
            <SidebarProvider>
                <div className="flex h-screen w-screen overflow-hidden">
                    <SiteHeader />
                    <AppSidebar />
                    <MainContent>
                        {/* <AppBreadCrump /> */}
                        {children}
                    </MainContent>
                </div>
            </SidebarProvider>
        )
    }

