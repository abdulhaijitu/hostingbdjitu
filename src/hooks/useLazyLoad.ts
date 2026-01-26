import { lazy, LazyExoticComponent, ComponentType } from 'react';

/**
 * Creates a lazy-loaded component with preload capability
 * Use for large admin pages to improve initial load time
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const Component = lazy(factory) as LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };
  
  Component.preload = factory;
  
  return Component;
}

/**
 * Preloads a component on hover/focus
 * Use on links/buttons that navigate to heavy pages
 */
export function usePreloadOnInteraction<T extends ComponentType<any>>(
  Component: LazyExoticComponent<T> & { preload?: () => Promise<any> }
) {
  return {
    onMouseEnter: () => Component.preload?.(),
    onFocus: () => Component.preload?.(),
    onTouchStart: () => Component.preload?.(),
  };
}

// Lazy-loaded admin pages for code splitting
export const LazyAdminPages = {
  Analytics: lazyWithPreload(() => import('@/pages/admin/AnalyticsDashboard')),
  Users: lazyWithPreload(() => import('@/pages/admin/UsersManagement')),
  Tickets: lazyWithPreload(() => import('@/pages/admin/TicketsManagement')),
  Servers: lazyWithPreload(() => import('@/pages/admin/ServerManagement')),
  HostingPlans: lazyWithPreload(() => import('@/pages/admin/HostingPlansManagement')),
  DomainPricing: lazyWithPreload(() => import('@/pages/admin/DomainPricingManagement')),
  Orders: lazyWithPreload(() => import('@/pages/admin/OrdersManagement')),
  Payments: lazyWithPreload(() => import('@/pages/admin/PaymentsManagement')),
  Invoices: lazyWithPreload(() => import('@/pages/admin/InvoicesManagement')),
  Webhooks: lazyWithPreload(() => import('@/pages/admin/WebhookLogs')),
  Provisioning: lazyWithPreload(() => import('@/pages/admin/ProvisioningQueue')),
  PackageMapping: lazyWithPreload(() => import('@/pages/admin/WHMPackageMapping')),
  HostingAccounts: lazyWithPreload(() => import('@/pages/admin/HostingAccountsManagement')),
  ServerCredentials: lazyWithPreload(() => import('@/pages/admin/ServerCredentials')),
  Refunds: lazyWithPreload(() => import('@/pages/admin/RefundsManagement')),
  Resellers: lazyWithPreload(() => import('@/pages/admin/ResellersManagement')),
  Affiliates: lazyWithPreload(() => import('@/pages/admin/AffiliatesManagement')),
  Announcements: lazyWithPreload(() => import('@/pages/admin/AnnouncementsManagement')),
  Settings: lazyWithPreload(() => import('@/pages/admin/SettingsManagement')),
};
