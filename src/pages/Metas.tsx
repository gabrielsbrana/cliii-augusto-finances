import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Metas = () => {
  const [metas, setMetas] = useState([
    {
      id: 1,
      titulo: "Economia Mensal",
      valorMeta: 1000,
      valorAtual: 650,
      categoria: "economia",
      prazo: "2024-02-29",
      status: "em_andamento"
    },
    {
      id: 2,
      titulo: "Reduzir Gastos com Lazer",
      valorMeta: 500,
      valorAtual: 320,
      categoria: "reducao",
      prazo: "2024-02-29",
      status: "alcancada"
    }
  ]);

  const [novaMeta, setNovaMeta] = useState({
    titulo: "",
    valorMeta: "",
    categoria: "",
    prazo: "",
    descricao: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaMeta.titulo || !novaMeta.valorMeta || !novaMeta.categoria || !novaMeta.prazo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const novaMetaObj = {
      id: Date.now(),
      titulo: novaMeta.titulo,
      valorMeta: Number(novaMeta.valorMeta),
      valorAtual: 0,
      categoria: novaMeta.categoria,
      prazo: novaMeta.prazo,
      status: "em_andamento"
    };

    setMetas(prev => [...prev, novaMetaObj]);
    toast.success("Meta criada com sucesso!");
    
    setNovaMeta({
      titulo: "",
      valorMeta: "",
      categoria: "",
      prazo: "",
      descricao: ""
    });
  };

  const calcularProgresso = (atual: number, meta: number) => {
    return Math.min((atual / meta) * 100, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "alcancada":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "em_risco":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Metas Financeiras
          </h1>
          <p className="text-muted-foreground">
            Defina e acompanhe suas metas de economia e controle de gastos
          </p>
        </div>

        {/* Metas Existentes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metas.map((meta) => (
            <Card key={meta.id} className="card-gradient animate-scale-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                    {getStatusIcon(meta.status)}
                    {meta.titulo}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-card-foreground font-medium">
                      R$ {meta.valorAtual.toLocaleString()} / R$ {meta.valorMeta.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={calcularProgresso(meta.valorAtual, meta.valorMeta)} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {calcularProgresso(meta.valorAtual, meta.valorMeta).toFixed(1)}% concluído
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prazo:</span>
                  <span className="text-card-foreground">
                    {new Date(meta.prazo).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulário Nova Meta */}
        <Card className="card-gradient animate-slide-up">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Criar Nova Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-card-foreground">
                    Título da Meta *
                  </Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Economizar para viagem"
                    value={novaMeta.titulo}
                    onChange={(e) => setNovaMeta(prev => ({ ...prev, titulo: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-card-foreground">
                    Valor da Meta *
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={novaMeta.valorMeta}
                    onChange={(e) => setNovaMeta(prev => ({ ...prev, valorMeta: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Tipo de Meta *</Label>
                  <Select 
                    value={novaMeta.categoria} 
                    onValueChange={(value) => setNovaMeta(prev => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economia">Economia</SelectItem>
                      <SelectItem value="reducao">Redução de Gastos</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="emergencia">Reserva de Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazo" className="text-card-foreground">
                    Prazo *
                  </Label>
                  <Input
                    id="prazo"
                    type="date"
                    value={novaMeta.prazo}
                    onChange={(e) => setNovaMeta(prev => ({ ...prev, prazo: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-card-foreground">
                  Descrição (opcional)
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva sua meta e estratégia..."
                  value={novaMeta.descricao}
                  onChange={(e) => setNovaMeta(prev => ({ ...prev, descricao: e.target.value }))}
                  className="bg-input border-border min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="financial-gradient text-black font-semibold hover:opacity-90 button-hover"
                >
                  Criar Meta
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setNovaMeta({ titulo: "", valorMeta: "", categoria: "", prazo: "", descricao: "" })}
                  className="button-hover"
                >
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Metas;