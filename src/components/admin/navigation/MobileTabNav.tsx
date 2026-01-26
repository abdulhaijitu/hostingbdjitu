import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { mobileBottomNavItems, getActiveBottomNavItem, type NavItem } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const MobileTabNav: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const activeBottomItem = getActiveBottomNavItem(location.pathname);
  
  // Only show tabs if the active item has tabs
  if (!activeBottomItem?.tabs || activeBottomItem.tabs.length === 0) {
    return null;
  }

  const tabs = activeBottomItem.tabs;

  const isTabActive = (tab: NavItem) => {
    return location.pathname === tab.href || location.pathname.startsWith(tab.href + '/');
  };

  return (
    <div 
      className={cn(
        "sticky top-14 z-30 w-full", // Below top bar (h-14)
        "bg-background/95 backdrop-blur-xl",
        "border-b border-border",
        "md:hidden" // Only show on mobile
      )}
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-1 px-4 py-2">
          {tabs.map((tab) => {
            const active = isTabActive(tab);
            const IconComponent = tab.icon;
            
            return (
              <NavLink
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full",
                  "transition-all duration-200",
                  "whitespace-nowrap",
                  "min-h-[36px]",
                  "active:scale-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                aria-label={language === 'bn' && tab.labelBn ? tab.labelBn : tab.label}
                aria-current={active ? 'page' : undefined}
              >
                <IconComponent className="h-4 w-4" />
                <span className={cn(
                  "text-sm",
                  active ? "font-semibold" : "font-medium"
                )}>
                  {language === 'bn' && tab.labelBn ? tab.labelBn : tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};

export default MobileTabNav;
