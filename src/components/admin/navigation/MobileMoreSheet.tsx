import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileMoreSheetItems } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCMSRole } from '@/hooks/useCMSRole';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

interface MobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const { data: cmsRole } = useCMSRole();
  
  const isSuperAdmin = cmsRole?.role === 'super_admin';
  
  // Filter out restricted items for non-super-admins
  const filteredItems = useMemo(() => {
    return mobileMoreSheetItems.filter(item => !item.restricted || isSuperAdmin);
  }, [isSuperAdmin]);
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    onOpenChange(false);
    await signOut();
    navigate('/');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="max-h-[85vh] rounded-t-3xl"
        style={{
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
        </div>

        <DrawerHeader className="pb-2 pt-1">
          <DrawerTitle className="text-base font-semibold text-center">
            {language === 'bn' ? 'আরো অপশন' : 'More Options'}
          </DrawerTitle>
        </DrawerHeader>
        
        {/* Navigation Items */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl",
                    "transition-all duration-200",
                    "active:scale-95",
                    "min-h-[80px]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                  aria-label={language === 'bn' && item.labelBn ? item.labelBn : item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    active ? "bg-primary/15" : "bg-background"
                  )}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-xs text-center leading-tight",
                    active ? "font-semibold" : "font-medium"
                  )}>
                    {language === 'bn' && item.labelBn ? item.labelBn : item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-3 mx-4" />

        {/* Logout Button - Separated danger action */}
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl",
              "bg-destructive/10 text-destructive",
              "transition-all duration-200",
              "active:scale-[0.98]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
              "min-h-[44px]"
            )}
            aria-label={language === 'bn' ? 'লগআউট' : 'Logout'}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-semibold">
              {language === 'bn' ? 'লগআউট' : 'Logout'}
            </span>
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMoreSheet;
