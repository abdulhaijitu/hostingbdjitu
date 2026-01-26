import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import SEOHead from '@/components/common/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse({ email });
      setError('');
      setIsLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: resetError.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' 
          ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে' 
          : 'Password reset link has been sent',
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <SEOHead
          title={language === 'bn' ? 'ইমেইল পাঠানো হয়েছে' : 'Email Sent'}
          description={language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে' : 'Password reset link has been sent'}
          canonicalUrl="/forgot-password"
          noIndex={true}
        />
        <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
          <div className="container-wide">
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'ইমেইল পাঠানো হয়েছে!' : 'Email Sent!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'bn' 
                    ? `আমরা ${email} এ পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি। আপনার ইনবক্স চেক করুন।`
                    : `We've sent a password reset link to ${email}. Please check your inbox.`}
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন' : 'Forgot Password'}
        description={language === 'bn' ? 'আপনার পাসওয়ার্ড রিসেট করুন' : 'Reset your password'}
        canonicalUrl="/forgot-password"
        noIndex={true}
      />
      <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
        <div className="container-wide">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-display mb-2">
                  {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {language === 'bn' 
                    ? 'আপনার ইমেইল দিন, আমরা রিসেট লিংক পাঠাবো'
                    : 'Enter your email and we\'ll send you a reset link'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${error ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                    />
                  </div>
                  {error && <p className="text-destructive text-xs mt-1">{error}</p>}
                </div>

                <Button variant="hero" size="xl" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                      {language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}
                    </span>
                  ) : (
                    <>
                      {language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-muted-foreground mt-6">
                <Link to="/login" className="text-accent font-medium hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  {language === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
