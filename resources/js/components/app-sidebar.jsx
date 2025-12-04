import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { index as campaignsIndex } from '@/routes/campaigns';
import { index as subscribersIndex } from '@/routes/subscribers';
import { index as tagsIndex } from '@/routes/tags';
import { index as SenderIdIndex } from '@/routes/sender-ids';
import { index as singleSmsIndex } from '@/routes/single-sms';
import {
    Send,
    LayoutGrid,
    Megaphone,
    Users,
    Tag,
    IdCard,
    Coins,
    Settings,
    ShieldCheck,
} from 'lucide-react';
import AppLogo from './app-logo';
import billing from '../routes/billing/index.ts';
import admin from '../routes/admin/index.ts';
// import { admin } from '../routes/admin/index.ts';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Compose SMS',
        href: singleSmsIndex(),
        icon: Send,
    },
    {
        title: 'Campaigns',
        href: campaignsIndex(),
        icon: Megaphone,
    },
    {
        title: 'Subscribers',
        href: subscribersIndex(),
        icon: Users,
    },
    {
        title: 'Tags',
        href: tagsIndex(),
        icon: Tag,
    },
    {
        title: 'Sender ID',
        href: SenderIdIndex(),
        icon: IdCard,
    },
    {
        title: 'Billing',
        href: billing.index().url,
        icon: Coins,
    },
];

const adminNavItems = [
    {
        title: 'Admin Settings',
        href: admin.settings.index().url,
        icon: Settings,
    },
    {
        title: 'Sender ID Approvals',
        href: admin.senderIds.index().url,
        icon: ShieldCheck,
    },
];

const footerNavItems = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth?.isAdmin;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && (
                    <>
                        <SidebarSeparator className="mx-0" />
                        <NavMain items={adminNavItems} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
