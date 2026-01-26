import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileBottomNavItems, NavItem } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileBottomNavProps {
  onMoreClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onMoreClick }) => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  // Check if current page is in "More" menu
  const isMoreActive = !mobileBottomNavItems.some(item => isActive(item.href));

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-xl border-t border-border",
        "safe-area-bottom",
        "md:hidden" // Only show on mobile
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileBottomNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full",
              "transition-all duration-200 active:scale-95",
              "touch-target"
            )}
          >
            {({ isActive: routerActive }) => {
              const active = isActive(item.href);
              return (
                <div className={cn(
                  "flex flex-col items-center gap-0.5",
                  active ? "text-primary" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    active && "bg-primary/10"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      active && "scale-110"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    active && "font-semibold"
                  )}>
                    {language === 'bn' && item.labelBn ? item.labelBn : item.label}
                  </span>
                </div>
              );
            }}
          </NavLink>
        ))}
        
        {/* More button */}
        <button
          onClick={onMoreClick}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full",
            "transition-all duration-200 active:scale-95",
            "touch-target",
            isMoreActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-all duration-200",
            isMoreActive && "bg-primary/10"
          )}>
            <MoreHorizontal className={cn(
              "h-5 w-5 transition-transform duration-200",
              isMoreActive && "scale-110"
            )} />
          </div>
          <span className={cn(
            "text-[10px] font-medium transition-all duration-200",
            isMoreActive && "font-semibold"
          )}>
            {language === 'bn' ? 'আরো' : 'More'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
