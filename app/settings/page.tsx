'use client'

import {useEffect, useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User2,
  Lock,
  Bell,
  BookOpen,
  Plug,
  Database,
  FileEdit,
  Map
} from 'lucide-react';
import {usePageInfo} from "@/app/context/page-context";

// This is a mock context hook for demonstration purposes,
// as the original code uses a context not available here.
// In a real application, you would use your actual TabContext.
const useTab = () => {
  const [activeTab, setActiveTab] = useState('profile');
  return { activeTab, setActiveTab };
};

const settings = [
  { name: 'profile', title: 'Profile', description: 'Manage your public profile and account details.', icon: <User2 className="h-6 w-6" /> },
  { name: 'security', title: 'Security', description: 'Change your password and enable 2FA.', icon: <Lock className="h-6 w-6" /> },
  { name: 'notifications', title: 'Notifications', description: 'Configure how you receive alerts.', icon: <Bell className="h-6 w-6" /> },
  { name: 'knowledge', title: 'Knowledge', description: 'Manage your connected knowledge sources and run queries.', icon: <BookOpen className="h-6 w-6" /> },
  { name: 'integrations', title: 'Integrations', description: 'Connect to third-party services to enhance your experience.', icon: <Plug className="h-6 w-6" /> },
  { name: 'ingestion', title: 'Data Assets', description: 'Import critical data assets (RDF, Tabular, and unstructured).', icon: <Database className="h-6 w-6" /> },
  { name: 'metadata', title: 'Metadata', description: 'Schema, metadata, and mappings', icon: <FileEdit className="h-6 w-6" /> },
  { name: 'mapper', title: 'Mapper', description: 'Schema mappings', icon: <Map className="h-6 w-6" /> },
  { name: 'workbench', title: 'Data Workbench', description: 'Edit and enrich data', icon: <Database className="h-6 w-6" /> },
];

export default function SettingsApp() {
  // We're keeping the mock hook here, but the onClick now uses direct navigation.
  const {setActiveTab} = useTab();
  const { setPageInfo } = usePageInfo();

  useEffect(() => {
    setPageInfo('Settings Page', [
      { children: 'Home', href: '/' },
      { children: 'Settings', href: '/settings' },
    ])
  }, [setPageInfo]);

  const gridClasses = "grid gap-4 mt-4";
  const listClasses = "space-y-4 mt-4";

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Settings</h2>
        <div className={gridClasses}>
          <div className="grid grid-cols-4 sm:grid-cols-3 gap-4 mt-4">
            {settings.map((setting) => (
                <Card
                    key={setting.name}
                    // This is the change: Navigating directly to the URL.
                    // In a real app, you would typically use a router's navigate function.
                    onClick={() => window.location.href = `/settings/${setting.name}`}
                    className="cursor-pointer hover:bg-muted transition-colors flex flex-col p-4 space-y-2"
                >
                  <div className="text-primary mb-2">
                    {setting.icon}
                  </div>
                  <h4 className="text-lg font-semibold">{setting.title}</h4>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </Card>
            ))}
          </div>
        </div>
      </div>
  );
}
