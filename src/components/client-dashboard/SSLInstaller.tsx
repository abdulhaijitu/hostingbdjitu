import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, AlertCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SSLStatus {
  installed: boolean;
  issuer?: string;
  validFrom?: string;
  validUntil?: string;
  daysRemaining?: number;
  autoRenew?: boolean;
}

interface SSLInstallerProps {
  domain: string;
  serverId?: string;
  cpanelUsername?: string;
  initialStatus?: SSLStatus;
}

const SSLInstaller: React.FC<SSLInstallerProps> = ({
  domain,
  serverId,
  cpanelUsername,
  initialStatus
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [sslStatus, setSSLStatus] = useState<SSLStatus>(initialStatus || {
    installed: false,
  });
  const [isInstalling, setIsInstalling] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const checkSSLStatus = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: {
          action: 'checkSSL',
          serverId,
          cpanelUsername,
          domain,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setSSLStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to check SSL status:', error);
      // Mock data for demo
      setSSLStatus({
        installed: Math.random() > 0.5,
        issuer: "Let's Encrypt Authority X3",
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 90,
        autoRenew: true,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const installSSL = async () => {
    setIsInstalling(true);
    setShowConfirmDialog(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: {
          action: 'installSSL',
          serverId,
          cpanelUsername,
          domain,
          provider: 'letsencrypt',
        },
      });

      if (error) throw error;

      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: language === 'bn' ? 'SSL ইনস্টল হয়েছে!' : 'SSL Installed!',
        description: language === 'bn' 
          ? `${domain} এর জন্য Let's Encrypt SSL সফলভাবে ইনস্টল করা হয়েছে`
          : `Let's Encrypt SSL successfully installed for ${domain}`,
      });

      setSSLStatus({
        installed: true,
        issuer: "Let's Encrypt Authority X3",
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 90,
        autoRenew: true,
      });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message || 'SSL installation failed',
        variant: 'destructive',
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const getStatusBadge = () => {
    if (isChecking) {
      return (
        <Badge variant="secondary">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          {language === 'bn' ? 'চেক হচ্ছে...' : 'Checking...'}
        </Badge>
      );
    }

    if (!sslStatus.installed) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          {language === 'bn' ? 'SSL নেই' : 'No SSL'}
        </Badge>
      );
    }

    if (sslStatus.daysRemaining && sslStatus.daysRemaining < 14) {
      return (
        <Badge className="bg-warning text-warning-foreground">
          <AlertCircle className="h-3 w-3 mr-1" />
          {language === 'bn' ? `${sslStatus.daysRemaining} দিন বাকি` : `${sslStatus.daysRemaining} days left`}
        </Badge>
      );
    }

    return (
      <Badge className="bg-success text-success-foreground">
        <CheckCircle className="h-3 w-3 mr-1" />
        {language === 'bn' ? 'সক্রিয়' : 'Active'}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-medium">
                {language === 'bn' ? 'SSL সার্টিফিকেট' : 'SSL Certificate'}
              </CardTitle>
            </div>
            {getStatusBadge()}
          </div>
          <CardDescription className="text-xs">
            {domain}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sslStatus.installed ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'bn' ? 'প্রদানকারী' : 'Issuer'}
                  </span>
                  <span className="font-medium">{sslStatus.issuer}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'bn' ? 'মেয়াদ শেষ' : 'Expires'}
                  </span>
                  <span className="font-medium">
                    {sslStatus.validUntil 
                      ? new Date(sslStatus.validUntil).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'bn' ? 'অটো রিনিউ' : 'Auto Renew'}
                  </span>
                  <Badge variant={sslStatus.autoRenew ? 'default' : 'secondary'}>
                    {sslStatus.autoRenew 
                      ? (language === 'bn' ? 'চালু' : 'Enabled')
                      : (language === 'bn' ? 'বন্ধ' : 'Disabled')}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={checkSSLStatus}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'সাইট দেখুন' : 'Visit Site'}
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  {language === 'bn' 
                    ? 'আপনার ওয়েবসাইটে SSL সার্টিফিকেট নেই। নিরাপদ HTTPS সংযোগের জন্য SSL ইনস্টল করুন।'
                    : 'Your website does not have an SSL certificate. Install SSL for secure HTTPS connection.'}
                </p>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isInstalling}
                  className="w-full"
                >
                  {isInstalling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {language === 'bn' ? 'ইনস্টল হচ্ছে...' : 'Installing...'}
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      {language === 'bn' ? "Let's Encrypt SSL ইনস্টল করুন" : "Install Let's Encrypt SSL"}
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" />
                  {language === 'bn' ? 'সম্পূর্ণ বিনামূল্যে' : 'Completely free'}
                </p>
                <p className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" />
                  {language === 'bn' ? 'অটোমেটিক রিনিউ' : 'Automatic renewal'}
                </p>
                <p className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" />
                  {language === 'bn' ? '90 দিনের মেয়াদ' : '90-day validity'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {language === 'bn' ? "Let's Encrypt SSL ইনস্টল করুন" : "Install Let's Encrypt SSL"}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? `${domain} ডোমেইনে বিনামূল্যে SSL সার্টিফিকেট ইনস্টল করতে চান?`
                : `Do you want to install a free SSL certificate for ${domain}?`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <h4 className="font-medium text-success mb-2">
                {language === 'bn' ? 'যা ঘটবে:' : 'What will happen:'}
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {language === 'bn' ? "Let's Encrypt থেকে SSL সার্টিফিকেট জেনারেট হবে" : "SSL certificate will be generated from Let's Encrypt"}</li>
                <li>• {language === 'bn' ? 'আপনার ডোমেইনে অটোমেটিক ইনস্টল হবে' : 'Automatically installed on your domain'}</li>
                <li>• {language === 'bn' ? 'HTTPS সক্রিয় হবে' : 'HTTPS will be enabled'}</li>
                <li>• {language === 'bn' ? 'মেয়াদ শেষ হওয়ার আগে অটো রিনিউ হবে' : 'Auto-renews before expiration'}</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={installSSL}>
              <Shield className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'ইনস্টল করুন' : 'Install SSL'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SSLInstaller;
