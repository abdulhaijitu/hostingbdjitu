import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Crown, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPageTitle } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User } from 'lucide-react';

const MobileTopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  
  const pageTitle = getPageTitle(location.pathname, language as 'en' | 'bn');
  const initials = user?.email?.charAt(0).toUpperCase() || 'A';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-background/95 backdrop-blur-xl",
        "border-b border-border",
        "md:hidden" // Only show on mobile (≤768px)
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="h-5 w-px bg-border shrink-0" />
          <h1 className="text-base font-semibold truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Notifications */}
          <button
            className={cn(
              "relative p-2 rounded-full",
              "min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "transition-colors hover:bg-muted",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label={language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {/* Notification badge - placeholder */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          
          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(
                  "relative p-1 rounded-full",
                  "min-w-[44px] min-h-[44px]",
                  "flex items-center justify-center",
                  "transition-colors hover:bg-muted",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label={language === 'bn' ? 'প্রোফাইল মেনু' : 'Profile menu'}
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-3 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xs border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/settings')}
                className="min-h-[44px]"
              >
                <Settings className="h-4 w-4 mr-3" />
                {language === 'bn' ? 'সেটিংস' : 'Settings'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive min-h-[44px]"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {language === 'bn' ? 'লগআউট' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
