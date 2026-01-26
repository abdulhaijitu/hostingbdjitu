import React from 'react';
import { Shield, Lock, Globe, Ban, Check, X } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const SecurityPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  return (
    <DashboardLayout title={language === 'bn' ? 'সিকিউরিটি' : 'Security'}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'সিকিউরিটি সেটিংস' : 'Security Settings'}
        </h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              SSL Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">SSL Active</p>
                  <p className="text-sm text-muted-foreground">Let's Encrypt - Expires in 60 days</p>
                </div>
              </div>
              <StatusBadge status="active" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Force HTTPS</CardTitle>
            <CardDescription>Redirect all HTTP traffic to HTTPS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Enable HTTPS Redirect</span>
              <Switch defaultChecked onCheckedChange={(checked) => {
                toast({ title: checked ? 'HTTPS Enabled' : 'HTTPS Disabled' });
              }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" />
              IP Block List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">No blocked IPs</p>
            <Button variant="outline" onClick={() => toast({ title: 'Coming Soon' })}>
              Add IP to Block List
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecurityPage;
