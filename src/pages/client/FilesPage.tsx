import React, { useState } from 'react';
import { FolderOpen, File, Upload, Trash2, Download, ChevronRight, Home } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const mockFiles = [
  { id: 1, name: 'public_html', type: 'folder', size: '-', modified: '2024-01-15', permissions: 'drwxr-xr-x' },
  { id: 2, name: 'logs', type: 'folder', size: '-', modified: '2024-01-15', permissions: 'drwxr-xr-x' },
  { id: 3, name: '.htaccess', type: 'file', size: '1.2 KB', modified: '2024-02-20', permissions: '-rw-r--r--' },
  { id: 4, name: 'index.php', type: 'file', size: '4.5 KB', modified: '2024-03-10', permissions: '-rw-r--r--' },
];

const FilesPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState('/home/user');

  return (
    <DashboardLayout title={language === 'bn' ? 'ফাইল ম্যানেজার' : 'File Manager'}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'ফাইল ম্যানেজার' : 'File Manager'}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Home className="h-3.5 w-3.5" />
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground font-mono">{currentPath}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'আপলোড' : 'Upload'}
        </Button>
        <Button variant="outline" size="sm">
          <FolderOpen className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'নতুন ফোল্ডার' : 'New Folder'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {file.type === 'folder' ? (
                    <FolderOpen className="h-5 w-5 text-warning" />
                  ) : (
                    <File className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{file.permissions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{file.size}</span>
                  <span>{file.modified}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FilesPage;
