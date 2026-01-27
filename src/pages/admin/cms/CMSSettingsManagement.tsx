import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Mail, 
  Facebook,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Shield,
  Link2,
  Building2,
  Palette,
  MessageSquare,
  Check,
  RotateCcw
} from 'lucide-react';
import { useCMSSettings, useUpdateCMSSetting } from '@/hooks/useCMSSettings';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';

const CMSSettingsManagement: React.FC = () => {
  const { data: settings, isLoading } = useCMSSettings();
  const updateSetting = useUpdateCMSSetting();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<{ id: string; value: string } | null>(null);

  const handleValueChange = (id: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [id]: value }));
  };

  const handleResetValue = (id: string, originalValue: string | null) => {
    setEditedValues(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSaveRequest = (id: string, originalValue: string | null) => {
    const newValue = editedValues[id];
    if (newValue !== undefined && newValue !== originalValue) {
      setPendingSave({ id, value: newValue });
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmSave = () => {
    if (pendingSave) {
      updateSetting.mutate({ id: pendingSave.id, setting_value: pendingSave.value });
      setEditedValues(prev => {
        const updated = { ...prev };
        delete updated[pendingSave.id];
        return updated;
      });
      setPendingSave(null);
      setConfirmDialogOpen(false);
    }
  };

  const getCategoryConfig = (category: string | null) => {
    const configs: Record<string, { icon: React.ReactNode; label: string; labelBn: string; color: string; bgColor: string; description: string }> = {
      whmcs: {
        icon: <Link2 className="h-5 w-5" />,
        label: 'WHMCS Redirect URLs',
        labelBn: 'WHMCS রিডাইরেক্ট URLs',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        description: 'বিলিং সিস্টেমে রিডাইরেক্ট করার জন্য URLs'
      },
      branding: {
        icon: <Palette className="h-5 w-5" />,
        label: 'Branding',
        labelBn: 'ব্র্যান্ডিং',
        color: 'text-primary',
        bgColor: 'bg-primary/10 border-primary/20',
        description: 'সাইটের ব্র্যান্ড সম্পর্কিত সেটিংস'
      },
      contact: {
        icon: <Phone className="h-5 w-5" />,
        label: 'Contact Information',
        labelBn: 'যোগাযোগ তথ্য',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10 border-green-500/20',
        description: 'কোম্পানির যোগাযোগ তথ্য'
      },
      social: {
        icon: <MessageSquare className="h-5 w-5" />,
        label: 'Social Media',
        labelBn: 'সোশ্যাল মিডিয়া',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10 border-purple-500/20',
        description: 'সোশ্যাল মিডিয়া লিংক'
      },
      general: {
        icon: <Settings className="h-5 w-5" />,
        label: 'General',
        labelBn: 'সাধারণ',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/50 border-muted',
        description: 'সাধারণ সেটিংস'
      }
    };
    return configs[category || 'general'] || configs.general;
  };

  // Group settings by category
  const groupedSettings = useMemo(() => {
    if (!settings) return null;
    return settings.reduce((acc, setting) => {
      const category = setting.category || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);
  }, [settings]);

  // Count unsaved changes
  const unsavedChangesCount = Object.keys(editedValues).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground">সেটিংস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <CMSPermissionGate requiredRole="super_admin">
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Shield className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                গ্লোবাল সেটিংস
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                সাইট কনফিগারেশন ও WHMCS URLs পরিচালনা
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unsavedChangesCount > 0 && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/50 bg-amber-500/10">
                {unsavedChangesCount} অসংরক্ষিত পরিবর্তন
              </Badge>
            )}
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin Only
            </Badge>
          </div>
        </div>

        {/* Warning Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-destructive">সতর্কতা</p>
                  <p className="text-xs text-destructive/80">
                    এই সেটিংস পরিবর্তন করলে লাইভ সাইট প্রভাবিত হবে। সাবধানে পরিবর্তন করুন।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-blue-400">WHMCS ইন্টিগ্রেশন</p>
                  <p className="text-xs text-blue-400/80">
                    বিলিং ও হোস্টিং অপারেশন WHMCS দ্বারা পরিচালিত।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {groupedSettings && Object.entries(groupedSettings).map(([category, categorySettings]) => {
            const config = getCategoryConfig(category);
            
            return (
              <Card key={category} className="overflow-hidden">
                <CardHeader className={`${config.bgColor} border-b py-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background/80 ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {config.labelBn}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {config.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {categorySettings?.map((setting, index) => {
                      const currentValue = editedValues[setting.id] ?? setting.setting_value ?? '';
                      const hasChanges = editedValues[setting.id] !== undefined && 
                                        editedValues[setting.id] !== setting.setting_value;
                      const isLongText = setting.setting_type === 'textarea' || (currentValue.length > 100);
                      
                      return (
                        <div 
                          key={setting.id} 
                          className={`p-4 transition-colors ${hasChanges ? 'bg-amber-500/5' : 'hover:bg-muted/30'}`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 flex-1">
                                <Label htmlFor={setting.id} className="text-sm font-medium">
                                  {setting.description || setting.setting_key}
                                </Label>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {setting.setting_key}
                                </p>
                              </div>
                              {hasChanges && (
                                <Badge variant="outline" className="text-amber-500 border-amber-500/50 text-xs shrink-0">
                                  পরিবর্তিত
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              {isLongText ? (
                                <Textarea
                                  id={setting.id}
                                  value={currentValue}
                                  onChange={(e) => handleValueChange(setting.id, e.target.value)}
                                  placeholder={setting.setting_key}
                                  className="flex-1 min-h-[80px] text-sm"
                                  disabled={setting.is_editable === false}
                                />
                              ) : (
                                <Input
                                  id={setting.id}
                                  value={currentValue}
                                  onChange={(e) => handleValueChange(setting.id, e.target.value)}
                                  placeholder={setting.setting_key}
                                  className="flex-1 text-sm"
                                  disabled={setting.is_editable === false}
                                />
                              )}
                              
                              <div className="flex gap-2 sm:flex-shrink-0">
                                {hasChanges && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResetValue(setting.id, setting.setting_value)}
                                    className="h-10"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:ml-1.5">রিসেট</span>
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveRequest(setting.id, setting.setting_value)}
                                  disabled={!hasChanges || updateSetting.isPending}
                                  className={`h-10 min-w-[100px] ${hasChanges ? 'bg-primary hover:bg-primary/90' : ''}`}
                                >
                                  {updateSetting.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Save className="h-4 w-4" />
                                      <span className="ml-1.5">সেভ</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {(!groupedSettings || Object.keys(groupedSettings).length === 0) && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-muted mb-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">কোন সেটিং নেই</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                এখনো কোন গ্লোবাল সেটিং কনফিগার করা হয়নি।
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <p>
                এই সেটিংস CHost ফ্রন্টেন্ড কন্টেন্টের জন্য। সকল বিলিং ও হোস্টিং অপারেশন{' '}
                <a 
                  href="https://billing.chostbd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  WHMCS <ExternalLink className="h-3 w-3" />
                </a>
                {' '}দ্বারা পরিচালিত।
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <CMSConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          onConfirm={handleConfirmSave}
          title="সেটিং পরিবর্তন নিশ্চিত করুন"
          description="এই পরিবর্তন সরাসরি লাইভ সাইটকে প্রভাবিত করবে। আপনি কি নিশ্চিত?"
          actionType="settings"
          confirmLabel="পরিবর্তন সেভ করুন"
          isLoading={updateSetting.isPending}
        />
      </div>
    </CMSPermissionGate>
  );
};

export default CMSSettingsManagement;
