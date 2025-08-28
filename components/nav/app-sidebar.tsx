'use client'

import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import { TeamSwitcher } from '../team-switcher'
import { NavUser } from './nav-user'
import { SidebarNavList, type NavItem } from './app-sidebar-nav-section'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  ProjectorIcon,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import {NavSettings} from "@/components/nav/nav-settings";

const data = {
  user: { name: 'dinesh', email: 'dinesh@trl.com', avatar: '/avatars/shadcn.jpg' },
  teams: [
    { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
    { name: 'Bee Boulevard.', logo: AudioWaveform, plan: 'Startup' },
    { name: 'Cool Corp.', logo: Command, plan: 'Free' },
  ],
  navMain: [
    {
      title: 'Applications',
      url: '#',
      icon: SquareTerminal,
      items: [
        { title: 'Agents', url: '/agents/agents' },
        { title: 'Chat with Agents', url: '/agents/chat' },
        { title: 'Browse Information', url: '/agents/browse' },
        { title: 'Discover and Search', url: '/agents/search' },
        { title: 'Insights', url: '/agents/analytics' },
      ],
    },
    {
      title: 'Model Gym',
      url: '#',
      icon: Bot,
      items: [
        { title: 'Taxonomy', url: '/models/schema-editor' },
        { title: 'Data Mapping', url: '/models/schema-mapper' },
        { title: 'Context', url: '/models/context' },
        { title: 'Skills', url: '/models/skills' },
        { title: 'Actions', url: '/models/actions' },
        { title: 'Teachers', url: '/models/yoda' },
        { title: 'Training', url: '/models/training' },
      ],
    },
  ] satisfies NavItem[],
  projects: [
    {
      title: 'Projects',
      url: '#',
      icon: ProjectorIcon,
      items: [
        { title: 'Growth Engineering', icon: ProjectorIcon, url: '/projects/project-1' },
        { title: 'SEO', icon: ProjectorIcon, url: '/projects/project-2' },
      ],
    },
  ] satisfies NavItem[],

  navBottom: [
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'Introduction', url: '/docs/intro' },
        { title: 'Tutorials', url: '/docs/tutorials' },
      ],
    },
  ] satisfies NavItem[],
}

const navSettings = {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
}

export function AppSidebar({ className }: { className?: string }) {
  return (
      <Sidebar collapsible="icon" className={`flex flex-col ${className || ''}`}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent>
          {/* Top sections */}
          <SidebarNavList sections={data.navMain} />
          {/* Projects
          <SidebarNavList sections={data.projects} />
          */}
        </SidebarContent>

        <SidebarFooter>
          {/* Bottom sections expand upwards */}
          <NavSettings settings={navSettings} />
          <SidebarNavList sections={data.navBottom} direction="up" />
          <NavUser user={data.user} />
          <SidebarNavList sections={data.navBottom} direction="up" />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
  )
}
