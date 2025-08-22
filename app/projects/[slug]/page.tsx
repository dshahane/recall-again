import { AppBreadcrumbs } from '@/components/nav/app-breadcrumbs'
import SchemaMapper, {SchemaSpec} from "@/components/schema-mapper/mapper";
import {usePageInfo} from "@/app/context/page-context";
import {useEffect} from "react";

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const { setPageInfo } = usePageInfo()

    useEffect(() => {
        setPageInfo('Settings Page', [
            { children: 'Home', href: '/' },
            { children: 'Projects', href: '/projects' },
        ])
    }, [setPageInfo])

    // Example schemas
    const sourceSchemas: SchemaSpec[] = [
        { label: 'Customer', fields: ['firstName', 'lastName', 'email'], version: '1.0.0', color: 'bg-blue-50' },
        { label: 'Orders', fields: ['price', 'tax'], version: '2.1.0', color: 'bg-green-50' },
    ]
    const destinationSchema: SchemaSpec = { label: 'Target', fields: ['full_name', 'order_total'], version: '3.0.0', color: 'bg-slate-50' }

    const breadcrumbs = [
        { label: 'Projects', href: '/projects' },
        { label: slug },
    ]

    return (
        <SchemaMapper
            sourceSchemas={sourceSchemas}
            destinationSchema={destinationSchema}
            onChange={(state) => console.log('Mapping JSON for', slug, state)}
        />
    )
}
