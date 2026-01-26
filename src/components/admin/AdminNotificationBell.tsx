import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ShoppingCart, MessageSquare, AlertCircle, CheckCircle, X, ExternalLink, CreditCard, Volume2, VolumeX, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'order' | 'ticket' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
}

interface AdminNotificationBellProps {
  collapsed?: boolean;
}

const AdminNotificationBell: React.FC<AdminNotificationBellProps> = ({ collapsed }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('admin-notification-sound') !== 'false';
  });
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem('admin-notification-push') === 'true';
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request browser notification permission
  const requestPushPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        localStorage.setItem('admin-notification-push', 'true');
      }
    }
  };

  // Play notification sound with different tones for different types
  const playNotificationSound = useCallback((type: string, priority?: string) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different notification types
      const frequencies: Record<string, number> = {
        order: 880,    // Higher pitch for orders
        payment: 660,  // Medium pitch for payments
        ticket: 440,   // Lower pitch for tickets
        system: 520,
      };
      
      oscillator.frequency.value = frequencies[type] || 600;
      oscillator.type = priority === 'high' ? 'square' : 'sine';
      
      const volume = priority === 'high' ? 0.4 : 0.25;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      
      // Double beep for high priority
      if (priority === 'high') {
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = frequencies[type] || 600;
          osc2.type = 'square';
          gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.3);
        }, 150);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  // Show browser push notification
  const showPushNotification = useCallback((title: string, message: string, icon?: string) => {
    if (!pushEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    
    try {
      new Notification(title, {
        body: message,
        icon: icon || '/favicon.png',
        badge: '/favicon.png',
        tag: `admin-${Date.now()}`,
        requireInteraction: false,
      });
    } catch (e) {
      console.log('Push notification not supported');
    }
  }, [pushEnabled]);

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    playNotificationSound(notification.type, notification.priority);
    showPushNotification(notification.title, notification.message);
    
    // Trigger bell animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  }, [playNotificationSound, showPushNotification, toast]);

  // Listen to real-time events
  useEffect(() => {
    // Listen to new orders
    const ordersChannel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          addNotification({
            type: 'order',
            title: 'নতুন অর্ডার এসেছে',
            message: `অর্ডার #${payload.new.order_number} - ৳${payload.new.amount}`,
            link: '/admin/orders',
            data: payload.new,
          });
        }
      )
      .subscribe();

    // Listen to new support tickets
    const ticketsChannel = supabase
      .channel('admin-tickets')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_tickets' },
        (payload) => {
          addNotification({
            type: 'ticket',
            title: 'নতুন সাপোর্ট টিকেট',
            message: `${payload.new.ticket_number}: ${payload.new.subject}`,
            link: '/admin/tickets',
            data: payload.new,
          });
        }
      )
      .subscribe();

    // Listen to ticket updates
    const ticketUpdatesChannel = supabase
      .channel('admin-ticket-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'support_tickets' },
        (payload) => {
          if (payload.new.status !== payload.old?.status) {
            addNotification({
              type: 'ticket',
              title: 'টিকেট স্ট্যাটাস আপডেট',
              message: `${payload.new.ticket_number} - ${payload.new.status}`,
              link: '/admin/tickets',
              data: payload.new,
            });
          }
        }
      )
      .subscribe();

    // Listen to new payments
    const paymentsChannel = supabase
      .channel('admin-payments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          addNotification({
            type: 'payment',
            title: payload.new.status === 'completed' ? '✅ পেমেন্ট সম্পন্ন' : '⏳ নতুন পেমেন্ট',
            message: `৳${payload.new.amount} - ${payload.new.payment_method || 'অনলাইন'}`,
            link: '/admin/payments',
            data: payload.new,
            priority: payload.new.status === 'completed' ? 'high' : 'medium',
          });
        }
      )
      .subscribe();

    // Listen to payment status updates
    const paymentUpdatesChannel = supabase
      .channel('admin-payment-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'payments' },
        (payload) => {
          if (payload.new.status !== payload.old?.status) {
            const statusMessages: Record<string, string> = {
              completed: '✅ পেমেন্ট সম্পন্ন হয়েছে',
              failed: '❌ পেমেন্ট ব্যর্থ হয়েছে',
              refunded: '↩️ পেমেন্ট রিফান্ড করা হয়েছে',
            };
            addNotification({
              type: 'payment',
              title: statusMessages[payload.new.status] || 'পেমেন্ট আপডেট',
              message: `৳${payload.new.amount} - ${payload.new.transaction_id || ''}`,
              link: '/admin/payments',
              data: payload.new,
              priority: payload.new.status === 'completed' ? 'high' : 'medium',
            });
          }
        }
      )
      .subscribe();

    // Listen to order status changes
    const orderUpdatesChannel = supabase
      .channel('admin-order-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.new.status !== payload.old?.status) {
            addNotification({
              type: 'order',
              title: `অর্ডার স্ট্যাটাস: ${payload.new.status}`,
              message: `অর্ডার #${payload.new.order_number}`,
              link: '/admin/orders',
              data: payload.new,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(ticketUpdatesChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(paymentUpdatesChannel);
      supabase.removeChannel(orderUpdatesChannel);
    };
  }, [addNotification]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string, priority?: string) => {
    const baseClass = priority === 'high' ? 'animate-pulse' : '';
    switch (type) {
      case 'order':
        return <ShoppingCart className={cn("h-4 w-4 text-blue-500", baseClass)} />;
      case 'ticket':
        return <MessageSquare className={cn("h-4 w-4 text-amber-500", baseClass)} />;
      case 'payment':
        return <CreditCard className={cn("h-4 w-4 text-emerald-500", baseClass)} />;
      default:
        return <AlertCircle className={cn("h-4 w-4 text-muted-foreground", baseClass)} />;
    }
  };

  const togglePush = async () => {
    if (!pushEnabled) {
      await requestPushPermission();
    } else {
      setPushEnabled(false);
      localStorage.setItem('admin-notification-push', 'false');
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('admin-notification-sound', String(newValue));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-9 w-9 hover:bg-slate-800/60 rounded-xl transition-all duration-200",
            isAnimating && "animate-bounce"
          )}
        >
          {isAnimating ? (
            <BellRing className="h-4 w-4 text-primary animate-pulse" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold shadow-lg shadow-red-500/30"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align={collapsed ? 'start' : 'end'}
        side={collapsed ? 'right' : 'bottom'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-slate-900/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">নোটিফিকেশন</span>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                {unreadCount} নতুন
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-slate-800/50"
              onClick={toggleSound}
              title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-slate-800/50"
              onClick={togglePush}
              title={pushEnabled ? 'পুশ বন্ধ করুন' : 'পুশ চালু করুন'}
            >
              {pushEnabled ? <BellRing className="h-3.5 w-3.5 text-emerald-400" /> : <Bell className="h-3.5 w-3.5 text-slate-400" />}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">কোন নোটিফিকেশন নেই</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-slate-800/30 transition-all duration-200 cursor-pointer group",
                    !notification.read && "bg-gradient-to-r from-primary/5 to-transparent border-l-2 border-primary"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors">
                      {getIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-orange-500 shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground/70">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: bn })}
                        </span>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            দেখুন <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-2 border-t bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={markAllAsRead}
            >
              সব পড়া হিসেবে চিহ্নিত করুন
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-destructive hover:text-destructive"
              onClick={clearAll}
            >
              <X className="h-3 w-3 mr-1" />
              মুছে ফেলুন
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotificationBell;
