import React, { useState, useEffect, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

// Navigation components
import MobileTopBar from './navigation/MobileTopBar';
import MobileBottomNav from './navigation/MobileBottomNav';
import MobileMoreSheet from './navigation/MobileMoreSheet';
import MobileTabNav from './navigation/MobileTabNav';
import TabletSidebar from './navigation/TabletSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed';

// Breakpoints: Mobile ≤768px, Tablet 769-1024px, Desktop ≥1025px
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Custom hook for responsive breakpoints
const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= MOBILE_BREAKPOINT) return 'mobile';
    if (width <= TABLET_BREAKPOINT) return 'tablet';
    return 'desktop';
  });
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width <= MOBILE_BREAKPOINT) {
        setBreakpoint('mobile');
      } else if (width <= TABLET_BREAKPOINT) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    
    // Use matchMedia for better performance
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`);
    
    const handleChange = () => checkBreakpoint();
    
    mobileQuery.addEventListener('change', handleChange);
    tabletQuery.addEventListener('change', handleChange);
    
    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      tabletQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return breakpoint;
};

const AdminLayout: React.FC<AdminLayoutProps> = memo(({ children }) => {
  const breakpoint = useResponsiveBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  
  // Sidebar state - collapsed by default on tablet, expanded on desktop
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (saved !== null) return saved === 'true';
      // Default: collapsed on tablet, expanded on desktop
      return window.innerWidth <= TABLET_BREAKPOINT;
    }
    return true;
  });
  
  // Mobile "More" sheet state
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-collapse on tablet, auto-expand on desktop
  useEffect(() => {
    if (isTablet && !collapsed) {
      setCollapsed(true);
    } else if (isDesktop && collapsed) {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (saved === null) {
        setCollapsed(false);
      }
    }
  }, [isTablet, isDesktop, collapsed]);

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
          <div className="min-h-screen" />
        </div>
      </TooltipProvider>
    );
  }

  // ═══════════════════════════════════════════
  // MOBILE LAYOUT (≤768px)
  // Bottom nav + top bar, NO sidebar
  // ═══════════════════════════════════════════
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
          {/* Mobile Top Bar - Sticky */}
          <MobileTopBar />
          
          {/* Mobile Tab Navigation (for Hosting, Billing, Users) */}
          <MobileTabNav />
          
          {/* Main Content - With bottom padding for nav */}
          <main 
            className="flex-1 overflow-x-hidden"
            style={{
              paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))', // 64px + safe area
            }}
          >
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation - Fixed */}
          <MobileBottomNav onMoreClick={handleMoreClick} />
          
          {/* More Sheet - Action sheet, NOT modal */}
          <MobileMoreSheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen} />
        </div>
      </TooltipProvider>
    );
  }

  // ═══════════════════════════════════════════
  // TABLET/DESKTOP LAYOUT (>768px)
  // Sidebar (collapsed on tablet, full on desktop)
  // ═══════════════════════════════════════════
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Sidebar - Tablet: collapsed/icon-only, Desktop: full */}
        <TabletSidebar 
          collapsed={collapsed} 
          onToggle={handleToggle} 
        />
        
        {/* Main Content */}
        <main
          className={cn(
            'min-h-screen transition-all duration-300 ease-out overflow-x-hidden',
            collapsed ? 'ml-[72px]' : 'ml-[280px]'
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
