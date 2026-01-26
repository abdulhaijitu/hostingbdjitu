import React, { useState, useEffect, useCallback, memo } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed';

const AdminLayout: React.FC<AdminLayoutProps> = memo(({ children }) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(() => {
    // Initialize from localStorage synchronously
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem(SIDEBAR_STATE_KEY, String(newState));
      return newState;
    });
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Prevent layout shift before hydration
  if (!mounted) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="min-h-screen ml-64 transition-all duration-300" />
        </div>
      </TooltipProvider>
    );
  }

  // Desktop Layout
  if (!isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <AdminSidebar collapsed={collapsed} onToggle={handleToggle} />
          <main
            className={cn(
              'min-h-screen transition-all duration-200 ease-out',
              collapsed ? 'ml-[72px]' : 'ml-[280px]'
            )}
          >
            <div className="animate-slide-in-up">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    );
  }

  // Mobile Layout with Sheet
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/30 dark:bg-slate-950">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-xl px-4 safe-area-top">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 touch-target"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] p-0 bg-sidebar border-sidebar-border"
            >
              <SheetClose className="absolute right-4 top-4 rounded-lg opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <div className="h-full flex flex-col overflow-hidden">
                <AdminSidebar collapsed={false} onToggle={handleMobileClose} />
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Mobile Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg">CHost Admin</span>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="min-h-[calc(100vh-3.5rem)] p-4 pb-20 safe-area-bottom">
          <div className="animate-slide-in-up">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
