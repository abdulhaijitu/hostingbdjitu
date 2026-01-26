import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Globe, Server, Mail, HardDrive, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SearchResult {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  href: string;
  category: string;
  categoryBn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const searchData: SearchResult[] = [
  // Hosting
  { title: 'Web Hosting', titleBn: 'ওয়েব হোস্টিং', description: 'Affordable shared hosting plans', descriptionBn: 'সাশ্রয়ী শেয়ার্ড হোস্টিং প্ল্যান', href: '/hosting/web', category: 'Hosting', categoryBn: 'হোস্টিং', icon: Server },
  { title: 'Premium Hosting', titleBn: 'প্রিমিয়াম হোস্টিং', description: 'High-performance hosting', descriptionBn: 'উচ্চ-পারফরম্যান্স হোস্টিং', href: '/hosting/premium', category: 'Hosting', categoryBn: 'হোস্টিং', icon: Server },
  { title: 'WordPress Hosting', titleBn: 'ওয়ার্ডপ্রেস হোস্টিং', description: 'Optimized for WordPress', descriptionBn: 'ওয়ার্ডপ্রেসের জন্য অপটিমাইজড', href: '/hosting/wordpress', category: 'Hosting', categoryBn: 'হোস্টিং', icon: Server },
  { title: 'Reseller Hosting', titleBn: 'রিসেলার হোস্টিং', description: 'Start your hosting business', descriptionBn: 'আপনার হোস্টিং ব্যবসা শুরু করুন', href: '/hosting/reseller', category: 'Hosting', categoryBn: 'হোস্টিং', icon: Server },
  
  // VPS
  { title: 'Cloud VPS', titleBn: 'ক্লাউড VPS', description: 'Scalable cloud servers', descriptionBn: 'স্কেলেবল ক্লাউড সার্ভার', href: '/vps/cloud', category: 'VPS', categoryBn: 'VPS', icon: HardDrive },
  { title: 'WHM/cPanel VPS', titleBn: 'WHM/cPanel VPS', description: 'Managed VPS with cPanel', descriptionBn: 'cPanel সহ ম্যানেজড VPS', href: '/vps/whm-cpanel', category: 'VPS', categoryBn: 'VPS', icon: HardDrive },
  { title: 'Custom VPS', titleBn: 'কাস্টম VPS', description: 'Build your own VPS', descriptionBn: 'নিজের VPS তৈরি করুন', href: '/vps/custom', category: 'VPS', categoryBn: 'VPS', icon: HardDrive },
  
  // Servers
  { title: 'Dedicated Server', titleBn: 'ডেডিকেটেড সার্ভার', description: 'Full dedicated resources', descriptionBn: 'সম্পূর্ণ ডেডিকেটেড রিসোর্স', href: '/servers/dedicated', category: 'Servers', categoryBn: 'সার্ভার', icon: Server },
  { title: 'WHM/cPanel Dedicated', titleBn: 'WHM/cPanel ডেডিকেটেড', description: 'Managed dedicated server', descriptionBn: 'ম্যানেজড ডেডিকেটেড সার্ভার', href: '/servers/whm-cpanel', category: 'Servers', categoryBn: 'সার্ভার', icon: Server },
  { title: 'Custom Dedicated', titleBn: 'কাস্টম ডেডিকেটেড', description: 'Configure your server', descriptionBn: 'আপনার সার্ভার কনফিগার করুন', href: '/servers/custom', category: 'Servers', categoryBn: 'সার্ভার', icon: Server },
  
  // Domain
  { title: 'Domain Registration', titleBn: 'ডোমেইন রেজিস্ট্রেশন', description: 'Register new domains', descriptionBn: 'নতুন ডোমেইন রেজিস্টার করুন', href: '/domain/register', category: 'Domain', categoryBn: 'ডোমেইন', icon: Globe },
  { title: 'Domain Transfer', titleBn: 'ডোমেইন ট্রান্সফার', description: 'Transfer your domain', descriptionBn: 'আপনার ডোমেইন ট্রান্সফার করুন', href: '/domain/transfer', category: 'Domain', categoryBn: 'ডোমেইন', icon: Globe },
  { title: 'Domain Pricing', titleBn: 'ডোমেইন প্রাইসিং', description: 'View all domain prices', descriptionBn: 'সকল ডোমেইন মূল্য দেখুন', href: '/domain/pricing', category: 'Domain', categoryBn: 'ডোমেইন', icon: Globe },
  { title: 'Domain Reseller', titleBn: 'ডোমেইন রিসেলার', description: 'Become a domain reseller', descriptionBn: 'ডোমেইন রিসেলার হন', href: '/domain/reseller', category: 'Domain', categoryBn: 'ডোমেইন', icon: Globe },
  
  // Other Services
  { title: 'Email Hosting', titleBn: 'ইমেইল হোস্টিং', description: 'Professional email solutions', descriptionBn: 'প্রফেশনাল ইমেইল সলিউশন', href: '/email', category: 'Services', categoryBn: 'সার্ভিস', icon: Mail },
  { title: 'Website Design', titleBn: 'ওয়েবসাইট ডিজাইন', description: 'Custom website design', descriptionBn: 'কাস্টম ওয়েবসাইট ডিজাইন', href: '/services/website-design', category: 'Services', categoryBn: 'সার্ভিস', icon: FileText },
  { title: 'Affiliate Program', titleBn: 'অ্যাফিলিয়েট প্রোগ্রাম', description: 'Earn with referrals', descriptionBn: 'রেফারেলে আয় করুন', href: '/affiliate', category: 'Services', categoryBn: 'সার্ভিস', icon: Users },
  
  // Company
  { title: 'About Us', titleBn: 'আমাদের সম্পর্কে', description: 'Learn about CHost', descriptionBn: 'CHost সম্পর্কে জানুন', href: '/about', category: 'Company', categoryBn: 'কোম্পানি', icon: Users },
  { title: 'Contact', titleBn: 'যোগাযোগ', description: 'Get in touch with us', descriptionBn: 'আমাদের সাথে যোগাযোগ করুন', href: '/contact', category: 'Company', categoryBn: 'কোম্পানি', icon: Mail },
  { title: 'Support', titleBn: 'সাপোর্ট', description: '24/7 customer support', descriptionBn: '২৪/৭ গ্রাহক সাপোর্ট', href: '/support', category: 'Support', categoryBn: 'সাপোর্ট', icon: Users },
  { title: 'Blog', titleBn: 'ব্লগ', description: 'Read our latest articles', descriptionBn: 'আমাদের সর্বশেষ আর্টিকেল পড়ুন', href: '/blog', category: 'Company', categoryBn: 'কোম্পানি', icon: FileText },
];

interface SiteSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const SiteSearch: React.FC<SiteSearchProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.titleBn.includes(query) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.descriptionBn.includes(query) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.categoryBn.includes(query)
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        navigate(results[selectedIndex].href);
        onClose();
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  const handleResultClick = (href: string) => {
    navigate(href);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 animate-scale-in">
        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'সার্ভিস, পেজ বা সাহায্য সার্চ করুন...' : 'Search services, pages, or help...'}
              className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-lg"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}</p>
                <p className="text-sm mt-1">
                  {language === 'bn' ? 'অন্য কিছু সার্চ করুন' : 'Try searching for something else'}
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={result.href}
                    onClick={() => handleResultClick(result.href)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors",
                      index === selectedIndex ? "bg-primary/10" : "hover:bg-muted"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <result.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {language === 'bn' ? result.titleBn : result.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {language === 'bn' ? result.descriptionBn : result.description}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      {language === 'bn' ? result.categoryBn : result.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Links when no query */}
            {!query && (
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
                  {language === 'bn' ? 'জনপ্রিয় সার্চ' : 'Popular Searches'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Web Hosting', 'Domain', 'VPS', 'SSL', 'Email', 'Support'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">↑↓</kbd>
                {language === 'bn' ? 'নেভিগেট' : 'Navigate'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">↵</kbd>
                {language === 'bn' ? 'সিলেক্ট' : 'Select'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">Esc</kbd>
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteSearch;
