import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileMoreNavItems } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold">
              {language === 'bn' ? 'আরো অপশন' : 'More Options'}
            </DrawerTitle>
            <DrawerClose className="rounded-full p-2 hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <ScrollArea className="h-[60vh] px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {mobileMoreNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl",
                  "transition-all duration-200 active:scale-95",
                  "border border-border hover:border-primary/30",
                  isActive(item.href) 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  isActive(item.href) ? "bg-primary/10" : "bg-background"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-medium text-center leading-tight",
                  isActive(item.href) && "font-semibold"
                )}>
                  {language === 'bn' && item.labelBn ? item.labelBn : item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMoreSheet;
