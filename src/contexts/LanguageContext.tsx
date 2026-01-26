import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.hosting': 'Hosting',
    'nav.vps': 'VPS',
    'nav.servers': 'Servers',
    'nav.domain': 'Domain',
    'nav.email': 'Email',
    'nav.otherServices': 'Other Services',
    'nav.affiliate': 'Affiliate',
    'nav.support': 'Support',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Hosting submenu
    'nav.webHosting': 'Web Hosting',
    'nav.premiumHosting': 'Premium Hosting',
    'nav.wordpressHosting': 'WordPress Hosting',
    'nav.resellerHosting': 'Reseller Hosting',
    
    // VPS submenu
    'nav.cloudVps': 'Cloud VPS',
    'nav.whmCpanelVps': 'WHM & cPanel VPS',
    'nav.customVps': 'Custom VPS',
    
    // Servers submenu
    'nav.dedicatedServer': 'Dedicated Server',
    'nav.whmCpanelDedicated': 'WHM & cPanel Dedicated',
    'nav.customDedicated': 'Custom Dedicated',
    
    // Domain submenu
    'nav.domainRegistration': 'Domain Registration',
    'nav.domainTransfer': 'Domain Transfer',
    'nav.domainReseller': 'Domain Reseller',
    
    // Other Services
    'nav.websiteDesign': 'Website Design',
    
    // Hero
    'hero.title': 'Your Website Deserves',
    'hero.titleHighlight': 'Enterprise-Grade Hosting',
    'hero.subtitle': 'Experience lightning-fast speeds, ironclad security, and 99.99% uptime. Trusted by thousands of businesses worldwide.',
    'hero.getStarted': 'Get Started',
    'hero.viewPlans': 'View Plans',
    'hero.uptime': '99.99% Uptime',
    'hero.support': '24/7 Support',
    'hero.servers': 'Global Servers',
    
    // Domain Search
    'domain.title': 'Find Your Perfect Domain',
    'domain.subtitle': 'Search from millions of available domain names',
    'domain.placeholder': 'Enter your domain name',
    'domain.search': 'Search',
    
    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the perfect plan for your needs. All plans include free SSL, 24/7 support, and 30-day money-back guarantee.',
    'pricing.starter': 'Starter',
    'pricing.professional': 'Professional',
    'pricing.business': 'Business',
    'pricing.perMonth': '/month',
    'pricing.getStarted': 'Get Started',
    'pricing.mostPopular': 'Most Popular',
    
    // Features
    'features.title': 'Why Choose CHost?',
    'features.subtitle': 'We provide enterprise-grade infrastructure with unmatched reliability and performance.',
    'features.security.title': 'Advanced Security',
    'features.security.desc': 'Enterprise-grade security with DDoS protection, SSL certificates, and daily backups.',
    'features.speed.title': 'Blazing Fast',
    'features.speed.desc': 'NVMe SSD storage and optimized servers deliver lightning-fast loading times.',
    'features.support.title': '24/7 Expert Support',
    'features.support.desc': 'Our expert team is available around the clock to help you succeed.',
    'features.uptime.title': '99.99% Uptime',
    'features.uptime.desc': 'Industry-leading uptime guarantee with redundant infrastructure.',
    
    // Trust Section
    'trust.title': 'Trusted by Businesses Worldwide',
    'trust.websites': 'Websites Hosted',
    'trust.uptime': 'Uptime Guarantee',
    'trust.support': 'Support Response',
    'trust.countries': 'Countries Served',
    
    // CTA
    'cta.title': 'Ready to Get Started?',
    'cta.subtitle': 'Join thousands of satisfied customers and experience the CHost difference.',
    'cta.button': 'Start Your Free Trial',
    
    // Footer
    'footer.company': 'Company',
    'footer.aboutUs': 'About Us',
    'footer.contactUs': 'Contact Us',
    'footer.blog': 'Blog',
    'footer.services': 'Services',
    'footer.legal': 'Legal',
    'footer.refundPolicy': 'Refund Policy',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.knowledgeBase': 'Knowledge Base',
    'footer.systemStatus': 'System Status',
    'footer.license': 'License No',
    'footer.copyright': '© 2026 CHostbd. All Rights Reserved',
    'footer.designBy': 'Design & Developed',
  },
  bn: {
    // Navigation
    'nav.hosting': 'হোস্টিং',
    'nav.vps': 'ভিপিএস',
    'nav.servers': 'সার্ভার',
    'nav.domain': 'ডোমেইন',
    'nav.email': 'ইমেইল',
    'nav.otherServices': 'অন্যান্য সেবা',
    'nav.affiliate': 'অ্যাফিলিয়েট',
    'nav.support': 'সাপোর্ট',
    'nav.login': 'লগইন',
    'nav.signup': 'সাইন আপ',
    
    // Hosting submenu
    'nav.webHosting': 'ওয়েব হোস্টিং',
    'nav.premiumHosting': 'প্রিমিয়াম হোস্টিং',
    'nav.wordpressHosting': 'ওয়ার্ডপ্রেস হোস্টিং',
    'nav.resellerHosting': 'রিসেলার হোস্টিং',
    
    // VPS submenu
    'nav.cloudVps': 'ক্লাউড ভিপিএস',
    'nav.whmCpanelVps': 'WHM & cPanel ভিপিএস',
    'nav.customVps': 'কাস্টম ভিপিএস',
    
    // Servers submenu
    'nav.dedicatedServer': 'ডেডিকেটেড সার্ভার',
    'nav.whmCpanelDedicated': 'WHM & cPanel ডেডিকেটেড',
    'nav.customDedicated': 'কাস্টম ডেডিকেটেড',
    
    // Domain submenu
    'nav.domainRegistration': 'ডোমেইন রেজিস্ট্রেশন',
    'nav.domainTransfer': 'ডোমেইন ট্রান্সফার',
    'nav.domainReseller': 'ডোমেইন রিসেলার',
    
    // Other Services
    'nav.websiteDesign': 'ওয়েবসাইট ডিজাইন',
    
    // Hero
    'hero.title': 'আপনার ওয়েবসাইটের জন্য',
    'hero.titleHighlight': 'এন্টারপ্রাইজ-গ্রেড হোস্টিং',
    'hero.subtitle': 'অত্যন্ত দ্রুত গতি, শক্তিশালী নিরাপত্তা এবং ৯৯.৯৯% আপটাইম অভিজ্ঞতা নিন। বিশ্বব্যাপী হাজার হাজার ব্যবসার বিশ্বাসযোগ্য।',
    'hero.getStarted': 'শুরু করুন',
    'hero.viewPlans': 'প্ল্যান দেখুন',
    'hero.uptime': '৯৯.৯৯% আপটাইম',
    'hero.support': '২৪/৭ সাপোর্ট',
    'hero.servers': 'গ্লোবাল সার্ভার',
    
    // Domain Search
    'domain.title': 'আপনার পারফেক্ট ডোমেইন খুঁজুন',
    'domain.subtitle': 'লক্ষ লক্ষ উপলব্ধ ডোমেইন নাম থেকে খুঁজুন',
    'domain.placeholder': 'আপনার ডোমেইন নাম লিখুন',
    'domain.search': 'সার্চ',
    
    // Pricing
    'pricing.title': 'সহজ, স্বচ্ছ মূল্য',
    'pricing.subtitle': 'আপনার প্রয়োজন অনুযায়ী সঠিক প্ল্যান বেছে নিন। সকল প্ল্যানে ফ্রি SSL, ২৪/৭ সাপোর্ট এবং ৩০ দিনের মানি-ব্যাক গ্যারান্টি অন্তর্ভুক্ত।',
    'pricing.starter': 'স্টার্টার',
    'pricing.professional': 'প্রফেশনাল',
    'pricing.business': 'বিজনেস',
    'pricing.perMonth': '/মাস',
    'pricing.getStarted': 'শুরু করুন',
    'pricing.mostPopular': 'সবচেয়ে জনপ্রিয়',
    
    // Features
    'features.title': 'কেন CHost বেছে নেবেন?',
    'features.subtitle': 'আমরা অতুলনীয় নির্ভরযোগ্যতা এবং কর্মক্ষমতার সাথে এন্টারপ্রাইজ-গ্রেড অবকাঠামো প্রদান করি।',
    'features.security.title': 'উন্নত নিরাপত্তা',
    'features.security.desc': 'DDoS সুরক্ষা, SSL সার্টিফিকেট এবং দৈনিক ব্যাকআপ সহ এন্টারপ্রাইজ-গ্রেড নিরাপত্তা।',
    'features.speed.title': 'অত্যন্ত দ্রুত',
    'features.speed.desc': 'NVMe SSD স্টোরেজ এবং অপ্টিমাইজড সার্ভার অত্যন্ত দ্রুত লোডিং সময় দেয়।',
    'features.support.title': '২৪/৭ বিশেষজ্ঞ সাপোর্ট',
    'features.support.desc': 'আমাদের বিশেষজ্ঞ দল আপনার সাফল্যে সাহায্য করতে সর্বক্ষণ উপলব্ধ।',
    'features.uptime.title': '৯৯.৯৯% আপটাইম',
    'features.uptime.desc': 'রিডানড্যান্ট অবকাঠামো সহ শিল্প-নেতৃস্থানীয় আপটাইম গ্যারান্টি।',
    
    // Trust Section
    'trust.title': 'বিশ্বব্যাপী ব্যবসার বিশ্বাসযোগ্য',
    'trust.websites': 'হোস্টেড ওয়েবসাইট',
    'trust.uptime': 'আপটাইম গ্যারান্টি',
    'trust.support': 'সাপোর্ট রেসপন্স',
    'trust.countries': 'সেবাকৃত দেশ',
    
    // CTA
    'cta.title': 'শুরু করতে প্রস্তুত?',
    'cta.subtitle': 'হাজার হাজার সন্তুষ্ট গ্রাহকদের সাথে যোগ দিন এবং CHost এর পার্থক্য অনুভব করুন।',
    'cta.button': 'আপনার ফ্রি ট্রায়াল শুরু করুন',
    
    // Footer
    'footer.company': 'কোম্পানি',
    'footer.aboutUs': 'আমাদের সম্পর্কে',
    'footer.contactUs': 'যোগাযোগ',
    'footer.blog': 'ব্লগ',
    'footer.services': 'সেবাসমূহ',
    'footer.legal': 'আইনি',
    'footer.refundPolicy': 'রিফান্ড পলিসি',
    'footer.privacyPolicy': 'প্রাইভেসি পলিসি',
    'footer.termsOfService': 'সেবার শর্তাবলী',
    'footer.support': 'সাপোর্ট',
    'footer.helpCenter': 'হেল্প সেন্টার',
    'footer.knowledgeBase': 'নলেজ বেস',
    'footer.systemStatus': 'সিস্টেম স্ট্যাটাস',
    'footer.license': 'লাইসেন্স নং',
    'footer.copyright': '© ২০২৬ CHostbd. সর্বস্বত্ব সংরক্ষিত',
    'footer.designBy': 'ডিজাইন ও উন্নয়ন',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
