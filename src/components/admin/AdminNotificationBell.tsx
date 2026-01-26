import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, MessageSquare, AlertCircle, CheckCircle, X, ExternalLink } from 'lucide-react';
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
import { format, formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'order' | 'ticket' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  data?: any;
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

  const unreadCount = notifications.filter(n => !n.read).length;

  // Play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Add new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    playNotificationSound();
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

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

    // Listen to payments
    const paymentsChannel = supabase
      .channel('admin-payments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          if (payload.new.status === 'completed') {
            addNotification({
              type: 'payment',
              title: 'পেমেন্ট সম্পন্ন',
              message: `৳${payload.new.amount} পেমেন্ট পাওয়া গেছে`,
              link: '/admin/payments',
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
    };
  }, []);

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case 'ticket':
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case 'payment':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
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
          className="relative h-9 w-9 hover:bg-sidebar-accent rounded-lg"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold animate-pulse"
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
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="font-semibold text-sm">নোটিফিকেশন</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} নতুন
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleSound}
              title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {soundEnabled ? '🔔' : '🔕'}
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
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
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
