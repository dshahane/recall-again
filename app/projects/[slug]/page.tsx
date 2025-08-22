'use client';
export function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params;


// Fetch or dynamically load schemas per project
    const sourceSchemas: SchemaSpec[] = [
        { label: 'Customer', fields: ['firstName', 'lastName', 'email'], version: '1.0.0', color: 'bg-blue-50' },
        { label: 'Orders', fields: ['price', 'tax'], version: '2.1.0', color: 'bg-green-50' },
    ];


    const destinationSchema: SchemaSpec = { label: 'Target', fields: ['full_name', 'order_total'], version: '3.0.0', color: 'bg-slate-50' };


    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">Project: {slug}</h2>
            <SchemaMapper
                sourceSchemas={sourceSchemas}
                destinationSchema={destinationSchema}
                onChange={(state) => console.log('Mapping JSON for', slug, state)}
            />
        </div>
    );
}