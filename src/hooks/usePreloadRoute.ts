import { useCallback } from 'react';

/**
 * Preload route chunks on hover/focus for faster navigation
 */
const routeModules: Record<string, () => Promise<unknown>> = {
  '/hosting/web': () => import('@/pages/hosting/WebHosting'),
  '/hosting/premium': () => import('@/pages/hosting/PremiumHosting'),
  '/hosting/wordpress': () => import('@/pages/hosting/WordPressHosting'),
  '/hosting/reseller': () => import('@/pages/hosting/ResellerHosting'),
  '/vps/cloud': () => import('@/pages/vps/CloudVPS'),
  '/vps/whm-cpanel': () => import('@/pages/vps/WHMcPanelVPS'),
  '/vps/custom': () => import('@/pages/vps/CustomVPS'),
  '/servers/dedicated': () => import('@/pages/servers/DedicatedServer'),
  '/servers/whm-cpanel': () => import('@/pages/servers/WHMcPanelDedicated'),
  '/servers/custom': () => import('@/pages/servers/CustomDedicated'),
  '/domain/register': () => import('@/pages/domain/DomainRegistration'),
  '/domain/transfer': () => import('@/pages/domain/DomainTransfer'),
  '/domain/reseller': () => import('@/pages/domain/DomainReseller'),
  '/domain/pricing': () => import('@/pages/domain/DomainPricing'),
  '/email': () => import('@/pages/EmailHosting'),
  '/affiliate': () => import('@/pages/Affiliate'),
  '/support': () => import('@/pages/Support'),
  '/about': () => import('@/pages/company/About'),
  '/contact': () => import('@/pages/company/Contact'),
  '/blog': () => import('@/pages/company/Blog'),
};

export const usePreloadRoute = () => {
  const preload = useCallback((path: string) => {
    // Normalize path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Find matching route module
    const moduleLoader = routeModules[normalizedPath];
    
    if (moduleLoader) {
      // Preload the module
      moduleLoader().catch(() => {
        // Silently fail - the actual navigation will handle errors
      });
    }
  }, []);

  return { preload };
};

export default usePreloadRoute;
