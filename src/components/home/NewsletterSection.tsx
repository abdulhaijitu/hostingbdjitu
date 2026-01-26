import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: "Invalid email" }).max(255);

const NewsletterSection: React.FC = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(language === 'bn' ? 'সঠিক ইমেইল দিন' : 'Please enter a valid email');
      return;
    }

    // Simulate subscription (frontend only)
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="section-padding bg-gradient-primary relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{language === 'bn' ? 'এক্সক্লুসিভ অফার' : 'Exclusive Offers'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-primary-foreground mb-4">
            {language === 'bn' ? 'আমাদের নিউজলেটারে' : 'Subscribe to Our'}{' '}
            <span className="text-accent">{language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Newsletter'}</span>
          </h2>
          
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            {language === 'bn' 
              ? 'লেটেস্ট অফার, টিপস এবং হোস্টিং নিউজ সরাসরি আপনার ইনবক্সে পান।'
              : 'Get the latest offers, tips, and hosting news delivered directly to your inbox.'}
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={language === 'bn' ? 'আপনার ইমেইল দিন' : 'Enter your email'}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    maxLength={255}
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="accent" 
                  size="lg" 
                  className="px-8 py-4 h-auto"
                >
                  <Send className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
                  </span>
                </Button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-accent">{error}</p>
              )}
              <p className="mt-4 text-sm text-primary-foreground/60">
                {language === 'bn' 
                  ? '🔒 আমরা স্প্যাম করি না। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।'
                  : '🔒 We never spam. Unsubscribe anytime.'}
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-primary-foreground/10 rounded-2xl p-8 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                {language === 'bn' ? 'ধন্যবাদ!' : 'Thank You!'}
              </h3>
              <p className="text-primary-foreground/80">
                {language === 'bn' 
                  ? 'আপনি সফলভাবে সাবস্ক্রাইব করেছেন। শীঘ্রই আপডেট পাবেন!'
                  : 'You have successfully subscribed. You will receive updates soon!'}
              </p>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-primary-foreground/10">
            {[
              { value: '10K+', label: language === 'bn' ? 'সাবস্ক্রাইবার' : 'Subscribers' },
              { value: '2x', label: language === 'bn' ? 'সাপ্তাহিক' : 'Weekly' },
              { value: '0%', label: language === 'bn' ? 'স্প্যাম' : 'Spam' },
            ].map((stat, index) => (
              <div key={index} className="text-center px-4">
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;