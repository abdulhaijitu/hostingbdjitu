import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, MapPin, Lock, Save } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  company_name: z.string().max(100).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfileSettingsPage: React.FC = () => {
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      profileSchema.parse(formData);
      setErrors({});
      setIsSaving(true);

      await updateProfile.mutateAsync({
        full_name: formData.full_name,
        phone: formData.phone || null,
        company_name: formData.company_name || null,
        address: formData.address || null,
      });

      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: language === 'bn' ? 'প্রোফাইল আপডেট ব্যর্থ' : 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      passwordSchema.parse(passwordData);
      setPasswordErrors({});
      setIsChangingPassword(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: language === 'bn' ? 'সফল!' : 'Success!',
        description: language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password changed successfully',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setPasswordErrors(newErrors);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'bn' ? 'আপনার ব্যক্তিগত তথ্য এবং সেটিংস পরিচালনা করুন' : 'Manage your personal information and settings'}
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {language === 'bn' ? 'পুরো নাম' : 'Full Name'}
                </Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                  className={errors.full_name ? 'border-destructive' : ''}
                />
                {errors.full_name && <p className="text-destructive text-xs">{errors.full_name}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {language === 'bn' ? 'ইমেইল' : 'Email'}
                </Label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'bn' ? 'ইমেইল পরিবর্তন করা যাবে না' : 'Email cannot be changed'}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {language === 'bn' ? 'কোম্পানির নাম' : 'Company Name'}
                </Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder={language === 'bn' ? 'কোম্পানির নাম (ঐচ্ছিক)' : 'Company name (optional)'}
                  className={errors.company_name ? 'border-destructive' : ''}
                />
                {errors.company_name && <p className="text-destructive text-xs">{errors.company_name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {language === 'bn' ? 'ঠিকানা' : 'Address'}
              </Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={language === 'bn' ? 'আপনার সম্পূর্ণ ঠিকানা' : 'Your full address'}
                rows={3}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && <p className="text-destructive text-xs">{errors.address}</p>}
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                  {language === 'bn' ? 'সেভ হচ্ছে...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {language === 'bn' ? 'পরিবর্তন সেভ করুন' : 'Save Changes'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={passwordErrors.currentPassword ? 'border-destructive' : ''}
              />
              {passwordErrors.currentPassword && <p className="text-destructive text-xs">{passwordErrors.currentPassword}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className={passwordErrors.newPassword ? 'border-destructive' : ''}
                />
                {passwordErrors.newPassword && <p className="text-destructive text-xs">{passwordErrors.newPassword}</p>}
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={passwordErrors.confirmPassword ? 'border-destructive' : ''}
                />
                {passwordErrors.confirmPassword && <p className="text-destructive text-xs">{passwordErrors.confirmPassword}</p>}
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={isChangingPassword} variant="outline" className="gap-2">
              {isChangingPassword ? (
                <>
                  <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></span>
                  {language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {language === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'নোটিফিকেশন সেটিংস' : 'Notification Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language === 'bn' ? 'ইনভয়েস নোটিফিকেশন' : 'Invoice Notifications'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'নতুন ইনভয়েস এলে ইমেইল পান' : 'Receive emails for new invoices'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language === 'bn' ? 'সাপোর্ট টিকেট' : 'Support Tickets'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'টিকেট আপডেটের জন্য ইমেইল পান' : 'Receive emails for ticket updates'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language === 'bn' ? 'প্রমোশনাল ইমেইল' : 'Promotional Emails'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'অফার এবং ডিসকাউন্ট সম্পর্কে জানুন' : 'Learn about offers and discounts'}
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
