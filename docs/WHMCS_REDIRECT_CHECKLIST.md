# WHMCS Redirect Checklist

This document contains a comprehensive checklist of all pages and components that have been configured with WHMCS redirects.

## Configuration File
- **Location**: `src/lib/whmcsConfig.ts`
- **Base URL**: `https://billing.chostbd.com`

---

## ✅ HOSTING PAGES

### Web Hosting (`/hosting/web`)
- [x] Hero "Get Started Now" → `WHMCS_URLS.hosting.web`
- [x] Pricing cards "Get Started" → `getHostingStoreUrl('web')`
- **File**: `src/pages/hosting/WebHosting.tsx`

### Premium Hosting (`/hosting/premium`)
- [x] Hero "Get Started" → `getHostingStoreUrl('premium')`
- [x] Hero "View Plans" → `getHostingStoreUrl('premium')`
- [x] Pricing cards "Get Started" → `getHostingStoreUrl('premium')`
- [x] CTA "View All Plans" → `getHostingStoreUrl('premium')`
- [x] CTA "Contact Us" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/hosting/PremiumHosting.tsx`

### WordPress Hosting (`/hosting/wordpress`)
- [x] Hero "Get Started" → `getHostingStoreUrl('wordpress')`
- [x] Hero "View Plans" → `getHostingStoreUrl('wordpress')`
- [x] Pricing cards "Get Started" → `getHostingStoreUrl('wordpress')`
- [x] CTA "Start Your WordPress Site" → `getHostingStoreUrl('wordpress')`
- [x] CTA "Contact Us" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/hosting/WordPressHosting.tsx`

### Reseller Hosting (`/hosting/reseller`)
- [x] Hero "Get Started" → `getHostingStoreUrl('reseller')`
- [x] Hero "View Plans" → `getHostingStoreUrl('reseller')`
- [x] Pricing cards "Get Started" → `getHostingStoreUrl('reseller')`
- [x] CTA "Start Your Hosting Business" → `getHostingStoreUrl('reseller')`
- [x] CTA "Contact Sales" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/hosting/ResellerHosting.tsx`

---

## ✅ VPS PAGES

### Cloud VPS (`/vps/cloud`)
- [x] All "Order Now" buttons → `getVPSStoreUrl('cloud')`
- [x] "View All Plans" → `getVPSStoreUrl('cloud')`
- [x] "Contact Sales" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/vps/CloudVPS.tsx`

### WHM/cPanel VPS (`/vps/whm-cpanel`)
- [x] Hero "Get Started" → `getVPSStoreUrl('whm')`
- [x] Hero "View Plans" → `getVPSStoreUrl('whm')`
- [x] Pricing cards "Order Now" → `getVPSStoreUrl('whm')`
- [x] CTA buttons → `getVPSStoreUrl('whm')`
- [x] "Contact Sales" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/vps/WHMcPanelVPS.tsx`

### Custom VPS (`/vps/custom`)
- [x] Hero "Request Quote" → `getVPSStoreUrl('custom')`
- [x] "Contact Sales" → `WHMCS_URLS.submitTicket`
- [x] CTA "Request Quote" → `getVPSStoreUrl('custom')`
- **File**: `src/pages/vps/CustomVPS.tsx`

---

## ✅ DEDICATED SERVER PAGES

### Dedicated Server (`/servers/dedicated`)
- [x] All "Order Now" buttons → `getServerStoreUrl('dedicated')`
- **File**: `src/pages/servers/DedicatedServer.tsx`

### WHM/cPanel Dedicated (`/servers/whm-cpanel`)
- [x] Hero "Order Now" → `getServerStoreUrl('whm')`
- [x] Hero "View Plans" → `getServerStoreUrl('whm')`
- [x] Pricing "Order Now" → `getServerStoreUrl('whm')`
- [x] CTA buttons → `getServerStoreUrl('whm')`
- [x] "Contact Sales" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/servers/WHMcPanelDedicated.tsx`

