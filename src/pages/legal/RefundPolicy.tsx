import React from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCcw, CheckCircle, XCircle, Clock, CreditCard, AlertCircle, HelpCircle, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const RefundPolicy: React.FC = () => {
  const { language } = useLanguage();

  const refundableServices = [
    {
      service: language === 'bn' ? 'শেয়ার্ড হোস্টিং' : 'Shared Hosting',
      period: language === 'bn' ? '৩০ দিন' : '30 Days',
      refundable: true
    },
    {
      service: language === 'bn' ? 'প্রিমিয়াম হোস্টিং' : 'Premium Hosting',
      period: language === 'bn' ? '৩০ দিন' : '30 Days',
      refundable: true
    },
    {
      service: language === 'bn' ? 'ওয়ার্ডপ্রেস হোস্টিং' : 'WordPress Hosting',
      period: language === 'bn' ? '৩০ দিন' : '30 Days',
      refundable: true
    },
    {
      service: language === 'bn' ? 'রিসেলার হোস্টিং' : 'Reseller Hosting',
      period: language === 'bn' ? '১৪ দিন' : '14 Days',
      refundable: true
    },
    {
      service: language === 'bn' ? 'ক্লাউড VPS' : 'Cloud VPS',
      period: language === 'bn' ? '৭ দিন' : '7 Days',
      refundable: true
    },
    {
      service: language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Server',
      period: language === 'bn' ? 'ফেরতযোগ্য নয়' : 'Non-refundable',
      refundable: false
    },
    {
      service: language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন' : 'Domain Registration',
      period: language === 'bn' ? 'ফেরতযোগ্য নয়' : 'Non-refundable',
      refundable: false
    },
    {
      service: language === 'bn' ? 'SSL সার্টিফিকেট' : 'SSL Certificate',
      period: language === 'bn' ? 'ফেরতযোগ্য নয়' : 'Non-refundable',
      refundable: false
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: language === 'bn' ? 'রিফান্ড রিকোয়েস্ট' : 'Submit Request',
      description: language === 'bn' 
        ? 'সাপোর্ট টিকেট খুলুন এবং আপনার অ্যাকাউন্ট তথ্য সহ রিফান্ডের কারণ উল্লেখ করুন।'
        : 'Open a support ticket with your account details and reason for refund.'
    },
    {
      step: 2,
      title: language === 'bn' ? 'যাচাইকরণ' : 'Verification',
      description: language === 'bn'
        ? 'আমাদের টিম আপনার রিকোয়েস্ট পর্যালোচনা করে যোগ্যতা যাচাই করবে।'
        : 'Our team will review your request and verify eligibility.'
    },
    {
      step: 3,
      title: language === 'bn' ? 'অনুমোদন' : 'Approval',
      description: language === 'bn'
        ? 'যোগ্য হলে ২৪-৪৮ ঘণ্টার মধ্যে রিফান্ড অনুমোদন করা হবে।'
        : 'If eligible, refund will be approved within 24-48 hours.'
    },
    {
      step: 4,
      title: language === 'bn' ? 'পেমেন্ট প্রক্রিয়া' : 'Payment Processing',
      description: language === 'bn'
        ? 'মূল পেমেন্ট পদ্ধতিতে ৫-১০ কার্যদিবসের মধ্যে টাকা ফেরত দেওয়া হবে।'
        : 'Funds will be returned to original payment method within 5-10 business days.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <RefreshCcw className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              {language === 'bn' ? '৩০ দিনের মানি-ব্যাক গ্যারান্টি' : '30-Day Money-Back Guarantee'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            {language === 'bn' ? 'রিফান্ড নীতি' : 'Refund Policy'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমরা গ্রাহক সন্তুষ্টিতে বিশ্বাস করি। সন্তুষ্ট না হলে আপনার টাকা ফেরত পান।'
              : 'We believe in customer satisfaction. Get your money back if not satisfied.'}
          </p>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="py-8 bg-green-500/10 border-b border-green-500/20">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {language === 'bn' ? '১০০% ঝুঁকিমুক্ত গ্যারান্টি' : '100% Risk-Free Guarantee'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'bn' 
                  ? 'হোস্টিং প্ল্যান কিনুন। পরীক্ষা করুন। সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত পান।'
                  : 'Buy a hosting plan. Test it. Get a full refund if not satisfied.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Table */}
      <section className="py-16 bg-background">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'bn' ? 'রিফান্ড যোগ্যতা' : 'Refund Eligibility'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' 
                ? 'প্রতিটি সেবার জন্য রিফান্ড সময়সীমা আলাদা'
                : 'Refund periods vary by service type'}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 font-semibold text-foreground border-b border-border">
              <div>{language === 'bn' ? 'সেবা' : 'Service'}</div>
              <div className="text-center">{language === 'bn' ? 'রিফান্ড সময়' : 'Refund Period'}</div>
              <div className="text-center">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</div>
            </div>
            {refundableServices.map((service, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 p-4 items-center ${index !== refundableServices.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="font-medium text-foreground">{service.service}</div>
                <div className="text-center text-muted-foreground">{service.period}</div>
                <div className="flex justify-center">
                  {service.refundable ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {language === 'bn' ? 'ফেরতযোগ্য' : 'Refundable'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      {language === 'bn' ? 'ফেরতযোগ্য নয়' : 'Non-refundable'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-16 bg-muted/50">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'bn' ? 'রিফান্ড প্রক্রিয়া' : 'Refund Process'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? '৪টি সহজ ধাপে আপনার রিফান্ড পান' : 'Get your refund in 4 simple steps'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {refundProcess.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card rounded-xl border border-border p-6 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < refundProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-background">
        <div className="container-wide max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Conditions */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold">
                  {language === 'bn' ? 'রিফান্ড শর্তাবলী' : 'Refund Conditions'}
                </h3>
              </div>
              <ul className="space-y-3">
                {(language === 'bn' 
                  ? [
                    'রিফান্ড শুধুমাত্র প্রথমবার ক্রয়ের জন্য প্রযোজ্য',
                    'নবায়ন পেমেন্ট ফেরতযোগ্য নয়',
                    'অবৈধ কার্যকলাপের জন্য সাসপেন্ড অ্যাকাউন্ট রিফান্ড পাবে না',
                    'রিফান্ড অনুরোধ সময়সীমার মধ্যে করতে হবে',
                    'ডোমেইন এবং অ্যাড-অন ফি বাদ দেওয়া হবে'
                  ]
                  : [
                    'Refunds apply to first-time purchases only',
                    'Renewal payments are non-refundable',
                    'Suspended accounts for violations are not eligible',
                    'Request must be made within the refund period',
                    'Domain and add-on fees will be deducted'
                  ]
                ).map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Common Questions'}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {language === 'bn' ? 'রিফান্ড পেতে কতদিন লাগে?' : 'How long does a refund take?'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' 
                      ? 'অনুমোদনের পর ৫-১০ কার্যদিবস।'
                      : '5-10 business days after approval.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {language === 'bn' ? 'কোন পদ্ধতিতে রিফান্ড হবে?' : 'What payment method for refund?'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' 
                      ? 'মূল পেমেন্ট পদ্ধতিতে ফেরত দেওয়া হয়।'
                      : 'Refunded to original payment method.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {language === 'bn' ? 'আংশিক রিফান্ড কি সম্ভব?' : 'Are partial refunds possible?'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' 
                      ? 'হ্যাঁ, নির্দিষ্ট ক্ষেত্রে আংশিক রিফান্ড দেওয়া হয়।'
                      : 'Yes, partial refunds may be issued in certain cases.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container-wide max-w-3xl text-center">
          <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            {language === 'bn' ? 'রিফান্ড রিকোয়েস্ট করতে চান?' : 'Need to Request a Refund?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'bn'
              ? 'আমাদের সাপোর্ট টিম ২৪/৭ আপনাকে সাহায্য করতে প্রস্তুত।'
              : 'Our support team is available 24/7 to assist you.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/support">
                {language === 'bn' ? 'সাপোর্ট টিকেট খুলুন' : 'Open Support Ticket'}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:support@chostbd.com" className="inline-flex items-center gap-2">
                <Mail className="w-5 h-5" />
                support@chostbd.com
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
