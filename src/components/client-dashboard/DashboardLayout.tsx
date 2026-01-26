import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Server, Globe, Mail, Database, FolderOpen, 
  Shield, Archive, CreditCard, MessageSquare, User, LogOut, 
  Bell, ChevronDown, Menu, X, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/common/SEOHead';

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
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border">
            <DropdownMenuLabel>
              {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              {language === 'bn' ? 'কোন নতুন নোটিফিকেশন নেই' : 'No new notifications'}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </p>
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
  const { language } = useLanguage();

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        canonicalUrl="/client"
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 p-4 lg:p-6 bg-muted/30">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
