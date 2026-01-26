import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
              <span className="text-xl font-bold text-primary-foreground">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display text-foreground">CHost</span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Secure.Fast.Online</span>
            </div>
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
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-card border border-border shadow-lg animate-fade-in">
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
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'EN' : 'বাং'}</span>
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
  );
};

export default Header;
