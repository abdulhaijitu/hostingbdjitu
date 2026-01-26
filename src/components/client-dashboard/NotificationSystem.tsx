import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Package, CreditCard, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'support' | 'system' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Initial demo notifications
    {
      id: '1',
      type: 'system',
      title: 'Welcome to CHost!',
      message: 'Your account has been set up successfully. Explore your dashboard.',
      read: false,
      created_at: new Date().toISOString(),
      link: '/client',
    },
  ]);

  // Subscribe to realtime order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('orders-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'order',
              title: 'New Order Created',
              message: `Order #${(payload.new as any).order_number} has been created.`,
              link: '/client/billing',
            });
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = (payload.new as any).status;
            if (newStatus === 'completed') {
              addNotification({
                type: 'order',
                title: 'Order Completed',
                message: `Order #${(payload.new as any).order_number} is now active.`,
                link: '/client/hosting',
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to payment updates
    const paymentChannel = supabase
      .channel('payments-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = (payload.new as any).status;
          if (newStatus === 'completed') {
            addNotification({
              type: 'payment',
              title: 'Payment Successful',
              message: `Payment of ৳${(payload.new as any).amount} completed.`,
              link: '/client/billing',
            });
          } else if (newStatus === 'failed') {
            addNotification({
              type: 'payment',
              title: 'Payment Failed',
              message: 'Your payment could not be processed. Please try again.',
              link: '/client/billing',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(paymentChannel);
    };
  }, [user]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell: React.FC<{ className?: string }> = ({ className }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { language } = useLanguage();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="h-4 w-4 text-primary" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-success" />;
      case 'support':
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-accent" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return language === 'bn' ? 'এইমাত্র' : 'Just now';
    if (diffMins < 60) return `${diffMins}${language === 'bn' ? ' মিনিট আগে' : 'm ago'}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}${language === 'bn' ? ' ঘন্টা আগে' : 'h ago'}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}${language === 'bn' ? ' দিন আগে' : 'd ago'}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-popover border">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">
            {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              {language === 'bn' ? 'সব পড়া হয়েছে' : 'Mark all read'}
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.slice(0, 10).map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
                        !notification.read && "font-medium"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'কোন নোটিফিকেশন নেই' : 'No notifications'}
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
