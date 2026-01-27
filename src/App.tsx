import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PageLoader from "@/components/common/PageLoader";

// Critical pages - loaded immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages - code splitting for better performance
// Hosting Pages
const WebHosting = lazy(() => import("./pages/hosting/WebHosting"));
const PremiumHosting = lazy(() => import("./pages/hosting/PremiumHosting"));
const WordPressHosting = lazy(() => import("./pages/hosting/WordPressHosting"));
const ResellerHosting = lazy(() => import("./pages/hosting/ResellerHosting"));

// VPS Pages
const CloudVPS = lazy(() => import("./pages/vps/CloudVPS"));
const WHMcPanelVPS = lazy(() => import("./pages/vps/WHMcPanelVPS"));
const CustomVPS = lazy(() => import("./pages/vps/CustomVPS"));

// Server Pages
const DedicatedServer = lazy(() => import("./pages/servers/DedicatedServer"));
const WHMcPanelDedicated = lazy(() => import("./pages/servers/WHMcPanelDedicated"));
const CustomDedicated = lazy(() => import("./pages/servers/CustomDedicated"));

// Domain Pages
const DomainRegistration = lazy(() => import("./pages/domain/DomainRegistration"));
const DomainTransfer = lazy(() => import("./pages/domain/DomainTransfer"));
const DomainReseller = lazy(() => import("./pages/domain/DomainReseller"));
const DomainPricing = lazy(() => import("./pages/domain/DomainPricing"));

// Other Pages
const EmailHosting = lazy(() => import("./pages/EmailHosting"));
const WebsiteDesign = lazy(() => import("./pages/services/WebsiteDesign"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Support = lazy(() => import("./pages/Support"));

// Company Pages
const About = lazy(() => import("./pages/company/About"));
const Contact = lazy(() => import("./pages/company/Contact"));
const Blog = lazy(() => import("./pages/company/Blog"));

// Legal Pages
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));

// Admin Route Wrapper
const AdminRoute = lazy(() => import("./components/auth/AdminRoute"));

// CMS Dashboard (Content-Only)
const CMSDashboard = lazy(() => import("./pages/admin/CMSDashboard"));

// Admin CMS Pages
const CMSSettingsManagement = lazy(() => import("./pages/admin/cms/CMSSettingsManagement"));
const CMSPricingManagement = lazy(() => import("./pages/admin/cms/CMSPricingManagement"));
const CMSFAQManagement = lazy(() => import("./pages/admin/cms/CMSFAQManagement"));
const CMSTestimonialsManagement = lazy(() => import("./pages/admin/cms/CMSTestimonialsManagement"));
const CMSAnnouncementsManagement = lazy(() => import("./pages/admin/cms/CMSAnnouncementsManagement"));
const CMSBlogManagement = lazy(() => import("./pages/admin/cms/CMSBlogManagement"));
const CMSPagesManagement = lazy(() => import("./pages/admin/cms/CMSPagesManagement"));
const CMSContactMessagesPage = lazy(() => import("./pages/admin/cms/CMSContactMessagesPage"));
const CMSAdminUsersPage = lazy(() => import("./pages/admin/cms/CMSAdminUsersPage"));

// Configure React Query with optimized global settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
});