### Custom Dedicated (`/servers/custom`)
- [x] Hero "Request Quote" → `getServerStoreUrl('custom')`
- [x] CTA "Request Quote" → `getServerStoreUrl('custom')`
- [x] "Contact Sales" → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/servers/CustomDedicated.tsx`

---

## ✅ DOMAIN PAGES

### Domain Registration (`/domain/register`)
- [x] Domain search form → `WHMCS_URLS.domainSearch`
- [x] All "Register" buttons → `WHMCS_URLS.domainSearch`
- [x] CTA "Search Domains" → `WHMCS_URLS.domainSearch`
- **File**: `src/pages/domain/DomainRegistration.tsx`

### Domain Pricing (`/domain/pricing`)
- [x] All "Register" buttons → `WHMCS_URLS.domainSearch`
- [x] CTA "Search Domains" → `WHMCS_URLS.domainSearch`
- **File**: `src/pages/domain/DomainPricing.tsx`

### Domain Transfer (`/domain/transfer`)
- [x] Hero "Start Transfer" → `WHMCS_URLS.domainTransfer`
- [x] All "Transfer" buttons → `WHMCS_URLS.domainTransfer`
- [x] CTA buttons → `WHMCS_URLS.domainTransfer`
- **File**: `src/pages/domain/DomainTransfer.tsx`

### Domain Reseller (`/domain/reseller`)
- [x] Hero "Get Started" → `WHMCS_URLS.domainSearch`
- [x] "Join as Reseller" → `WHMCS_URLS.submitTicket`
- [x] CTA buttons → `WHMCS_URLS.domainSearch`
- **File**: `src/pages/domain/DomainReseller.tsx`

---

## ✅ OTHER PAGES

### Email Hosting (`/email-hosting`)
- [x] All "Get Started" buttons → `${WHMCS_URLS.billingHome}?rp=/store/email-hosting`
- [x] Pricing cards → Email hosting store
- **File**: `src/pages/EmailHosting.tsx`

### Affiliate (`/affiliate`)
- [x] Hero "Join Now" → `WHMCS_URLS.affiliates`
- [x] All "Join as Affiliate" buttons → `WHMCS_URLS.affiliates`
- [x] CTA "Join for Free" → `WHMCS_URLS.affiliates`
- **File**: `src/pages/Affiliate.tsx`

### Support (`/support`)
- [x] "Submit Ticket" → `WHMCS_URLS.submitTicket`
- [x] "Knowledge Base" → `WHMCS_URLS.knowledgeBase`
- [x] Live Chat → `WHMCS_URLS.clientArea`
- **File**: `src/pages/Support.tsx`

### Contact (`/company/contact`)
- [x] Live Chat channel → `WHMCS_URLS.clientArea`
- [x] Ticket System channel → `WHMCS_URLS.submitTicket`
- [x] "Open Ticket" button → `WHMCS_URLS.submitTicket`
- **File**: `src/pages/company/Contact.tsx`

---

## ✅ LAYOUT COMPONENTS

### Header
- [x] "Get Started" button → `WHMCS_URLS.billingHome`
- [x] "Login" link → `WHMCS_URLS.clientArea`
- **File**: `src/components/layout/Header.tsx`

### Footer
- [x] Web Hosting → `WHMCS_URLS.hosting.web`
- [x] Cloud VPS → `WHMCS_URLS.vps.cloud`
- [x] Dedicated Server → `WHMCS_URLS.servers.dedicated`
- **File**: `src/components/layout/Footer.tsx`

### Mega Menu
- [x] All hosting, VPS, server links → Respective WHMCS store URLs
- **File**: `src/components/layout/MegaMenu.tsx`

---

## ✅ HOME PAGE COMPONENTS

### Domain Search
- [x] Search form → `WHMCS_URLS.domainSearch`
- **File**: `src/components/home/DomainSearch.tsx`

### Pricing Section
- [x] All pricing cards → `getHostingStoreUrl()`
- **File**: `src/components/home/PricingSection.tsx`

### Pricing Cards
- [x] All "Get Started" buttons → `WHMCS_URLS.hosting.web`
- **File**: `src/components/hosting/PricingCards.tsx`

---

## WHMCS URL Reference

```typescript
WHMCS_URLS = {
  billingHome: 'https://billing.chostbd.com/index.php',
  clientArea: 'https://billing.chostbd.com/clientarea.php',
  domainSearch: 'https://billing.chostbd.com/cart.php?a=add&domain=register',
  domainTransfer: 'https://billing.chostbd.com/cart.php?a=add&domain=transfer',
  submitTicket: 'https://billing.chostbd.com/submitticket.php',
  viewTickets: 'https://billing.chostbd.com/supporttickets.php',
  knowledgeBase: 'https://billing.chostbd.com/knowledgebase.php',
  affiliates: 'https://billing.chostbd.com/affiliates.php',
  
  hosting: {
    web: '.../store/web-hosting',
    premium: '.../store/premium-hosting',
    wordpress: '.../store/wordpress-hosting',
    reseller: '.../store/reseller-hosting',
  },
  
  vps: {
    cloud: '.../store/cloud-vps',
    whm: '.../store/whm-cpanel-vps',
    custom: '.../store/custom-vps',
  },
  
  servers: {
    dedicated: '.../store/dedicated-server',
    whm: '.../store/whm-cpanel-dedicated',
    custom: '.../store/custom-dedicated',
  },
}
```

---

## Testing Instructions

1. **Manual Testing**: Click each button/link and verify it redirects to the correct WHMCS URL
2. **Check Console**: Ensure no JavaScript errors occur during redirect
3. **Mobile Testing**: Verify redirects work on mobile devices
4. **New Tab Verification**: For external links, ensure they open in new tabs where appropriate

---

*Last Updated: January 2026*

---

# Performance Optimizations

## ✅ Implemented Optimizations

### Code Splitting (Lazy Loading)
- All non-critical pages are lazy loaded using `React.lazy()`
- Only Home and 404 pages load immediately
- Suspense fallback shows a loading spinner during chunk load
- **File**: `src/App.tsx`

### Route Preloading
- Routes preload on link hover/focus for faster navigation
- `usePreloadRoute` hook handles chunk preloading
- `PreloadLink` component wraps React Router's Link
- **Files**: `src/hooks/usePreloadRoute.ts`, `src/components/common/PreloadLink.tsx`

### Image Optimization
- `OptimizedImage` component with:
  - Intersection Observer for lazy loading
  - Blur placeholder while loading
  - Error fallback handling
  - Native lazy loading support
- **File**: `src/components/common/OptimizedImage.tsx`

### Performance Utilities
- Debounce/throttle for scroll handlers
- Image preloading utilities
- Connection speed detection
- Deferred non-critical operations
- **File**: `src/lib/performanceOptimizations.ts`

### React Query Optimization
- Stale time: 60 seconds
- GC time: 10 minutes
- Offline-first network mode
- Smart retry with exponential backoff

### Service Worker
- Offline support enabled
- Registered after initial render (deferred)
- **File**: `src/lib/registerServiceWorker.ts`

---

## Usage Examples

### OptimizedImage
```tsx
import OptimizedImage from '@/components/common/OptimizedImage';

<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  aspectRatio="video"
  priority={true}  // Load immediately for above-fold images
/>
```

### PreloadLink
```tsx
import PreloadLink from '@/components/common/PreloadLink';

<PreloadLink to="/hosting/web">
  Web Hosting
</PreloadLink>
```

### Performance Utilities
```tsx
import { debounce, throttle, deferNonCritical } from '@/lib/performanceOptimizations';

// Debounce scroll handler
const handleScroll = debounce(() => {
  // Handle scroll
}, 100);

// Defer analytics
deferNonCritical(() => {
  // Initialize analytics
});
```
