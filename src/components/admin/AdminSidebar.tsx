import React from 'react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AdminSidebarNav, { NavSection } from './AdminSidebarNav';
import AdminSidebarProfile from './AdminSidebarProfile';
import AdminNotificationBell from './AdminNotificationBell';
import chostLogo from '@/assets/chost-logo.png';
import {
  LayoutDashboard,
  Package,
  Server,
  MonitorCog,
  ListTodo,
  ShoppingCart,
  CreditCard,
  FileText,
  RotateCcw,
  Users,
  UserCheck,
  Gift,
  MessageSquare,
  Megaphone,
  FileBarChart,
  Settings,
  Globe,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navSections: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'HOSTING',
    items: [
      { label: 'Hosting Plans', href: '/admin/hosting-plans', icon: Package },
      { label: 'Servers', href: '/admin/servers', icon: Server },
      { label: 'WHM / cPanel', href: '/admin/package-mapping', icon: MonitorCog },
      { label: 'Provisioning Queue', href: '/admin/provisioning', icon: ListTodo },
    ],
  },
  {
    label: 'BILLING',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      { label: 'Invoices', href: '/admin/invoices', icon: FileText },
      { label: 'Refund Requests', href: '/admin/refunds', icon: RotateCcw },
    ],
  },
  {
    label: 'USERS',
    items: [
      { label: 'Customers', href: '/admin/users', icon: Users },
      { label: 'Resellers', href: '/admin/resellers', icon: UserCheck },
      { label: 'Affiliates', href: '/admin/affiliates', icon: Gift },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Support Tickets', href: '/admin/tickets', icon: MessageSquare },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Reports & Logs', href: '/admin/webhooks', icon: FileBarChart },
      { label: 'API Credentials', href: '/admin/server-credentials', icon: Settings },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'bg-sidebar border-r border-sidebar-border',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Brand Section */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src={chostLogo} alt="CHost" className="h-6 w-6 object-contain" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-center">
                <p className="font-semibold">CHost</p>
                <p className="text-xs text-muted-foreground">Secure.Fast.Online</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <img src={chostLogo} alt="CHost" className="h-6 w-6 object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sidebar-foreground text-base leading-tight">CHost</h2>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
                Secure.Fast.Online
              </p>
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="flex items-center gap-1">
            <AdminNotificationBell collapsed={collapsed} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-sidebar-accent rounded-lg shrink-0"
              onClick={onToggle}
            >
              <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>

      {/* Collapsed Toggle Button */}
      {collapsed && (
        <div className="p-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-9 hover:bg-sidebar-accent rounded-lg"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Menu</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Navigation */}
      <AdminSidebarNav sections={navSections} collapsed={collapsed} />

      {/* Profile Section */}
      <AdminSidebarProfile collapsed={collapsed} />
    </aside>
  );
};

export default AdminSidebar;