// Suspense wrapper for lazy routes
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Home - Critical route, loaded immediately */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Hosting Routes - Lazy loaded */}
                  <Route path="/hosting" element={<LazyRoute><WebHosting /></LazyRoute>} />
                  <Route path="/hosting/web" element={<LazyRoute><WebHosting /></LazyRoute>} />
                  <Route path="/hosting/premium" element={<LazyRoute><PremiumHosting /></LazyRoute>} />
                  <Route path="/hosting/wordpress" element={<LazyRoute><WordPressHosting /></LazyRoute>} />
                  <Route path="/hosting/reseller" element={<LazyRoute><ResellerHosting /></LazyRoute>} />
                  
                  {/* VPS Routes - Lazy loaded */}
                  <Route path="/vps" element={<LazyRoute><CloudVPS /></LazyRoute>} />
                  <Route path="/vps/cloud" element={<LazyRoute><CloudVPS /></LazyRoute>} />
                  <Route path="/vps/whm-cpanel" element={<LazyRoute><WHMcPanelVPS /></LazyRoute>} />
                  <Route path="/vps/custom" element={<LazyRoute><CustomVPS /></LazyRoute>} />
                  
                  {/* Server Routes - Lazy loaded */}
                  <Route path="/servers" element={<LazyRoute><DedicatedServer /></LazyRoute>} />
                  <Route path="/servers/dedicated" element={<LazyRoute><DedicatedServer /></LazyRoute>} />
                  <Route path="/servers/whm-cpanel" element={<LazyRoute><WHMcPanelDedicated /></LazyRoute>} />
                  <Route path="/servers/custom" element={<LazyRoute><CustomDedicated /></LazyRoute>} />
                  
                  {/* Domain Routes - Lazy loaded */}
                  <Route path="/domain" element={<LazyRoute><DomainRegistration /></LazyRoute>} />
                  <Route path="/domain/register" element={<LazyRoute><DomainRegistration /></LazyRoute>} />
                  <Route path="/domain/transfer" element={<LazyRoute><DomainTransfer /></LazyRoute>} />
                  <Route path="/domain/reseller" element={<LazyRoute><DomainReseller /></LazyRoute>} />
                  <Route path="/domain/pricing" element={<LazyRoute><DomainPricing /></LazyRoute>} />
                  
                  {/* Other Service Routes - Lazy loaded */}
                  <Route path="/email" element={<LazyRoute><EmailHosting /></LazyRoute>} />
                  <Route path="/services/website-design" element={<LazyRoute><WebsiteDesign /></LazyRoute>} />
                  <Route path="/affiliate" element={<LazyRoute><Affiliate /></LazyRoute>} />
                  <Route path="/support" element={<LazyRoute><Support /></LazyRoute>} />
                  
                  {/* Company Routes - Lazy loaded */}
                  <Route path="/about" element={<LazyRoute><About /></LazyRoute>} />
                  <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
                  <Route path="/blog" element={<LazyRoute><Blog /></LazyRoute>} />
                  
                  {/* Legal Routes - Lazy loaded */}
                  <Route path="/refund-policy" element={<LazyRoute><RefundPolicy /></LazyRoute>} />
                  <Route path="/privacy-policy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
                  <Route path="/terms-of-service" element={<LazyRoute><TermsOfService /></LazyRoute>} />
                  
                  {/* Auth Routes - Lazy loaded */}
                  <Route path="/auth/login" element={<LazyRoute><Login /></LazyRoute>} />
                  <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
                  <Route path="/signup" element={<LazyRoute><Login /></LazyRoute>} />

                  {/* Admin CMS Routes - Content Only */}
                  <Route path="/admin" element={<LazyRoute><AdminRoute><CMSDashboard /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/pages" element={<LazyRoute><AdminRoute><CMSPagesManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/pricing" element={<LazyRoute><AdminRoute><CMSPricingManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/blog" element={<LazyRoute><AdminRoute><CMSBlogManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/announcements" element={<LazyRoute><AdminRoute><CMSAnnouncementsManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/faq" element={<LazyRoute><AdminRoute><CMSFAQManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/testimonials" element={<LazyRoute><AdminRoute><CMSTestimonialsManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/settings" element={<LazyRoute><AdminRoute><CMSSettingsManagement /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/messages" element={<LazyRoute><AdminRoute><CMSContactMessagesPage /></AdminRoute></LazyRoute>} />
                  <Route path="/admin/cms/admins" element={<LazyRoute><AdminRoute><CMSAdminUsersPage /></AdminRoute></LazyRoute>} />
                  
                  {/* 404 - Critical route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
