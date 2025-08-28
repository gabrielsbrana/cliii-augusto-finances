import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useReports, type ReportsFilters } from "@/hooks/useReports";
import { format, subMonths } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useCategorias } from "@/hooks/useCategorias";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Relatorios = () => {
  const [filters, setFilters] = useState<ReportsFilters>({
    dataInicio: format(subMonths(new Date(), 12), 'yyyy-MM-dd'),
    dataFim: format(new Date(), 'yyyy-MM-dd'),
    categoria: "all",
    tipo: "all"
  });

  const { categorias } = useCategorias();
  const { data: reportsData, isLoading } = useReports(filters);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToPDF = () => {
    toast.success("Exportação PDF iniciada - Cliii – Augusto");
    // Implementation would use libraries like jsPDF or Puppeteer
  };

  const exportToExcel = () => {
    toast.success("Exportação Excel iniciada - Cliii – Augusto");
    // Implementation would use libraries like xlsx or ExcelJS
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return format(new Date(parseInt(year), parseInt(month) - 1), 'MMM/yy');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando relatórios...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Relatórios Financeiros - Cliii – Augusto
          </h1>
          <p className="text-muted-foreground">
            Consolidação e análise dos seus dados financeiros
          </p>
        </div>

        {/* Summary Cards */}
        {reportsData && (
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <p className="text-sm font-medium text-card-foreground">Receitas Total</p>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(reportsData.totalReceitas)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-card-foreground">Despesas Total</p>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(reportsData.totalDespesas)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-card-foreground">Saldo Total</p>
                </div>
                <div className="mt-2">
                  <p className={`text-2xl font-bold ${reportsData.saldoTotal >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(reportsData.saldoTotal)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <p className="text-sm font-medium text-card-foreground">Saldo Devedor</p>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-warning">
                    {formatCurrency(reportsData.saldoDevedor)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-card-foreground">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio" className="text-card-foreground">
                  Data Início
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => handleFilterChange("dataInicio", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim" className="text-card-foreground">
                  Data Fim
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => handleFilterChange("dataFim", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">
                  Tipo
                </Label>
                <Select 
                  value={filters.tipo} 
                  onValueChange={(value) => handleFilterChange("tipo", value)}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="receita">Receitas</SelectItem>
                    <SelectItem value="despesa">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">
                  Categoria
                </Label>
                <Select 
                  value={filters.categoria} 
                  onValueChange={(value) => handleFilterChange("categoria", value)}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={exportToPDF}
                className="financial-gradient text-black font-semibold hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button 
                onClick={exportToExcel}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        {reportsData && (
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* Monthly Evolution Chart */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-card-foreground">Evolução Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={formatMonth}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(label) => formatMonth(label)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="receitas" 
                      stroke="hsl(var(--success))" 
                      name="Receitas"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="despesas" 
                      stroke="hsl(var(--destructive))" 
                      name="Despesas"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="saldo" 
                      stroke="hsl(var(--primary))" 
                      name="Saldo"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories Chart */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-card-foreground">Top Categorias de Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportsData.topCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="valor"
                    >
                      {reportsData.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Valor"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {reportsData.topCategories.map((category, index) => (
                    <div key={category.categoria} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-card-foreground">{category.categoria}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-card-foreground">
                          {formatCurrency(category.valor)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Data Table */}
        {reportsData && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-card-foreground">Consolidação Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-card-foreground">Mês</TableHead>
                    <TableHead className="text-card-foreground text-right">Receitas</TableHead>
                    <TableHead className="text-card-foreground text-right">Despesas</TableHead>
                    <TableHead className="text-card-foreground text-right">Pagamentos Dívidas</TableHead>
                    <TableHead className="text-card-foreground text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData.monthlyData.map((item) => (
                    <TableRow key={item.month} className="border-border">
                      <TableCell className="text-card-foreground font-medium">
                        {formatMonth(item.month)}
                      </TableCell>
                      <TableCell className="text-right text-success font-semibold">
                        {formatCurrency(item.receitas)}
                      </TableCell>
                      <TableCell className="text-right text-destructive font-semibold">
                        {formatCurrency(item.despesas)}
                      </TableCell>
                      <TableCell className="text-right text-warning font-semibold">
                        {formatCurrency(item.pagamentos_dividas)}
                      </TableCell>
                      <TableCell 
                        className={`text-right font-bold ${
                          item.saldo >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {formatCurrency(item.saldo)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Relatorios;