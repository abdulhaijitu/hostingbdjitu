import React from 'react';
import { PanelLeftClose, PanelLeft, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
        'border-r border-white/5',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Super Admin Brand Section */}
      <div className={cn(
        'relative flex items-center gap-3 p-4 border-b border-white/10',
        'bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 blur-xl" />
        
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Crown className="h-5 w-5 text-white" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-800 border-slate-700">
              <div className="text-center">
                <p className="font-bold text-white flex items-center gap-2">
                  <Crown className="h-4 w-4 text-orange-400" />
                  Super Admin
                </p>
                <p className="text-xs text-slate-400">CHost Control Panel</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
              <Crown className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base leading-tight">Super Admin</h2>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-300 text-[10px] px-1.5 py-0 h-4 border border-orange-500/30 font-medium">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  Full Access
                </Badge>
              </div>
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="relative flex items-center gap-1">
            <AdminNotificationBell collapsed={collapsed} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/10 rounded-lg shrink-0 text-slate-400 hover:text-white"
              onClick={onToggle}
            >
              <PanelLeftClose className="h-4 w-4" />
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
                className="w-full h-9 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-800 border-slate-700">
              Expand Menu
            </TooltipContent>
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
