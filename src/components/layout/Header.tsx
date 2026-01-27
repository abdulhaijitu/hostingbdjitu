import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Globe, Sun, Moon, Search, Phone, Mail, User, Headphones, Gift, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { WHMCS_URLS } from '@/lib/whmcsConfig';
import chostLogo from '@/assets/chost-logo.png';
import SiteSearch from '@/components/common/SiteSearch';
import PromoBanner from './PromoBanner';
import MegaMenu from './MegaMenu';
import PreloadLink from '@/components/common/PreloadLink';

interface MenuItem {
  label: string;
  href: string;
  key?: string;
  external?: boolean;
  children?: Omit<MenuItem, 'children'>[];
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mainMenuItems: MenuItem[] = [
    {
      label: t('nav.hosting'),
      href: '/hosting',
      key: 'hosting',
      children: [
        { label: t('nav.webHosting'), href: '/hosting/web' },
        { label: t('nav.premiumHosting'), href: '/hosting/premium' },
        { label: t('nav.wordpressHosting'), href: '/hosting/wordpress' },
        { label: t('nav.resellerHosting'), href: '/hosting/reseller' },
      ],
    },
    {
      label: t('nav.vps'),
      href: '/vps',
      key: 'vps',
      children: [
        { label: t('nav.cloudVps'), href: '/vps/cloud' },
        { label: t('nav.whmCpanelVps'), href: '/vps/whm-cpanel' },
        { label: t('nav.customVps'), href: '/vps/custom' },
      ],
    },
    {
      label: t('nav.servers'),
      href: '/servers',
      key: 'servers',
      children: [
        { label: t('nav.dedicatedServer'), href: '/servers/dedicated' },
        { label: t('nav.whmCpanelDedicated'), href: '/servers/whm-cpanel' },
        { label: t('nav.customDedicated'), href: '/servers/custom' },
      ],
    },
    {
      label: t('nav.domain'),
      href: '/domain',
      key: 'domain',
      children: [
        { label: t('nav.domainRegistration'), href: '/domain/register' },
        { label: t('nav.domainTransfer'), href: '/domain/transfer' },
        { label: t('nav.domainReseller'), href: '/domain/reseller' },
      ],
    },
    { label: t('nav.email'), href: '/email' },
    {
      label: t('nav.otherServices'),
      href: '/services',
      key: 'services',
      children: [
        { label: t('nav.websiteDesign'), href: '/services/website-design' },
      ],
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      {/* Promo Banner */}
      <PromoBanner />

      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex h-10 items-center justify-between text-sm">
            {/* Left - Contact Info */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-6">
              <a 
                href="tel:+8801833876434" 
                className="flex items-center gap-2 hover:text-white/80 transition-colors group"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Phone className="h-3 w-3" />
                </span>
                <span className="font-medium">+8801833876434</span>
              </a>
              <a 
                href="mailto:support@chostbd.com" 
                className="flex items-center gap-2 hover:text-white/80 transition-colors group"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Mail className="h-3 w-3" />
                </span>
                <span className="font-medium">support@chostbd.com</span>
              </a>
            </div>

            {/* Right - Quick Links & Actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              {/* Affiliate Link - WHMCS */}
              <a 
                href={WHMCS_URLS.affiliates}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-white/10 rounded-md transition-colors"
              >
                <Gift className="h-3.5 w-3.5" />
                <span>{t('nav.affiliate')}</span>
              </a>

              {/* Support Link - WHMCS */}
              <a 
                href={WHMCS_URLS.submitTicket}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-white/10 rounded-md transition-colors"
              >
                <Headphones className="h-3.5 w-3.5" />
                <span>{t('nav.support')}</span>
              </a>

              {/* Divider */}
              <div className="hidden md:block w-px h-4 bg-white/20 mx-1" />

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors"
                  aria-label="Toggle theme"
                >
                  <Sun 
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                    )} 
                  />
                  <Moon 
                    className={cn(
                      "absolute h-4 w-4 transition-all duration-300",
                      isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                    )} 
                  />
                </button>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="h-4 w-4" />
              </button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-4 bg-white/20 mx-1" />

              {/* Login - WHMCS Client Area */}
              <a 
                href={WHMCS_URLS.clientArea}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-white/10 rounded-md transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </a>

              {/* Client Area Button */}
              <a 
                href={WHMCS_URLS.clientArea}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-white text-primary hover:bg-white/90 rounded-md transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'ক্লায়েন্ট এরিয়া' : 'Client Area'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full bg-background/98 backdrop-blur-md transition-all duration-300",
        isScrolled ? "shadow-lg border-b border-border/50" : "border-b border-border/20"
      )}>
        <div className="container-wide">
          <div className="flex h-16 lg:h-[72px] items-center justify-between">
            {/* Logo */}
            <PreloadLink to="/" className="flex items-center flex-shrink-0">
              <img 
                src={chostLogo} 
                alt="CHost - Secure.Fast.Online" 
                className="h-10 sm:h-12 w-auto"
              />
            </PreloadLink>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1">
                {mainMenuItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(item.key || item.label)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <PreloadLink
                      to={item.href}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200 rounded-lg group",
                        activeMenu === (item.key || item.label) && "text-primary"
                      )}
                    >
                      <span className="relative">
                        {item.label}
                        <span className={cn(
                          "absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transform origin-left transition-transform duration-300",
                          activeMenu === (item.key || item.label) ? "scale-x-100" : "scale-x-0"
                        )} />
                      </span>
                      {item.children && (
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          activeMenu === (item.key || item.label) && "rotate-180 text-primary"
                        )} />
                      )}
                    </PreloadLink>

                    {/* Mega Menu Dropdown */}
                    {item.key && item.children && (
                      <MegaMenu
                        category={item.key}
                        isActive={activeMenu === item.key}
                        onClose={() => setActiveMenu(null)}
                        language={language}
                      />
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">{language === 'bn' ? 'সার্চ' : 'Search'}</span>
                <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              {/* Get Started Button - WHMCS */}
              <Button 
                variant="hero" 
                size="default" 
                className="hidden sm:flex shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                onClick={() => window.location.href = WHMCS_URLS.billingHome}
              >
                {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-slide-down">
            <div className="container-wide py-4 space-y-2">
              {/* Mobile Search */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors"
              >
                <Search className="h-5 w-5" />
                {language === 'bn' ? 'সার্চ করুন...' : 'Search...'}
              </button>

              {/* Mobile Menu Items */}
              <div className="space-y-1 pt-2">
                {mainMenuItems.map((item) => (
                  <div key={item.label}>
                    <PreloadLink
                      to={item.href}
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      onClick={() => !item.children && setIsOpen(false)}
                    >
                      {item.label}
                      {item.children && <ChevronDown className="h-4 w-4" />}
                    </PreloadLink>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                        {item.children.map((child) => (
                          <PreloadLink
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.label}
                          </PreloadLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Quick Links - WHMCS */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <a
                  href={WHMCS_URLS.affiliates}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary bg-muted/30 hover:bg-primary/5 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Gift className="h-4 w-4" />
                  {t('nav.affiliate')}
                </a>
                <a
                  href={WHMCS_URLS.submitTicket}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary bg-muted/30 hover:bg-primary/5 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Headphones className="h-4 w-4" />
                  {t('nav.support')}
                </a>
              </div>
              
              {/* Mobile Theme & Language */}
              <div className="flex items-center gap-2 pt-2">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary bg-muted/30 hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    {isDark ? (
                      <>
                        <Moon className="h-4 w-4 text-blue-400" />
                        <span>{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>{language === 'bn' ? 'লাইট' : 'Light'}</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={toggleLanguage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary bg-muted/30 hover:bg-primary/5 rounded-xl transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === 'en' ? 'English' : 'বাংলা'}</span>
                </button>
              </div>

              {/* Mobile Auth Buttons - WHMCS */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <a 
                  href={WHMCS_URLS.clientArea}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    {t('nav.login')}
                  </Button>
                </a>
                <a 
                  href={WHMCS_URLS.billingHome}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="hero" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Site Search Modal */}
      <SiteSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
