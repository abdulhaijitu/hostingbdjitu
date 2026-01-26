import { LucideIcon, LayoutDashboard, Package, Server, MonitorCog, ListTodo, ShoppingCart, CreditCard, FileText, RotateCcw, Users, UserCheck, Gift, MessageSquare, Megaphone, FileBarChart, Settings, MoreHorizontal, Globe, Receipt, Webhook } from 'lucide-react';

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

// Bottom nav items for mobile (4 core + More)
export const mobileBottomNavItems: NavItem[] = [
  { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
  { label: 'Hosting', labelBn: 'হোস্টিং', href: '/admin/hosting-plans', icon: Package },
  { label: 'Billing', labelBn: 'বিলিং', href: '/admin/orders', icon: CreditCard },
  { label: 'Users', labelBn: 'ইউজার', href: '/admin/users', icon: Users },
];

// "More" menu items for mobile slide-up sheet
export const mobileMoreNavItems: NavItem[] = [
  { label: 'Invoices', labelBn: 'ইনভয়েস', href: '/admin/invoices', icon: FileText },
  { label: 'Payments', labelBn: 'পেমেন্ট', href: '/admin/payments', icon: Receipt },
  { label: 'Refunds', labelBn: 'রিফান্ড', href: '/admin/refunds', icon: RotateCcw },
  { label: 'Resellers', labelBn: 'রিসেলার', href: '/admin/resellers', icon: UserCheck },
  { label: 'Affiliates', labelBn: 'অ্যাফিলিয়েট', href: '/admin/affiliates', icon: Gift },
  { label: 'Tickets', labelBn: 'টিকেট', href: '/admin/tickets', icon: MessageSquare },
  { label: 'Servers', labelBn: 'সার্ভার', href: '/admin/servers', icon: Server },
  { label: 'WHM/cPanel', labelBn: 'WHM/cPanel', href: '/admin/package-mapping', icon: MonitorCog },
  { label: 'Provisioning', labelBn: 'প্রভিশনিং', href: '/admin/provisioning', icon: ListTodo },
  { label: 'Announcements', labelBn: 'ঘোষণা', href: '/admin/announcements', icon: Megaphone },
  { label: 'Webhooks', labelBn: 'ওয়েবহুক', href: '/admin/webhooks', icon: Webhook },
  { label: 'Credentials', labelBn: 'ক্রেডেনশিয়াল', href: '/admin/server-credentials', icon: FileBarChart },
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
      { label: 'Credentials', labelBn: 'API ক্রেডেনশিয়াল', href: '/admin/server-credentials', icon: Settings },
      { label: 'Settings', labelBn: 'সেটিংস', href: '/admin/settings', icon: Settings },
    ],
  },
];

// Get page title from path
export const getPageTitle = (pathname: string, language: 'en' | 'bn' = 'en'): string => {
  const allItems = [
    ...mobileBottomNavItems,
    ...mobileMoreNavItems,
    ...sidebarNavSections.flatMap(s => s.items),
  ];
  
  const item = allItems.find(i => i.href === pathname);
  if (item) {
    return language === 'bn' && item.labelBn ? item.labelBn : item.label;
  }
  
  // Default fallbacks
  if (pathname.includes('hosting')) return language === 'bn' ? 'হোস্টিং' : 'Hosting';
  if (pathname.includes('orders')) return language === 'bn' ? 'অর্ডার' : 'Orders';
  if (pathname.includes('domain')) return language === 'bn' ? 'ডোমেইন' : 'Domain';
  if (pathname.includes('canned')) return language === 'bn' ? 'ক্যানড রেসপন্স' : 'Canned Responses';
  if (pathname.includes('analytics')) return language === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics';
  
  return language === 'bn' ? 'অ্যাডমিন' : 'Admin';
};
