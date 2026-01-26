import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Invoice {
  id: string;
  payment_id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  tax: number | null;
  total: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

// Cache durations for optimized performance
const QUERY_CONFIG = {
  staleTime: 30 * 1000, // Data is fresh for 30 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
};

export const useInvoices = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['invoices', user?.id, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, payments(*, orders(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    ...QUERY_CONFIG,
  });
};
