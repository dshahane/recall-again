'use client';
import React, {useEffect} from 'react';
import {SchemaMapper} from '@/components/schema-mapper/mapper';
import {SchemaSpec} from "@/app/types/mapper";
import ChatPanel from "@/components/chat/ChatPanel";
import {usePageInfo} from "@/app/context/page-context";

const sourceSchemas: SchemaSpec[] = [
    { label: 'Customer', fields: ['firstName', 'lastName', 'email'], version: '1.0.0', color: 'bg-blue-50' },
//    { label: 'Orders', fields: ['price', 'tax'], version: '2.1.0', color: 'bg-green-50' },
];
const destinationSchema: SchemaSpec = { label: 'Target', fields: ['full_name', 'order_total'], version: '3.0.0', color: 'bg-slate-50' };


export default function AgentsPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    /*
    const { setPageInfo } = usePageInfo()

    useEffect(() => {
        setPageInfo('Settings Page', [
            { children: 'Home', href: '/' },
            { children: 'Settings', href: '/settings' },
        ])
    }, [setPageInfo])*/

    let pageContent;

    /* 'agent', 'chat', or 'search' */
    switch (slug) {
        case 'chat':
            pageContent = <ChatPanel/>;
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
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                {pageContent}
            </div>
    );
}