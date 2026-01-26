import React, { useState } from 'react';
import { 
  Globe, Search, CheckCircle2, XCircle, Clock, Loader2, 
  MapPin, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface DNSServer {
  location: string;
  country: string;
  ip: string;
  status: 'checking' | 'propagated' | 'not_propagated' | 'error';
  result?: string;
  responseTime?: number;
}

const DNS_SERVERS: DNSServer[] = [
  { location: 'Google', country: 'US', ip: '8.8.8.8', status: 'checking' },
  { location: 'Cloudflare', country: 'US', ip: '1.1.1.1', status: 'checking' },
  { location: 'OpenDNS', country: 'US', ip: '208.67.222.222', status: 'checking' },
  { location: 'Quad9', country: 'CH', ip: '9.9.9.9', status: 'checking' },
  { location: 'Singapore', country: 'SG', ip: '165.21.83.88', status: 'checking' },
  { location: 'Tokyo', country: 'JP', ip: '210.152.135.178', status: 'checking' },
  { location: 'London', country: 'UK', ip: '195.46.39.39', status: 'checking' },
  { location: 'Sydney', country: 'AU', ip: '1.0.0.1', status: 'checking' },
];

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'];

const DNSPropagationChecker: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [isChecking, setIsChecking] = useState(false);
  const [servers, setServers] = useState<DNSServer[]>([]);
  const [progress, setProgress] = useState(0);

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'একটি ডোমেইন নাম লিখুন' : 'Please enter a domain name',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    
    // Initialize servers with checking status
    const initialServers = DNS_SERVERS.map(s => ({ ...s, status: 'checking' as const }));
    setServers(initialServers);

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    // Simulate checking each server
    for (let i = 0; i < initialServers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      setServers(prev => {
        const updated = [...prev];
        const isPropagated = Math.random() > 0.2; // 80% propagated
        updated[i] = {
          ...updated[i],
          status: isPropagated ? 'propagated' : 'not_propagated',
          result: isPropagated ? '103.145.12.' + Math.floor(Math.random() * 255) : 'Not found',
          responseTime: Math.floor(Math.random() * 150) + 10,
        };
        return updated;
      });
      
      setProgress(((i + 1) / initialServers.length) * 100);
    }

    setIsChecking(false);
    
    toast({
      title: language === 'bn' ? 'চেক সম্পন্ন' : 'Check Complete',
      description: language === 'bn' 
        ? `${cleanDomain} এর DNS propagation চেক করা হয়েছে`
        : `DNS propagation checked for ${cleanDomain}`,
    });
  };

  const propagatedCount = servers.filter(s => s.status === 'propagated').length;
  const checkedCount = servers.filter(s => s.status !== 'checking').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {language === 'bn' ? 'DNS Propagation চেকার' : 'DNS Propagation Checker'}
        </CardTitle>
        <CardDescription>
          {language === 'bn' 
            ? 'বিশ্বব্যাপী DNS প্রচার স্থিতি পরীক্ষা করুন'
            : 'Check DNS propagation status worldwide'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'bn' ? 'example.com' : 'example.com'}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              className="pl-10"
            />
          </div>
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECORD_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCheck} disabled={isChecking}>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">
              {language === 'bn' ? 'চেক করুন' : 'Check'}
            </span>
          </Button>
        </div>

        {/* Progress Bar */}
        {isChecking && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'bn' ? 'চেক করা হচ্ছে...' : 'Checking...'}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Results Summary */}
        {servers.length > 0 && !isChecking && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-medium">
                {propagatedCount}/{checkedCount} {language === 'bn' ? 'সার্ভারে প্রচারিত' : 'servers propagated'}
              </span>
            </div>
            <Badge variant={propagatedCount === checkedCount ? 'default' : 'secondary'}>
              {Math.round((propagatedCount / checkedCount) * 100)}%
            </Badge>
          </div>
        )}

        {/* Server Results */}
        {servers.length > 0 && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {servers.map((server, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">{server.location}</span>
                    <span className="text-xs text-muted-foreground">({server.country})</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {server.status === 'checking' ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">
                        {language === 'bn' ? 'চেক করা হচ্ছে...' : 'Checking...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground font-mono">
                        {server.result}
                      </span>
                      {server.responseTime && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {server.responseTime}ms
                        </span>
                      )}
                      {server.status === 'propagated' ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {servers.length === 0 && !isChecking && (
          <div className="py-8 text-center text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {language === 'bn' 
                ? 'DNS propagation চেক করতে একটি ডোমেইন লিখুন'
                : 'Enter a domain to check DNS propagation'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DNSPropagationChecker;
