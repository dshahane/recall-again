'use client';
import React, {useEffect} from 'react';
import { useRouter } from "next/navigation";
import { SchemaSpec } from '@/app/types/mapper';
import { SchemaMapper } from '@/components/schema-mapper/mapper';
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import KnowledgeDashboard from "@/components/knowledge/KnowledgeDashboard";
import IntegrationsSettings from "@/components/settings/IntegrationsSettings";
import Workbench from "@/components/settings/ingestion/Workbench";
import AssetManager from "@/components/settings/dataplane/AssetManager";
import {usePageInfo} from "@/app/context/page-context";
import BackButton from "@/components/ui/BackButton";

const sourceSchemas: SchemaSpec[] = [
    { label: 'Customer', fields: ['firstName', 'lastName', 'email'], version: '1.0.0', color: 'bg-blue-50' },
    { label: 'Orders', fields: ['price', 'tax'], version: '2.1.0', color: 'bg-green-50' },
];

const destinationSchema: SchemaSpec = {
    label: 'Target',
    fields: ['full_name', 'order_total'],
    version: '3.0.0',
    color: 'bg-slate-50'
};

export default function SettingsPage({ params } : {params: {slug: string}}) {
    const { slug } = params;
    const { setPageInfo } = usePageInfo();

    useEffect(() => {
        const pageTitle = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
        const pageBreadcrumbs = [
            { children: 'Home', href: '/' },
            { children: 'Settings', href: '/settings' },
            { children: pageTitle },
        ];

        setPageInfo(pageTitle, pageBreadcrumbs);
    }, [slug, setPageInfo]);

    let pageContent;
    switch (slug) {
        case 'profile':
            pageContent = <ProfileSettings />;
            break;
        case 'security':
            pageContent =  <SecuritySettings />;
            break;
        case 'notifications':
            pageContent =  <NotificationsSettings />;
            break;
        case 'knowledge':
            pageContent = <KnowledgeDashboard />;
            break;
        case 'integrations':
            pageContent = <IntegrationsSettings />;
            break;
        case 'ingestion':
            pageContent =  <AssetManager />;
            break;
        case 'metadata':
            pageContent =  <Workbench />;
            break;
        case 'workbench':
            pageContent =  <Workbench />;
            break;
        default:
            pageContent =  <SchemaMapper
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
    );
}