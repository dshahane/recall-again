'use client'

import React from 'react'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface AppBreadcrumbsProps  {
    crumbs: { label: string; href?: string }[]
}

export const AppBreadcrumbs = ({ crumbs }: AppBreadcrumbsProps) => {
    if (!crumbs || crumbs.length === 0) return null

    const lastIndex = crumbs.length - 1

    return (
        <header className="flex h-16 items-center gap-2 px-4 border-b border-muted-foreground/20">
            <Breadcrumb>
                <BreadcrumbList>
                    {crumbs.map((crumb, index) => (
                        <BreadcrumbItem key={index}>
                            {index === lastIndex ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={crumb.href || '#'}>{crumb.label}</BreadcrumbLink>
                            )}
                            {index < lastIndex && <BreadcrumbSeparator />}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    )
}
