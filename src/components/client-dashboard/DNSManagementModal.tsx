import React, { useState } from 'react';
import { 
  Globe, Plus, Trash2, Edit2, Save, X, AlertCircle, 
  CheckCircle, Clock, RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { cn } from '@/lib/utils';

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  status: 'active' | 'pending' | 'error';
}

interface DNSManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainName: string;
}

const initialRecords: DNSRecord[] = [
  { id: '1', type: 'A', name: '@', value: '103.145.123.45', ttl: 3600, status: 'active' },
  { id: '2', type: 'A', name: 'www', value: '103.145.123.45', ttl: 3600, status: 'active' },
  { id: '3', type: 'CNAME', name: 'mail', value: 'mail.chost.com.bd', ttl: 3600, status: 'active' },
  { id: '4', type: 'MX', name: '@', value: 'mail.chost.com.bd', ttl: 3600, priority: 10, status: 'active' },
  { id: '5', type: 'TXT', name: '@', value: 'v=spf1 include:_spf.chost.com.bd ~all', ttl: 3600, status: 'active' },
];

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV'] as const;

const ttlOptions = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 14400, label: '4 hours' },
  { value: 86400, label: '24 hours' },
];

const DNSManagementModal: React.FC<DNSManagementModalProps> = ({
  open,
  onOpenChange,
  domainName,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [records, setRecords] = useState<DNSRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    type: 'A' as DNSRecord['type'],
    name: '',
    value: '',
    ttl: 3600,
    priority: 10,
  });

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(r => r.type === activeTab);

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.value) {
      toast({
        title: language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Information',
        description: language === 'bn' ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const record: DNSRecord = {
      id: Date.now().toString(),
      type: newRecord.type,
      name: newRecord.name,
      value: newRecord.value,
      ttl: newRecord.ttl,
      priority: newRecord.type === 'MX' ? newRecord.priority : undefined,
      status: 'pending',
    };

    setRecords(prev => [...prev, record]);
    setShowAddDialog(false);
    setNewRecord({ type: 'A', name: '', value: '', ttl: 3600, priority: 10 });

    toast({
      title: language === 'bn' ? 'রেকর্ড যোগ হয়েছে' : 'Record Added',
      description: language === 'bn' 
        ? 'DNS রেকর্ড প্রচার হতে কয়েক মিনিট সময় লাগতে পারে'
        : 'DNS record may take a few minutes to propagate',
    });

    // Simulate propagation
    setTimeout(() => {
      setRecords(prev => prev.map(r => 
        r.id === record.id ? { ...r, status: 'active' as const } : r
      ));
    }, 3000);
  };

  const handleUpdateRecord = () => {
    if (!editingRecord) return;

    setRecords(prev => prev.map(r => 
      r.id === editingRecord.id ? { ...editingRecord, status: 'pending' as const } : r
    ));
    setEditingRecord(null);

    toast({
      title: language === 'bn' ? 'রেকর্ড আপডেট হয়েছে' : 'Record Updated',
      description: language === 'bn' 
        ? 'পরিবর্তন কার্যকর হতে কয়েক মিনিট সময় লাগতে পারে'
        : 'Changes may take a few minutes to propagate',
    });

    // Simulate propagation
    setTimeout(() => {
      setRecords(prev => prev.map(r => 
        r.id === editingRecord.id ? { ...r, status: 'active' as const } : r
      ));
    }, 3000);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    toast({
      title: language === 'bn' ? 'রেকর্ড মুছে ফেলা হয়েছে' : 'Record Deleted',
    });
  };

  const getStatusBadge = (status: DNSRecord['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-success/10 text-success gap-1">
            <CheckCircle className="h-3 w-3" />
            {language === 'bn' ? 'সক্রিয়' : 'Active'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning/10 text-warning gap-1">
            <Clock className="h-3 w-3" />
            {language === 'bn' ? 'প্রচার হচ্ছে' : 'Propagating'}
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-destructive/10 text-destructive gap-1">
            <AlertCircle className="h-3 w-3" />
            {language === 'bn' ? 'ত্রুটি' : 'Error'}
          </Badge>
        );
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-500/10 text-blue-600',
      'AAAA': 'bg-indigo-500/10 text-indigo-600',
      'CNAME': 'bg-purple-500/10 text-purple-600',
      'MX': 'bg-orange-500/10 text-orange-600',
      'TXT': 'bg-green-500/10 text-green-600',
      'NS': 'bg-cyan-500/10 text-cyan-600',
      'SRV': 'bg-pink-500/10 text-pink-600',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {language === 'bn' ? 'DNS ম্যানেজমেন্ট' : 'DNS Management'}
            </DialogTitle>
            <DialogDescription>
              {domainName} - {language === 'bn' 
                ? 'DNS রেকর্ড যোগ, সম্পাদনা বা মুছুন'
                : 'Add, edit, or delete DNS records'}
            </DialogDescription>
          </DialogHeader>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">
                {language === 'bn' ? 'গুরুত্বপূর্ণ তথ্য' : 'Important Information'}
              </p>
              <p className="text-muted-foreground">
                {language === 'bn' 
                  ? 'DNS পরিবর্তন বিশ্বব্যাপী প্রচার হতে ২৪-৪৮ ঘন্টা সময় লাগতে পারে।'
                  : 'DNS changes may take 24-48 hours to propagate globally.'}
              </p>
            </div>
          </div>

          {/* Tabs and Add Button */}
          <div className="flex items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 w-full max-w-xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="A">A</TabsTrigger>
                <TabsTrigger value="CNAME">CNAME</TabsTrigger>
                <TabsTrigger value="MX">MX</TabsTrigger>
                <TabsTrigger value="TXT">TXT</TabsTrigger>
                <TabsTrigger value="NS">NS</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2 flex-shrink-0">
              <Plus className="h-4 w-4" />
              {language === 'bn' ? 'রেকর্ড যোগ করুন' : 'Add Record'}
            </Button>
          </div>

          {/* Records Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">{language === 'bn' ? 'টাইপ' : 'Type'}</TableHead>
                  <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                  <TableHead>{language === 'bn' ? 'মান' : 'Value'}</TableHead>
                  <TableHead className="w-24">TTL</TableHead>
                  <TableHead className="w-28">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                  <TableHead className="w-24 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {language === 'bn' ? 'কোন রেকর্ড পাওয়া যায়নি' : 'No records found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge className={cn('font-mono', getRecordTypeColor(record.type))}>
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.name === '@' ? domainName : `${record.name}.${domainName}`}
                      </TableCell>
                      <TableCell className="font-mono text-sm max-w-[200px] truncate">
                        {record.priority ? `${record.priority} ` : ''}{record.value}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ttlOptions.find(t => t.value === record.ttl)?.label || `${record.ttl}s`}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingRecord(record)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {filteredRecords.length} {language === 'bn' ? 'রেকর্ড' : 'records'}
            </p>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন DNS রেকর্ড যোগ করুন' : 'Add New DNS Record'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'রেকর্ড টাইপ' : 'Record Type'}</Label>
                <Select 
                  value={newRecord.type}
                  onValueChange={(value: DNSRecord['type']) => setNewRecord(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>TTL</Label>
                <Select 
                  value={newRecord.ttl.toString()}
                  onValueChange={(value) => setNewRecord(prev => ({ ...prev, ttl: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ttlOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{language === 'bn' ? 'নাম (হোস্ট)' : 'Name (Host)'}</Label>
              <Input
                value={newRecord.name}
                onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
                placeholder="@ or subdomain"
                className="mt-1 font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'bn' ? '@ রুট ডোমেইনের জন্য ব্যবহার করুন' : 'Use @ for root domain'}
              </p>
            </div>
            {newRecord.type === 'MX' && (
              <div>
                <Label>{language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}</Label>
                <Input
                  type="number"
                  value={newRecord.priority}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, priority: parseInt(e.target.value) || 10 }))}
                  placeholder="10"
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label>
                {newRecord.type === 'A' || newRecord.type === 'AAAA' 
                  ? (language === 'bn' ? 'IP ঠিকানা' : 'IP Address')
                  : newRecord.type === 'CNAME' 
                    ? (language === 'bn' ? 'টার্গেট হোস্ট' : 'Target Host')
                    : newRecord.type === 'MX'
                      ? (language === 'bn' ? 'মেইল সার্ভার' : 'Mail Server')
                      : (language === 'bn' ? 'মান' : 'Value')
                }
              </Label>
              <Input
                value={newRecord.value}
                onChange={(e) => setNewRecord(prev => ({ ...prev, value: e.target.value }))}
                placeholder={
                  newRecord.type === 'A' ? '192.168.1.1' 
                  : newRecord.type === 'CNAME' ? 'target.example.com'
                  : newRecord.type === 'MX' ? 'mail.example.com'
                  : newRecord.type === 'TXT' ? 'v=spf1 include:...'
                  : 'Value'
                }
                className="mt-1 font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleAddRecord}>
              {language === 'bn' ? 'রেকর্ড যোগ করুন' : 'Add Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'DNS রেকর্ড সম্পাদনা করুন' : 'Edit DNS Record'}
            </DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'bn' ? 'রেকর্ড টাইপ' : 'Record Type'}</Label>
                  <Input value={editingRecord.type} disabled className="mt-1 bg-muted" />
                </div>
                <div>
                  <Label>TTL</Label>
                  <Select 
                    value={editingRecord.ttl.toString()}
                    onValueChange={(value) => setEditingRecord(prev => prev ? { ...prev, ttl: parseInt(value) } : null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ttlOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>{language === 'bn' ? 'নাম' : 'Name'}</Label>
                <Input
                  value={editingRecord.name}
                  onChange={(e) => setEditingRecord(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="mt-1 font-mono"
                />
              </div>
              {editingRecord.type === 'MX' && (
                <div>
                  <Label>{language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}</Label>
                  <Input
                    type="number"
                    value={editingRecord.priority || 10}
                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, priority: parseInt(e.target.value) || 10 } : null)}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label>{language === 'bn' ? 'মান' : 'Value'}</Label>
                <Input
                  value={editingRecord.value}
                  onChange={(e) => setEditingRecord(prev => prev ? { ...prev, value: e.target.value } : null)}
                  className="mt-1 font-mono"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateRecord}>
              {language === 'bn' ? 'পরিবর্তন সেভ করুন' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DNSManagementModal;
