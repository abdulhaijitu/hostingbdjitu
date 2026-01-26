import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, Check } from 'lucide-react';
import { z } from 'zod';
import SEOHead from '@/components/common/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if there's a valid recovery session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    // Also check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
    });
  }, []);

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: language === 'bn' ? 'কমপক্ষে ৮ অক্ষর' : 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: language === 'bn' ? 'একটি বড় হাতের অক্ষর' : 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: language === 'bn' ? 'একটি সংখ্যা' : 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      passwordSchema.parse(formData);
      setErrors({});
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' 
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' 
          : 'Password has been updated successfully',
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/client');
      }, 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) newErrors[error.path[0] as string] = error.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <SEOHead
          title={language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password Updated'}
          description={language === 'bn' ? 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' : 'Your password has been updated successfully'}
          canonicalUrl="/reset-password"
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
                  {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে!' : 'Password Updated!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'bn' 
                    ? 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। ড্যাশবোর্ডে নিয়ে যাচ্ছি...'
                    : 'Your password has been updated successfully. Redirecting to dashboard...'}
                </p>
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isValidSession) {
    return (
      <Layout>
        <SEOHead
          title={language === 'bn' ? 'অবৈধ লিংক' : 'Invalid Link'}
          description={language === 'bn' ? 'এই রিসেট লিংক অবৈধ বা মেয়াদ উত্তীর্ণ' : 'This reset link is invalid or expired'}
          canonicalUrl="/reset-password"
          noIndex={true}
        />
        <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
          <div className="container-wide">
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'অবৈধ বা মেয়াদোত্তীর্ণ লিংক' : 'Invalid or Expired Link'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'bn' 
                    ? 'এই পাসওয়ার্ড রিসেট লিংক অবৈধ বা মেয়াদ উত্তীর্ণ হয়ে গেছে। অনুগ্রহ করে নতুন লিংক অনুরোধ করুন।'
                    : 'This password reset link is invalid or has expired. Please request a new one.'}
                </p>
                <Link to="/forgot-password">
                  <Button variant="hero" className="w-full">
                    {language === 'bn' ? 'নতুন লিংক অনুরোধ করুন' : 'Request New Link'}
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
        title={language === 'bn' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Set New Password'}
        description={language === 'bn' ? 'আপনার নতুন পাসওয়ার্ড সেট করুন' : 'Set your new password'}
        canonicalUrl="/reset-password"
        noIndex={true}
      />
      <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
        <div className="container-wide">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-display mb-2">
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Set New Password'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {language === 'bn' 
                    ? 'আপনার নতুন পাসওয়ার্ড লিখুন'
                    : 'Enter your new password'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
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

                <Button variant="hero" size="xl" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                      {language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...'}
                    </span>
                  ) : (
                    <>
                      {language === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
