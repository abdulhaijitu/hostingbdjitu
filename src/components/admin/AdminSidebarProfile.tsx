import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminSidebarProfileProps {
  collapsed: boolean;
}

const AdminSidebarProfile: React.FC<AdminSidebarProfileProps> = ({ collapsed }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = user?.email?.charAt(0).toUpperCase() || 'A';

  if (collapsed) {
    return (
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-10 p-0 hover:bg-sidebar-accent rounded-xl relative"
            >
              <Avatar className="h-8 w-8 ring-2 ring-red-500/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs border-0">
                  Super Admin
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-red-500/30">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-1.5 py-0 h-4 border-0">
              <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
              Super Admin
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9 hover:bg-sidebar-accent rounded-lg"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9 hover:bg-destructive/10 hover:text-destructive rounded-lg"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default AdminSidebarProfile;
