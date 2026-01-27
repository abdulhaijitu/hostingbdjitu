import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DomainStatus } from './useDomains';

export interface AdminDomain {
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
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

export interface DomainSyncLog {
  id: string;
  domain_id: string | null;
  sync_type: string;
  status: string;
  local_data: Record<string, any> | null;
  registrar_data: Record<string, any> | null;
  mismatches: Record<string, any> | null;
  error_message: string | null;
  created_at: string;
}

// Fetch all domains for admin
export const useAdminDomains = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['admin-domains', statusFilter],
    queryFn: async () => {
      // First fetch domains
      let domainQuery = supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        domainQuery = domainQuery.eq('status', statusFilter as DomainStatus);
      }

      const { data: domains, error: domainError } = await domainQuery;
      if (domainError) throw domainError;

      if (!domains || domains.length === 0) return [] as AdminDomain[];

      // Fetch profiles for these domains
      const userIds = [...new Set(domains.map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return domains.map(d => ({
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
          : {},
        profiles: profileMap.get(d.user_id) || undefined,
      })) as AdminDomain[];
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Fetch domain sync logs
export const useDomainSyncLogs = (domainId?: string) => {
  return useQuery({
    queryKey: ['domain-sync-logs', domainId],
    queryFn: async () => {
      let query = supabase
        .from('domain_sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (domainId) {
        query = query.eq('domain_id', domainId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DomainSyncLog[];
    },
    staleTime: 60 * 1000,
  });
};

// Admin manual renew
export const useAdminRenewDomain = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, years = 1 }: { domainId: string; years?: number }) => {
      const response = await supabase.functions.invoke('domain-renew', {
        body: { domainId, years, renewalType: 'manual', isAdmin: true }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-renewals'] });
      toast({
        title: 'ডোমেইন রিনিউ সফল',
        description: `নতুন মেয়াদ: ${new Date(data.renewal?.new_expiry_date).toLocaleDateString('bn-BD')}`,
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

// Admin override expiry date
export const useOverrideExpiryDate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, newExpiryDate, reason }: { 
      domainId: string; 
      newExpiryDate: string;
      reason: string;
    }) => {
      const { data, error } = await supabase
        .from('domains')
        .update({ 
          expiry_date: newExpiryDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', domainId)
        .select()
        .single();

      if (error) throw error;

      // Log audit
      await supabase.functions.invoke('log-audit', {
        body: {
          actionType: 'domain_expiry_override',
          targetType: 'domain',
          targetId: domainId,
          metadata: { newExpiryDate, reason }
        }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: 'এক্সপায়ারি ডেট আপডেট হয়েছে',
        description: 'ডোমেইনের মেয়াদ সফলভাবে পরিবর্তন করা হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'এক্সপায়ারি ডেট পরিবর্তন করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Sync single domain
export const useSyncDomain = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const response = await supabase.functions.invoke('domain-sync', {
        body: { domainIds: [domainId] }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-sync-logs'] });
      toast({
        title: 'সিঙ্ক সম্পন্ন',
        description: 'ডোমেইন তথ্য রেজিস্ট্রার থেকে আপডেট হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'সিঙ্ক ব্যর্থ',
        description: error instanceof Error ? error.message : 'সিঙ্ক করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

// Update domain status
export const useUpdateDomainStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, status, reason }: { 
      domainId: string; 
      status: DomainStatus;
      reason?: string;
    }) => {
      const { data, error } = await supabase
        .from('domains')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', domainId)
        .select()
        .single();

      if (error) throw error;

      // Log audit
      await supabase.functions.invoke('log-audit', {
        body: {
          actionType: 'domain_status_change',
          targetType: 'domain',
          targetId: domainId,
          metadata: { newStatus: status, reason }
        }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: 'স্ট্যাটাস আপডেট হয়েছে',
        description: 'ডোমেইন স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'স্ট্যাটাস পরিবর্তন করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Generate EPP/Auth code
export const useGenerateAuthCode = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const response = await supabase.functions.invoke('domain-generate-authcode', {
        body: { domainId }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: 'EPP কোড জেনারেট হয়েছে',
        description: 'ক্লায়েন্টকে ইমেইলে পাঠানো হবে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'EPP কোড জেনারেট করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Initiate domain transfer out
export const useInitiateTransferOut = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, targetRegistrar }: { 
      domainId: string; 
      targetRegistrar?: string;
    }) => {
      const response = await supabase.functions.invoke('domain-transfer-out', {
        body: { domainId, targetRegistrar }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: 'ট্রান্সফার শুরু হয়েছে',
        description: 'ডোমেইন ট্রান্সফার আউট প্রক্রিয়া শুরু হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'ট্রান্সফার শুরু করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};

// Accept domain transfer in
export const useAcceptTransferIn = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId }: { domainId: string }) => {
      const response = await supabase.functions.invoke('domain-transfer-in', {
        body: { domainId, action: 'accept' }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: 'ট্রান্সফার গ্রহণ হয়েছে',
        description: 'ডোমেইন ট্রান্সফার সফলভাবে গ্রহণ করা হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error instanceof Error ? error.message : 'ট্রান্সফার গ্রহণ করতে সমস্যা',
        variant: 'destructive',
      });
    },
  });
};
