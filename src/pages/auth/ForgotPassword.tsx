import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import SEOHead from '@/components/common/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
});

// Failsafe timeout constant
const REQUEST_TIMEOUT_MS = 6000;

const ForgotPassword: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Separate loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setSubmitError(null);
    
    // Validate email
    try {
      emailSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    // Start submission
    setIsSubmitting(true);

    // Setup failsafe timeout
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && isSubmitting) {
        setIsSubmitting(false);
        setSubmitError(
          language === 'bn' 
            ? 'অনুরোধ সময় শেষ। আবার চেষ্টা করুন।' 
            : 'Request timed out. Please try again.'
        );
        toast({
          title: language === 'bn' ? 'টাইমআউট' : 'Timeout',
          description: language === 'bn' 
            ? 'সার্ভার সাড়া দিচ্ছে না। আবার চেষ্টা করুন।' 
            : 'Server not responding. Please try again.',
          variant: 'destructive',
        });
      }
    }, REQUEST_TIMEOUT_MS);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!mountedRef.current) return;

      if (resetError) {
        setSubmitError(getErrorMessage(resetError.message, language));
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: getErrorMessage(resetError.message, language),
          variant: 'destructive',
        });
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
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!mountedRef.current) return;

      const message = err instanceof Error ? err.message : 'Unknown error';
      setSubmitError(getErrorMessage(message, language));
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: getErrorMessage(message, language),
        variant: 'destructive',
      });
    } finally {
      // ALWAYS reset isSubmitting in finally block
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
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
                <Link to="/auth/login">
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

              {/* Error Alert */}
              {submitError && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-destructive font-medium">
                      {language === 'bn' ? 'ত্রুটি' : 'Error'}
                    </p>
                    <p className="text-sm text-destructive/80 mt-1">{submitError}</p>
                  </div>
                </div>
              )}

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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                        if (submitError) setSubmitError(null);
                      }}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${error ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {error && <p className="text-destructive text-xs mt-1">{error}</p>}
                </div>

                <Button 
                  type="submit"
                  variant="hero" 
                  size="xl" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                <Link to="/auth/login" className="text-accent font-medium hover:underline inline-flex items-center">
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

// Helper function to get user-friendly error messages
function getErrorMessage(error: string, language: string): string {
  const errorMap: Record<string, { en: string; bn: string }> = {
    'User not found': {
      en: 'No account found with this email.',
      bn: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
    },
    'Too many requests': {
      en: 'Too many attempts. Please wait and try again.',
      bn: 'অনেক বেশি চেষ্টা। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।',
    },
    'Network request failed': {
      en: 'Network error. Please check your connection.',
      bn: 'নেটওয়ার্ক সমস্যা। আপনার কানেকশন চেক করুন।',
    },
    'Failed to fetch': {
      en: 'Connection failed. Please check your internet.',
      bn: 'কানেকশন ব্যর্থ। আপনার ইন্টারনেট চেক করুন।',
    },
  };

  for (const [key, messages] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return language === 'bn' ? messages.bn : messages.en;
    }
  }

  return language === 'bn' 
    ? 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।' 
    : 'Something went wrong. Please try again.';
}

export default ForgotPassword;
