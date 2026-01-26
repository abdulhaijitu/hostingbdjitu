import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/common/SEOHead';

const CheckoutSuccess: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoice_id');
  const [isVerifying, setIsVerifying] = useState(!!invoiceId);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!invoiceId) {
        setIsVerifying(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsVerifying(false);
          return;
        }

        const response = await supabase.functions.invoke('verify-payment', {
          body: { invoice_id: invoiceId },
        });

        if (response.data?.success) {
          setVerified(true);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [invoiceId]);

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'পেমেন্ট সফল' : 'Payment Successful'}
        description="Your payment was successful"
        canonicalUrl="/checkout/success"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen flex items-center">
        <div className="container-wide max-w-lg mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              {isVerifying ? (
                <>
                  <Loader2 className="h-20 w-20 mx-auto mb-6 text-primary animate-spin" />
                  <h1 className="text-2xl font-bold mb-4">
                    {language === 'bn' ? 'পেমেন্ট যাচাই হচ্ছে...' : 'Verifying Payment...'}
                  </h1>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'অনুগ্রহ করে অপেক্ষা করুন' : 'Please wait'}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                  <h1 className="text-2xl font-bold mb-4">
                    {language === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    {language === 'bn' 
                      ? 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। শীঘ্রই আপনার সার্ভিস অ্যাক্টিভেট করা হবে।'
                      : 'Your order has been placed successfully. Your service will be activated shortly.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link to="/dashboard/orders">
                        <Package className="h-4 w-4 mr-2" />
                        {language === 'bn' ? 'অর্ডার দেখুন' : 'View Orders'}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard">
                        {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
