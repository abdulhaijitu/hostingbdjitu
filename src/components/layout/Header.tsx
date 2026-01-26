import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Globe, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import chostLogo from '@/assets/chost-logo.png';
import SiteSearch from '@/components/common/SiteSearch';

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
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

  const menuItems: MenuItem[] = [
    {
      label: t('nav.hosting'),
      href: '/hosting',
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
      children: [
        { label: t('nav.cloudVps'), href: '/vps/cloud' },
        { label: t('nav.whmCpanelVps'), href: '/vps/whm-cpanel' },
        { label: t('nav.customVps'), href: '/vps/custom' },
      ],
    },
    {
      label: t('nav.servers'),
      href: '/servers',
      children: [
        { label: t('nav.dedicatedServer'), href: '/servers/dedicated' },
        { label: t('nav.whmCpanelDedicated'), href: '/servers/whm-cpanel' },
        { label: t('nav.customDedicated'), href: '/servers/custom' },
      ],
    },
    {
      label: t('nav.domain'),
      href: '/domain',
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
      children: [
        { label: t('nav.websiteDesign'), href: '/services/website-design' },
      ],
    },
    { label: t('nav.affiliate'), href: '/affiliate' },
    { label: t('nav.support'), href: '/support' },
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
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-wide">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={chostLogo} 
                alt="CHost - Secure.Fast.Online" 
                className="h-10 sm:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted/50",
                      activeMenu === item.label && "text-foreground bg-muted/50"
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeMenu === item.label && "rotate-180"
                      )} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && activeMenu === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-card border border-border shadow-lg animate-fade-in z-50">
                      <div className="p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg bg-muted/50 hover:bg-muted"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'সার্চ' : 'Search'}</span>
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle - Improved */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  aria-label="Toggle theme"
                >
                  <Sun 
                    className={cn(
                      "h-5 w-5 text-yellow-500 transition-all duration-300",
                      isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                    )} 
                  />
                  <Moon 
                    className={cn(
                      "absolute h-5 w-5 text-blue-400 transition-all duration-300",
                      isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                    )} 
                  />
                </button>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg bg-muted/50 hover:bg-muted"
              >
                <Globe className="h-4 w-4" />
                <span className="font-semibold">{language === 'en' ? 'EN' : 'বাং'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/signup">{t('nav.signup')}</Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <div className="container-wide py-4 space-y-2">
              {/* Mobile Search */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
                {language === 'bn' ? 'সার্চ করুন...' : 'Search...'}
              </button>

              {menuItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    onClick={() => !item.children && setIsOpen(false)}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-4 w-4" />}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Theme Toggle */}
              <div className="px-4 py-3 border-t border-border mt-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  {mounted && isDark ? (
                    <>
                      <Moon className="h-5 w-5 text-blue-400" />
                      <span>{language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span>{language === 'bn' ? 'লাইট মোড' : 'Light Mode'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
                </Button>
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>{t('nav.signup')}</Link>
                </Button>
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
