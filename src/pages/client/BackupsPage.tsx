import React from 'react';
import { Archive, Download, RefreshCw, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const mockBackups = [
  { id: 1, date: '2024-01-25', size: '2.3 GB', type: 'Full', status: 'completed' },
  { id: 2, date: '2024-01-18', size: '2.1 GB', type: 'Full', status: 'completed' },
];

const BackupsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  return (
    <DashboardLayout title={language === 'bn' ? 'ব্যাকআপ' : 'Backups'}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            {language === 'bn' ? 'ব্যাকআপ ম্যানেজমেন্ট' : 'Backup Management'}
          </h1>
          <p className="text-muted-foreground mt-1">Last backup: January 25, 2024</p>
        </div>
        <Button variant="hero" onClick={() => toast({ title: 'Backup Started', description: 'This may take a few minutes...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'ব্যাকআপ নিন' : 'Create Backup'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBackups.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Archive className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-muted-foreground">{backup.type} - {backup.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={backup.status} />
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BackupsPage;
