import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Crown, PanelLeft, LogOut, Settings, Sun, Moon, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { sidebarNavSections, type NavSection } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCMSRole } from '@/hooks/useCMSRole';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminNotificationBell from '../AdminNotificationBell';

interface TabletSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TabletSidebar: React.FC<TabletSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: cmsRole } = useCMSRole();
  
  const initials = user?.email?.charAt(0).toUpperCase() || 'A';
  const isSuperAdmin = cmsRole?.role === 'super_admin';
  
  // Filter out restricted items for non-super-admins
  const filteredNavSections: NavSection[] = useMemo(() => {
    return sidebarNavSections.map(section => ({
      ...section,
      items: section.items.filter(item => !item.restricted || isSuperAdmin)
    })).filter(section => section.items.length > 0);
  }, [isSuperAdmin]);
  
  const isDark = theme === 'dark';
  
  // Get role display info
  const roleLabel = useMemo(() => {
    switch (cmsRole?.role) {
      case 'super_admin': return { title: 'Super Admin', subtitle: 'Full Access' };
      case 'editor': return { title: 'Editor', subtitle: 'Content Editor' };
      case 'viewer': return { title: 'Viewer', subtitle: 'Read Only' };
      default: return { title: 'CMS Admin', subtitle: 'CHost CMS' };
    }
  }, [cmsRole?.role]);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex-col",
        "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        "border-r border-slate-800/50",
        "transition-all duration-300 ease-out",
        "backdrop-blur-xl",
        // Hidden on mobile (≤768px), visible on tablet+ (>768px)
        "hidden",
        "md:flex", // md = 768px+
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Brand Section */}
      <div className={cn(
        "relative flex items-center gap-3 px-4 py-4 border-b border-slate-800/50",
        "bg-gradient-to-r from-slate-900/80 to-transparent",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{roleLabel.title}</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">{roleLabel.title}</h2>
                <p className="text-xs text-slate-400">CHost CMS</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <AdminNotificationBell collapsed={collapsed} />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-800/60 text-slate-400 hover:text-white"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Collapsed Toggle */}
      {collapsed && (
        <div className="p-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-10 hover:bg-slate-800/60 text-slate-400 hover:text-white"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Menu</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {filteredNavSections.map((section, index) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const link = (
                    <NavLink
                      to={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                        "transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-primary/20 to-accent/10 text-white border-l-2 border-primary"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active ? "text-primary" : "text-slate-500 group-hover:text-primary"
                      )} />
                      {!collapsed && (
                        <span>{language === 'bn' && item.labelBn ? item.labelBn : item.label}</span>
                      )}
                    </NavLink>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 border-slate-700">
                          {language === 'bn' && item.labelBn ? item.labelBn : item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return <div key={item.href}>{link}</div>;
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Theme Toggle */}
      <div className={cn(
        "px-3 py-2 border-t border-slate-800/50",
        collapsed ? "flex justify-center" : ""
      )}>
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-slate-800/60 text-slate-400 hover:text-white"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 text-slate-400">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-sm">{isDark ? 'Dark' : 'Light'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-slate-800/60"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              Switch
            </Button>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className={cn(
        "p-3 border-t border-slate-800/50",
        collapsed ? "flex flex-col items-center gap-2" : ""
      )}>
        {collapsed ? (
          <>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button onClick={() => navigate('/admin/settings')}>
                  <Avatar className="h-9 w-9 ring-2 ring-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{user?.email}</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-red-500/20 text-red-400"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
            <Avatar className="h-10 w-10 ring-2 ring-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-slate-400">{roleLabel.title}</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-700/50 text-slate-400"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-500/20 text-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TabletSidebar;
