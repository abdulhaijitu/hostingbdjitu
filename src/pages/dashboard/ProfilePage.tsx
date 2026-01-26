import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Save, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';

const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company_name: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      toast({ 
        title: language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated successfully' 
      });
    } catch (error) {
      toast({ 
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'প্রোফাইল' : 'Profile'}
        description="Edit your profile"
        canonicalUrl="/dashboard/profile"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? 'আপনার তথ্য আপডেট করুন' : 'Update your profile information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                    <Input value={profile?.email || ''} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'ইমেইল পরিবর্তন করা যাবে না' : 'Email cannot be changed'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">{language === 'bn' ? 'পুরো নাম' : 'Full Name'}</Label>
                    <Input 
                      id="full_name"
                      value={formData.full_name} 
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder={language === 'bn' ? 'আপনার নাম' : 'Your full name'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</Label>
                    <Input 
                      id="phone"
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">{language === 'bn' ? 'কোম্পানির নাম' : 'Company Name'}</Label>
                    <Input 
                      id="company_name"
                      value={formData.company_name} 
                      onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder={language === 'bn' ? 'আপনার কোম্পানি' : 'Your company (optional)'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{language === 'bn' ? 'ঠিকানা' : 'Address'}</Label>
                    <Textarea 
                      id="address"
                      value={formData.address} 
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder={language === 'bn' ? 'আপনার ঠিকানা' : 'Your address'}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={updateProfile.isPending} className="w-full">
                    {updateProfile.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {language === 'bn' ? 'সেভ করুন' : 'Save Changes'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
