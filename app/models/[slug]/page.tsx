'use client'

import React, {useEffect} from "react";
import {usePageInfo} from "@/app/context/page-context";
import {SchemaMapper} from "@/components/schema-mapper/mapper";
import {SchemaSpec} from "@/app/types/mapper"
import {ModelTraining} from "@/components/models/training";
import ModelSkills from "@/components/models/skills";
import WorkflowBuilder from "@/components/models/actions";
import {ModelTeacher} from "@/components/models/yoda";
import ContextManagerApp from "@/components/models/context/context-manager";

export default function ModelsPage({params}: { params: { slug: string } }) {
    const {slug} = params
    const {setPageInfo} = usePageInfo()

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
        case 'context':
            pageContent = <ContextManagerApp/>;
            break;
        case 'actions':
            pageContent = <WorkflowBuilder/>;
            break;
        case 'skills':
            pageContent = <ModelSkills/>;
            break;
        case 'training':
            pageContent = <ModelTraining/>;
            break;
        case 'yoda':
            pageContent = <ModelTeacher/>;
            break;
        default:
            pageContent = <SchemaMapper
                sourceSchemas={sourceSchemas}
                destinationSchema={destinationSchema}
                onChange={(state) => console.log('Mapping JSON for', slug, state)}
            />
            break;
    }
    return (
        <div>
            {pageContent}
        </div>
    )
}
