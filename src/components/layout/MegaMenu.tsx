import React from 'react';
import { Link } from 'react-router-dom';
import PreloadLink from '@/components/common/PreloadLink';
import {
  Server, 
  Cloud, 
  Globe, 
  Mail, 
  Palette, 
  HardDrive,
  Cpu,
  Shield,
  Zap,
  Database,
  Settings,
  RefreshCw,
  ArrowRight,
  Rocket,
  Crown,
  Users,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WHMCS_URLS, redirectToWHMCS } from '@/lib/whmcsConfig';

interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  whmcsUrl?: string; // External WHMCS URL
  isExternal?: boolean;
}

interface MegaMenuCategory {
  title: string;
  items: MegaMenuItem[];
  featured?: {
    title: string;
    description: string;
    href: string;
    badge?: string;
  };
}

interface MegaMenuProps {
  category: string;
  isActive: boolean;
  onClose: () => void;
  language: string;
}

const getMegaMenuData = (language: string): Record<string, MegaMenuCategory> => ({
  hosting: {
    title: language === 'bn' ? 'হোস্টিং সলিউশন' : 'Hosting Solutions',
    items: [
      {
        label: language === 'bn' ? 'ওয়েব হোস্টিং' : 'Web Hosting',
        href: '/hosting/web',
        icon: Server,
        description: language === 'bn' ? 'সাশ্রয়ী মূল্যে শেয়ার্ড হোস্টিং' : 'Affordable shared hosting for websites',
        badge: language === 'bn' ? 'জনপ্রিয়' : 'Popular',
        whmcsUrl: WHMCS_URLS.hosting.web,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'প্রিমিয়াম হোস্টিং' : 'Premium Hosting',
        href: '/hosting/premium',
        icon: Crown,
        description: language === 'bn' ? 'উচ্চ পারফরম্যান্স ও রিসোর্স' : 'High performance with more resources',
        whmcsUrl: WHMCS_URLS.hosting.premium,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'ওয়ার্ডপ্রেস হোস্টিং' : 'WordPress Hosting',
        href: '/hosting/wordpress',
        icon: Zap,
        description: language === 'bn' ? 'ওয়ার্ডপ্রেসের জন্য অপটিমাইজড' : 'Optimized for WordPress sites',
        whmcsUrl: WHMCS_URLS.hosting.wordpress,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'রিসেলার হোস্টিং' : 'Reseller Hosting',
        href: '/hosting/reseller',
        icon: Users,
        description: language === 'bn' ? 'নিজের হোস্টিং ব্যবসা শুরু করুন' : 'Start your own hosting business',
        whmcsUrl: WHMCS_URLS.hosting.reseller,
        isExternal: true
      }
    ],
    featured: {
      title: language === 'bn' ? 'নতুন বছরের অফার!' : 'New Year Sale!',
      description: language === 'bn' ? 'সকল হোস্টিং প্ল্যানে ৫০% ছাড়' : '50% OFF on all hosting plans',
      href: WHMCS_URLS.hosting.web,
      badge: '50% OFF'
    }
  },
  vps: {
    title: language === 'bn' ? 'VPS সার্ভার' : 'VPS Servers',
    items: [
      {
        label: language === 'bn' ? 'ক্লাউড VPS' : 'Cloud VPS',
        href: '/vps/cloud',
        icon: Cloud,
        description: language === 'bn' ? 'স্কেলেবল ক্লাউড সার্ভার' : 'Scalable cloud-based VPS servers',
        badge: language === 'bn' ? 'সেরা বিক্রি' : 'Best Seller',
        whmcsUrl: WHMCS_URLS.vps.cloud,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'WHM/cPanel VPS' : 'WHM/cPanel VPS',
        href: '/vps/whm-cpanel',
        icon: Settings,
        description: language === 'bn' ? 'পূর্ব-ইনস্টল করা কন্ট্রোল প্যানেল' : 'Pre-installed control panel included',
        whmcsUrl: WHMCS_URLS.vps.whm,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'কাস্টম VPS' : 'Custom VPS',
        href: '/vps/custom',
        icon: Cpu,
        description: language === 'bn' ? 'আপনার প্রয়োজন অনুযায়ী কনফিগার করুন' : 'Configure according to your needs',
        whmcsUrl: WHMCS_URLS.vps.custom,
        isExternal: true
      }
    ]
  },
  servers: {
    title: language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Servers',
    items: [
      {
        label: language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Server',
        href: '/servers/dedicated',
        icon: HardDrive,
        description: language === 'bn' ? 'সম্পূর্ণ সার্ভার আপনার নিয়ন্ত্রণে' : 'Full server under your control',
        whmcsUrl: WHMCS_URLS.servers.dedicated,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'WHM/cPanel ডেডিকেটেড' : 'WHM/cPanel Dedicated',
        href: '/servers/whm-cpanel',
        icon: Database,
        description: language === 'bn' ? 'ম্যানেজড ডেডিকেটেড সার্ভার' : 'Managed dedicated with control panel',
        whmcsUrl: WHMCS_URLS.servers.whm,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'কাস্টম ডেডিকেটেড' : 'Custom Dedicated',
        href: '/servers/custom',
        icon: Shield,
        description: language === 'bn' ? 'এন্টারপ্রাইজ গ্রেড সলিউশন' : 'Enterprise-grade custom solutions',
        whmcsUrl: WHMCS_URLS.servers.custom,
        isExternal: true
      }
    ]
  },
  domain: {
    title: language === 'bn' ? 'ডোমেইন সার্ভিস' : 'Domain Services',
    items: [
      {
        label: language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন' : 'Domain Registration',
        href: '/domain/register',
        icon: Globe,
        description: language === 'bn' ? 'নতুন ডোমেইন রেজিস্টার করুন' : 'Register your new domain name',
        badge: language === 'bn' ? '৳৯৯৯ থেকে' : 'From ৳999',
        whmcsUrl: WHMCS_URLS.domainSearch,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'ডোমেইন ট্রান্সফার' : 'Domain Transfer',
        href: '/domain/transfer',
        icon: RefreshCw,
        description: language === 'bn' ? 'আপনার ডোমেইন আমাদের কাছে আনুন' : 'Transfer your domain to us',
        whmcsUrl: WHMCS_URLS.domainTransfer,
        isExternal: true
      },
      {
        label: language === 'bn' ? 'ডোমেইন রিসেলার' : 'Domain Reseller',
        href: '/domain/reseller',
        icon: Users,
        description: language === 'bn' ? 'ডোমেইন রিসেলার হন' : 'Become a domain reseller'
      }
    ]
  },
  services: {
    title: language === 'bn' ? 'অন্যান্য সার্ভিস' : 'Other Services',
    items: [
      {
        label: language === 'bn' ? 'ওয়েবসাইট ডিজাইন' : 'Website Design',
        href: '/services/website-design',
        icon: Palette,
        description: language === 'bn' ? 'প্রফেশনাল ওয়েবসাইট ডিজাইন সার্ভিস' : 'Professional website design services'
      }
    ]
  }
});

