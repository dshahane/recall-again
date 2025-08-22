// src/components/site-header.tsx
'use client'

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePageInfo } from "@/app/context/page-context"
import { LayoutDashboard } from "lucide-react"

export function SiteHeader() {
  const { title } = usePageInfo()

  return (
      <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {/* The SidebarTrigger is styled here */}
          <div className="flex items-center gap-2">
            <SidebarTrigger  />
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Token Recall Studio</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <h2 className="text-base font-medium text-muted-foreground">{title}</h2>
          </div>
        </div>
      </header>
  )
}