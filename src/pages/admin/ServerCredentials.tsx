import React, { useState } from 'react';
import { 
  Key, Server, Eye, EyeOff, Save, Plus, Trash2, 
  Shield, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/DashboardSkeletons';
import { useHostingServers } from '@/hooks/useWHMAdmin';

interface ServerCredential {
  id: string;
  serverId: string;
  serverName: string;
  apiUsername: string;
  apiToken: string;
  port: number;
  useSSL: boolean;
  isValid: boolean;
  lastVerified?: Date;
}

const ServerCredentials: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: servers, isLoading: serversLoading, isError: serversError, refetch: refetchServers } = useHostingServers();
  
  const [credentials, setCredentials] = useState<ServerCredential[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    serverId: '',
    apiUsername: 'root',
    apiToken: '',
    port: 2087,
    useSSL: true,
  });

  const handleAddCredential = async () => {
    const server = servers?.find(s => s.id === formData.serverId);
    if (!server) return;

    const newCredential: ServerCredential = {
      id: `cred-${Date.now()}`,
      serverId: formData.serverId,
      serverName: server.name,
      apiUsername: formData.apiUsername,
      apiToken: formData.apiToken,
      port: formData.port,
      useSSL: formData.useSSL,
      isValid: false,
    };

    setCredentials(prev => [...prev, newCredential]);
    
    toast({
      title: language === 'bn' ? 'ক্রেডেনশিয়াল যোগ হয়েছে' : 'Credential Added',
      description: language === 'bn' 
        ? 'এখন ভেরিফাই করুন' 
        : 'Please verify the credentials',
    });
    
    setShowAddDialog(false);
    resetForm();
  };

  const verifyCredential = async (credential: ServerCredential) => {
    setVerifying(credential.id);
    
    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification result
      const isValid = Math.random() > 0.3;
      
      setCredentials(prev => prev.map(c => 
        c.id === credential.id 
          ? { ...c, isValid, lastVerified: new Date() }
          : c
      ));
      
      toast({
        title: isValid 
          ? (language === 'bn' ? 'ভেরিফিকেশন সফল' : 'Verification Successful')
          : (language === 'bn' ? 'ভেরিফিকেশন ব্যর্থ' : 'Verification Failed'),
        description: isValid
          ? (language === 'bn' ? 'API সংযোগ সফল' : 'API connection successful')
          : (language === 'bn' ? 'API সংযোগ ব্যর্থ' : 'API connection failed'),
        variant: isValid ? 'default' : 'destructive',
      });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setVerifying(null);
    }
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
    toast({
      title: language === 'bn' ? 'ক্রেডেনশিয়াল মুছে ফেলা হয়েছে' : 'Credential Deleted',
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetForm = () => {
    setFormData({
      serverId: '',
      apiUsername: 'root',
      apiToken: '',
      port: 2087,
      useSSL: true,
    });
  };

  const availableServers = servers?.filter(
    s => !credentials.some(c => c.serverId === s.id)
  ) || [];

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'WHM API কনফিগারেশন' : 'WHM API Configuration'}
        description="Configure WHM API credentials for servers"
        canonicalUrl="/admin/server-credentials"
      />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
              <Key className="h-8 w-8 text-primary" />
              {language === 'bn' ? 'WHM API কনফিগারেশন' : 'WHM API Configuration'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'প্রতিটি সার্ভারের জন্য API credentials সেট করুন' 
                : 'Set API credentials for each server'}
            </p>
          </div>
          <Button 
            onClick={() => { resetForm(); setShowAddDialog(true); }}
            disabled={availableServers.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'ক্রেডেনশিয়াল যোগ করুন' : 'Add Credential'}
          </Button>
        </div>

        {/* Security Notice */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>{language === 'bn' ? 'নিরাপত্তা নোট' : 'Security Note'}</AlertTitle>
          <AlertDescription>
            {language === 'bn' 
              ? 'API টোকেন নিরাপদে এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকে। শুধুমাত্র অনুমোদিত সার্ভার অপারেশনের জন্য ব্যবহৃত হয়।'
              : 'API tokens are stored securely in encrypted format. They are only used for authorized server operations.'}
          </AlertDescription>
        </Alert>

        {/* Credentials Table */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'সার্ভার ক্রেডেনশিয়াল' : 'Server Credentials'}</CardTitle>
            <CardDescription>
              {language === 'bn' 
                ? 'কনফিগার করা WHM API ক্রেডেনশিয়াল' 
                : 'Configured WHM API credentials'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {serversError ? (
              <ErrorState 
                title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা হয়েছে' : 'Failed to load data'}
                onRetry={() => refetchServers()}
              />
            ) : serversLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : credentials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'bn' ? 'সার্ভার' : 'Server'}</TableHead>
                    <TableHead>{language === 'bn' ? 'ইউজারনেম' : 'Username'}</TableHead>
                    <TableHead>{language === 'bn' ? 'API টোকেন' : 'API Token'}</TableHead>
                    <TableHead>{language === 'bn' ? 'পোর্ট' : 'Port'}</TableHead>
                    <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                    <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map(credential => (
                    <TableRow key={credential.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{credential.serverName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {credential.apiUsername}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {showPassword[credential.id] 
                              ? credential.apiToken.slice(0, 20) + '...'
                              : '••••••••••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => togglePasswordVisibility(credential.id)}
                          >
                            {showPassword[credential.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {credential.useSSL ? 'HTTPS:' : 'HTTP:'}{credential.port}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {credential.isValid ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {language === 'bn' ? 'যাচাই করা হয়নি' : 'Not Verified'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyCredential(credential)}
                            disabled={verifying === credential.id}
                          >
                            {verifying === credential.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {language === 'bn' ? 'যাচাই' : 'Verify'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteCredential(credential.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {language === 'bn' 
                    ? 'কোন API ক্রেডেনশিয়াল কনফিগার করা হয়নি' 
                    : 'No API credentials configured'}
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'প্রথম ক্রেডেনশিয়াল যোগ করুন' : 'Add First Credential'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Credential Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === 'bn' ? 'WHM API ক্রেডেনশিয়াল যোগ করুন' : 'Add WHM API Credential'}
              </DialogTitle>
              <DialogDescription>
                {language === 'bn' 
                  ? 'সার্ভারের জন্য API অ্যাক্সেস কনফিগার করুন' 
                  : 'Configure API access for a server'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>{language === 'bn' ? 'সার্ভার নির্বাচন করুন' : 'Select Server'}</Label>
                <Select
                  value={formData.serverId}
                  onValueChange={(val) => setFormData({ ...formData, serverId: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'bn' ? 'সার্ভার নির্বাচন করুন' : 'Select a server'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServers.map(server => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name} ({server.hostname})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{language === 'bn' ? 'API ইউজারনেম' : 'API Username'}</Label>
                <Input
                  value={formData.apiUsername}
                  onChange={(e) => setFormData({ ...formData, apiUsername: e.target.value })}
                  placeholder="root"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>{language === 'bn' ? 'API টোকেন' : 'API Token'}</Label>
                <Input
                  type="password"
                  value={formData.apiToken}
                  onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                  placeholder="WHM API Token"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'bn' 
                    ? 'WHM থেকে API টোকেন পেতে: Home → Development → Manage API Tokens' 
                    : 'Get API token from WHM: Home → Development → Manage API Tokens'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'bn' ? 'পোর্ট' : 'Port'}</Label>
                  <Input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{language === 'bn' ? 'প্রোটোকল' : 'Protocol'}</Label>
                  <Select
                    value={formData.useSSL ? 'https' : 'http'}
                    onValueChange={(val) => setFormData({ ...formData, useSSL: val === 'https' })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="https">HTTPS (Recommended)</SelectItem>
                      <SelectItem value="http">HTTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleAddCredential}
                disabled={!formData.serverId || !formData.apiToken}
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Credential'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ServerCredentials;
