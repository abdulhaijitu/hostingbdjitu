import { LucideIcon, PanelTop, Tag, FileEdit, Megaphone, HelpCircle, Quote, MessageSquare, Settings, Users, Lock } from 'lucide-react';

export interface NavItem {
  label: string;
  labelBn?: string;
  href: string;
  icon: LucideIcon;
  restricted?: boolean; // For items requiring Super Admin access
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface BottomNavItem {
  label: string;
  labelBn?: string;
  icon: LucideIcon;
  href?: string;
  activeRoutes: string[];
  tabs?: NavItem[];
}

// CMS-only sidebar sections - Content management only
// NO billing, clients, domains, hosting, analytics, or WHMCS operations
export const sidebarNavSections: NavSection[] = [
  {
    label: 'CONTENT',
    items: [
      { label: 'Pages', labelBn: 'পেজ', href: '/admin/cms/pages', icon: PanelTop },
      { label: 'Pricing & Plans', labelBn: 'প্রাইসিং', href: '/admin/cms/pricing', icon: Tag },
      { label: 'Blog / News', labelBn: 'ব্লগ', href: '/admin/cms/blog', icon: FileEdit },
      { label: 'Announcements', labelBn: 'অ্যানাউন্সমেন্ট', href: '/admin/cms/announcements', icon: Megaphone },
      { label: 'FAQs', labelBn: 'FAQ', href: '/admin/cms/faq', icon: HelpCircle },
      { label: 'Testimonials', labelBn: 'টেস্টিমোনিয়াল', href: '/admin/cms/testimonials', icon: Quote },
    ],
  },
  {
    label: 'INBOX',
    items: [
      { label: 'Contact Messages', labelBn: 'যোগাযোগ বার্তা', href: '/admin/cms/messages', icon: MessageSquare },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Global Settings', labelBn: 'গ্লোবাল সেটিংস', href: '/admin/cms/settings', icon: Settings, restricted: true },
      { label: 'Admin Users', labelBn: 'CMS অ্যাডমিন', href: '/admin/cms/admins', icon: Users, restricted: true },
    ],
  },
];

// Mobile bottom nav - simplified for CMS
export const mobileBottomNavItems: BottomNavItem[] = [
  {
    label: 'Pages',
    labelBn: 'পেজ',
    icon: PanelTop,
    href: '/admin/cms/pages',
    activeRoutes: ['/admin/cms/pages'],
  },
  {
    label: 'Pricing',
    labelBn: 'প্রাইসিং',
    icon: Tag,
    href: '/admin/cms/pricing',
    activeRoutes: ['/admin/cms/pricing'],
  },
  {
    label: 'Blog',
    labelBn: 'ব্লগ',
    icon: FileEdit,
    href: '/admin/cms/blog',
    activeRoutes: ['/admin/cms/blog'],
  },
  {
    label: 'FAQs',
    labelBn: 'FAQ',
    icon: HelpCircle,
    href: '/admin/cms/faq',
    activeRoutes: ['/admin/cms/faq'],
  },
];

// "More" sheet items for mobile - additional CMS sections
export const mobileMoreSheetItems: NavItem[] = [
  { label: 'Announcements', labelBn: 'অ্যানাউন্সমেন্ট', href: '/admin/cms/announcements', icon: Megaphone },
  { label: 'Testimonials', labelBn: 'টেস্টিমোনিয়াল', href: '/admin/cms/testimonials', icon: Quote },
  { label: 'Contact Messages', labelBn: 'যোগাযোগ বার্তা', href: '/admin/cms/messages', icon: MessageSquare },
  { label: 'Global Settings', labelBn: 'গ্লোবাল সেটিংস', href: '/admin/cms/settings', icon: Settings, restricted: true },
  { label: 'Admin Users', labelBn: 'CMS অ্যাডমিন', href: '/admin/cms/admins', icon: Users, restricted: true },
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
  
  // Default fallback for CMS
  return language === 'bn' ? 'CMS অ্যাডমিন' : 'CMS Admin';
};

// Get active bottom nav item based on current path
export const getActiveBottomNavItem = (pathname: string): BottomNavItem | null => {
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
