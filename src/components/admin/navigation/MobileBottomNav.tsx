import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileBottomNavItems, getActiveBottomNavItem, isInMoreMenu, type BottomNavItem } from './AdminNavConfig';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileBottomNavProps {
  onMoreClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onMoreClick }) => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const activeItem = getActiveBottomNavItem(location.pathname);
  const isMoreActive = isInMoreMenu(location.pathname);

  const isItemActive = (item: BottomNavItem) => {
    if (item.href === '/admin') {
      return location.pathname === '/admin';
    }
    return item.activeRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/')
    );
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/98 backdrop-blur-xl",
        "border-t border-border",
        "md:hidden" // ONLY show on mobile (≤768px)
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="flex items-center justify-around h-16">
        {mobileBottomNavItems.map((item) => {
          const active = isItemActive(item);
          const IconComponent = item.icon;
          
          return (
            <NavLink
              key={item.label}
              to={item.href || '#'}
              className={cn(
                "flex flex-col items-center justify-center",
                "flex-1 h-full min-w-[44px] min-h-[44px]", // Touch target 44px
                "transition-all duration-200",
                "active:scale-95 active:opacity-80",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              )}
              aria-label={language === 'bn' && item.labelBn ? item.labelBn : item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative flex flex-col items-center gap-0.5">
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
                
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  active ? "bg-primary/15" : "bg-transparent"
                )}>
                  <IconComponent 
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                
                <span className={cn(
                  "text-[10px] leading-tight transition-all duration-200",
                  active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
                )}>
                  {language === 'bn' && item.labelBn ? item.labelBn : item.label}
                </span>
              </div>
            </NavLink>
          );
        })}
        
        {/* More button */}
        <button
          onClick={onMoreClick}
          className={cn(
            "flex flex-col items-center justify-center",
            "flex-1 h-full min-w-[44px] min-h-[44px]", // Touch target 44px
            "transition-all duration-200",
            "active:scale-95 active:opacity-80",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          )}
          aria-label={language === 'bn' ? 'আরো অপশন' : 'More options'}
          aria-haspopup="dialog"
        >
          <div className="relative flex flex-col items-center gap-0.5">
            {/* Active indicator dot */}
            {isMoreActive && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
            
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-200",
              isMoreActive ? "bg-primary/15" : "bg-transparent"
            )}>
              <Menu 
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isMoreActive ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={isMoreActive ? 2.5 : 2}
              />
            </div>
            
            <span className={cn(
              "text-[10px] leading-tight transition-all duration-200",
              isMoreActive ? "font-semibold text-primary" : "font-medium text-muted-foreground"
            )}>
              {language === 'bn' ? 'আরো' : 'More'}
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
