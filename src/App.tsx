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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OfflineIndicator from "@/components/common/OfflineIndicator";
import AdminPageLoader from "@/components/admin/AdminPageLoader";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Hosting Pages
import WebHosting from "./pages/hosting/WebHosting";
import PremiumHosting from "./pages/hosting/PremiumHosting";
import WordPressHosting from "./pages/hosting/WordPressHosting";
import ResellerHosting from "./pages/hosting/ResellerHosting";

// VPS Pages
import CloudVPS from "./pages/vps/CloudVPS";
import WHMcPanelVPS from "./pages/vps/WHMcPanelVPS";
import CustomVPS from "./pages/vps/CustomVPS";

// Server Pages
import DedicatedServer from "./pages/servers/DedicatedServer";
import WHMcPanelDedicated from "./pages/servers/WHMcPanelDedicated";
import CustomDedicated from "./pages/servers/CustomDedicated";

// Domain Pages
import DomainRegistration from "./pages/domain/DomainRegistration";
import DomainTransfer from "./pages/domain/DomainTransfer";
import DomainReseller from "./pages/domain/DomainReseller";
import DomainPricing from "./pages/domain/DomainPricing";

// Other Pages
import EmailHosting from "./pages/EmailHosting";
import WebsiteDesign from "./pages/services/WebsiteDesign";
import Affiliate from "./pages/Affiliate";
import Support from "./pages/Support";

// Company Pages
import About from "./pages/company/About";
import Contact from "./pages/company/Contact";
import Blog from "./pages/company/Blog";

// Legal Pages
import RefundPolicy from "./pages/legal/RefundPolicy";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages (Legacy)
import Dashboard from "./pages/dashboard/Dashboard";
import ProfilePage from "./pages/dashboard/ProfilePage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import InvoicesPage from "./pages/dashboard/InvoicesPage";

// Client Dashboard Pages (New cPanel-style)
import ClientDashboard from "./pages/client/ClientDashboard";
import { HostingList, HostingDetails } from "./pages/client/HostingManagement";
import DomainsPage from "./pages/client/DomainsPage";
import EmailsPage from "./pages/client/EmailsPage";
import DatabasesPage from "./pages/client/DatabasesPage";
import FilesPage from "./pages/client/FilesPage";
import SecurityPage from "./pages/client/SecurityPage";
import BackupsPage from "./pages/client/BackupsPage";
import BillingPage from "./pages/client/BillingPage";
import SupportPage from "./pages/client/SupportPage";
import ProfileSettingsPage from "./pages/client/ProfileSettingsPage";

// Checkout Pages
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import CheckoutCancel from "./pages/checkout/CheckoutCancel";

// =====================================================
// LAZY LOADED ADMIN PAGES - Code splitting for faster initial load
// =====================================================
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const HostingPlansManagement = lazy(() => import('./pages/admin/HostingPlansManagement'));
const DomainPricingManagement = lazy(() => import('./pages/admin/DomainPricingManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const TicketsManagement = lazy(() => import('./pages/admin/TicketsManagement'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'));
const PaymentsManagement = lazy(() => import('./pages/admin/PaymentsManagement'));
const WebhookLogs = lazy(() => import('./pages/admin/WebhookLogs'));
const ServerManagement = lazy(() => import('./pages/admin/ServerManagement'));
const ProvisioningQueue = lazy(() => import('./pages/admin/ProvisioningQueue'));
const WHMPackageMapping = lazy(() => import('./pages/admin/WHMPackageMapping'));
const CannedResponsesManagement = lazy(() => import('./pages/admin/CannedResponsesManagement'));
const HostingAccountsManagement = lazy(() => import('./pages/admin/HostingAccountsManagement'));
const ServerCredentials = lazy(() => import('./pages/admin/ServerCredentials'));
const InvoicesManagement = lazy(() => import('./pages/admin/InvoicesManagement'));
const RefundsManagement = lazy(() => import('./pages/admin/RefundsManagement'));
const ResellersManagement = lazy(() => import('./pages/admin/ResellersManagement'));
const AffiliatesManagement = lazy(() => import('./pages/admin/AffiliatesManagement'));
const AnnouncementsManagement = lazy(() => import('./pages/admin/AnnouncementsManagement'));
const SettingsManagement = lazy(() => import('./pages/admin/SettingsManagement'));
const AuditLogsManagement = lazy(() => import('./pages/admin/AuditLogsManagement'));
const ErrorLogsManagement = lazy(() => import('./pages/admin/ErrorLogsManagement'));
const SecurityMonitoringPage = lazy(() => import('./pages/admin/SecurityMonitoringPage'));
const ReportsManagement = lazy(() => import('./pages/admin/ReportsManagement'));
// Configure React Query with optimized global settings
// Key principles:
// - Aggressive caching to prevent refetches
// - No refetch on window focus (manual invalidation only)
// - Fast retries with backoff
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 60 * 1000, // 1 minute - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes cache retention
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false, // Don't refetch if data exists
      networkMode: 'offlineFirst', // Use cache first
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
});

