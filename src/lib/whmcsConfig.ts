/**
 * WHMCS Integration Configuration
 * 
 * This file contains all WHMCS URLs and redirect configurations.
 * All billing, order, support, and client area actions redirect to WHMCS.
 */

const WHMCS_BASE_URL = 'https://billing.chostbd.com';

export const WHMCS_URLS = {
  // Main URLs
  billingHome: `${WHMCS_BASE_URL}/index.php`,
  clientArea: `${WHMCS_BASE_URL}/clientarea.php`,
  
  // Domain
  domainSearch: `${WHMCS_BASE_URL}/cart.php?a=add&domain=register`,
  domainTransfer: `${WHMCS_BASE_URL}/cart.php?a=add&domain=transfer`,
  
  // Support
  submitTicket: `${WHMCS_BASE_URL}/submitticket.php`,
  viewTickets: `${WHMCS_BASE_URL}/supporttickets.php`,
  knowledgeBase: `${WHMCS_BASE_URL}/knowledgebase.php`,
  
  // Orders
  cart: `${WHMCS_BASE_URL}/cart.php`,
  orderHosting: (productId: number) => `${WHMCS_BASE_URL}/cart.php?a=add&pid=${productId}`,
  
  // Account
  invoices: `${WHMCS_BASE_URL}/clientarea.php?action=invoices`,
  services: `${WHMCS_BASE_URL}/clientarea.php?action=services`,
  domains: `${WHMCS_BASE_URL}/clientarea.php?action=domains`,
  profile: `${WHMCS_BASE_URL}/clientarea.php?action=details`,
  
  // Announcements
  announcements: `${WHMCS_BASE_URL}/announcements`,
  
  // Affiliates
  affiliates: `${WHMCS_BASE_URL}/affiliates.php`,
} as const;

/**
 * Product IDs for hosting plans
 * These should match your WHMCS product configuration
 */
export const WHMCS_PRODUCT_IDS = {
  // Shared Hosting
  sharedStarter: 1,
  sharedBusiness: 2,
  sharedEnterprise: 3,
  
  // WordPress Hosting
  wpStarter: 4,
  wpBusiness: 5,
  wpEnterprise: 6,
  
  // Premium Hosting
  premiumStarter: 7,
  premiumBusiness: 8,
  premiumEnterprise: 9,
  
  // Reseller Hosting
  resellerStarter: 10,
  resellerBusiness: 11,
  resellerEnterprise: 12,
  
  // VPS
  vpsCloud: 13,
  vpsWHM: 14,
  vpsCustom: 15,
  
  // Dedicated Servers
  dedicatedStarter: 16,
  dedicatedBusiness: 17,
  dedicatedEnterprise: 18,
} as const;

/**
 * Helper function to redirect to WHMCS
 */
export const redirectToWHMCS = (url: string): void => {
  window.location.href = url;
};

/**
 * Helper function to open WHMCS in new tab
 */
export const openWHMCSInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
