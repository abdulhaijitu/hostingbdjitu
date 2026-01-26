import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularLinks = [
    { href: "/hosting", label: language === 'bn' ? 'ওয়েব হোস্টিং' : 'Web Hosting' },
    { href: "/domain", label: language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন' : 'Domain Registration' },
    { href: "/vps", label: language === 'bn' ? 'ক্লাউড VPS' : 'Cloud VPS' },
    { href: "/support", label: language === 'bn' ? 'সাপোর্ট' : 'Support' },
    { href: "/contact", label: language === 'bn' ? 'যোগাযোগ' : 'Contact' },
  ];

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container-wide relative z-10 text-center px-4 py-16">
          {/* 404 Number with Animation */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold font-display text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {/* Animated Ghost/Robot Icon */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary to-primary/60 rounded-3xl rotate-12 transform hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-2xl">
                    <div className="text-5xl md:text-6xl animate-bounce">🔍</div>
                  </div>
                  {/* Floating particles */}
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'bn' ? 'ওহো! পেজটি খুঁজে পাওয়া যাচ্ছে না' : 'Oops! Page Not Found'}
          </h2>
          <p className="text-lg text-muted-foreground mb-2 max-w-xl mx-auto">
            {language === 'bn' 
              ? 'আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে বা অস্থায়ীভাবে অনুপলব্ধ।'
              : 'The page you are looking for might have been removed, renamed, or is temporarily unavailable.'}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {language === 'bn' ? 'অনুরোধকৃত URL: ' : 'Requested URL: '}
            <code className="bg-muted px-2 py-1 rounded text-primary">{location.pathname}</code>
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === 'bn' ? 'সাইটে সার্চ করুন...' : 'Search the site...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="w-5 h-5" />
                {language === 'bn' ? 'হোমপেজে যান' : 'Go to Homepage'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a onClick={() => window.history.back()} className="cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                {language === 'bn' ? 'পেছনে যান' : 'Go Back'}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/support">
                <MessageCircle className="w-5 h-5" />
                {language === 'bn' ? 'সাপোর্ট' : 'Get Support'}
              </Link>
            </Button>
          </div>

          {/* Popular Links */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                {language === 'bn' ? 'জনপ্রিয় পেজসমূহ' : 'Popular Pages'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Message */}
          <p className="mt-10 text-sm text-muted-foreground">
            {language === 'bn' 
              ? '💡 টিপ: সঠিক URL চেক করুন বা উপরের সার্চ বক্স ব্যবহার করুন।'
              : '💡 Tip: Check the URL for typos or use the search box above.'}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
