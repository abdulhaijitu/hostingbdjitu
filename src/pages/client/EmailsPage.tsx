import React, { useState } from 'react';
import { 
  Mail, Plus, Search, ExternalLink, Key, Trash2, HardDrive
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import UsageProgress from '@/components/client-dashboard/UsageProgress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Mock email accounts data
const mockEmailAccounts = [
  { id: 1, email: 'info@example.com', storageUsed: 1.2, storageTotal: 5, created: '2024-01-15' },
  { id: 2, email: 'support@example.com', storageUsed: 0.8, storageTotal: 5, created: '2024-02-20' },
  { id: 3, email: 'sales@example.com', storageUsed: 2.1, storageTotal: 5, created: '2024-03-10' },
];

const EmailsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [newEmail, setNewEmail] = useState({ name: '', domain: 'example.com', password: '' });

  const filteredEmails = mockEmailAccounts.filter(e => 
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEmail = () => {
    toast({
      title: language === 'bn' ? 'ইমেইল তৈরি হয়েছে' : 'Email Created',
      description: `${newEmail.name}@${newEmail.domain}`,
    });
    setShowCreateDialog(false);
    setNewEmail({ name: '', domain: 'example.com', password: '' });
  };

  const handleChangePassword = () => {
    toast({
      title: language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password Changed',
      description: selectedEmail?.email,
    });
    setShowPasswordDialog(false);
  };

  const handleDeleteEmail = (email: any) => {
    toast({
      title: language === 'bn' ? 'ইমেইল ডিলিট হয়েছে' : 'Email Deleted',
      description: email.email,
      variant: 'destructive',
    });
  };

  const openWebmail = () => {
    window.open('https://webmail.example.com', '_blank');
  };

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'ইমেইল ম্যানেজমেন্ট' : 'Email Management'}
      description={language === 'bn' ? 'আপনার ইমেইল অ্যাকাউন্ট পরিচালনা করুন' : 'Manage your email accounts'}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              {language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'আপনার ইমেইল অ্যাকাউন্ট তৈরি ও পরিচালনা করুন'
                : 'Create and manage your email accounts'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openWebmail}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Webmail
            </Button>
            <Button variant="hero" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন ইমেইল' : 'Create Email'}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'bn' ? 'ইমেইল খুঁজুন...' : 'Search emails...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'মোট অ্যাকাউন্ট' : 'Total Accounts'}
                </p>
                <p className="text-xl font-bold">{mockEmailAccounts.length}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <HardDrive className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'ব্যবহৃত স্টোরেজ' : 'Storage Used'}
                </p>
                <p className="text-xl font-bold">4.1GB / 50GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <UsageProgress
              label={language === 'bn' ? 'স্টোরেজ' : 'Storage'}
              used={4.1}
              total={50}
              unit="GB"
            />
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'ইমেইল তালিকা' : 'Email List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'bn' ? 'ইমেইল' : 'Email'}</TableHead>
                <TableHead>{language === 'bn' ? 'স্টোরেজ' : 'Storage'}</TableHead>
                <TableHead>{language === 'bn' ? 'তৈরির তারিখ' : 'Created'}</TableHead>
                <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.map(email => (
                <TableRow key={email.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <UsageProgress
                        label=""
                        used={email.storageUsed}
                        total={email.storageTotal}
                        unit="GB"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(email.created).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedEmail(email);
                          setShowPasswordDialog(true);
                        }}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteEmail(email)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Email Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ইমেইল তৈরি করুন' : 'Create New Email'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? 'আপনার ডোমেইনে একটি নতুন ইমেইল অ্যাকাউন্ট তৈরি করুন'
                : 'Create a new email account on your domain'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</Label>
              <div className="flex mt-1">
                <Input 
                  placeholder="username"
                  value={newEmail.name}
                  onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                  className="rounded-r-none"
                />
                <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                  @{newEmail.domain}
                </div>
              </div>
            </div>
            <div>
              <Label>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={newEmail.password}
                onChange={(e) => setNewEmail({ ...newEmail, password: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateEmail}>
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
            </DialogTitle>
            <DialogDescription>
              {selectedEmail?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
              <Input type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <div>
              <Label>{language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</Label>
              <Input type="password" placeholder="••••••••" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleChangePassword}>
              {language === 'bn' ? 'পরিবর্তন করুন' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmailsPage;
