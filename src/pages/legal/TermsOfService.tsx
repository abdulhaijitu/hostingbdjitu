import React from 'react';
import Layout from '@/components/layout/Layout';
import { FileText, CheckCircle, AlertTriangle, Ban, Scale, Clock, RefreshCw, Gavel } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfService: React.FC = () => {
  const { language } = useLanguage();

  const sections = [
    {
      icon: CheckCircle,
      title: language === 'bn' ? 'শর্তাবলী গ্রহণ' : 'Acceptance of Terms',
      content: language === 'bn'
        ? 'CHost-এর সেবা ব্যবহার করে আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলী মেনে না নেন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।'
        : 'By using CHost services, you agree to be bound by these terms and conditions. If you do not accept these terms, please do not use our services.'
    },
    {
      icon: FileText,
      title: language === 'bn' ? 'সেবার বিবরণ' : 'Service Description',
      content: language === 'bn'
        ? 'CHost ওয়েব হোস্টিং, ডোমেইন রেজিস্ট্রেশন, VPS, ডেডিকেটেড সার্ভার এবং সংশ্লিষ্ট সেবা প্রদান করে। আমরা সর্বোচ্চ আপটাইম এবং নির্ভরযোগ্যতা নিশ্চিত করার চেষ্টা করি।'
        : 'CHost provides web hosting, domain registration, VPS, dedicated servers, and related services. We strive to ensure maximum uptime and reliability.'
    },
    {
      icon: Scale,
      title: language === 'bn' ? 'ব্যবহারকারীর দায়িত্ব' : 'User Responsibilities',
      content: language === 'bn'
        ? 'আপনি আপনার অ্যাকাউন্টের নিরাপত্তা এবং সমস্ত কার্যকলাপের জন্য দায়ী। আপনাকে অবশ্যই সঠিক এবং আপ-টু-ডেট তথ্য প্রদান করতে হবে।'
        : 'You are responsible for your account security and all activities. You must provide accurate and up-to-date information.',
      items: language === 'bn'
        ? ['অ্যাকাউন্ট নিরাপত্তা বজায় রাখা', 'সঠিক তথ্য প্রদান', 'পাসওয়ার্ড গোপন রাখা', 'অননুমোদিত ব্যবহার রোধ']
        : ['Maintain account security', 'Provide accurate information', 'Keep passwords confidential', 'Prevent unauthorized use']
    },
    {
      icon: Ban,
      title: language === 'bn' ? 'নিষিদ্ধ কার্যকলাপ' : 'Prohibited Activities',
      content: language === 'bn'
        ? 'নিম্নলিখিত কার্যকলাপগুলি কঠোরভাবে নিষিদ্ধ এবং তাৎক্ষণিক অ্যাকাউন্ট সাসপেনশনের কারণ হতে পারে।'
        : 'The following activities are strictly prohibited and may result in immediate account suspension.',
      items: language === 'bn'
        ? ['স্প্যাম বা ম্যালওয়্যার বিতরণ', 'অবৈধ বিষয়বস্তু হোস্টিং', 'কপিরাইট লঙ্ঘন', 'DDoS আক্রমণ বা হ্যাকিং', 'ফিশিং বা স্ক্যাম', 'শিশু শোষণমূলক বিষয়বস্তু']
        : ['Spam or malware distribution', 'Hosting illegal content', 'Copyright infringement', 'DDoS attacks or hacking', 'Phishing or scams', 'Child exploitation content']
    },
    {
      icon: Clock,
      title: language === 'bn' ? 'পেমেন্ট শর্তাবলী' : 'Payment Terms',
      content: language === 'bn'
        ? 'সমস্ত পেমেন্ট অগ্রিম এবং অ-ফেরতযোগ্য (রিফান্ড নীতিতে উল্লিখিত ছাড়া)। সময়মতো পেমেন্ট না করলে সেবা সাসপেন্ড করা হতে পারে।'
        : 'All payments are due in advance and non-refundable (except as stated in Refund Policy). Failure to pay on time may result in service suspension.',
      items: language === 'bn'
        ? ['অগ্রিম পেমেন্ট প্রয়োজন', 'স্বয়ংক্রিয় নবায়ন', 'বিলম্বিত পেমেন্টে সার্ভিস সাসপেনশন', 'মূল্য পরিবর্তনের অধিকার সংরক্ষিত']
        : ['Advance payment required', 'Auto-renewal enabled', 'Service suspension for late payment', 'Right to change prices reserved']
    },
    {
      icon: RefreshCw,
      title: language === 'bn' ? 'সেবা স্তরের গ্যারান্টি' : 'Service Level Agreement',
      content: language === 'bn'
        ? 'আমরা 99.9% আপটাইম গ্যারান্টি প্রদান করি। নির্ধারিত রক্ষণাবেক্ষণ এবং জরুরি পরিস্থিতি ব্যতীত সেবা বন্ধ থাকলে ক্রেডিট প্রদান করা হয়।'
        : 'We provide 99.9% uptime guarantee. Credits are provided for downtime exceeding our SLA, excluding scheduled maintenance and emergencies.',
      items: language === 'bn'
        ? ['99.9% আপটাইম গ্যারান্টি', 'নির্ধারিত রক্ষণাবেক্ষণ বিজ্ঞপ্তি', 'ডাউনটাইম ক্রেডিট', '24/7 নেটওয়ার্ক মনিটরিং']
        : ['99.9% uptime guarantee', 'Scheduled maintenance notices', 'Downtime credits', '24/7 network monitoring']
    },
    {
      icon: AlertTriangle,
      title: language === 'bn' ? 'দায় সীমাবদ্ধতা' : 'Limitation of Liability',
      content: language === 'bn'
        ? 'CHost কোনো পরোক্ষ, আনুষঙ্গিক, বিশেষ বা ফলস্বরূপ ক্ষতির জন্য দায়ী নয়। আমাদের সর্বোচ্চ দায় আপনার প্রদত্ত ফি-এর মধ্যে সীমাবদ্ধ।'
        : 'CHost is not liable for any indirect, incidental, special, or consequential damages. Our maximum liability is limited to fees paid by you.'
    },
    {
      icon: Gavel,
      title: language === 'bn' ? 'বিরোধ নিষ্পত্তি' : 'Dispute Resolution',
      content: language === 'bn'
        ? 'যেকোনো বিরোধ প্রথমে সরাসরি আলোচনার মাধ্যমে সমাধান করা হবে। সমাধান না হলে বাংলাদেশের আইন অনুযায়ী মধ্যস্থতা বা সালিশের মাধ্যমে নিষ্পত্তি করা হবে।'
        : 'Any disputes will first be resolved through direct negotiation. If unresolved, disputes will be settled through mediation or arbitration under Bangladesh law.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              {language === 'bn' ? 'আইনি চুক্তি' : 'Legal Agreement'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            {language === 'bn' ? 'সেবার শর্তাবলী' : 'Terms of Service'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'CHost-এর সেবা ব্যবহারের আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।'
              : 'Please read these terms carefully before using CHost services.'}
          </p>
          <p className="text-white/60 mt-4">
            {language === 'bn' ? 'সর্বশেষ আপডেট: জানুয়ারি ২০২৬' : 'Last Updated: January 2026'}
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-muted/50 border-b border-border sticky top-16 z-40 backdrop-blur-sm">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-3">
            {sections.slice(0, 6).map((section, index) => (
              <a 
                key={index}
                href={`#section-${index}`}
                className="px-4 py-2 bg-background rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container-wide max-w-5xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div 
                key={index}
                id={`section-${index}`}
                className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow duration-300 scroll-mt-32"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {language === 'bn' ? `ধারা ${index + 1}` : `Section ${index + 1}`}
                      </span>
                      <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{section.content}</p>
                    {section.items && (
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agreement Box */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {language === 'bn' ? 'শর্তাবলী গ্রহণ' : 'Agreement to Terms'}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn'
                ? 'CHost-এর যেকোনো সেবা ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনি এই শর্তাবলী পড়েছেন, বুঝেছেন এবং মেনে চলতে সম্মত।'
                : 'By using any CHost service, you confirm that you have read, understood, and agree to be bound by these terms.'}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;
