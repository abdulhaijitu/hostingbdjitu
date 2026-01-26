import React from 'react';
import { User, Mail, Phone, Building, MapPin, Bell, Lock } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    toast({ title: language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile Updated' });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <Skeleton className="h-96 w-full" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
        </h1>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue={profile?.full_name || ''} className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={profile?.email || ''} className="mt-1" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input defaultValue={profile?.phone || ''} className="mt-1" />
              </div>
              <div>
                <Label>Company</Label>
                <Input defaultValue={profile?.company_name || ''} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input defaultValue={profile?.address || ''} className="mt-1" />
            </div>
            <Button onClick={handleSave}>{language === 'bn' ? 'সেভ করুন' : 'Save Changes'}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" className="mt-1" />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" className="mt-1" />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" className="mt-1" />
            </div>
            <Button onClick={() => toast({ title: 'Password Changed' })}>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email notifications for invoices</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Email notifications for support tickets</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Promotional emails</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
