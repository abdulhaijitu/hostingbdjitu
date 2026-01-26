import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CreditCard, Loader2, Shield, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useHostingPlans } from '@/hooks/useHostingPlans';
import { useCreateOrder } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';

const Checkout: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const planId = searchParams.get('plan');
  const billing = searchParams.get('billing') || 'yearly';
  
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: plans, isLoading: plansLoading } = useHostingPlans(true);
  const createOrder = useCreateOrder();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(billing as 'monthly' | 'yearly');
  const [domainName, setDomainName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlan = plans?.find(p => p.id === planId);
  const price = billingCycle === 'yearly' ? selectedPlan?.yearly_price : selectedPlan?.monthly_price;

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout' + window.location.search);
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!selectedPlan || !user || !profile) return;
    
    setIsProcessing(true);
    try {
      // Create order first
      const order = await createOrder.mutateAsync({
        order_type: 'hosting',
        item_name: selectedPlan.name,
        amount: Number(price),
        billing_cycle: billingCycle,
        hosting_plan_id: selectedPlan.id,
        domain_name: domainName || null,
        status: 'pending',
      });

      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Create payment with UddoktaPay
      const response = await supabase.functions.invoke('create-payment', {
        body: {
          orderId: order.id,
          amount: Number(price),
          customerName: profile.full_name || profile.email,
          customerEmail: profile.email,
          customerPhone: profile.phone || '',
          itemName: `${selectedPlan.name} (${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})`,
          redirectUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
          webhookUrl: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-webhook`,
        },
      });

      if (response.error) throw response.error;

      const { payment_url } = response.data;
      if (payment_url) {
        window.location.href = payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: language === 'bn' ? 'পেমেন্ট শুরু করতে সমস্যা হয়েছে' : 'Failed to initiate payment',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!planId) {
    return (
      <Layout>
        <section className="section-padding bg-muted/30 min-h-screen">
          <div className="container-wide max-w-2xl text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">
              {language === 'bn' ? 'কোন প্ল্যান সিলেক্ট করা হয়নি' : 'No plan selected'}
            </h1>
            <Button asChild>
              <Link to="/hosting/web">{language === 'bn' ? 'প্ল্যান বাছাই করুন' : 'Choose a Plan'}</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const isLoading = profileLoading || plansLoading;

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'চেকআউট' : 'Checkout'}
        description="Complete your order"
        canonicalUrl="/checkout"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'চেকআউট' : 'Checkout'}
              </h1>
            </div>
          </div>

          {isLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <Skeleton className="h-80 w-full" />
            </div>
          ) : selectedPlan ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'বিলিং সাইকেল' : 'Billing Cycle'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={billingCycle} 
                      onValueChange={(v) => setBillingCycle(v as 'monthly' | 'yearly')}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label 
                        htmlFor="monthly" 
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          billingCycle === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <RadioGroupItem value="monthly" id="monthly" />
                        <div>
                          <p className="font-medium">{language === 'bn' ? 'মাসিক' : 'Monthly'}</p>
                          <p className="text-lg font-bold">৳{selectedPlan.monthly_price}/mo</p>
                        </div>
                      </Label>
                      <Label 
                        htmlFor="yearly" 
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          billingCycle === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <RadioGroupItem value="yearly" id="yearly" />
                        <div>
                          <p className="font-medium">{language === 'bn' ? 'বাৎসরিক' : 'Yearly'}</p>
                          <p className="text-lg font-bold">৳{selectedPlan.yearly_price}/yr</p>
                          <p className="text-xs text-success">
                            {language === 'bn' ? 'সেভ করুন' : 'Save'} ৳{(selectedPlan.monthly_price * 12) - selectedPlan.yearly_price}
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'ডোমেইন' : 'Domain'} (Optional)</CardTitle>
                    <CardDescription>
                      {language === 'bn' 
                        ? 'আপনার ওয়েবসাইটের জন্য একটি ডোমেইন নাম দিন'
                        : 'Enter a domain name for your website'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input 
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      placeholder="example.com"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'বিলিং তথ্য' : 'Billing Information'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">{language === 'bn' ? 'নাম' : 'Name'}</Label>
                        <p className="font-medium">{profile?.full_name || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{language === 'bn' ? 'ফোন' : 'Phone'}</Label>
                        <p className="font-medium">{profile?.phone || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{language === 'bn' ? 'কোম্পানি' : 'Company'}</Label>
                        <p className="font-medium">{profile?.company_name || '-'}</p>
                      </div>
                    </div>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link to="/dashboard/profile">{language === 'bn' ? 'তথ্য পরিবর্তন করুন' : 'Update Information'}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedPlan.category} Hosting</p>
                      <div className="mt-3 space-y-1 text-sm">
                        {selectedPlan.storage && <p>Storage: {selectedPlan.storage}</p>}
                        {selectedPlan.bandwidth && <p>Bandwidth: {selectedPlan.bandwidth}</p>}
                        {selectedPlan.websites && <p>Websites: {selectedPlan.websites}</p>}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>৳0</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>{language === 'bn' ? 'মোট' : 'Total'}</span>
                      <span>৳{price}</span>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {language === 'bn' ? 'প্রসেসিং...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          {language === 'bn' ? 'পেমেন্ট করুন' : 'Pay Now'}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      {language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === 'bn' ? 'প্ল্যান পাওয়া যায়নি' : 'Plan not found'}
              </p>
              <Button asChild className="mt-4">
                <Link to="/hosting/web">{language === 'bn' ? 'প্ল্যান দেখুন' : 'View Plans'}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