// Wrapper component for lazy-loaded admin pages
const LazyAdminPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<AdminPageLoader />}>
    {children}
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <OfflineIndicator />
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  {/* Hosting Routes */}
                  <Route path="/hosting" element={<WebHosting />} />
                  <Route path="/hosting/web" element={<WebHosting />} />
                  <Route path="/hosting/premium" element={<PremiumHosting />} />
                  <Route path="/hosting/wordpress" element={<WordPressHosting />} />
                  <Route path="/hosting/reseller" element={<ResellerHosting />} />
                  
                  {/* VPS Routes */}
                  <Route path="/vps" element={<CloudVPS />} />
                  <Route path="/vps/cloud" element={<CloudVPS />} />
                  <Route path="/vps/whm-cpanel" element={<WHMcPanelVPS />} />
                  <Route path="/vps/custom" element={<CustomVPS />} />
                  
                  {/* Server Routes */}
                  <Route path="/servers" element={<DedicatedServer />} />
                  <Route path="/servers/dedicated" element={<DedicatedServer />} />
                  <Route path="/servers/whm-cpanel" element={<WHMcPanelDedicated />} />
                  <Route path="/servers/custom" element={<CustomDedicated />} />
                  
                  {/* Domain Routes */}
                  <Route path="/domain" element={<DomainRegistration />} />
                  <Route path="/domain/register" element={<DomainRegistration />} />
                  <Route path="/domain/transfer" element={<DomainTransfer />} />
                  <Route path="/domain/reseller" element={<DomainReseller />} />
                  <Route path="/domain/pricing" element={<DomainPricing />} />
                  
                  {/* Other Service Routes */}
                  <Route path="/email" element={<EmailHosting />} />
                  <Route path="/services/website-design" element={<WebsiteDesign />} />
                  <Route path="/affiliate" element={<Affiliate />} />
                  <Route path="/support" element={<Support />} />
                  
                  {/* Company Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  
                  {/* Legal Routes */}
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  
                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Checkout Routes */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
                  <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                  
                  {/* Customer Dashboard Routes (Legacy) */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/dashboard/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
                  
                  {/* Client Dashboard Routes (New cPanel-style) */}
                  <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
                  <Route path="/client/hosting" element={<ProtectedRoute><HostingList /></ProtectedRoute>} />
                  <Route path="/client/hosting/:id" element={<ProtectedRoute><HostingDetails /></ProtectedRoute>} />
                  <Route path="/client/domains" element={<ProtectedRoute><DomainsPage /></ProtectedRoute>} />
                  <Route path="/client/emails" element={<ProtectedRoute><EmailsPage /></ProtectedRoute>} />
                  <Route path="/client/databases" element={<ProtectedRoute><DatabasesPage /></ProtectedRoute>} />
                  <Route path="/client/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
                  <Route path="/client/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
                  <Route path="/client/backups" element={<ProtectedRoute><BackupsPage /></ProtectedRoute>} />
                  <Route path="/client/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
                  <Route path="/client/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                  <Route path="/client/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
                  
                  {/* Admin Routes - Lazy loaded with Suspense for faster initial load */}
                  <Route path="/admin" element={<AdminRoute><LazyAdminPage><AdminDashboard /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/hosting-plans" element={<AdminRoute><LazyAdminPage><HostingPlansManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/domain-pricing" element={<AdminRoute><LazyAdminPage><DomainPricingManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><LazyAdminPage><UsersManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/tickets" element={<AdminRoute><LazyAdminPage><TicketsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/canned-responses" element={<AdminRoute><LazyAdminPage><CannedResponsesManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><LazyAdminPage><AnalyticsDashboard /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><LazyAdminPage><OrdersManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/payments" element={<AdminRoute><LazyAdminPage><PaymentsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/webhooks" element={<AdminRoute><LazyAdminPage><WebhookLogs /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/servers" element={<AdminRoute><LazyAdminPage><ServerManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/provisioning" element={<AdminRoute><LazyAdminPage><ProvisioningQueue /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/package-mapping" element={<AdminRoute><LazyAdminPage><WHMPackageMapping /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/hosting-accounts" element={<AdminRoute><LazyAdminPage><HostingAccountsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/server-credentials" element={<AdminRoute><LazyAdminPage><ServerCredentials /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/invoices" element={<AdminRoute><LazyAdminPage><InvoicesManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/refunds" element={<AdminRoute><LazyAdminPage><RefundsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/resellers" element={<AdminRoute><LazyAdminPage><ResellersManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/affiliates" element={<AdminRoute><LazyAdminPage><AffiliatesManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/announcements" element={<AdminRoute><LazyAdminPage><AnnouncementsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><LazyAdminPage><SettingsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/audit-logs" element={<AdminRoute><LazyAdminPage><AuditLogsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/error-logs" element={<AdminRoute><LazyAdminPage><ErrorLogsManagement /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/security" element={<AdminRoute><LazyAdminPage><SecurityMonitoringPage /></LazyAdminPage></AdminRoute>} />
                  <Route path="/admin/reports" element={<AdminRoute><LazyAdminPage><ReportsManagement /></LazyAdminPage></AdminRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
