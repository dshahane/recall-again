'use client';

import React from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import Link2 from 'next/link';
import {ChevronRight, Folder, LucideIcon} from "lucide-react";

export function NavSettings({ settings,}: {
  settings: {
    title: string
    url: string
    icon: LucideIcon,
  }
}) {
  const { isMobile } = useSidebar();

  return (
      <>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
              <SidebarMenuItem key={settings.title}>
                <SidebarMenuButton>
                  <Link2 href={settings.url} className="flex items-center gap-2 w-full">
                    {settings.icon && (() => {
                      const Icon = settings.icon; // Capitalize first letter
                      return <Icon />;
                    })()}
                    <span>{settings.title}</span>
                  </Link2>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </>
  );
}
