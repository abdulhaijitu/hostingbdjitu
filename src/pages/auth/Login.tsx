import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Headphones, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import SEOHead from '@/components/common/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Failsafe timeout constant
const LOGIN_TIMEOUT_MS = 6000;

const Login: React.FC = () => {
  const { language } = useLanguage();
  const { user, authReady, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Separate loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Get redirect path from location state or default
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/client';

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

  // Redirect if already authenticated - only after auth is ready
  useEffect(() => {
    if (authReady && user) {
      const redirectPath = isAdmin ? '/admin' : from;
      navigate(redirectPath, { replace: true });
    }
  }, [authReady, user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setLoginError(null);
    setErrors({});
    
    // Validate form
    try {
      loginSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    // Start submission
    setIsSubmitting(true);

    // Setup failsafe timeout
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && isSubmitting) {
        setIsSubmitting(false);
        setLoginError(
          language === 'bn' 
            ? 'লগইন সময় শেষ। আবার চেষ্টা করুন।' 
            : 'Login timed out. Please try again.'
        );
        toast({
          title: language === 'bn' ? 'লগইন টাইমআউট' : 'Login Timeout',
          description: language === 'bn' 
            ? 'সার্ভার সাড়া দিচ্ছে না। আবার চেষ্টা করুন।' 
            : 'Server not responding. Please try again.',
          variant: 'destructive',
        });
      }
    }, LOGIN_TIMEOUT_MS);

    try {
      // Call Supabase auth directly for better control
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!mountedRef.current) return;

      if (error) {
        setLoginError(getErrorMessage(error.message, language));
        toast({
          title: language === 'bn' ? 'লগইন ব্যর্থ' : 'Login Failed',
          description: getErrorMessage(error.message, language),
          variant: 'destructive',
        });
        return;
      }

      // Verify session was created
      if (!data.session || !data.user) {
        setLoginError(
          language === 'bn' 
            ? 'সেশন তৈরি হয়নি। আবার চেষ্টা করুন।' 
            : 'Session not created. Please try again.'
        );
        return;
      }

      // Success - show toast and redirect will happen via useEffect
      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' ? 'সফলভাবে লগইন হয়েছে' : 'Successfully logged in',
      });

      // Navigate after session is confirmed
      // Role check happens in AuthContext, so we navigate to client
      // and AuthGate will redirect to admin if needed
      navigate(from, { replace: true });

    } catch (error) {
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!mountedRef.current) return;

      const message = error instanceof Error ? error.message : 'Unknown error';
      setLoginError(getErrorMessage(message, language));
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

  const handleGoogleLogin = async () => {
    setLoginError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/client`,
        },
      });

      if (error) {
        setLoginError(getErrorMessage(error.message, language));
        toast({
          title: language === 'bn' ? 'Google লগইন ব্যর্থ' : 'Google Login Failed',
          description: getErrorMessage(error.message, language),
          variant: 'destructive',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setLoginError(getErrorMessage(message, language));
    }
  };

  const features = [
    { icon: Shield, text: language === 'bn' ? 'সিকিউর লগইন' : 'Secure Login' },
    { icon: Zap, text: language === 'bn' ? 'তাৎক্ষণিক অ্যাক্সেস' : 'Instant Access' },
    { icon: Headphones, text: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support' },
  ];

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'লগইন' : 'Login'}
        description={language === 'bn' ? 'আপনার হোস্টিং, ডোমেইন এবং সার্ভিস ম্যানেজ করতে লগইন করুন।' : 'Login to manage your hosting, domains, and services.'}
        canonicalUrl="/login"
        noIndex={true}
      />
      <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block">
              <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6">
                {language === 'bn' ? 'আপনার একাউন্টে' : 'Welcome Back to'}
                <span className="text-gradient-primary block mt-2">
                  {language === 'bn' ? 'স্বাগতম' : 'Your Account'}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'আপনার হোস্টিং, ডোমেইন এবং সার্ভিস ম্যানেজ করতে লগইন করুন।'
                  : 'Login to manage your hosting, domains, and services.'}
              </p>
              <div className="flex flex-wrap gap-6">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-display mb-2">
                    {language === 'bn' ? 'লগইন করুন' : 'Login'}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {language === 'bn' ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Access your account'}
                  </p>
                </div>

                {/* Error Alert */}
                {loginError && (
                  <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-destructive font-medium">
                        {language === 'bn' ? 'লগইন ব্যর্থ' : 'Login Failed'}
                      </p>
                      <p className="text-sm text-destructive/80 mt-1">{loginError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                          if (loginError) setLoginError(null);
                        }}
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    </div>
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                      </label>
                      <Link to="/forgot-password" className="text-xs text-accent hover:underline">
                        {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errors.password) setErrors({ ...errors, password: '' });
                          if (loginError) setLoginError(null);
                        }}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        className={`w-full h-12 pl-12 pr-12 rounded-lg bg-background text-foreground border ${errors.password ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-accent disabled:opacity-50"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember me'}
                    </label>
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
                        {language === 'bn' ? 'লগইন হচ্ছে...' : 'Logging in...'}
                      </span>
                    ) : (
                      <>
                        {language === 'bn' ? 'লগইন করুন' : 'Login'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {language === 'bn' ? 'অথবা' : 'or continue with'}
                    </span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-12 gap-3"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {language === 'bn' ? 'Google দিয়ে লগইন' : 'Continue with Google'}
                </Button>

                <p className="text-center text-muted-foreground mt-6">
                  {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                  <Link to="/signup" className="text-accent font-medium hover:underline">
                    {language === 'bn' ? 'সাইন আপ করুন' : 'Sign Up'}
                  </Link>
                </p>
              </div>
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
    'Invalid login credentials': {
      en: 'Invalid email or password. Please try again.',
      bn: 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।',
    },
    'Email not confirmed': {
      en: 'Please verify your email before logging in.',
      bn: 'লগইন করার আগে আপনার ইমেইল ভেরিফাই করুন।',
    },
    'User not found': {
      en: 'No account found with this email.',
      bn: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
    },
    'Too many requests': {
      en: 'Too many login attempts. Please wait and try again.',
      bn: 'অনেক বেশি লগইন চেষ্টা। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।',
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

  // Find matching error
  for (const [key, messages] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return language === 'bn' ? messages.bn : messages.en;
    }
  }

  // Default message
  return language === 'bn' 
    ? 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।' 
    : 'Something went wrong. Please try again.';
}

export default Login;
