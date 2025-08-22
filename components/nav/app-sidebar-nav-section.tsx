"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

export type NavItem = {
    title: string
    url?: string
    icon?: React.ElementType
    items?: NavItem[]
}

type SectionProps = {
    nav?: NavItem            // make it optional so we can guard
    direction?: "down" | "up" // "up" for footer, default "down"
}

export function SidebarNavSection({ nav, direction = "down" }: SectionProps) {
    // Hard guard: if nothing to render, bail out safely
    if (!nav) return null

    const pathname = usePathname()

    const parentHref = nav.url && nav.url !== "#" ? nav.url : undefined
    const isActive = !!(parentHref && pathname === parentHref)
    const isSubActive = !!nav.items?.some((item) => item.url && pathname === item.url)

    // Ensure boolean
    const defaultOpen = !!(isActive || isSubActive)

    return (
        <SidebarMenu key={nav.title}>
            <Collapsible defaultOpen={defaultOpen}>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                            {parentHref ? (
                                <Link href={parentHref}>
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded hover:bg-muted ${
                                            isActive || isSubActive ? "bg-accent text-accent-foreground" : ""
                                        }`}
                                    >
                                        {nav.icon && <nav.icon className="h-5 w-5" />}
                                        <span>{nav.title}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div
                                    className={`flex items-center gap-2 p-2 rounded hover:bg-muted ${
                                        isActive || isSubActive ? "bg-accent text-accent-foreground" : ""
                                    }`}
                                >
                                    {nav.icon && <nav.icon className="h-5 w-5" />}
                                    <span>{nav.title}</span>
                                </div>
                            )}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {nav.items?.length ? (
                        <CollapsibleContent className={direction === "up" ? "flex flex-col-reverse" : ""}>
                            <SidebarMenu>
                                {nav.items.map((item) => {
                                    const itemHref = item.url ?? "#"
                                    const subActive = !!(item.url && pathname === item.url)
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={itemHref}>
                                                    <div
                                                        className={`flex items-center gap-2 p-2 rounded hover:bg-muted pl-6 ${
                                                            subActive ? "bg-accent text-accent-foreground" : ""
                                                        }`}
                                                    >
                                                        {item.icon && <item.icon className="h-4 w-4" />}
                                                        <span>{item.title}</span>
                                                    </div>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </CollapsibleContent>
                    ) : null}
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    )
}

/**
 * Safely renders a list of sections.
 * Pass your arrays (navMain, projects, navBottom) into this.
 */
export function SidebarNavList({
                                   sections,
                                   direction = "down",
                               }: {
    sections?: NavItem[]
    direction?: "down" | "up"
}) {
    if (!sections?.length) return null
    return (
        <>
            {sections.map((s) => (
                <SidebarNavSection key={s.title} nav={s} direction={direction} />
            ))}
        </>
    )
}
