import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { 
  Gift, 
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Link2,
  MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AffiliatesManagement: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  usePagePerformance('Affiliates Management');

  // Mock data - in production, this would come from an affiliates table
  const affiliates = [
    { id: '1', name: 'Rakib Hasan', email: 'rakib@example.com', referrals: 23, clicks: 1250, earnings: 4500, status: 'active', code: 'RAKIB10' },
    { id: '2', name: 'Fatima Ahmed', email: 'fatima@example.com', referrals: 15, clicks: 890, earnings: 2800, status: 'active', code: 'FATIMA15' },
    { id: '3', name: 'Kamal Rahman', email: 'kamal@example.com', referrals: 8, clicks: 420, earnings: 1200, status: 'pending', code: 'KAMAL20' },
  ];

  const stats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    totalReferrals: affiliates.reduce((sum, a) => sum + a.referrals, 0),
    totalEarnings: affiliates.reduce((sum, a) => sum + a.earnings, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = 
      affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'এফিলিয়েট ম্যানেজমেন্ট | CHost' : 'Affiliates Management | CHost'}
        description="Manage affiliate program"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'bn' ? 'এফিলিয়েট ম্যানেজমেন্ট' : 'Affiliates Management'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' ? 'এফিলিয়েট প্রোগ্রাম ও কমিশন ট্র্যাক করুন' : 'Track affiliate program and commissions'}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Affiliate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Affiliates</CardTitle>
              <Gift className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalAffiliates}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.activeAffiliates}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.totalReferrals}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">৳{stats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={language === 'bn' ? 'এফিলিয়েট খুঁজুন...' : 'Search affiliates...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-900 border-slate-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Affiliates Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Affiliate</TableHead>
                  <TableHead className="text-slate-400">Code</TableHead>
                  <TableHead className="text-slate-400">
                    <div className="flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" />
                      Clicks
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-400">
                    <div className="flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      Referrals
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-400">Earnings</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                      No affiliates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{affiliate.name}</p>
                          <p className="text-sm text-slate-400">{affiliate.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono border-slate-600 text-slate-300">
                          {affiliate.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{affiliate.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300">{affiliate.referrals}</TableCell>
                      <TableCell className="text-emerald-400 font-medium">৳{affiliate.earnings.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
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
                Full affiliate management including payout processing, tracking links, 
                conversion analytics, and automated commission calculations will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AffiliatesManagement;
