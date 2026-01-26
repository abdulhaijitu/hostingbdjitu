import React, { useState, useEffect } from 'react';
import { PanelLeft, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Store collapsed state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin-sidebar-collapsed');
    if (stored) {
      setCollapsed(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('admin-sidebar-collapsed', String(newState));
  };

  // Desktop Layout
  if (!isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <AdminSidebar collapsed={collapsed} onToggle={handleToggle} />
          <main
            className={cn(
              'min-h-screen transition-all duration-300 ease-out',
              collapsed ? 'ml-[68px]' : 'ml-64'
            )}
          >
            {children}
          </main>
        </div>
      </TooltipProvider>
    );
  }

  // Mobile Layout with Sheet
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/30">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-sidebar border-sidebar-border"
            >
              <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-50">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <div className="h-full flex flex-col">
                <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">CHost Admin</span>
          </div>
        </header>

        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
