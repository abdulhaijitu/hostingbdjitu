import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Mail, 
  Facebook,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useCMSSettings, useUpdateCMSSetting } from '@/hooks/useCMSSettings';

const CMSSettingsManagement: React.FC = () => {
  const { data: settings, isLoading } = useCMSSettings();
  const updateSetting = useUpdateCMSSetting();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const handleValueChange = (id: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string, originalValue: string | null) => {
    const newValue = editedValues[id];
    if (newValue !== undefined && newValue !== originalValue) {
      updateSetting.mutate({ id, setting_value: newValue });
      setEditedValues(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'whmcs': return <Globe className="h-4 w-4" />;
      case 'contact': return <Phone className="h-4 w-4" />;
      case 'social': return <Facebook className="h-4 w-4" />;
      case 'branding': return <Settings className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'whmcs': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'contact': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'social': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'branding': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Group settings by category
  const groupedSettings = settings?.reduce((acc, setting) => {
    const category = setting.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, typeof settings>);

  const categoryLabels: Record<string, string> = {
    whmcs: 'WHMCS রিডাইরেক্ট URLs',
    branding: 'ব্র্যান্ডিং',
    contact: 'যোগাযোগ',
    social: 'সোশ্যাল মিডিয়া',
    billing: 'বিলিং',
    general: 'সাধারণ'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CMS সেটিংস</h1>
          <p className="text-muted-foreground mt-1">
            WHMCS URLs এবং সাইট কনফিগারেশন পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-200">গুরুত্বপূর্ণ নোটিশ</p>
              <p className="text-sm text-amber-200/70 mt-1">
                এই সেটিংস শুধুমাত্র ফ্রন্টেন্ড কন্টেন্ট পরিচালনার জন্য। বিলিং, পেমেন্ট, 
                এবং হোস্টিং অপারেশন সম্পূর্ণভাবে WHMCS দ্বারা পরিচালিত হয়।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {groupedSettings && Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Badge className={getCategoryColor(category)}>
                {getCategoryIcon(category)}
                <span className="ml-1.5">{categoryLabels[category] || category}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySettings?.map((setting) => {
              const currentValue = editedValues[setting.id] ?? setting.setting_value ?? '';
              const hasChanges = editedValues[setting.id] !== undefined && 
                                editedValues[setting.id] !== setting.setting_value;
              
              return (
                <div key={setting.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {setting.description || setting.setting_key}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={currentValue}
                        onChange={(e) => handleValueChange(setting.id, e.target.value)}
                        placeholder={setting.setting_key}
                        className="flex-1"
                        disabled={setting.is_editable === false}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSave(setting.id, setting.setting_value)}
                        disabled={!hasChanges || updateSetting.isPending}
                        className={hasChanges ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        {updateSetting.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Key: <code className="bg-muted px-1 rounded">{setting.setting_key}</code>
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CMSSettingsManagement;
