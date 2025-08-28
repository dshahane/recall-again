'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
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
import { NavSettings } from './nav-settings'

const data = {
  user: { name: 'dinesh', email: 'dinesh@trl.com', avatar: '/avatars/shadcn.jpg' },
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
      <Sidebar
          className={`fixed top-[var(--header-height)] left-0 h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] z-20 bg-sidebar ${className || ''}`}
      >
        <SidebarContent>
          <SidebarNavList sections={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          <NavSettings settings={navSettings} />
          <SidebarNavList sections={data.navBottom} direction="up" />
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
  )
}
