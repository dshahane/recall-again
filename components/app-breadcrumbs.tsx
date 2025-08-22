'use client';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';


export default function Breadcrumbs() {
    const pathname = usePathname(); // e.g., '/projects/project-a'
    const segments = pathname.split('/').filter(Boolean);


    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, idx) => {
                    const path = '/' + segments.slice(0, idx + 1).join('/');
                    const isLast = idx === segments.length - 1;
                    return (
                        <BreadcrumbItem key={path}>
                            {isLast ? (
                                <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbLink href={path}>{decodeURIComponent(segment)}</BreadcrumbLink>
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}