import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Headphones } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login: React.FC = () => {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      setErrors({});
      setIsLoading(true);
      // Simulate login
      setTimeout(() => setIsLoading(false), 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const features = [
    { icon: Shield, text: language === 'bn' ? 'সিকিউর লগইন' : 'Secure Login' },
    { icon: Zap, text: language === 'bn' ? 'তাৎক্ষণিক অ্যাক্সেস' : 'Instant Access' },
    { icon: Headphones, text: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support' },
  ];

  return (
    <Layout>
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
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
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-border text-primary focus:ring-accent"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember me'}
                    </label>
                  </div>

                  <Button variant="hero" size="xl" className="w-full" disabled={isLoading}>
                    {isLoading ? (
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

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {language === 'bn' ? 'অথবা' : 'or'}
                    </span>
                  </div>
                </div>

                <p className="text-center text-muted-foreground">
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

export default Login;
