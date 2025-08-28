import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

export interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
  pagamentos_dividas: number;
}

export interface CategoryExpense {
  categoria: string;
  valor: number;
  percentage: number;
}

export interface ReportsData {
  monthlyData: MonthlyData[];
  topCategories: CategoryExpense[];
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
  saldoDevedor: number;
}

export interface ReportsFilters {
  dataInicio: string;
  dataFim: string;
  categoria: string;
  tipo: string;
}

export function useReports(filters: ReportsFilters) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async (): Promise<ReportsData> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Define date range - default to last 12 months if no filters
      const endDate = filters.dataFim ? new Date(filters.dataFim) : new Date();
      const startDate = filters.dataInicio ? new Date(filters.dataInicio) : subMonths(endDate, 12);

      // Fetch receitas
      let receitasQuery = supabase
        .from('receitas')
        .select('valor_liquido, data_recebimento, categoria_id, categorias(nome)')
        .eq('user_id', user.id)
        .gte('data_recebimento', format(startDate, 'yyyy-MM-dd'))
        .lte('data_recebimento', format(endDate, 'yyyy-MM-dd'));

      if (filters.categoria && filters.categoria !== 'all') {
        receitasQuery = receitasQuery.eq('categoria_id', filters.categoria);
      }

      // Fetch despesas
      let despesasQuery = supabase
        .from('despesas')
        .select('valor, data_pagamento, categoria_id, categorias(nome)')
        .eq('user_id', user.id)
        .not('data_pagamento', 'is', null)
        .gte('data_pagamento', format(startDate, 'yyyy-MM-dd'))
        .lte('data_pagamento', format(endDate, 'yyyy-MM-dd'));

      if (filters.categoria && filters.categoria !== 'all') {
        despesasQuery = despesasQuery.eq('categoria_id', filters.categoria);
      }

      // Fetch debt payments
      const { data: debtPayments } = await supabase
        .from('debt_payments')
        .select(`
          valor_pago, 
          data_pagamento,
          debts!inner(user_id)
        `)
        .eq('debts.user_id', user.id)
        .gte('data_pagamento', format(startDate, 'yyyy-MM-dd'))
        .lte('data_pagamento', format(endDate, 'yyyy-MM-dd'));

      // Fetch active debts for total debt amount
      const { data: activeDebts } = await supabase
        .from('debts')
        .select('valor_contratado, valor_parcela, parcelas_totais')
        .eq('user_id', user.id)
        .eq('status', 'ativo');

      const [receitasResult, despesasResult] = await Promise.all([
        receitasQuery,
        despesasQuery
      ]);

      const receitas = receitasResult.data || [];
      const despesas = despesasResult.data || [];

      // Calculate monthly aggregations
      const monthlyMap = new Map<string, MonthlyData>();

      // Process receitas
      receitas.forEach(receita => {
        const monthKey = format(new Date(receita.data_recebimento), 'yyyy-MM');
        const existing = monthlyMap.get(monthKey) || {
          month: monthKey,
          receitas: 0,
          despesas: 0,
          saldo: 0,
          pagamentos_dividas: 0
        };
        existing.receitas += Number(receita.valor_liquido);
        monthlyMap.set(monthKey, existing);
      });

      // Process despesas
      despesas.forEach(despesa => {
        const monthKey = format(new Date(despesa.data_pagamento!), 'yyyy-MM');
        const existing = monthlyMap.get(monthKey) || {
          month: monthKey,
          receitas: 0,
          despesas: 0,
          saldo: 0,
          pagamentos_dividas: 0
        };
        existing.despesas += Number(despesa.valor);
        monthlyMap.set(monthKey, existing);
      });

      // Process debt payments
      (debtPayments || []).forEach(payment => {
        const monthKey = format(new Date(payment.data_pagamento), 'yyyy-MM');
        const existing = monthlyMap.get(monthKey) || {
          month: monthKey,
          receitas: 0,
          despesas: 0,
          saldo: 0,
          pagamentos_dividas: 0
        };
        existing.pagamentos_dividas += Number(payment.valor_pago);
        monthlyMap.set(monthKey, existing);
      });

      // Calculate balances and sort by month
      const monthlyData = Array.from(monthlyMap.values())
        .map(data => ({
          ...data,
          saldo: data.receitas - data.despesas - data.pagamentos_dividas
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // Calculate top expense categories
      const categoryMap = new Map<string, number>();
      despesas.forEach(despesa => {
        const categoryName = (despesa as any).categorias?.nome || 'Sem categoria';
        const existing = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, existing + Number(despesa.valor));
      });

      const totalDespesasValue = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
      
      const topCategories: CategoryExpense[] = Array.from(categoryMap.entries())
        .map(([categoria, valor]) => ({
          categoria,
          valor,
          percentage: totalDespesasValue > 0 ? (valor / totalDespesasValue) * 100 : 0
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

      // Calculate totals
      const totalReceitas = receitas.reduce((sum, r) => sum + Number(r.valor_liquido), 0);
      const totalDespesas = despesas.reduce((sum, d) => sum + Number(d.valor), 0);
      const totalPagamentosDiv = (debtPayments || []).reduce((sum, p) => sum + Number(p.valor_pago), 0);
      const saldoTotal = totalReceitas - totalDespesas - totalPagamentosDiv;

      // Calculate remaining debt
      const saldoDevedor = (activeDebts || []).reduce((sum, debt) => {
        const totalValue = Number(debt.valor_contratado);
        // In a real implementation, you'd calculate based on payments made
        return sum + totalValue;
      }, 0);

      return {
        monthlyData,
        topCategories,
        totalReceitas,
        totalDespesas: totalDespesas + totalPagamentosDiv,
        saldoTotal,
        saldoDevedor
      };
    },
    enabled: !!filters,
  });
}