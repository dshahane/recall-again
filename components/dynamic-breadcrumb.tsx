// src/components/dynamic-breadcrumb.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation' // Import usePathname
import { FaArrowLeft } from 'react-icons/fa'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePageInfo } from '@/app/context/page-context'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export function DynamicBreadcrumb() {
    const { breadcrumbs } = usePageInfo()
    const router = useRouter()
    const pathname = usePathname() // Get the current pathname

    // Check if the current page is the home page
    const isHomePage = pathname === '/';

    return (
        <div className="flex items-center px-4 py-2 text-lg">
            {!isHomePage && ( // Conditionally render the button
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="-ml-1">
                    <FaArrowLeft className="h-4 w-4" />
                </Button>
            )}
            {!isHomePage && ( // Conditionally render the separator as well
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
            )}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {item.href ? (
                                    <BreadcrumbLink href={item.href}>{item.children}</BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{item.children}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}