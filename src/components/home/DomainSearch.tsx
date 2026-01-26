import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const DomainSearch: React.FC = () => {
  const { t } = useLanguage();
  const [domain, setDomain] = useState('');

  const domainExtensions = [
    { ext: '.com', price: '$12.99' },
    { ext: '.net', price: '$14.99' },
    { ext: '.org', price: '$13.99' },
    { ext: '.io', price: '$39.99' },
    { ext: '.com.bd', price: '৳999' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock search - just UI
    console.log('Searching for:', domain);
  };

  return (
    <section className="section-padding bg-primary">
      <div className="container-wide">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-foreground mb-4">
            {t('domain.title')}
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            {t('domain.subtitle')}
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder={t('domain.placeholder')}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-lg"
              />
            </div>
            <Button variant="accent" size="xl" type="submit" className="shrink-0">
              {t('domain.search')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Domain Extensions */}
        <div className="flex flex-wrap justify-center gap-4">
          {domainExtensions.map((item) => (
            <div
              key={item.ext}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors cursor-pointer"
            >
              <span className="font-semibold">{item.ext}</span>
              <span className="text-primary-foreground/60 text-sm">{item.price}/yr</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainSearch;
