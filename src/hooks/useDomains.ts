import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Domain status type - matches the database enum
export type DomainStatus = 
  | 'pending_registration'
  | 'active'
  | 'pending_renewal'
  | 'expired'
  | 'grace_period'
  | 'redemption'
  | 'cancelled'
  | 'transfer_in'
  | 'transfer_out';

export interface Domain {
  id: string;
  user_id: string;
  order_id: string | null;
  domain_name: string;
  extension: string;
  status: DomainStatus;
  registration_date: string | null;
  expiry_date: string | null;
  last_renewed_at: string | null;
  auto_renew: boolean;
  auto_renew_failed_at: string | null;
  auto_renew_failure_reason: string | null;
  nameservers: string[];
  nameserver_status: string;
  dns_records: any[];
  registrar_domain_id: string | null;
  registrar_name: string;
  auth_code: string | null;
  grace_period_ends_at: string | null;
  redemption_ends_at: string | null;
  last_synced_at: string | null;
  sync_status: string;
  sync_error: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DomainRenewal {
  id: string;
  domain_id: string;
  user_id: string;
  renewal_type: 'manual' | 'auto';
  renewal_period: number;
  amount: number;
  currency: string;
  previous_expiry_date: string | null;
  new_expiry_date: string | null;
  payment_id: string | null;
  status: string;
  failure_reason: string | null;
  created_at: string;
  processed_at: string | null;
}

// Fetch user's domains
export const useDomains = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['domains', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse the data to match our interface
      return (data || []).map(d => ({
        ...d,
        nameservers: Array.isArray(d.nameservers) 
          ? d.nameservers as string[]
          : typeof d.nameservers === 'string' 
            ? JSON.parse(d.nameservers) 
            : [],
        dns_records: Array.isArray(d.dns_records) 
          ? d.dns_records 
          : typeof d.dns_records === 'string'
            ? JSON.parse(d.dns_records)
            : [],
        metadata: typeof d.metadata === 'object' && d.metadata !== null
          ? d.metadata as Record<string, any>
          : {}
      })) as Domain[];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Fetch domain renewals
export const useDomainRenewals = (domainId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['domain-renewals', domainId, user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      let query = supabase
        .from('domain_renewals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (domainId) {
        query = query.eq('domain_id', domainId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DomainRenewal[];
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};

// Toggle auto-renew
export const useToggleAutoRenew = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ domainId, autoRenew }: { domainId: string; autoRenew: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('domain-toggle-autorenew', {
        body: { domainId, autoRenew, userId: user.id }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: data.auto_renew ? 'অটো-রিনিউ সক্রিয়' : 'অটো-রিনিউ নিষ্ক্রিয়',
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'অটো-রিনিউ আপডেট করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Update nameservers
export const useUpdateNameservers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ domainId, nameservers }: { domainId: string; nameservers: string[] }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('domain-update-nameservers', {
        body: { domainId, nameservers, userId: user.id }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: 'নেমসার্ভার আপডেট হয়েছে',
        description: data.message || 'পরিবর্তন কার্যকর হতে ২৪-৪৮ ঘন্টা সময় লাগতে পারে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'নেমসার্ভার আপডেট করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Renew domain
export const useRenewDomain = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, years = 1 }: { domainId: string; years?: number }) => {
      const response = await supabase.functions.invoke('domain-renew', {
        body: { domainId, years, renewalType: 'manual' }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-renewals'] });
      toast({
        title: 'ডোমেইন রিনিউ সফল',
        description: `নতুন মেয়াদ: ${new Date(data.renewal.new_expiry_date).toLocaleDateString('bn-BD')}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'রিনিউ ব্যর্থ',
        description: error instanceof Error ? error.message : 'ডোমেইন রিনিউ করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

// Get days until expiry
export const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get status color class
export const getStatusColor = (status: DomainStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success border-success/20';
    case 'pending_registration':
    case 'pending_renewal':
    case 'transfer_in':
    case 'transfer_out':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'expired':
    case 'grace_period':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'redemption':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'cancelled':
      return 'bg-muted text-muted-foreground border-muted';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

// Get status display text
export const getStatusText = (status: DomainStatus, language: 'en' | 'bn' = 'en'): string => {
  const texts: Record<DomainStatus, { en: string; bn: string }> = {
    pending_registration: { en: 'Registering', bn: 'রেজিস্ট্রেশন চলছে' },
    active: { en: 'Active', bn: 'সক্রিয়' },
    pending_renewal: { en: 'Renewal Pending', bn: 'রিনিউ পেন্ডিং' },
    expired: { en: 'Expired', bn: 'মেয়াদ শেষ' },
    grace_period: { en: 'Grace Period', bn: 'গ্রেস পিরিয়ড' },
    redemption: { en: 'Redemption', bn: 'রিডেম্পশন' },
    cancelled: { en: 'Cancelled', bn: 'বাতিল' },
    transfer_in: { en: 'Transferring In', bn: 'ট্রান্সফার ইন' },
    transfer_out: { en: 'Transferring Out', bn: 'ট্রান্সফার আউট' },
  };
  return texts[status]?.[language] || status;
};
