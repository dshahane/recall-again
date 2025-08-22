'use client'

import { useRouter } from 'next/navigation'
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
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button' // <-- Import the Button component

export function DynamicBreadcrumb() {
    const { breadcrumbs } = usePageInfo()
    const router = useRouter()

    return (
        <div className="flex items-center">
            {/* Using Shadcn's Button for the back button */}
            <Button onClick={() => router.back()} variant="ghost" size="icon" className="-ml-1">
                <FaArrowLeft className="h-4 w-4" />
            </Button>
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
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