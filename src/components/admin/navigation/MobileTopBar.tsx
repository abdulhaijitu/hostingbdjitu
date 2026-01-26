import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Crown, Settings, LogOut } from 'lucide-react';
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
import AdminNotificationBell from '../AdminNotificationBell';

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
        "bg-background/95 backdrop-blur-xl border-b border-border",
        "safe-area-top",
        "md:hidden" // Only show on mobile
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Page Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="hidden xs:block">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary">
                Admin
              </Badge>
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-base font-semibold truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <AdminNotificationBell collapsed />
          
          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative touch-target flex items-center justify-center">
                <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xs border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'সেটিংস' : 'Settings'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
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
