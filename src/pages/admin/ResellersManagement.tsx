import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { 
  UserCheck, 
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Plus,
  AlertCircle
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

const ResellersManagement: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  usePagePerformance('Resellers Management');

  // Mock data - in production, this would come from a resellers table
  const resellers = [
    { id: '1', name: 'TechHost BD', email: 'contact@techhost.bd', clients: 45, revenue: 125000, status: 'active', tier: 'gold' },
    { id: '2', name: 'WebMaster Pro', email: 'info@webmaster.com', clients: 28, revenue: 78000, status: 'active', tier: 'silver' },
    { id: '3', name: 'Digital Solutions', email: 'hello@digital.io', clients: 12, revenue: 32000, status: 'pending', tier: 'bronze' },
  ];

  const stats = {
    total: resellers.length,
    active: resellers.filter(r => r.status === 'active').length,
    totalClients: resellers.reduce((sum, r) => sum + r.clients, 0),
    totalRevenue: resellers.reduce((sum, r) => sum + r.revenue, 0),
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Gold</Badge>;
      case 'silver':
        return <Badge className="bg-slate-400/20 text-slate-300 border-slate-400/30">Silver</Badge>;
      case 'bronze':
        return <Badge className="bg-orange-700/20 text-orange-400 border-orange-700/30">Bronze</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
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

  const filteredResellers = resellers.filter(reseller => {
    const matchesSearch = 
      reseller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reseller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'রিসেলার ম্যানেজমেন্ট | CHost' : 'Resellers Management | CHost'}
        description="Manage reseller accounts"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'bn' ? 'রিসেলার ম্যানেজমেন্ট' : 'Resellers Management'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' ? 'রিসেলার একাউন্ট ও পারফরম্যান্স ট্র্যাক করুন' : 'Track reseller accounts and performance'}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Reseller
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Resellers</CardTitle>
              <UserCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.totalClients}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">৳{stats.totalRevenue.toLocaleString()}</div>
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
                  placeholder={language === 'bn' ? 'রিসেলার খুঁজুন...' : 'Search resellers...'}
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

        {/* Resellers Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Reseller</TableHead>
                  <TableHead className="text-slate-400">Tier</TableHead>
                  <TableHead className="text-slate-400">Clients</TableHead>
                  <TableHead className="text-slate-400">Revenue</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                      No resellers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResellers.map((reseller) => (
                    <TableRow key={reseller.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{reseller.name}</p>
                          <p className="text-sm text-slate-400">{reseller.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(reseller.tier)}</TableCell>
                      <TableCell className="text-slate-300">{reseller.clients}</TableCell>
                      <TableCell className="text-slate-300">৳{reseller.revenue.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(reseller.status)}</TableCell>
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
                Full reseller management including tier upgrades, commission tracking, 
                and white-label configuration will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResellersManagement;
