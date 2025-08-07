import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const mockData = [
  { id: 1, data: "2024-01-15", tipo: "Receita", categoria: "Salário", descricao: "Salário mensal", valor: 5000 },
  { id: 2, data: "2024-01-18", tipo: "Despesa", categoria: "Alimentação", descricao: "Supermercado", valor: -350 },
  { id: 3, data: "2024-01-20", tipo: "Despesa", categoria: "Transporte", descricao: "Combustível", valor: -200 },
  { id: 4, data: "2024-01-25", tipo: "Receita", categoria: "Freelance", descricao: "Projeto web", valor: 1500 },
  { id: 5, data: "2024-01-28", tipo: "Despesa", categoria: "Saúde", descricao: "Consulta médica", valor: -150 },
];

const Relatorios = () => {
  const [filters, setFilters] = useState({
    dataInicio: "",
    dataFim: "",
    categoria: "",
    tipo: ""
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToPDF = () => {
    toast.success("Relatório PDF será baixado em breve");
    // Here you would implement PDF export
  };

  const exportToExcel = () => {
    toast.success("Relatório Excel será baixado em breve");
    // Here you would implement Excel export
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground">
            Consulte e exporte seus dados financeiros
          </p>
        </div>

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
                    <SelectItem value="salario">Salário</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="lazer">Lazer</SelectItem>
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

        {/* Data Table */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-card-foreground">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-card-foreground">Data</TableHead>
                  <TableHead className="text-card-foreground">Tipo</TableHead>
                  <TableHead className="text-card-foreground">Categoria</TableHead>
                  <TableHead className="text-card-foreground">Descrição</TableHead>
                  <TableHead className="text-card-foreground text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id} className="border-border">
                    <TableCell className="text-card-foreground">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-card-foreground">{item.tipo}</TableCell>
                    <TableCell className="text-card-foreground">{item.categoria}</TableCell>
                    <TableCell className="text-card-foreground">{item.descricao}</TableCell>
                    <TableCell 
                      className={`text-right font-semibold ${
                        item.valor > 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      R$ {Math.abs(item.valor).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;