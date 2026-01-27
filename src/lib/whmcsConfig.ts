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
  
  // Hosting Store Pages
  hosting: {
    web: `${WHMCS_BASE_URL}/index.php?rp=/store/web-hosting`,
    premium: `${WHMCS_BASE_URL}/index.php?rp=/store/premium-hosting`,
    wordpress: `${WHMCS_BASE_URL}/index.php?rp=/store/wordpress-hosting`,
    reseller: `${WHMCS_BASE_URL}/index.php?rp=/store/reseller-hosting`,
  },
  
  // Legacy cart URLs (kept for reference)
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
 * Get WHMCS hosting store URL by category
 */
export const getHostingStoreUrl = (category: string): string => {
  const categoryMap: Record<string, string> = {
    web: WHMCS_URLS.hosting.web,
    premium: WHMCS_URLS.hosting.premium,
    wordpress: WHMCS_URLS.hosting.wordpress,
    reseller: WHMCS_URLS.hosting.reseller,
  };
  
  return categoryMap[category] || WHMCS_URLS.hosting.web;
};

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
