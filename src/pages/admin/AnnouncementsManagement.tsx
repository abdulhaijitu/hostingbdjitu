import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { 
  Megaphone, 
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  AlertCircle,
  Bell,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AnnouncementsManagement: React.FC = () => {
  const { language } = useLanguage();
  
  usePagePerformance('Announcements Management');

  // Mock data - in production, this would come from an announcements table
  const announcements = [
    { 
      id: '1', 
      title: 'Scheduled Maintenance Notice', 
      content: 'We will be performing scheduled maintenance on our servers...',
      type: 'maintenance',
      status: 'active',
      created_at: '2025-01-25',
      expires_at: '2025-01-28'
    },
    { 
      id: '2', 
      title: 'New Hosting Plans Available', 
      content: 'Check out our new premium hosting plans with improved features...',
      type: 'news',
      status: 'active',
      created_at: '2025-01-24',
      expires_at: null
    },
    { 
      id: '3', 
      title: 'Holiday Support Hours', 
      content: 'Our support team will be operating with limited hours during...',
      type: 'info',
      status: 'expired',
      created_at: '2025-01-20',
      expires_at: '2025-01-22'
    },
  ];

  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'active').length,
    expired: announcements.filter(a => a.status === 'expired').length,
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Maintenance</Badge>;
      case 'news':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">News</Badge>;
      case 'info':
        return <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Info</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Urgent</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Eye className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">
            <EyeOff className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <EyeOff className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'অ্যানাউন্সমেন্ট ম্যানেজমেন্ট | CHost' : 'Announcements Management | CHost'}
        description="Manage system announcements"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'bn' ? 'অ্যানাউন্সমেন্ট ম্যানেজমেন্ট' : 'Announcements Management'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' ? 'সিস্টেম অ্যানাউন্সমেন্ট তৈরি ও ম্যানেজ করুন' : 'Create and manage system announcements'}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Active</CardTitle>
              <Bell className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-900/50 to-slate-900 border-red-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Expired</CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Title</TableHead>
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Created</TableHead>
                  <TableHead className="text-slate-400">Expires</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                      No announcements found
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => (
                    <TableRow key={announcement.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{announcement.title}</p>
                          <p className="text-sm text-slate-400 truncate max-w-xs">{announcement.content}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(announcement.type)}</TableCell>
                      <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                      <TableCell className="text-slate-400">{announcement.created_at}</TableCell>
                      <TableCell className="text-slate-400">
                        {announcement.expires_at || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Coming Soon</p>
              <p className="text-blue-400/80">
                Full announcement management including rich text editor, scheduled publishing, 
                targeting options, and email notifications will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnnouncementsManagement;
