import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('promo_banner_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const now = Date.now();
    
    // Show banner again after 24 hours
    if (dismissedTime && now - dismissedTime < 24 * 60 * 60 * 1000) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('promo_banner_dismissed', Date.now().toString());
    }, 300);
  };

  if (!isVisible) return null;

  const promoText = language === 'bn' 
    ? '🎉 নতুন বছরের অফার! সকল হোস্টিং প্ল্যানে ৫০% ছাড় - সীমিত সময়!'
    : '🎉 New Year Sale! Get 50% OFF on all hosting plans - Limited time only!';

  const ctaText = language === 'bn' ? 'অফার নিন' : 'Claim Offer';

  return (
    <div 
      className={cn(
        "relative bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] animate-gradient text-white overflow-hidden transition-all duration-300",
        isAnimating && "opacity-0 -translate-y-full"
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h4v4H0V0zm8%200h4v4H8V0zm8%200h4v4h-4V0zM4%204h4v4H4V4zm8%200h4v4h-4V4zM0%208h4v4H0V8zm8%200h4v4H8V8zm8%200h4v4h-4V8zM4%2012h4v4H4v-4zm8%200h4v4h-4v-4zM0%2016h4v4H0v-4zm8%200h4v4H8v-4zm8%200h4v4h-4v-4z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.03%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
      
      {/* Sparkle Effects */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:block">
        <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
      </div>
      <div className="absolute top-1/2 right-20 -translate-y-1/2 hidden lg:block">
        <Zap className="h-4 w-4 text-yellow-300 animate-bounce-subtle" />
      </div>

      <div className="container-wide relative">
        <div className="flex items-center justify-center gap-4 py-2.5 px-8 sm:px-4">
          {/* Promo Text */}
          <p className="text-xs sm:text-sm font-medium text-center flex items-center gap-2 flex-wrap justify-center">
            <span className="animate-pulse">
              <Sparkles className="h-4 w-4 text-yellow-300 inline" />
            </span>
            <span>{promoText}</span>
          </p>

          {/* CTA Button */}
          <Link
            to="/hosting/web"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-primary text-xs font-bold rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap group"
          >
            {ctaText}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
