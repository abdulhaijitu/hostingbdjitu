import React from 'react';
import { Globe, Server, Cloud, Cpu, Headphones, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WHMCS_URLS, redirectToWHMCS } from '@/lib/whmcsConfig';

interface ServicePlan {
  icon: React.ElementType;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  price: string;
  priceBn: string;
  whmcsUrl: string;
}

const PricingSection: React.FC = () => {
  const { t, language } = useLanguage();

  const servicePlans: ServicePlan[] = [
    {
      icon: Globe,
      name: 'Web Hosting',
      nameBn: 'ওয়েব হোস্টিং',
      description: 'Perfect for startups and developers. Launch and manage websites with ease today.',
      descriptionBn: 'স্টার্টআপ এবং ডেভেলপারদের জন্য। সহজেই ওয়েবসাইট তৈরি ও ম্যানেজ করুন।',
      price: '৳49.00',
      priceBn: '৳৪৯.০০',
      whmcsUrl: WHMCS_URLS.hosting.web,
    },
    {
      icon: Server,
      name: 'Reseller Hosting',
      nameBn: 'রিসেলার হোস্টিং',
      description: 'Designed for developers and agencies. Sell hosting under your own brand easily.',
      descriptionBn: 'ডেভেলপার ও এজেন্সিদের জন্য। নিজের ব্র্যান্ডে হোস্টিং বিক্রি করুন।',
      price: '৳499.00',
      priceBn: '৳৪৯৯.০০',
      whmcsUrl: WHMCS_URLS.hosting.reseller,
    },
    {
      icon: Cloud,
      name: 'VPS Hosting',
      nameBn: 'ভিপিএস হোস্টিং',
      description: 'Powerful cloud VPS for demanding apps. Full root access and scalable resources.',
      descriptionBn: 'শক্তিশালী ক্লাউড VPS। ফুল রুট অ্যাক্সেস ও স্কেলেবল রিসোর্স।',
      price: '৳999.00',
      priceBn: '৳৯৯৯.০০',
      whmcsUrl: WHMCS_URLS.vps.cloud,
    },
    {
      icon: Cpu,
      name: 'Dedicated Servers',
      nameBn: 'ডেডিকেটেড সার্ভার',
      description: 'Best for enterprises with big needs. Full control, performance and security too.',
      descriptionBn: 'বড় প্রতিষ্ঠানের জন্য। সম্পূর্ণ নিয়ন্ত্রণ, পারফরম্যান্স ও নিরাপত্তা।',
      price: '৳14999.00',
      priceBn: '৳১৪৯৯৯.০০',
      whmcsUrl: WHMCS_URLS.servers.dedicated,
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 text-foreground">
            {language === 'bn' ? 'আপনার জন্য সেরা হোস্টিং প্ল্যান' : 'Your Perfect Web Hosting Deal Awaits'}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Headphones className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">
              {language === 'bn' ? 'আমরা আপনাকে সাহায্য করতে এখানে' : "We're Here to Help You"}
            </span>
          </div>
          
          <p className="text-muted-foreground text-base">
            {language === 'bn' 
              ? 'কোন প্ল্যান আপনার জন্য সেরা তা বুঝতে সমস্যা? আমাদের এক্সপার্ট টিম আপনাকে সঠিক সমাধান বেছে নিতে সাহায্য করবে।'
              : 'Not sure which plan suits you best? Our expert team is here to help you choose the perfect solution.'
            }
            {' '}
            <a 
              href="#" 
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                redirectToWHMCS(WHMCS_URLS.submitTicket);
              }}
            >
              {language === 'bn' ? 'এখনই চ্যাট করুন' : 'Chat with us now'}
            </a>
            {', '}
            {language === 'bn' ? 'অথবা' : 'or'}
            {' '}
            <a 
              href="mailto:support@chostbd.com" 
              className="text-primary hover:underline font-medium"
            >
              {language === 'bn' ? 'ইমেইল পাঠান' : 'send us an email'}
            </a>
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicePlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-14 w-14 stroke-[1.5]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display mb-3 text-foreground">
                  {language === 'bn' ? plan.nameBn : plan.name}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                  {language === 'bn' ? plan.descriptionBn : plan.description}
                </p>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-primary mb-6" />

                {/* Price */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground block mb-1">
                    {language === 'bn' ? 'শুরু হচ্ছে' : 'Starting at'}
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-3xl font-bold text-foreground">
                      {language === 'bn' ? plan.priceBn : plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{language === 'bn' ? 'মাস' : 'mo'}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => redirectToWHMCS(plan.whmcsUrl)}
                >
                  {language === 'bn' ? 'শুরু করুন' : 'Get Started Now'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Billing Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {language === 'bn' 
            ? '💳 বিলিং এবং পেমেন্ট আমাদের বিলিং পোর্টালের মাধ্যমে নিরাপদভাবে প্রক্রিয়া করা হয়।'
            : '💳 Billing and payments are securely processed via our billing portal.'}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
