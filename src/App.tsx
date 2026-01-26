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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import HostingPlansManagement from "./pages/admin/HostingPlansManagement";
import DomainPricingManagement from "./pages/admin/DomainPricingManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import TicketsManagement from "./pages/admin/TicketsManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import OrdersManagement from "./pages/admin/OrdersManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import WebhookLogs from "./pages/admin/WebhookLogs";

// Checkout Pages
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import CheckoutCancel from "./pages/checkout/CheckoutCancel";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
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
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/hosting-plans" element={<ProtectedRoute requireAdmin><HostingPlansManagement /></ProtectedRoute>} />
                  <Route path="/admin/domain-pricing" element={<ProtectedRoute requireAdmin><DomainPricingManagement /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersManagement /></ProtectedRoute>} />
                  <Route path="/admin/tickets" element={<ProtectedRoute requireAdmin><TicketsManagement /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AnalyticsDashboard /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><OrdersManagement /></ProtectedRoute>} />
                  <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><PaymentsManagement /></ProtectedRoute>} />
                  <Route path="/admin/webhooks" element={<ProtectedRoute requireAdmin><WebhookLogs /></ProtectedRoute>} />
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
);

export default App;
