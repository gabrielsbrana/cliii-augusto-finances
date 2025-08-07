import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { FinancialChart } from "@/components/Dashboard/FinancialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const saldoAtual = 15800;
  const receitasMes = 6000;
  const despesasMes = 4200;
  const hasSaldoNegativo = despesasMes > receitasMes;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças
          </p>
        </div>

        {/* Alert for negative balance */}
        {hasSaldoNegativo && (
          <Alert className="border-warning bg-warning/10 animate-slide-up">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              Atenção! Suas despesas estão maiores que suas receitas este mês.
            </AlertDescription>
          </Alert>
        )}

        {/* Consultor Recomenda */}
        <Card className="card-gradient animate-scale-in">
          <CardHeader>
            <CardTitle className="text-card-foreground">Consultor Recomenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-card-foreground text-sm">
                "Parabéns pelo controle dos gastos este mês! Sugiro aumentar sua reserva de emergência para 6 meses. 
                Considere também diversificar seus investimentos com 10% em renda variável."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Ana Paula - Consultora Financeira
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Saldo Atual"
            value={`R$ ${saldoAtual.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            className="animate-scale-in"
          />
          <StatsCard
            title="Receitas do Mês"
            value={`R$ ${receitasMes.toLocaleString()}`}
            icon={TrendingUp}
            trend="up"
            className="animate-scale-in"
          />
          <StatsCard
            title="Despesas do Mês"
            value={`R$ ${despesasMes.toLocaleString()}`}
            icon={TrendingDown}
            trend="down"
            className="animate-scale-in"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-slide-up">
            <ExpenseChart />
          </div>
          <div className="animate-slide-up">
            <FinancialChart />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
