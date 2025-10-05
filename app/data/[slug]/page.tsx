'use client'

import React, {useEffect} from "react";
import {usePageInfo} from "@/app/context/page-context";
import {SchemaMapper} from "@/components/schema-mapper/mapper";
import {SchemaSpec} from "@/app/types/mapper"
import ContextManagerApp from "@/components/workflow-editor/context/context-manager";
import ConceptEditorApp from "@/components/concept-editor/concept-editor-app";
import AssetManager2 from "@/components/settings/dataplane/AssetManager2";


export default function DataPage({params}: { params: { slug: string } }) {
    const {slug} = params;
    const {setPageInfo} = usePageInfo();

    useEffect(() => {
        const pageTitle = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
        const pageBreadcrumbs = [
            { children: 'Home', href: '/' },
            { children: 'Data', href: '/data' },
            { children: pageTitle },
        ]
        setPageInfo(pageTitle, pageBreadcrumbs);
    }, [slug, setPageInfo]);

    // Example schemas
    const sourceSchemas: SchemaSpec[] = [
        {label: 'Customer', fields: ['firstName', 'lastName', 'email'], version: '1.0.0', color: 'bg-blue-50'},
        {label: 'Orders', fields: ['price', 'tax'], version: '2.1.0', color: 'bg-green-50'},
    ]
    const destinationSchema: SchemaSpec = {
        label: 'Target',
        fields: ['full_name', 'order_total'],
        version: '3.0.0',
        color: 'bg-slate-50'
    }

    let pageContent;
    switch (slug) {
        case 'taxonomy':
            pageContent = <ConceptEditorApp/>
            break;
        case 'data-assets':
            pageContent = <AssetManager2 />;
            break;
        case 'schema-mapper':
            pageContent = <SchemaMapper
                sourceSchemas={sourceSchemas}
                destinationSchema={destinationSchema}
                onChange={(state) => console.log('Mapping JSON for', slug, state)}
            />
            break;
        case 'context':
            pageContent = <ContextManagerApp/>;
            break;
        default:
            pageContent = <div>Unknown Page check app-sidebar</div>
            break;
    }
    return pageContent;
}
