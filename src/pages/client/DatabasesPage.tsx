import React, { useState } from 'react';
import { 
  Database, Plus, Search, Trash2, User, Key, ExternalLink
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
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

// Mock database data
const mockDatabases = [
  { id: 1, name: 'db_wordpress', size: '45.2 MB', tables: 12, created: '2024-01-15' },
  { id: 2, name: 'db_ecommerce', size: '128.5 MB', tables: 35, created: '2024-02-20' },
];

const mockDatabaseUsers = [
  { id: 1, username: 'wp_admin', databases: ['db_wordpress'], created: '2024-01-15' },
  { id: 2, username: 'shop_user', databases: ['db_ecommerce'], created: '2024-02-20' },
];

const DatabasesPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDbDialog, setShowCreateDbDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'databases' | 'users'>('databases');

  const filteredDatabases = mockDatabases.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockDatabaseUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDatabase = () => {
    toast({
      title: language === 'bn' ? 'ডাটাবেস তৈরি হয়েছে' : 'Database Created',
      description: language === 'bn' ? 'নতুন ডাটাবেস সফলভাবে তৈরি হয়েছে' : 'New database created successfully',
    });
    setShowCreateDbDialog(false);
  };

  const handleCreateUser = () => {
    toast({
      title: language === 'bn' ? 'ইউজার তৈরি হয়েছে' : 'User Created',
      description: language === 'bn' ? 'নতুন ডাটাবেস ইউজার তৈরি হয়েছে' : 'New database user created',
    });
    setShowCreateUserDialog(false);
  };

  const handleDelete = (type: 'database' | 'user', item: any) => {
    toast({
      title: type === 'database' 
        ? (language === 'bn' ? 'ডাটাবেস ডিলিট হয়েছে' : 'Database Deleted')
        : (language === 'bn' ? 'ইউজার ডিলিট হয়েছে' : 'User Deleted'),
      description: type === 'database' ? item.name : item.username,
      variant: 'destructive',
    });
  };

  const openPhpMyAdmin = () => {
    window.open('https://phpmyadmin.example.com', '_blank');
  };

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'ডাটাবেস ম্যানেজমেন্ট' : 'Database Management'}
      description={language === 'bn' ? 'আপনার ডাটাবেস পরিচালনা করুন' : 'Manage your databases'}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              {language === 'bn' ? 'ডাটাবেস' : 'Databases'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'MySQL ডাটাবেস এবং ইউজার ম্যানেজ করুন'
                : 'Manage MySQL databases and users'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openPhpMyAdmin}>
              <ExternalLink className="h-4 w-4 mr-2" />
              phpMyAdmin
            </Button>
            <Button 
              variant="hero" 
              onClick={() => activeTab === 'databases' ? setShowCreateDbDialog(true) : setShowCreateUserDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'databases' 
                ? (language === 'bn' ? 'নতুন ডাটাবেস' : 'Create Database')
                : (language === 'bn' ? 'নতুন ইউজার' : 'Create User')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === 'databases' ? 'default' : 'outline'}
          onClick={() => setActiveTab('databases')}
        >
          <Database className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'ডাটাবেস' : 'Databases'} ({mockDatabases.length})
        </Button>
        <Button 
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          <User className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'ইউজার' : 'Users'} ({mockDatabaseUsers.length})
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={activeTab === 'databases' 
            ? (language === 'bn' ? 'ডাটাবেস খুঁজুন...' : 'Search databases...')
            : (language === 'bn' ? 'ইউজার খুঁজুন...' : 'Search users...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'databases' 
              ? (language === 'bn' ? 'ডাটাবেস তালিকা' : 'Database List')
              : (language === 'bn' ? 'ইউজার তালিকা' : 'User List')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'databases' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                  <TableHead>{language === 'bn' ? 'সাইজ' : 'Size'}</TableHead>
                  <TableHead>{language === 'bn' ? 'টেবিল' : 'Tables'}</TableHead>
                  <TableHead>{language === 'bn' ? 'তৈরির তারিখ' : 'Created'}</TableHead>
                  <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatabases.map(db => (
                  <TableRow key={db.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium font-mono">{db.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{db.size}</TableCell>
                    <TableCell>{db.tables}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(db.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete('database', db)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'bn' ? 'ইউজারনেম' : 'Username'}</TableHead>
                  <TableHead>{language === 'bn' ? 'ডাটাবেস অ্যাক্সেস' : 'Database Access'}</TableHead>
                  <TableHead>{language === 'bn' ? 'তৈরির তারিখ' : 'Created'}</TableHead>
                  <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium font-mono">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.databases.map(db => (
                        <span key={db} className="inline-block px-2 py-1 bg-muted rounded text-xs mr-1">
                          {db}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete('user', user)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Database Dialog */}
      <Dialog open={showCreateDbDialog} onOpenChange={setShowCreateDbDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ডাটাবেস তৈরি করুন' : 'Create New Database'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ডাটাবেস নাম' : 'Database Name'}</Label>
              <Input placeholder="my_database" className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'bn' 
                  ? 'শুধুমাত্র অক্ষর, সংখ্যা এবং আন্ডারস্কোর ব্যবহার করুন'
                  : 'Use only letters, numbers, and underscores'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDbDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateDatabase}>
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ইউজার তৈরি করুন' : 'Create New User'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ইউজারনেম' : 'Username'}</Label>
              <Input placeholder="db_user" className="mt-1" />
            </div>
            <div>
              <Label>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <Input type="password" placeholder="••••••••" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateUser}>
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DatabasesPage;
