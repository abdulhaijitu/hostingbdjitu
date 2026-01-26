import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ExternalLink, Shield, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import chostLogo from '@/assets/chost-logo.png';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const footerLinks = {
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.contactUs'), href: '/contact' },
      { label: t('footer.blog'), href: '/blog' },
    ],
    services: [
      { label: t('nav.webHosting'), href: '/hosting/web' },
      { label: t('nav.cloudVps'), href: '/vps/cloud' },
      { label: t('nav.dedicatedServer'), href: '/servers/dedicated' },
      { label: t('nav.domainRegistration'), href: '/domain/register' },
    ],
    legal: [
      { label: t('footer.refundPolicy'), href: '/refund-policy' },
      { label: t('footer.privacyPolicy'), href: '/privacy-policy' },
      { label: t('footer.termsOfService'), href: '/terms-of-service' },
    ],
    support: [
      { label: t('footer.helpCenter'), href: '/support' },
      { label: t('footer.knowledgeBase'), href: '/knowledge-base' },
      { label: t('footer.systemStatus'), href: '/status' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={chostLogo} 
                alt="CHost - Secure.Fast.Online" 
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Your trusted partner for reliable, secure, and lightning-fast web hosting solutions. Serving businesses locally and globally.
            </p>
            
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>House#71, Road#27, Gulshan-01, Dhaka</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:support@chostbd.com" className="hover:text-accent transition-colors">
                  support@chostbd.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent shrink-0" />
                <span>{t('footer.license')}: 132653</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold font-display mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4">{t('footer.services')}</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="font-semibold font-display mt-6 mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>{t('footer.copyright')}</p>
            <p className="flex items-center gap-1">
              {t('footer.designBy')}:{' '}
              <a
                href="https://creationtech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
              >
                CreationTech <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
