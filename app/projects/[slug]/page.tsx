import { AppBreadcrumbs } from '@/components/nav/app-breadcrumbs'
import SchemaMapper, {SchemaSpec} from "@/components/schema-mapper/mapper";

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params

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
        <div className="flex flex-col gap-4">
            <AppBreadcrumbs crumbs={breadcrumbs} />
            <div className="p-4 bg-muted/50 rounded-xl flex-1 min-h-[60vh]">
                <h2 className="text-lg font-semibold mb-4">Project: {slug}</h2>
                <SchemaMapper
                    sourceSchemas={sourceSchemas}
                    destinationSchema={destinationSchema}
                    onChange={(state) => console.log('Mapping JSON for', slug, state)}
                />
            </div>
        </div>
    )
}
