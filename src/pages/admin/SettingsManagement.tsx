import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { 
  Settings, 
  Globe,
  Bell,
  Shield,
  Palette,
  Mail,
  CreditCard,
  Server,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsManagement: React.FC = () => {
  const { language } = useLanguage();
  
  usePagePerformance('Settings');

  const settingSections = [
    {
      title: 'General Settings',
      description: 'Configure site name, logo, and basic settings',
      icon: Globe,
      color: 'text-blue-400',
      bgColor: 'from-blue-900/50',
      borderColor: 'border-blue-700/50',
    },
    {
      title: 'Notification Settings',
      description: 'Manage email and push notification preferences',
      icon: Bell,
      color: 'text-amber-400',
      bgColor: 'from-amber-900/50',
      borderColor: 'border-amber-700/50',
    },
    {
      title: 'Security Settings',
      description: 'Configure authentication, 2FA, and access controls',
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-900/50',
      borderColor: 'border-emerald-700/50',
    },
    {
      title: 'Appearance',
      description: 'Customize theme, colors, and branding',
      icon: Palette,
      color: 'text-purple-400',
      bgColor: 'from-purple-900/50',
      borderColor: 'border-purple-700/50',
    },
    {
      title: 'Email Templates',
      description: 'Configure email templates and SMTP settings',
      icon: Mail,
      color: 'text-pink-400',
      bgColor: 'from-pink-900/50',
      borderColor: 'border-pink-700/50',
    },
    {
      title: 'Payment Gateway',
      description: 'Configure payment methods and gateways',
      icon: CreditCard,
      color: 'text-cyan-400',
      bgColor: 'from-cyan-900/50',
      borderColor: 'border-cyan-700/50',
    },
    {
      title: 'Server Configuration',
      description: 'WHM/cPanel API and server settings',
      icon: Server,
      color: 'text-orange-400',
      bgColor: 'from-orange-900/50',
      borderColor: 'border-orange-700/50',
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'সেটিংস | CHost' : 'Settings | CHost'}
        description="System settings and configuration"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'bn' ? 'সেটিংস' : 'Settings'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'bn' ? 'সিস্টেম কনফিগারেশন ও প্রেফারেন্স ম্যানেজ করুন' : 'Manage system configuration and preferences'}
          </p>
        </div>

        {/* Settings Sections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settingSections.map((section) => (
            <Card 
              key={section.title}
              className={`bg-gradient-to-br ${section.bgColor} to-slate-900 ${section.borderColor} cursor-pointer hover:bg-opacity-80 transition-all group`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-800/50 ${section.color}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-white mt-3">{section.title}</CardTitle>
                <CardDescription className="text-slate-400">
                  {section.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-400" />
              Quick Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Toggle common settings without navigating to specific sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Maintenance Mode</Label>
                <p className="text-sm text-slate-400">
                  Enable maintenance mode to show a maintenance page to visitors
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="border-t border-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">New User Registration</Label>
                <p className="text-sm text-slate-400">
                  Allow new users to register on the platform
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="border-t border-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Email Notifications</Label>
                <p className="text-sm text-slate-400">
                  Send email notifications for important events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="border-t border-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Auto Provisioning</Label>
                <p className="text-sm text-slate-400">
                  Automatically provision hosting accounts after payment
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Coming Soon</p>
              <p className="text-blue-400/80">
                Full settings management with individual setting pages, configuration export/import, 
                and advanced system preferences will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SettingsManagement;
