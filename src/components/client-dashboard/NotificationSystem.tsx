import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Package, CreditCard, MessageSquare, ShoppingCart, Ticket, Volume2, VolumeX } from 'lucide-react';
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
import { toast as sonnerToast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'support' | 'system' | 'info' | 'ticket';
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
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  pushEnabled: boolean;
  requestPushPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
};

// Request browser push notification permission
const requestBrowserPushPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show browser push notification
const showBrowserNotification = (title: string, body: string, link?: string) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'chost-notification',
      requireInteraction: false,
    });
    
    if (link) {
      notification.onclick = () => {
        window.focus();
        window.location.href = link;
        notification.close();
      };
    }
    
    setTimeout(() => notification.close(), 5000);
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { language } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('notification-sound');
    return saved !== 'false';
  });
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
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

  // Check push permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('notification-sound', soundEnabled.toString());
  }, [soundEnabled]);

  const requestPushPermission = async () => {
    const granted = await requestBrowserPushPermission();
    setPushEnabled(granted);
    if (granted) {
      sonnerToast.success(language === 'bn' ? 'পুশ নোটিফিকেশন সক্রিয়!' : 'Push notifications enabled!');
    }
  };

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play sound if enabled
    if (soundEnabled) {
      playNotificationSound();
    }
    
    // Show browser push notification if enabled
    if (pushEnabled) {
      showBrowserNotification(notification.title, notification.message, notification.link);
    }
    
    // Show toast notification
    sonnerToast(notification.title, {
      description: notification.message,
      action: notification.link ? {
        label: language === 'bn' ? 'দেখুন' : 'View',
        onClick: () => window.location.href = notification.link!,
      } : undefined,
    });
  }, [language, soundEnabled, pushEnabled]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    // Customer subscription - only their orders
    if (!isAdmin) {
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
                title: language === 'bn' ? 'নতুন অর্ডার তৈরি হয়েছে' : 'New Order Created',
                message: `Order #${(payload.new as any).order_number} has been created.`,
                link: '/client/billing',
              });
            } else if (payload.eventType === 'UPDATE') {
              const newStatus = (payload.new as any).status;
              if (newStatus === 'completed') {
                addNotification({
                  type: 'order',
                  title: language === 'bn' ? 'অর্ডার সম্পন্ন হয়েছে' : 'Order Completed',
                  message: `Order #${(payload.new as any).order_number} is now active.`,
                  link: '/client/hosting',
                });
              }
            }
          }
        )
        .subscribe();

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
                title: language === 'bn' ? 'পেমেন্ট সফল' : 'Payment Successful',
                message: `Payment of ৳${(payload.new as any).amount} completed.`,
                link: '/client/billing',
              });
            } else if (newStatus === 'failed') {
              addNotification({
                type: 'payment',
                title: language === 'bn' ? 'পেমেন্ট ব্যর্থ' : 'Payment Failed',
                message: language === 'bn' ? 'আপনার পেমেন্ট প্রসেস করা যায়নি।' : 'Your payment could not be processed.',
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
    }

    // Admin subscriptions - all orders, payments, tickets
    if (isAdmin) {
      const adminOrderChannel = supabase
        .channel('admin-orders-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
          },
          (payload) => {
            addNotification({
              type: 'order',
              title: language === 'bn' ? '🛒 নতুন অর্ডার!' : '🛒 New Order!',
              message: language === 'bn' 
                ? `অর্ডার #${(payload.new as any).order_number} - ৳${(payload.new as any).amount}`
                : `Order #${(payload.new as any).order_number} - ৳${(payload.new as any).amount}`,
              link: '/admin/orders',
            });
          }
        )
        .subscribe();

      const adminPaymentChannel = supabase
        .channel('admin-payments-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              addNotification({
                type: 'payment',
                title: language === 'bn' ? '💳 নতুন পেমেন্ট!' : '💳 New Payment!',
                message: language === 'bn' 
                  ? `৳${(payload.new as any).amount} - ${(payload.new as any).status}`
                  : `৳${(payload.new as any).amount} - ${(payload.new as any).status}`,
                link: '/admin/payments',
              });
            } else if (payload.eventType === 'UPDATE') {
              const newStatus = (payload.new as any).status;
              if (newStatus === 'completed') {
                addNotification({
                  type: 'payment',
                  title: language === 'bn' ? '✅ পেমেন্ট সম্পন্ন!' : '✅ Payment Completed!',
                  message: language === 'bn' 
                    ? `৳${(payload.new as any).amount} পেমেন্ট সফল হয়েছে`
                    : `৳${(payload.new as any).amount} payment successful`,
                  link: '/admin/payments',
                });
              }
            }
          }
        )
        .subscribe();

      const adminTicketChannel = supabase
        .channel('admin-tickets-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_tickets',
          },
          (payload) => {
            addNotification({
              type: 'ticket',
              title: language === 'bn' ? '🎫 নতুন সাপোর্ট টিকেট!' : '🎫 New Support Ticket!',
              message: language === 'bn' 
                ? `#${(payload.new as any).ticket_number} - ${(payload.new as any).subject}`
                : `#${(payload.new as any).ticket_number} - ${(payload.new as any).subject}`,
              link: '/admin/tickets',
            });
          }
        )
        .subscribe();

      const adminTicketMessageChannel = supabase
        .channel('admin-ticket-messages-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ticket_messages',
          },
          (payload) => {
            if (!(payload.new as any).is_staff_reply) {
              addNotification({
                type: 'ticket',
                title: language === 'bn' ? '💬 নতুন টিকেট মেসেজ!' : '💬 New Ticket Message!',
                message: language === 'bn' 
                  ? 'একজন গ্রাহক নতুন মেসেজ পাঠিয়েছেন'
                  : 'A customer sent a new message',
                link: '/admin/tickets',
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(adminOrderChannel);
        supabase.removeChannel(adminPaymentChannel);
        supabase.removeChannel(adminTicketChannel);
        supabase.removeChannel(adminTicketMessageChannel);
      };
    }
  }, [user, isAdmin, addNotification, language]);

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
        soundEnabled,
        setSoundEnabled,
        pushEnabled,
        requestPushPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell: React.FC<{ className?: string }> = ({ className }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, soundEnabled, setSoundEnabled, pushEnabled, requestPushPermission } = useNotifications();
  const { language } = useLanguage();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="h-4 w-4 text-primary" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'support':
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      case 'ticket':
        return <Ticket className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
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
          <div className="flex items-center gap-2">
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
        </div>
        
        {/* Sound & Push Settings */}
        <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={language === 'bn' ? 'সাউন্ড টগল করুন' : 'Toggle sound'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {language === 'bn' ? 'সাউন্ড' : 'Sound'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {language === 'bn' ? 'পুশ' : 'Push'}
            </span>
            {pushEnabled ? (
              <Badge variant="secondary" className="text-xs h-5">
                <Bell className="h-3 w-3 mr-1" />
                {language === 'bn' ? 'সক্রিয়' : 'On'}
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={requestPushPermission}
              >
                {language === 'bn' ? 'সক্রিয় করুন' : 'Enable'}
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.slice(0, 15).map(notification => (
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
