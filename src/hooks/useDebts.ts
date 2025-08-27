import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Debt {
  id: string;
  user_id: string;
  instituicao: string;
  tipo: 'consignado' | 'financiamento' | 'cartao';
  juros_a_mensal: number;
  parcelas_totais: number;
  valor_contratado: number;
  valor_parcela: number;
  status: 'ativo' | 'quitado';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDebtData {
  instituicao: string;
  tipo: 'consignado' | 'financiamento' | 'cartao';
  juros_a_mensal: number;
  parcelas_totais: number;
  valor_contratado: number;
  valor_parcela: number;
  observacoes?: string;
}

export function useDebts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: debts, isLoading, error } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Debt[];
    },
  });

  const createDebt = useMutation({
    mutationFn: async (debtData: CreateDebtData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('debts')
        .insert({
          ...debtData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Dívida cadastrada",
        description: "Dívida cadastrada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar dívida",
        variant: "destructive",
      });
    },
  });

  const updateDebt = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Debt> & { id: string }) => {
      const { data, error } = await supabase
        .from('debts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Dívida atualizada",
        description: "Dívida atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar dívida",
        variant: "destructive",
      });
    },
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Dívida excluída",
        description: "Dívida excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir dívida",
        variant: "destructive",
      });
    },
  });

  const markAsQuitado = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('debts')
        .update({ status: 'quitado' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Dívida quitada",
        description: "Dívida marcada como quitada!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao quitar dívida",
        variant: "destructive",
      });
    },
  });

  return {
    debts: debts || [],
    isLoading,
    error,
    createDebt,
    updateDebt,
    deleteDebt,
    markAsQuitado,
  };
}