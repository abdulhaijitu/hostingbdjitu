import React, { useState, useEffect, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

// Navigation components
import MobileTopBar from './navigation/MobileTopBar';
import MobileBottomNav from './navigation/MobileBottomNav';
import MobileMoreSheet from './navigation/MobileMoreSheet';
import TabletSidebar from './navigation/TabletSidebar';

// Hooks
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed';
const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

// Custom hook for responsive breakpoints
const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < TABLET_BREAKPOINT) {
        setBreakpoint('mobile');
      } else if (width < DESKTOP_BREAKPOINT) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  return breakpoint;
};

const AdminLayout: React.FC<AdminLayoutProps> = memo(({ children }) => {
  const breakpoint = useResponsiveBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  
  // Sidebar state - collapsed by default on tablet
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (saved !== null) return saved === 'true';
      // Default: collapsed on tablet, expanded on desktop
      return window.innerWidth < DESKTOP_BREAKPOINT;
    }
    return false;
  });
  
  // Mobile "More" sheet state
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-collapse on tablet, expand on desktop
  useEffect(() => {
    if (isTablet && !collapsed) {
      setCollapsed(true);
    }
  }, [isTablet]);

  const handleToggle = useCallback(() => {
    setCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem(SIDEBAR_STATE_KEY, String(newState));
      return newState;
    });
  }, []);

  const handleMoreClick = useCallback(() => {
    setMoreSheetOpen(true);
  }, []);

  // Prevent layout shift before hydration
  if (!mounted) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="min-h-screen animate-pulse" />
        </div>
      </TooltipProvider>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Mobile Top Bar */}
          <MobileTopBar />
          
          {/* Main Content */}
          <main className="flex-1 pb-20 overflow-x-hidden">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav onMoreClick={handleMoreClick} />
          
          {/* More Sheet */}
          <MobileMoreSheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen} />
        </div>
      </TooltipProvider>
    );
  }

  // Tablet/Desktop Layout
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Sidebar - visible on tablet and desktop */}
        <TabletSidebar collapsed={collapsed} onToggle={handleToggle} />
        
        {/* Main Content */}
        <main
          className={cn(
            'min-h-screen transition-all duration-300 ease-out overflow-x-hidden',
            collapsed ? 'md:ml-[72px]' : 'md:ml-[280px]'
          )}
        >
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
