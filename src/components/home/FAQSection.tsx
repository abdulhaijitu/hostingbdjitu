import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const { language } = useLanguage();

  const faqs: FAQItem[] = [
    {
      question: language === 'bn' ? 'CHost এ হোস্টিং কেনার পর কত সময়ে সাইট লাইভ হবে?' : 'How soon will my site be live after purchasing hosting?',
      answer: language === 'bn' 
        ? 'পেমেন্ট কনফার্ম হওয়ার সাথে সাথে আপনার হোস্টিং একাউন্ট অ্যাক্টিভ হয়ে যাবে। সাধারণত ৫-১০ মিনিটের মধ্যে আপনি cPanel অ্যাক্সেস পাবেন এবং সাইট আপলোড করতে পারবেন।'
        : 'Your hosting account will be activated immediately after payment confirmation. Usually within 5-10 minutes, you will get cPanel access and can upload your site.',
    },
    {
      question: language === 'bn' ? 'আমি কি অন্য হোস্টিং থেকে CHost এ মাইগ্রেট করতে পারি?' : 'Can I migrate from another hosting to CHost?',
      answer: language === 'bn'
        ? 'হ্যাঁ, অবশ্যই! আমরা সম্পূর্ণ ফ্রি মাইগ্রেশন সার্ভিস প্রদান করি। আমাদের টেকনিক্যাল টিম আপনার পুরো ওয়েবসাইট, ডেটাবেস এবং ইমেইল মাইগ্রেট করে দেবে কোনো ডাউনটাইম ছাড়াই।'
        : 'Yes, absolutely! We provide completely free migration service. Our technical team will migrate your entire website, database, and emails without any downtime.',
    },
    {
      question: language === 'bn' ? 'SSL সার্টিফিকেট কি ফ্রি?' : 'Is SSL certificate free?',
      answer: language === 'bn'
        ? 'হ্যাঁ, সব প্ল্যানের সাথে আমরা ফ্রি Let\'s Encrypt SSL সার্টিফিকেট প্রদান করি যা লাইফটাইম ফ্রি এবং অটোমেটিক রিনিউ হয়।'
        : 'Yes, we provide free Let\'s Encrypt SSL certificate with all plans which is lifetime free and auto-renews automatically.',
    },
    {
      question: language === 'bn' ? 'আপটাইম গ্যারান্টি কত?' : 'What is the uptime guarantee?',
      answer: language === 'bn'
        ? 'আমরা ৯৯.৯৯% আপটাইম গ্যারান্টি দিই। আমাদের সার্ভার ২৪/৭ মনিটর করা হয় এবং যেকোনো সমস্যা হলে ইনস্ট্যান্ট অ্যালার্ট সিস্টেম আছে।'
        : 'We guarantee 99.99% uptime. Our servers are monitored 24/7 and we have instant alert system for any issues.',
    },
    {
      question: language === 'bn' ? 'পেমেন্ট মেথড কী কী সাপোর্ট করেন?' : 'What payment methods do you support?',
      answer: language === 'bn'
        ? 'আমরা বিকাশ, নগদ, রকেট, ব্যাংক ট্রান্সফার, ক্রেডিট/ডেবিট কার্ড (Visa, Mastercard), এবং PayPal সাপোর্ট করি।'
        : 'We support bKash, Nagad, Rocket, Bank Transfer, Credit/Debit Cards (Visa, Mastercard), and PayPal.',
    },
    {
      question: language === 'bn' ? 'রিফান্ড পলিসি কী?' : 'What is your refund policy?',
      answer: language === 'bn'
        ? 'আমরা ৩০ দিনের মানি-ব্যাক গ্যারান্টি অফার করি। যদি আমাদের সার্ভিসে সন্তুষ্ট না হন, ৩০ দিনের মধ্যে সম্পূর্ণ রিফান্ড পাবেন, কোনো প্রশ্ন ছাড়াই।'
        : 'We offer 30-day money-back guarantee. If you are not satisfied with our service, you will get a full refund within 30 days, no questions asked.',
    },
    {
      question: language === 'bn' ? 'কাস্টমার সাপোর্ট কীভাবে পাব?' : 'How can I get customer support?',
      answer: language === 'bn'
        ? 'আমাদের ২৪/৭ লাইভ চ্যাট, টিকেট সিস্টেম, এবং ফোন সাপোর্ট আছে। বাংলা ও ইংরেজি দুই ভাষাতেই সাপোর্ট পাবেন।'
        : 'We have 24/7 live chat, ticket system, and phone support. Support is available in both Bangla and English.',
    },
    {
      question: language === 'bn' ? 'WordPress ইনস্টল করা কি সহজ?' : 'Is it easy to install WordPress?',
      answer: language === 'bn'
        ? 'অবশ্যই! আমাদের ওয়ান-ক্লিক WordPress ইনস্টলার আছে। মাত্র একটি ক্লিকে WordPress সেটআপ হয়ে যাবে, কোনো টেকনিক্যাল জ্ঞান লাগবে না।'
        : 'Absolutely! We have one-click WordPress installer. WordPress will be set up with just one click, no technical knowledge required.',
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              <span>{language === 'bn' ? 'সাধারণ প্রশ্নাবলী' : 'Frequently Asked Questions'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
              {language === 'bn' ? 'কোনো প্রশ্ন' : 'Have'}{' '}
              <span className="text-gradient-primary">{language === 'bn' ? 'আছে?' : 'Questions?'}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'নিচে আমাদের সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলোর উত্তর দেওয়া হয়েছে।'
                : 'Find answers to our most frequently asked questions below.'}
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-accent/40 data-[state=open]:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent py-5 [&[data-state=open]>svg]:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-primary rounded-2xl text-primary-foreground">
            <h3 className="text-xl font-semibold mb-2">
              {language === 'bn' ? 'আরো প্রশ্ন আছে?' : 'Still have questions?'}
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              {language === 'bn' 
                ? 'আমাদের সাপোর্ট টিম ২৪/৭ আপনার সেবায় প্রস্তুত।'
                : 'Our support team is available 24/7 to help you.'}
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              {language === 'bn' ? 'সাপোর্টে যোগাযোগ করুন' : 'Contact Support'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;