const MegaMenu: React.FC<MegaMenuProps> = ({ category, isActive, onClose, language }) => {
  if (!isActive) return null;

  const menuData = getMegaMenuData(language);
  const data = menuData[category.toLowerCase()];

  if (!data) return null;

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-3xl mt-2 animate-fade-in z-50"
      onMouseLeave={onClose}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">{data.title}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Menu Items */}
          <div className="lg:col-span-2 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.items.map((item, idx) => {
                const handleClick = (e: React.MouseEvent) => {
                  if (item.isExternal && item.whmcsUrl) {
                    e.preventDefault();
                    onClose();
                    redirectToWHMCS(item.whmcsUrl);
                  } else {
                    onClose();
                  }
                };

                return (
                  <Link
                    key={item.href}
                    to={item.isExternal ? '#' : item.href}
                    onClick={handleClick}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-accent-foreground rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.isExternal && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Featured Section */}
          {data.featured && (
            <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/10 border-l border-border">
              <div className="h-full flex flex-col justify-between">
                <div>
                  {data.featured.badge && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-accent text-accent-foreground rounded-md mb-2">
                      {data.featured.badge}
                    </span>
                  )}
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {data.featured.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {data.featured.description}
                  </p>
                </div>
                <a
                  href={data.featured.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    redirectToWHMCS(data.featured!.href);
                  }}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:text-accent transition-colors group"
                >
                  <Rocket className="h-4 w-4" />
                  <span>{language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          )}

          {/* If no featured section, show a simple CTA */}
          {!data.featured && (
            <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/10 border-l border-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {language === 'bn' ? 'সাহায্য দরকার?' : 'Need help choosing?'}
                </p>
                <PreloadLink
                  to="/support"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  <span>{language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact Us'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </PreloadLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
