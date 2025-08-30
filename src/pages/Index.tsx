import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { FinancialChart } from "@/components/Dashboard/FinancialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDebts } from "@/hooks/useDebts";

const Index = () => {
  const { debts } = useDebts();
  const saldoAtual = 15800;
  const receitasMes = 6000;
  const despesasMes = 4200;
  const hasSaldoNegativo = despesasMes > receitasMes;
  
  // Calculate debt summary
  const activeDebts = debts.filter(debt => debt.status === 'ativo');
  const totalDebtAmount = activeDebts.reduce((sum, debt) => sum + debt.valor_contratado, 0);
  const monthlyDebtPayment = activeDebts.reduce((sum, debt) => sum + debt.valor_parcela, 0);
  const hasActiveDebts = activeDebts.length > 0;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] px-4 md:px-6 pb-6 animate-fade-in">
        {/* Header - Compacto */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Dashboard Financeiro
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral das suas finanças • {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Alertas - 12 colunas */}
          <div className="col-span-12 space-y-3">
            {hasSaldoNegativo && (
              <Alert className="border-warning bg-warning/10 animate-slide-in-right">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground text-sm">
                  Atenção! Suas despesas estão maiores que suas receitas este mês.
                </AlertDescription>
              </Alert>
            )}

            {hasActiveDebts && (
              <Alert className="border-destructive bg-destructive/10 animate-slide-in-right">
                <CreditCard className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive text-sm">
                  Você possui {activeDebts.length} dívida(s) ativa(s). Saldo devedor total: R$ {totalDebtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Consultor Recomenda - 12 colunas, altura fixa */}
          <Card className="col-span-12 rounded-2xl border bg-card shadow-sm min-h-[72px] md:min-h-[88px] hover-scale animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Consultor Recomenda
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary p-3 rounded-r-lg w-full">
                <p className="text-card-foreground text-sm leading-relaxed">
                  "Parabéns pelo controle dos gastos este mês! Sugiro aumentar sua reserva de emergência para 6 meses. 
                  Considere também diversificar seus investimentos com 10% em renda variável."
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Ana Paula - Consultora Financeira
                </p>
              </div>
            </CardContent>
          </Card>

          {/* KPIs - Grid responsivo com altura consistente */}
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm min-h-[90px] md:min-h-[110px] flex flex-col justify-center hover-scale transition-all duration-300 hover:shadow-card group animate-scale-in">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg transition-colors group-hover:bg-primary/20">
                  <DollarSign className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Saldo Atual</p>
                  <p className="text-lg md:text-xl font-bold text-foreground truncate transition-colors group-hover:text-primary">
                    R$ {saldoAtual.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm min-h-[90px] md:min-h-[110px] flex flex-col justify-center hover-scale transition-all duration-300 hover:shadow-card group animate-scale-in [animation-delay:100ms]">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg transition-colors group-hover:bg-success/20">
                  <TrendingUp className="h-5 w-5 text-success transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Receitas do Mês</p>
                  <p className="text-lg md:text-xl font-bold text-foreground truncate transition-colors group-hover:text-success">
                    R$ {receitasMes.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm min-h-[90px] md:min-h-[110px] flex flex-col justify-center hover-scale transition-all duration-300 hover:shadow-card group animate-scale-in [animation-delay:200ms]">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-destructive/10 rounded-lg transition-colors group-hover:bg-destructive/20">
                  <TrendingDown className="h-5 w-5 text-destructive transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Despesas do Mês</p>
                  <p className="text-lg md:text-xl font-bold text-foreground truncate transition-colors group-hover:text-destructive">
                    R$ {despesasMes.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm min-h-[90px] md:min-h-[110px] flex flex-col justify-center hover-scale transition-all duration-300 hover:shadow-card group animate-scale-in [animation-delay:300ms]">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg transition-colors group-hover:bg-warning/20">
                  <CreditCard className="h-5 w-5 text-warning transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Saldo Devedor</p>
                  <p className="text-lg md:text-xl font-bold text-foreground truncate transition-colors group-hover:text-warning">
                    R$ {totalDebtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficos - Grid otimizado com aspectos fixos */}
          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
            {/* Despesas por Categoria - 7 colunas no desktop */}
            <Card className="lg:col-span-7 rounded-2xl border bg-card shadow-sm min-h-[360px] md:min-h-[420px] aspect-[16/10] overflow-hidden hover-scale transition-all duration-300 hover:shadow-elevated animate-fade-in [animation-delay:400ms]">
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-base font-semibold text-card-foreground flex items-center gap-2" aria-label="Gráfico de despesas por categoria">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  Despesas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 h-[calc(100%-80px)]">
                <div className="w-full h-full">
                  <ExpenseChart />
                </div>
              </CardContent>
            </Card>

            {/* Evolução Financeira - 5 colunas no desktop */}
            <Card className="lg:col-span-5 rounded-2xl border bg-card shadow-sm min-h-[360px] md:min-h-[420px] aspect-[16/10] overflow-hidden hover-scale transition-all duration-300 hover:shadow-elevated animate-fade-in [animation-delay:500ms]">
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-base font-semibold text-card-foreground flex items-center gap-2" aria-label="Gráfico de evolução financeira">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-primary"></div>
                  Evolução Financeira
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 h-[calc(100%-80px)]">
                <div className="w-full h-full">
                  <FinancialChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rodapé com estatísticas adicionais */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
            <div className="text-center p-3 rounded-lg bg-muted/30 animate-fade-in [animation-delay:600ms]">
              <p className="text-sm font-medium text-muted-foreground">Economia do Mês</p>
              <p className="text-lg font-bold text-success">
                R$ {(receitasMes - despesasMes).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30 animate-fade-in [animation-delay:700ms]">
              <p className="text-sm font-medium text-muted-foreground">Meta de Economia</p>
              <p className="text-lg font-bold text-primary">R$ 2.000</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30 animate-fade-in [animation-delay:800ms]">
              <p className="text-sm font-medium text-muted-foreground">Próximo Vencimento</p>
              <p className="text-lg font-bold text-warning">15/12</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
