import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, User, Tag, Search, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: language === 'bn' ? 'সব' : 'All' },
    { id: 'hosting', name: language === 'bn' ? 'হোস্টিং' : 'Hosting' },
    { id: 'domain', name: language === 'bn' ? 'ডোমেইন' : 'Domain' },
    { id: 'security', name: language === 'bn' ? 'সিকিউরিটি' : 'Security' },
    { id: 'tutorial', name: language === 'bn' ? 'টিউটোরিয়াল' : 'Tutorials' },
    { id: 'news', name: language === 'bn' ? 'নিউজ' : 'News' },
  ];

  const posts = [
    { 
      id: 1,
      title: language === 'bn' ? 'সঠিক হোস্টিং প্ল্যান কিভাবে বাছাই করবেন' : 'How to Choose the Right Hosting Plan', 
      date: 'Jan 15, 2026', 
      excerpt: language === 'bn' ? 'আপনার ওয়েবসাইটের জন্য সঠিক হোস্টিং সল্যুশন নির্বাচনের একটি বিস্তারিত গাইড।' : 'A comprehensive guide to selecting the perfect hosting solution for your website.',
      category: 'hosting',
      author: 'Admin',
      readTime: language === 'bn' ? '৫ মিনিট' : '5 min',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      featured: true
    },
    { 
      id: 2,
      title: language === 'bn' ? 'আপনার ওয়েবসাইট দ্রুত করার ১০টি টিপস' : '10 Tips to Speed Up Your Website', 
      date: 'Jan 10, 2026', 
      excerpt: language === 'bn' ? 'আপনার ওয়েবসাইটের লোডিং স্পিড উন্নত করার প্রমাণিত কৌশল শিখুন।' : 'Learn proven techniques to improve your website loading speed.',
      category: 'tutorial',
      author: 'Admin',
      readTime: language === 'bn' ? '৮ মিনিট' : '8 min',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      featured: true
    },
    { 
      id: 3,
      title: language === 'bn' ? 'SSL সার্টিফিকেট বোঝা' : 'Understanding SSL Certificates', 
      date: 'Jan 5, 2026', 
      excerpt: language === 'bn' ? 'SSL এবং ওয়েবসাইট সিকিউরিটি সম্পর্কে আপনার যা জানা দরকার।' : 'Everything you need to know about SSL and website security.',
      category: 'security',
      author: 'Admin',
      readTime: language === 'bn' ? '৬ মিনিট' : '6 min',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop',
      featured: false
    },
    { 
      id: 4,
      title: language === 'bn' ? 'ডোমেইন নাম নির্বাচনের সেরা অভ্যাস' : 'Best Practices for Domain Name Selection', 
      date: 'Jan 1, 2026', 
      excerpt: language === 'bn' ? 'আপনার ব্র্যান্ডের জন্য সঠিক ডোমেইন নাম কিভাবে বাছাই করবেন তা শিখুন।' : 'Learn how to select the perfect domain name for your brand.',
      category: 'domain',
      author: 'Admin',
      readTime: language === 'bn' ? '৪ মিনিট' : '4 min',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      featured: false
    },
    { 
      id: 5,
      title: language === 'bn' ? 'WordPress সাইট সিকিউর করার উপায়' : 'How to Secure Your WordPress Site', 
      date: 'Dec 28, 2025', 
      excerpt: language === 'bn' ? 'আপনার WordPress ওয়েবসাইট হ্যাকার থেকে সুরক্ষিত রাখার টিপস।' : 'Tips to protect your WordPress website from hackers.',
      category: 'security',
      author: 'Admin',
      readTime: language === 'bn' ? '৭ মিনিট' : '7 min',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop',
      featured: false
    },
    { 
      id: 6,
      title: language === 'bn' ? 'CHost নতুন ডাটা সেন্টার চালু করেছে' : 'CHost Launches New Data Center', 
      date: 'Dec 25, 2025', 
      excerpt: language === 'bn' ? 'ঢাকায় আমাদের নতুন ডাটা সেন্টার চালু হয়েছে আরও ভালো পারফরম্যান্সের জন্য।' : 'Our new data center in Dhaka is now live for better performance.',
      category: 'news',
      author: 'Admin',
      readTime: language === 'bn' ? '৩ মিনিট' : '3 min',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      featured: false
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || activeCategory !== 'all');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ব্লগ' : 'Blog'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের টিমের কাছ থেকে টিপস, টিউটোরিয়াল এবং ইনসাইটস পড়ুন'
              : 'Tips, tutorials, and insights from our team'}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'আর্টিকেল খুঁজুন...' : 'Search articles...'}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-lg border border-border"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-muted/30 border-b border-border sticky top-16 z-10">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border hover:border-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === 'all' && searchQuery === '' && (
        <section className="section-padding">
          <div className="container-wide">
            <h2 className="text-2xl font-bold font-display mb-8">
              {language === 'bn' ? 'ফিচার্ড আর্টিকেল' : 'Featured Articles'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                    {language === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read More'} 
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl font-bold font-display mb-8">
            {activeCategory === 'all' && searchQuery === '' 
              ? (language === 'bn' ? 'সব আর্টিকেল' : 'All Articles')
              : (language === 'bn' ? 'ফলাফল' : 'Results')}
            {filteredPosts.length > 0 && (
              <span className="text-muted-foreground font-normal text-lg ml-2">
                ({filteredPosts.length})
              </span>
            )}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'bn' ? 'কোন আর্টিকেল পাওয়া যায়নি।' : 'No articles found.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory === 'all' && searchQuery === '' ? regularPosts.filter(p => !p.featured) : filteredPosts).map((post) => (
                <article key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-background/90 text-xs font-medium">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold font-display mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <span className="inline-flex items-center text-primary text-sm font-medium">
                      {language === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read More'} 
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length >= 6 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                {language === 'bn' ? 'আরও লোড করুন' : 'Load More'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আপডেট পেতে সাবস্ক্রাইব করুন' : 'Subscribe for Updates'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'নতুন আর্টিকেল, টিপস এবং অফার সরাসরি আপনার ইনবক্সে পান।'
                : 'Get new articles, tips, and offers directly in your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'Your email'}
                className="flex-1 h-12 px-4 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="hero" size="lg">
                {language === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
