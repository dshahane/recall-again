'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePageInfo } from '@/app/context/page-context'
import {AudioWaveform, Command, GalleryVerticalEnd, LayoutDashboard} from 'lucide-react'
import { TeamSwitcher } from '@/components/team-switcher'
import { NavUser } from '@/components/nav/nav-user'
import { Separator } from '@radix-ui/react-menu'

const user = { name: 'dinesh', email: 'dinesh@trl.com', avatar: '/avatars/shadcn.jpg' }
const teams = [
    { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
    { name: 'Bee Boulevard.', logo: AudioWaveform, plan: 'Startup' },
    { name: 'Cool Corp.', logo: Command, plan: 'Free' },
]

interface SiteHeaderProps {
    className?: string
}

export function SiteHeader({ className }: { className?: string }) {
    const { title } = usePageInfo()
    return (
        <header
            className={`fixed top-0 left-0 w-[100vw] z-50 h-[var(--header-height)] bg-background border-b ${className || ''}`}
        >
            <div className="flex items-center justify-between px-4 lg:px-6 h-full">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">{title || 'Token Recall Studio'}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <TeamSwitcher teams={teams} />
                    <Separator />
                    <NavUser user={user} />
                    <Separator />
                </div>
            </div>
        </header>
    )
}

