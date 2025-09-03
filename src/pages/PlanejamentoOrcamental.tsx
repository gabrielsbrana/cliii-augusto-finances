import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PlusCircle, Target, TrendingUp, AlertTriangle, FileDown, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Meta {
  id: string;
  categoria: string;
  valor: number;
  cor: string;
}

interface Despesa {
  id: string;
  data: string;
  valor: number;
  descricao: string;
  categoria: string;
}

const categoriasPadrao = [
  { nome: "Alimentação", cor: "#3B82F6", percentualIdeal: 15 },
  { nome: "Lazer", cor: "#10B981", percentualIdeal: 5 },
  { nome: "Moradia", cor: "#F59E0B", percentualIdeal: 30 },
  { nome: "Educação", cor: "#8B5CF6", percentualIdeal: 5 },
  { nome: "Transporte", cor: "#EF4444", percentualIdeal: 15 },
  { nome: "Saúde", cor: "#06B6D4", percentualIdeal: 10 },
  { nome: "Outros", cor: "#6B7280", percentualIdeal: 20 },
];

export default function PlanejamentoOrcamental() {
  const [metaGlobal, setMetaGlobal] = useState<number>(5000);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState({
    data: "",
    valor: "",
    descricao: "",
    categoria: "",
  });

  useEffect(() => {
    // Inicializar metas padrão
    const metasIniciais = categoriasPadrao.map((cat, index) => ({
      id: `meta-${index}`,
      categoria: cat.nome,
      valor: metaGlobal * (cat.percentualIdeal / 100),
      cor: cat.cor,
    }));
    setMetas(metasIniciais);
  }, [metaGlobal]);

  const calcularGastosPorCategoria = () => {
    const gastos = categoriasPadrao.map(cat => {
      const totalGasto = despesas
        .filter(d => d.categoria === cat.nome)
        .reduce((sum, d) => sum + d.valor, 0);
      
      const meta = metas.find(m => m.categoria === cat.nome)?.valor || 0;
      const percentual = meta > 0 ? (totalGasto / meta) * 100 : 0;
      
      return {
        categoria: cat.nome,
        gasto: totalGasto,
        meta,
        percentual,
        cor: cat.cor,
        percentualIdeal: cat.percentualIdeal,
      };
    });
    
    return gastos;
  };

  const totalGasto = despesas.reduce((sum, d) => sum + d.valor, 0);
  const saldoRestante = metaGlobal - totalGasto;
  const percentualGasto = (totalGasto / metaGlobal) * 100;

  const handleAdicionarDespesa = () => {
    if (!novaDespesa.data || !novaDespesa.valor || !novaDespesa.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const despesa: Despesa = {
      id: Date.now().toString(),
      data: novaDespesa.data,
      valor: parseFloat(novaDespesa.valor),
      descricao: novaDespesa.descricao,
      categoria: novaDespesa.categoria,
    };

    setDespesas([...despesas, despesa]);
    setNovaDespesa({ data: "", valor: "", descricao: "", categoria: "" });
    setIsDialogOpen(false);
    toast.success("Despesa adicionada com sucesso!");
  };

  const handleExcluirDespesa = (id: string) => {
    setDespesas(despesas.filter(d => d.id !== id));
    toast.success("Despesa excluída com sucesso!");
  };

  const gastosPorCategoria = calcularGastosPorCategoria();
  const dadosGrafico = gastosPorCategoria.map(g => ({
    name: g.categoria,
    value: g.gasto,
    fill: g.cor,
  }));

  const getStatusColor = (percentual: number) => {
    if (percentual >= 100) return "text-destructive";
    if (percentual >= 80) return "text-orange-500";
    return "text-muted-foreground";
  };

  const getStatusIcon = (percentual: number) => {
    if (percentual >= 100) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (percentual >= 80) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return null;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] px-4 md:px-6 pb-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planejamento Orçamental</h1>
            <p className="text-muted-foreground">Gerencie suas metas e acompanhe seus gastos em tempo real</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl border bg-card shadow-sm min-h-[110px] hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Meta Global</p>
                  <p className="text-lg md:text-xl font-bold">R$ {metaGlobal.toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-sm min-h-[110px] hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Gasto</p>
                  <p className="text-lg md:text-xl font-bold">R$ {totalGasto.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-sm min-h-[110px] hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Saldo Restante</p>
                  <p className={`text-lg md:text-xl font-bold ${saldoRestante < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                    R$ {saldoRestante.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-full p-2 ${saldoRestante < 0 ? 'bg-destructive/10' : 'bg-emerald-100'}`}>
                  <Target className={`h-4 w-4 ${saldoRestante < 0 ? 'text-destructive' : 'text-emerald-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-sm min-h-[110px] hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">% Consumido</p>
                  <p className={`text-lg md:text-xl font-bold ${getStatusColor(percentualGasto)}`}>
                    {percentualGasto.toFixed(1)}%
                  </p>
                </div>
                {getStatusIcon(percentualGasto)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
              {/* Gráfico de pizza */}
              <Card className="lg:col-span-7 rounded-2xl border bg-card shadow-sm min-h-[420px] hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosGrafico}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {dadosGrafico.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Gasto']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso por categoria */}
              <Card className="lg:col-span-5 rounded-2xl border bg-card shadow-sm min-h-[420px] hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">Progresso das Metas</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {gastosPorCategoria.map((categoria) => (
                    <div key={categoria.categoria} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{categoria.categoria}</span>
                        <div className="flex items-center gap-2">
                          <span className={getStatusColor(categoria.percentual)}>
                            {categoria.percentual.toFixed(0)}%
                          </span>
                          {getStatusIcon(categoria.percentual)}
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(categoria.percentual, 100)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>R$ {categoria.gasto.toLocaleString()}</span>
                        <span>R$ {categoria.meta.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metas" className="space-y-6">
            <Card className="rounded-2xl border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Configuração de Metas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meta-global">Meta Global Mensal</Label>
                    <Input
                      id="meta-global"
                      type="number"
                      value={metaGlobal}
                      onChange={(e) => setMetaGlobal(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metas.map((meta) => (
                    <Card key={meta.id} className="p-4">
                      <div className="space-y-2">
                        <Label>{meta.categoria}</Label>
                        <Input
                          type="number"
                          value={meta.valor}
                          onChange={(e) => {
                            const novasMetas = metas.map(m => 
                              m.id === meta.id 
                                ? { ...m, valor: Number(e.target.value) }
                                : m
                            );
                            setMetas(novasMetas);
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Ideal: {categoriasPadrao.find(c => c.nome === meta.categoria)?.percentualIdeal}% da renda
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="despesas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestão de Despesas</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Despesa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data">Data</Label>
                      <Input
                        id="data"
                        type="date"
                        value={novaDespesa.data}
                        onChange={(e) => setNovaDespesa({...novaDespesa, data: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={novaDespesa.valor}
                        onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select 
                        value={novaDespesa.categoria} 
                        onValueChange={(value) => setNovaDespesa({...novaDespesa, categoria: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriasPadrao.map((cat) => (
                            <SelectItem key={cat.nome} value={cat.nome}>
                              {cat.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descrição da despesa..."
                        value={novaDespesa.descricao}
                        onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAdicionarDespesa} className="w-full">
                      Adicionar Despesa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-2xl border bg-card shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y">
                  {despesas.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhuma despesa cadastrada ainda
                    </div>
                  ) : (
                    despesas.map((despesa) => (
                      <div key={despesa.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{despesa.descricao}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(despesa.data).toLocaleDateString()} • {despesa.categoria}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">R$ {despesa.valor.toLocaleString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExcluirDespesa(despesa.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <Card className="rounded-2xl border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Relatórios Mensais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">R$ {metaGlobal.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Meta Planejada</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">R$ {totalGasto.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Gasto</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className={`text-2xl font-bold ${saldoRestante < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                      R$ {Math.abs(saldoRestante).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {saldoRestante < 0 ? 'Excesso' : 'Economia'}
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{gastosPorCategoria.filter(g => g.percentual > 100).length}</p>
                    <p className="text-sm text-muted-foreground">Categorias Estouradas</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Ranking de Categorias que Mais Estouraram</h3>
                  <div className="space-y-2">
                    {gastosPorCategoria
                      .filter(g => g.percentual > 100)
                      .sort((a, b) => b.percentual - a.percentual)
                      .map((categoria, index) => (
                        <div key={categoria.categoria} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="destructive">{index + 1}º</Badge>
                            <span className="font-medium">{categoria.categoria}</span>
                          </div>
                          <span className="text-destructive font-semibold">
                            +{(categoria.percentual - 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    {gastosPorCategoria.filter(g => g.percentual > 100).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        🎉 Parabéns! Nenhuma categoria estourou a meta este mês.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}