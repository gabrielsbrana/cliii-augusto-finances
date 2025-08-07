import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { FinancialChart } from "@/components/Dashboard/FinancialChart";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const saldoAtual = 15800;
  const receitasMes = 6000;
  const despesasMes = 4200;
  const hasSaldoNegativo = despesasMes > receitasMes;

  return (
    <Layout>
      <div className="space-y-6">
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
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              Atenção! Suas despesas estão maiores que suas receitas este mês.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Saldo Atual"
            value={`R$ ${saldoAtual.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Receitas do Mês"
            value={`R$ ${receitasMes.toLocaleString()}`}
            icon={TrendingUp}
            trend="up"
          />
          <StatsCard
            title="Despesas do Mês"
            value={`R$ ${despesasMes.toLocaleString()}`}
            icon={TrendingDown}
            trend="down"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpenseChart />
          <FinancialChart />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
