import React from 'react';
import { PanelLeftClose, PanelLeft, Crown, Sparkles, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AdminSidebarNav, { NavSection } from './AdminSidebarNav';
import AdminSidebarProfile from './AdminSidebarProfile';
import AdminNotificationBell from './AdminNotificationBell';
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
        'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
        'border-r border-slate-800/50',
        'transition-all duration-300 ease-out',
        'backdrop-blur-xl',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
      </div>

      {/* Super Admin Brand Section */}
      <div className={cn(
        'relative flex items-center gap-3 px-4 py-5 border-b border-slate-800/50',
        'bg-gradient-to-r from-slate-900/80 via-slate-800/30 to-transparent',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-transparent" />
        
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-slate-900" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 border-slate-700/50 shadow-xl">
              <div className="text-center py-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <Crown className="h-4 w-4 text-orange-400" />
                  Super Admin
                </p>
                <p className="text-xs text-slate-400 mt-0.5">CHost Control Panel</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center animate-pulse">
                <Zap className="h-2.5 w-2.5 text-slate-900" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-lg leading-tight tracking-tight">Super Admin</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-gradient-to-r from-primary/20 via-red-500/15 to-orange-500/20 text-orange-300 text-[10px] px-2 py-0.5 h-5 border border-orange-500/30 font-semibold rounded-md">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
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
              className="h-9 w-9 hover:bg-slate-800/80 rounded-xl shrink-0 text-slate-400 hover:text-white transition-all duration-200"
              onClick={onToggle}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Collapsed Toggle Button */}
      {collapsed && (
        <div className="p-3 relative">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-10 hover:bg-slate-800/60 rounded-xl text-slate-400 hover:text-white transition-all duration-200 border border-transparent hover:border-slate-700/50"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 border-slate-700/50 font-medium">
              Expand Menu
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Navigation */}
      <AdminSidebarNav sections={navSections} collapsed={collapsed} />

      {/* Theme Toggle */}
      <ThemeToggle collapsed={collapsed} />

      {/* Profile Section */}
      <AdminSidebarProfile collapsed={collapsed} />
    </aside>
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (collapsed) {
    return (
      <div className="px-3 py-2 border-t border-slate-800/50">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10 hover:bg-slate-800/60 rounded-xl text-slate-400 hover:text-white transition-all duration-200"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-900 border-slate-700/50 font-medium">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="mx-3 px-4 py-3 border-t border-slate-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDark ? (
            <Moon className="h-4 w-4 text-slate-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
          <span className="text-sm text-slate-300 font-medium">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={() => toggleTheme()}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
};

export default AdminSidebar;