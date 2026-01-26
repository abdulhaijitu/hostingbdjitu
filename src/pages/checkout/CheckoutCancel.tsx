import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const CheckoutCancel: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'পেমেন্ট বাতিল' : 'Payment Cancelled'}
        description="Your payment was cancelled"
        canonicalUrl="/checkout/cancel"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen flex items-center">
        <div className="container-wide max-w-lg mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-4">
                {language === 'bn' ? 'পেমেন্ট বাতিল হয়েছে' : 'Payment Cancelled'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'আপনার পেমেন্ট বাতিল করা হয়েছে। আপনি চাইলে আবার চেষ্টা করতে পারেন।'
                  : 'Your payment was cancelled. You can try again if you wish.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/hosting/web">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'প্ল্যান দেখুন' : 'View Plans'}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'হোম' : 'Home'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutCancel;
