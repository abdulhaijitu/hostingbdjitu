import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ServerHealth {
  id: string;
  name: string;
  hostname: string;
  cpu: number;
  ram: number;
  disk: number;
  status: 'online' | 'offline' | 'warning';
  accounts: number;
  maxAccounts: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--accent))'];

const ServerHealthMonitor: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [servers, setServers] = useState<ServerHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchServerHealth = async () => {
    try {
      // Get servers from database
      const { data: serversData, error } = await supabase
        .from('hosting_servers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Simulate health data for each server (in production, this would come from WHM API)
      const healthData: ServerHealth[] = (serversData || []).map((server) => ({
        id: server.id,
        name: server.name,
        hostname: server.hostname,
        cpu: Math.floor(Math.random() * 60) + 10, // 10-70%
        ram: Math.floor(Math.random() * 50) + 20, // 20-70%
        disk: Math.floor(Math.random() * 40) + 30, // 30-70%
        status: Math.random() > 0.1 ? 'online' : 'warning',
        accounts: server.current_accounts || 0,
        maxAccounts: server.max_accounts || 500,
      }));

      setServers(healthData);
    } catch (error) {
      console.error('Error fetching server health:', error);
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'সার্ভার ডেটা লোড করতে ব্যর্থ' : 'Failed to load server data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServerHealth();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchServerHealth();
  };

  // Prepare data for bar chart
  const barChartData = servers.map((server) => ({
    name: server.name.length > 10 ? server.name.substring(0, 10) + '...' : server.name,
    CPU: server.cpu,
    RAM: server.ram,
    Disk: server.disk,
  }));

  // Prepare data for pie chart (accounts distribution)
  const pieChartData = servers.map((server) => ({
    name: server.name,
    value: server.accounts,
  }));

  // Calculate averages
  const avgCPU = servers.length ? Math.round(servers.reduce((a, b) => a + b.cpu, 0) / servers.length) : 0;
  const avgRAM = servers.length ? Math.round(servers.reduce((a, b) => a + b.ram, 0) / servers.length) : 0;
  const avgDisk = servers.length ? Math.round(servers.reduce((a, b) => a + b.disk, 0) / servers.length) : 0;
  const totalAccounts = servers.reduce((a, b) => a + b.accounts, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {language === 'bn' ? 'সার্ভার হেলথ মনিটরিং' : 'Server Health Monitoring'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'bn' 
              ? 'সব সার্ভারের রিয়েল-টাইম পারফরম্যান্স' 
              : 'Real-time performance of all servers'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Cpu className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'bn' ? 'গড় CPU' : 'Avg CPU'}
                </p>
                <p className="text-2xl font-bold">{avgCPU}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'bn' ? 'গড় RAM' : 'Avg RAM'}
                </p>
                <p className="text-2xl font-bold">{avgRAM}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <HardDrive className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'bn' ? 'গড় Disk' : 'Avg Disk'}
                </p>
                <p className="text-2xl font-bold">{avgDisk}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Server className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'bn' ? 'মোট অ্যাকাউন্ট' : 'Total Accounts'}
                </p>
                <p className="text-2xl font-bold">{totalAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'bn' ? 'সার্ভার রিসোর্স ব্যবহার' : 'Server Resource Usage'}
            </CardTitle>
            <CardDescription>
              {language === 'bn' ? 'CPU, RAM, Disk তুলনা' : 'CPU, RAM, Disk comparison'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servers.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="CPU" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RAM" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Disk" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                {language === 'bn' ? 'কোন সার্ভার নেই' : 'No servers found'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accounts Distribution Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'bn' ? 'অ্যাকাউন্ট বিতরণ' : 'Account Distribution'}
            </CardTitle>
            <CardDescription>
              {language === 'bn' ? 'সার্ভার ভিত্তিক অ্যাকাউন্ট' : 'Accounts per server'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servers.length > 0 && totalAccounts > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                {language === 'bn' ? 'কোন অ্যাকাউন্ট নেই' : 'No accounts found'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Server Status Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === 'bn' ? 'সার্ভার স্ট্যাটাস' : 'Server Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      {language === 'bn' ? 'সার্ভার' : 'Server'}
                    </th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                      {language === 'bn' ? 'স্ট্যাটাস' : 'Status'}
                    </th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">CPU</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">RAM</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Disk</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                      {language === 'bn' ? 'অ্যাকাউন্ট' : 'Accounts'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map((server) => (
                    <tr key={server.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{server.name}</p>
                          <p className="text-xs text-muted-foreground">{server.hostname}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge variant={server.status === 'online' ? 'default' : 'destructive'}>
                          {server.status === 'online' 
                            ? (language === 'bn' ? 'অনলাইন' : 'Online')
                            : (language === 'bn' ? 'সমস্যা' : 'Warning')}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={server.cpu > 80 ? 'text-destructive font-medium' : ''}>
                          {server.cpu}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={server.ram > 80 ? 'text-destructive font-medium' : ''}>
                          {server.ram}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={server.disk > 80 ? 'text-destructive font-medium' : ''}>
                          {server.disk}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        {server.accounts}/{server.maxAccounts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{language === 'bn' ? 'কোন সক্রিয় সার্ভার নেই' : 'No active servers'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerHealthMonitor;
