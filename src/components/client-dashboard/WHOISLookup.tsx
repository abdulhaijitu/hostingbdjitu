import React, { useState } from 'react';
import { Search, Globe, Calendar, User, Building, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface WHOISData {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  status: string[];
  nameservers: string[];
  registrant?: {
    name?: string;
    organization?: string;
    country?: string;
  };
}

const WHOISLookup: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WHOISData | null>(null);

  const handleLookup = async () => {
    if (!domain.trim()) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'একটি ডোমেইন নাম লিখুন' : 'Please enter a domain name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Simulated WHOIS data (in production, call actual WHOIS API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

      // Mock WHOIS response
      const mockData: WHOISData = {
        domain: cleanDomain,
        registrar: 'Example Registrar Inc.',
        createdDate: '2020-05-15T00:00:00Z',
        expiryDate: '2025-05-15T00:00:00Z',
        updatedDate: '2024-05-10T00:00:00Z',
        status: ['clientTransferProhibited', 'clientDeleteProhibited'],
        nameservers: ['ns1.example.com', 'ns2.example.com'],
        registrant: {
          name: 'Domain Admin',
          organization: 'Example Organization',
          country: 'BD',
        },
      };

      setResult(mockData);

      toast({
        title: language === 'bn' ? 'সফল' : 'Success',
        description: language === 'bn' ? 'WHOIS তথ্য পাওয়া গেছে' : 'WHOIS data retrieved',
      });
    } catch (error) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'WHOIS তথ্য পেতে ব্যর্থ' : 'Failed to fetch WHOIS data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          {language === 'bn' ? 'WHOIS লুকআপ' : 'WHOIS Lookup'}
        </CardTitle>
        <CardDescription>
          {language === 'bn' 
            ? 'যেকোনো ডোমেইনের রেজিস্ট্রেশন তথ্য দেখুন'
            : 'Check registration details of any domain'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'bn' ? 'example.com' : 'example.com'}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleLookup} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">
              {language === 'bn' ? 'খুঁজুন' : 'Lookup'}
            </span>
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">{result.domain}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Registrar */}
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'রেজিস্ট্রার' : 'Registrar'}
                    </p>
                    <p className="font-medium text-sm">{result.registrar}</p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'তৈরির তারিখ' : 'Created'}
                    </p>
                    <p className="font-medium text-sm">
                      {new Date(result.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'মেয়াদ শেষ' : 'Expires'}
                    </p>
                    <p className="font-medium text-sm">
                      {new Date(result.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Registrant */}
                {result.registrant && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {language === 'bn' ? 'রেজিস্ট্র্যান্ট' : 'Registrant'}
                      </p>
                      <p className="font-medium text-sm">
                        {result.registrant.organization || result.registrant.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {language === 'bn' ? 'স্ট্যাটাস' : 'Status'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.status.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Nameservers */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  {language === 'bn' ? 'নেমসার্ভার' : 'Nameservers'}
                </p>
                <div className="space-y-1">
                  {result.nameservers.map((ns, i) => (
                    <p key={i} className="text-sm font-mono text-muted-foreground">
                      {ns}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WHOISLookup;
