'use client'

import React, {useEffect} from "react";
import {usePageInfo} from "@/app/context/page-context";
import {SchemaMapper} from "@/components/schema-mapper/mapper";
import {SchemaSpec} from "@/app/types/mapper"
import {ModelTraining} from "@/components/models/training";
import ModelSkills from "@/components/models/skills";
import WorkflowBuilder from "@/components/models/neo/workflow-builder";
import {ModelTeacher} from "@/components/models/yoda";
import ContextManagerApp from "@/components/models/context/context-manager";
import MetaFlow from "@/components/models/skills/meta-flow";
import ConceptEditorApp from "@/components/concept-editor/concept-editor-app";

export default function ModelsPage({params}: { params: { slug: string } }) {
    const {slug} = params;
    const {setPageInfo} = usePageInfo();

    useEffect(() => {
        const pageTitle = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
        const pageBreadcrumbs = [
            { children: 'Home', href: '/' },
            { children: 'Models', href: '/models' },
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
        case 'skills':
            pageContent = <ModelSkills/>;
            break;
        case 'actions':
            pageContent = <WorkflowBuilder/>;
            break;
        case 'training':
            pageContent = <ModelTraining/>;
            break;
        case 'yoda':
            // pageContent = <ModelTraining/>;
            //pageContent = <NeoContextBuilder/>
            pageContent = <MetaFlow/>
            break;
        default:
            pageContent = <div>Unknown Page check app-sidebar</div>
            break;
    }
    return pageContent;
}
