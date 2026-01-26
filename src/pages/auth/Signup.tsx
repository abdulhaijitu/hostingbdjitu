import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check, Shield, Zap, Gift } from 'lucide-react';
import { z } from 'zod';
import SEOHead from '@/components/common/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup: React.FC = () => {
  const { language } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrors({ terms: language === 'bn' ? 'শর্তাবলী মেনে নিতে হবে' : 'You must agree to the terms' });
      return;
    }
    try {
      signupSchema.parse(formData);
      setErrors({});
      setIsLoading(true);
      
      const { error } = await signUp(formData.email, formData.password, formData.name);
      
      if (error) {
        toast({
          title: language === 'bn' ? 'সাইন আপ ব্যর্থ' : 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!',
      });
      
      // Auto-login: Navigate directly to dashboard
      navigate('/client');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: language === 'bn' ? 'ফ্রি SSL সার্টিফিকেট' : 'Free SSL Certificate' },
    { icon: Zap, text: language === 'bn' ? 'ফ্রি ওয়েবসাইট মাইগ্রেশন' : 'Free Website Migration' },
    { icon: Gift, text: language === 'bn' ? '৩০ দিনের মানি ব্যাক গ্যারান্টি' : '30-Day Money Back Guarantee' },
  ];

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: language === 'bn' ? 'কমপক্ষে ৮ অক্ষর' : 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: language === 'bn' ? 'একটি বড় হাতের অক্ষর' : 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: language === 'bn' ? 'একটি সংখ্যা' : 'One number' },
  ];

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'সাইন আপ' : 'Sign Up'}
        description={language === 'bn' ? 'একটি অ্যাকাউন্ট তৈরি করুন এবং সেরা হোস্টিং সার্ভিস উপভোগ করুন।' : 'Create an account and enjoy the best hosting services.'}
        canonicalUrl="/signup"
        noIndex={true}
      />
      <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block">
              <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Get Started Today'}
                <span className="text-gradient-primary block mt-2">
                  {language === 'bn' ? 'বিনামূল্যে সাইন আপ' : 'Free Sign Up'}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'একটি অ্যাকাউন্ট তৈরি করুন এবং সেরা হোস্টিং সার্ভিস উপভোগ করুন।'
                  : 'Create an account and enjoy the best hosting services.'}
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((b) => (
                  <div key={b.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <b.icon className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-muted-foreground">{b.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">🎉</span>
                  </div>
                  <div>
                    <p className="font-semibold">{language === 'bn' ? 'স্পেশাল অফার' : 'Special Offer'}</p>
                    <p className="text-sm text-muted-foreground">{language === 'bn' ? 'নতুন ইউজারদের জন্য' : 'For new users'}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' 
                    ? 'আজই সাইন আপ করুন এবং প্রথম মাসে ৫০% ডিসকাউন্ট পান!'
                    : 'Sign up today and get 50% off on your first month!'}
                </p>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-display mb-2">
                    {language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {language === 'bn' ? 'আপনার তথ্য দিয়ে রেজিস্টার করুন' : 'Register with your details'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'পুরো নাম' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${errors.name ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                      />
                    </div>
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                      />
                    </div>
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXX-XXXXXX"
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${errors.phone ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full h-12 pl-12 pr-12 rounded-lg bg-background text-foreground border ${errors.password ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                    
                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        {passwordRequirements.map((req) => (
                          <div key={req.text} className={`flex items-center gap-2 text-xs ${req.met ? 'text-success' : 'text-muted-foreground'}`}>
                            <Check className={`h-3 w-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                            {req.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full h-12 pl-12 pr-12 rounded-lg bg-background text-foreground border ${errors.confirmPassword ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-accent"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'আমি ' : 'I agree to the '}
                      <Link to="/terms-of-service" className="text-accent hover:underline">
                        {language === 'bn' ? 'শর্তাবলী' : 'Terms of Service'}
                      </Link>
                      {language === 'bn' ? ' এবং ' : ' and '}
                      <Link to="/privacy-policy" className="text-accent hover:underline">
                        {language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
                      </Link>
                      {language === 'bn' ? ' মেনে নিচ্ছি' : ''}
                    </label>
                  </div>
                  {errors.terms && <p className="text-destructive text-xs">{errors.terms}</p>}

                  <Button variant="hero" size="xl" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                        {language === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating account...'}
                      </span>
                    ) : (
                      <>
                        {language === 'bn' ? 'সাইন আপ করুন' : 'Sign Up'}
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
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/client`,
                      },
                    });
                    if (error) {
                      toast({
                        title: language === 'bn' ? 'Google সাইন আপ ব্যর্থ' : 'Google Sign Up Failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    }
                  }}
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
                  {language === 'bn' ? 'Google দিয়ে সাইন আপ' : 'Continue with Google'}
                </Button>

                <p className="text-center text-muted-foreground mt-6">
                  {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                  <Link to="/login" className="text-accent font-medium hover:underline">
                    {language === 'bn' ? 'লগইন করুন' : 'Login'}
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

export default Signup;
