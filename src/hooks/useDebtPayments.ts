import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DebtPayment {
  id: string;
  debt_id: string;
  data_pagamento: string;
  valor_pago: number;
  status: 'em_dia' | 'atraso';
  created_at: string;
  updated_at: string;
}

export interface CreateDebtPaymentData {
  debt_id: string;
  data_pagamento: string;
  valor_pago: number;
  status: 'em_dia' | 'atraso';
}

export function useDebtPayments(debtId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['debt-payments', debtId],
    queryFn: async () => {
      const query = supabase
        .from('debt_payments')
        .select('*')
        .order('data_pagamento', { ascending: false });

      if (debtId) {
        query.eq('debt_id', debtId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DebtPayment[];
    },
    enabled: !!debtId,
  });

  const createPayment = useMutation({
    mutationFn: async (paymentData: CreateDebtPaymentData) => {
      const { data, error } = await supabase
        .from('debt_payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      toast({
        title: "Pagamento registrado",
        description: "Pagamento registrado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar pagamento",
        variant: "destructive",
      });
    },
  });

  const updatePayment = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<DebtPayment> & { id: string }) => {
      const { data, error } = await supabase
        .from('debt_payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      toast({
        title: "Pagamento atualizado",
        description: "Pagamento atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar pagamento",
        variant: "destructive",
      });
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debt_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      toast({
        title: "Pagamento excluído",
        description: "Pagamento excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir pagamento",
        variant: "destructive",
      });
    },
  });

  return {
    payments: payments || [],
    isLoading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
  };
}