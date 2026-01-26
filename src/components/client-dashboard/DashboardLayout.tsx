import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Server, Globe, Mail, Database, FolderOpen, 
  Shield, Archive, CreditCard, MessageSquare, User, LogOut, 
  ChevronDown, Settings, Sun, Moon, Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/common/SEOHead';
import { NotificationProvider, NotificationBell } from './NotificationSystem';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', path: '/client' },
  { icon: Server, label: 'My Hosting', labelBn: 'আমার হোস্টিং', path: '/client/hosting' },
  { icon: Globe, label: 'My Domains', labelBn: 'আমার ডোমেইন', path: '/client/domains' },
  { icon: Mail, label: 'Emails', labelBn: 'ইমেইল', path: '/client/emails' },
  { icon: Database, label: 'Databases', labelBn: 'ডাটাবেস', path: '/client/databases' },
  { icon: FolderOpen, label: 'Files', labelBn: 'ফাইল', path: '/client/files' },
  { icon: Shield, label: 'Security', labelBn: 'সিকিউরিটি', path: '/client/security' },
  { icon: Archive, label: 'Backups', labelBn: 'ব্যাকআপ', path: '/client/backups' },
  { icon: CreditCard, label: 'Billing & Invoices', labelBn: 'বিলিং ও ইনভয়েস', path: '/client/billing' },
  { icon: MessageSquare, label: 'Support Tickets', labelBn: 'সাপোর্ট টিকেট', path: '/client/support' },
  { icon: User, label: 'Profile Settings', labelBn: 'প্রোফাইল সেটিংস', path: '/client/profile' },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Server className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-display font-bold text-lg">CHost</span>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/client' && location.pathname.startsWith(item.path));
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={isCollapsed ? (language === 'bn' ? item.labelBn : item.label) : undefined}
                    >
                      <Link 
                        to={item.path}
                        className={cn(
                          "transition-all duration-200",
                          isActive && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 shrink-0",
                          isActive && "text-primary"
                        )} />
                        <span>{language === 'bn' ? item.labelBn : item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isCollapsed && "justify-center"
        )}>
          <Settings className="h-3 w-3" />
          {!isCollapsed && <span>v1.0.0</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const TopBar = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { language } = useLanguage();
  const { setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const userInitials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 transition-colors duration-300">
      <SidebarTrigger className="md:hidden" />
      
      {/* Home Link */}
      <Button variant="ghost" size="icon" asChild className="hidden md:flex">
        <Link to="/">
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="transition-all duration-300"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500 transition-transform duration-300 rotate-0" />
          ) : (
            <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />
          )}
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white text-[10px] px-1.5 py-0 h-4 border-0">
                    {language === 'bn' ? 'ক্লায়েন্ট' : 'Client'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-32">
                  {user?.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border">
            <DropdownMenuLabel>
              {language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/client/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/client/billing" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                {language === 'bn' ? 'বিলিং' : 'Billing'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/client/support" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                {language === 'bn' ? 'সাপোর্ট' : 'Support'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'লগআউট' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Dashboard',
  description = 'Manage your hosting services'
}) => {
  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        canonicalUrl="/client"
      />
      <NotificationProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background transition-colors duration-300">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 p-4 lg:p-6 bg-muted/30 dark:bg-muted/10 transition-colors duration-300">
                <div className="animate-fade-in">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </NotificationProvider>
    </>
  );
};

export default DashboardLayout;
