import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/common/ErrorBoundary";

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

// Auth Pages (WHMCS Redirect)
import Login from "./pages/auth/Login";

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

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <BrowserRouter>
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
                
                {/* Auth Routes - WHMCS Redirect */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
