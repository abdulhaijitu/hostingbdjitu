import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ShieldCheck, Crown, Sparkles } from 'lucide-react';
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
      <div className="p-3 border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-10 p-0 hover:bg-white/10 rounded-xl relative"
            >
              <div className="relative">
                <Avatar className="h-9 w-9 ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Crown className="absolute -top-2 -right-1 h-4 w-4 text-yellow-400 drop-shadow-lg" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-64 bg-slate-900 border-slate-700">
            <div className="px-3 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-orange-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Crown className="absolute -top-2 -right-1 h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs border-0 shadow-lg shadow-red-500/20">
                    <Crown className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem 
              onClick={() => navigate('/admin/settings')}
              className="text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
      {/* Profile Card */}
      <div className="relative p-3 rounded-xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent border border-red-500/20 mb-3">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl blur-xl" />
        
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Crown className="absolute -top-2 -right-1 h-5 w-5 text-yellow-400 drop-shadow-lg animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-2 py-0.5 h-5 border-0 shadow-lg shadow-red-500/30 font-semibold">
              <Crown className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
            <p className="text-xs text-slate-400 truncate mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700">Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/20"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700">Logout</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default AdminSidebarProfile;
