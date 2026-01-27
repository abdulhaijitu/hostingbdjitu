import { LucideIcon, LayoutDashboard, Package, Server, MonitorCog, ListTodo, ShoppingCart, CreditCard, FileText, RotateCcw, Users, UserCheck, Gift, MessageSquare, Megaphone, Settings, Menu, LogOut, Receipt, Webhook, FileBarChart, Shield, AlertTriangle, ShieldCheck, Activity, BarChart3 } from 'lucide-react';

export interface NavItem {
  label: string;
  labelBn?: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface BottomNavItem {
  label: string;
  labelBn?: string;
  icon: LucideIcon;
  href?: string; // Main route (optional for items with tabs)
  activeRoutes: string[]; // Routes that mark this tab as active
  tabs?: NavItem[]; // Sub-tabs for internal navigation
}

// Bottom nav items for mobile (EXACT 5 items)
export const mobileBottomNavItems: BottomNavItem[] = [
  {
    label: 'Dashboard',
    labelBn: 'ড্যাশবোর্ড',
    icon: LayoutDashboard,
    href: '/admin',
    activeRoutes: ['/admin'],
  },
  {
    label: 'Hosting',
    labelBn: 'হোস্টিং',
    icon: Server,
    href: '/admin/hosting-plans',
    activeRoutes: ['/admin/hosting-plans', '/admin/servers', '/admin/package-mapping', '/admin/provisioning', '/admin/hosting-accounts', '/admin/server-credentials'],
    tabs: [
      { label: 'Plans', labelBn: 'প্ল্যান', href: '/admin/hosting-plans', icon: Package },
      { label: 'Servers', labelBn: 'সার্ভার', href: '/admin/servers', icon: Server },
      { label: 'WHM/cPanel', labelBn: 'WHM/cPanel', href: '/admin/package-mapping', icon: MonitorCog },
      { label: 'Queue', labelBn: 'কিউ', href: '/admin/provisioning', icon: ListTodo },
    ],
  },
  {
    label: 'Billing',
    labelBn: 'বিলিং',
    icon: CreditCard,
    href: '/admin/orders',
    activeRoutes: ['/admin/orders', '/admin/payments', '/admin/invoices', '/admin/refunds', '/admin/webhooks'],
    tabs: [
      { label: 'Orders', labelBn: 'অর্ডার', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Payments', labelBn: 'পেমেন্ট', href: '/admin/payments', icon: CreditCard },
      { label: 'Invoices', labelBn: 'ইনভয়েস', href: '/admin/invoices', icon: FileText },
      { label: 'Refunds', labelBn: 'রিফান্ড', href: '/admin/refunds', icon: RotateCcw },
    ],
  },
  {
    label: 'Users',
    labelBn: 'ইউজার',
    icon: Users,
    href: '/admin/users',
    activeRoutes: ['/admin/users', '/admin/resellers', '/admin/affiliates'],
    tabs: [
      { label: 'Customers', labelBn: 'কাস্টমার', href: '/admin/users', icon: Users },
      { label: 'Resellers', labelBn: 'রিসেলার', href: '/admin/resellers', icon: UserCheck },
      { label: 'Affiliates', labelBn: 'অ্যাফিলিয়েট', href: '/admin/affiliates', icon: Gift },
    ],
  },
];

// "More" sheet items
export const mobileMoreSheetItems: NavItem[] = [
  { label: 'Tickets', labelBn: 'সাপোর্ট টিকেট', href: '/admin/tickets', icon: MessageSquare },
  { label: 'Announcements', labelBn: 'ঘোষণা', href: '/admin/announcements', icon: Megaphone },
  { label: 'Webhooks', labelBn: 'ওয়েবহুক লগ', href: '/admin/webhooks', icon: Webhook },
  { label: 'Audit Logs', labelBn: 'অডিট লগ', href: '/admin/audit-logs', icon: Shield },
  { label: 'Error Logs', labelBn: 'এরর লগ', href: '/admin/error-logs', icon: AlertTriangle },
  { label: 'Security', labelBn: 'নিরাপত্তা', href: '/admin/security', icon: ShieldCheck },
  { label: 'Reports', labelBn: 'রিপোর্ট', href: '/admin/reports', icon: BarChart3 },
  { label: 'Analytics', labelBn: 'অ্যানালিটিক্স', href: '/admin/analytics', icon: FileBarChart },
  { label: 'Credentials', labelBn: 'API ক্রেডেনশিয়াল', href: '/admin/server-credentials', icon: Settings },
  { label: 'Settings', labelBn: 'সেটিংস', href: '/admin/settings', icon: Settings },
];

// Full sidebar sections for tablet/desktop
export const sidebarNavSections: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'HOSTING',
    items: [
      { label: 'Hosting Plans', labelBn: 'হোস্টিং প্ল্যান', href: '/admin/hosting-plans', icon: Package },
      { label: 'Servers', labelBn: 'সার্ভার', href: '/admin/servers', icon: Server },
      { label: 'WHM / cPanel', labelBn: 'WHM / cPanel', href: '/admin/package-mapping', icon: MonitorCog },
      { label: 'Provisioning', labelBn: 'প্রভিশনিং', href: '/admin/provisioning', icon: ListTodo },
    ],
  },
  {
    label: 'BILLING',
    items: [
      { label: 'Orders', labelBn: 'অর্ডার', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Payments', labelBn: 'পেমেন্ট', href: '/admin/payments', icon: CreditCard },
      { label: 'Invoices', labelBn: 'ইনভয়েস', href: '/admin/invoices', icon: FileText },
      { label: 'Refunds', labelBn: 'রিফান্ড', href: '/admin/refunds', icon: RotateCcw },
    ],
  },
  {
    label: 'USERS',
    items: [
      { label: 'Customers', labelBn: 'কাস্টমার', href: '/admin/users', icon: Users },
      { label: 'Resellers', labelBn: 'রিসেলার', href: '/admin/resellers', icon: UserCheck },
      { label: 'Affiliates', labelBn: 'অ্যাফিলিয়েট', href: '/admin/affiliates', icon: Gift },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Tickets', labelBn: 'টিকেট', href: '/admin/tickets', icon: MessageSquare },
      { label: 'Announcements', labelBn: 'ঘোষণা', href: '/admin/announcements', icon: Megaphone },
      { label: 'Webhooks', labelBn: 'ওয়েবহুক লগ', href: '/admin/webhooks', icon: FileBarChart },
      { label: 'Audit Logs', labelBn: 'অডিট লগ', href: '/admin/audit-logs', icon: Shield },
      { label: 'Error Logs', labelBn: 'এরর লগ', href: '/admin/error-logs', icon: AlertTriangle },
      { label: 'Security', labelBn: 'নিরাপত্তা', href: '/admin/security', icon: ShieldCheck },
      { label: 'Reports', labelBn: 'রিপোর্ট', href: '/admin/reports', icon: BarChart3 },
      { label: 'Credentials', labelBn: 'API ক্রেডেনশিয়াল', href: '/admin/server-credentials', icon: Settings },
      { label: 'Settings', labelBn: 'সেটিংস', href: '/admin/settings', icon: Settings },
    ],
  },
];

// Get page title from path
export const getPageTitle = (pathname: string, language: 'en' | 'bn' = 'en'): string => {
  const allItems = [
    ...mobileMoreSheetItems,
    ...sidebarNavSections.flatMap(s => s.items),
    ...mobileBottomNavItems.flatMap(i => i.tabs || []),
  ];
  
  const item = allItems.find(i => i.href === pathname);
  if (item) {
    return language === 'bn' && item.labelBn ? item.labelBn : item.label;
  }
  
  // Check bottom nav items
  const bottomItem = mobileBottomNavItems.find(i => i.href === pathname);
  if (bottomItem) {
    return language === 'bn' && bottomItem.labelBn ? bottomItem.labelBn : bottomItem.label;
  }
  
  // Default fallbacks
  if (pathname.includes('hosting')) return language === 'bn' ? 'হোস্টিং' : 'Hosting';
  if (pathname.includes('orders')) return language === 'bn' ? 'অর্ডার' : 'Orders';
  if (pathname.includes('domain')) return language === 'bn' ? 'ডোমেইন' : 'Domain';
  if (pathname.includes('canned')) return language === 'bn' ? 'ক্যানড রেসপন্স' : 'Canned Responses';
  if (pathname.includes('analytics')) return language === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics';
  
  return language === 'bn' ? 'অ্যাডমিন' : 'Admin';
};

// Get active bottom nav item based on current path
export const getActiveBottomNavItem = (pathname: string): BottomNavItem | null => {
  // Exact match for dashboard
  if (pathname === '/admin') {
    return mobileBottomNavItems[0];
  }
  
  // Check other items by their activeRoutes
  for (const item of mobileBottomNavItems) {
    if (item.activeRoutes.some(route => 
      route === pathname || pathname.startsWith(route + '/')
    )) {
      return item;
    }
  }
  
  return null;
};

// Check if current path is in "More" menu
export const isInMoreMenu = (pathname: string): boolean => {
  return mobileMoreSheetItems.some(item => 
    item.href === pathname || pathname.startsWith(item.href + '/')
  );
};
