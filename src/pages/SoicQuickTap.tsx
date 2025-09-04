import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  Zap, 
  Wifi, 
  ShoppingCart, 
  Car, 
  Home, 
  Pill, 
  UtensilsCrossed,
  Utensils,
  Building,
  Bus,
  Receipt,
  Heart,
  Gamepad2,
  GraduationCap,
  CreditCard,
  MoreHorizontal,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const quickButtons = [
  { label: "Água", icon: Droplets, category: "Contas", value: "15.00" },
  { label: "Luz", icon: Zap, category: "Contas", value: "120.00" },
  { label: "Internet", icon: Wifi, category: "Contas", value: "80.00" },
  { label: "Mercado", icon: ShoppingCart, category: "Alimentação", value: "150.00" },
  { label: "Uber", icon: Car, category: "Transporte", value: "25.00" },
  { label: "Aluguel", icon: Home, category: "Moradia", value: "1200.00" },
  { label: "Farmácia", icon: Pill, category: "Saúde", value: "45.00" },
  { label: "Restaurante", icon: UtensilsCrossed, category: "Alimentação", value: "65.00" }
];

const categories = [
  { name: "Alimentação", icon: Utensils, color: "bg-green-100 text-green-700 border-green-200" },
  { name: "Moradia", icon: Building, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Transporte", icon: Bus, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "Contas", icon: Receipt, color: "bg-orange-100 text-orange-700 border-orange-200" },
  { name: "Saúde", icon: Heart, color: "bg-red-100 text-red-700 border-red-200" },
  { name: "Lazer", icon: Gamepad2, color: "bg-pink-100 text-pink-700 border-pink-200" },
  { name: "Educação", icon: GraduationCap, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "Dívidas", icon: CreditCard, color: "bg-gray-100 text-gray-700 border-gray-200" },
  { name: "Outros", icon: MoreHorizontal, color: "bg-slate-100 text-slate-700 border-slate-200" }
];

interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: Date;
}

export default function SoicQuickTap() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categoriaSugerida, setCategoriaSugerida] = useState("");
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const { toast } = useToast();

  // Sugestão automática de categoria baseada na descrição
  useEffect(() => {
    const texto = descricao.toLowerCase();
    
    const sugestoes = {
      "água": "Contas",
      "luz": "Contas",
      "internet": "Contas",
      "mercado": "Alimentação",
      "uber": "Transporte",
      "aluguel": "Moradia",
      "farmácia": "Saúde",
      "restaurante": "Alimentação",
      "comida": "Alimentação",
      "gasolina": "Transporte",
      "médico": "Saúde",
      "cinema": "Lazer",
      "curso": "Educação"
    };

    for (const [palavra, categoria] of Object.entries(sugestoes)) {
      if (texto.includes(palavra)) {
        setCategoriaSugerida(categoria);
        if (!categoriaSelecionada) {
          setCategoriaSelecionada(categoria);
        }
        return;
      }
    }
    
    if (!categoriaSelecionada) {
      setCategoriaSugerida("");
    }
  }, [descricao, categoriaSelecionada]);

  const handleQuickButton = (button: typeof quickButtons[0]) => {
    setDescricao(button.label);
    setValor(button.value);
    setCategoriaSelecionada(button.category);
  };

  const handleSalvar = () => {
    if (!descricao || !valor || !categoriaSelecionada) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha descrição, valor e categoria.",
        variant: "destructive"
      });
      return;
    }

    const novoLancamento: Lancamento = {
      id: Date.now().toString(),
      descricao,
      valor: parseFloat(valor.replace(",", ".")),
      categoria: categoriaSelecionada,
      data: new Date()
    };

    setLancamentos(prev => [novoLancamento, ...prev.slice(0, 9)]);
    
    // Limpar campos
    setDescricao("");
    setValor("");
    setCategoriaSelecionada("");
    setCategoriaSugerida("");

    toast({
      title: "Lançamento salvo!",
      description: `${descricao} - R$ ${valor}`,
      className: "bg-green-50 border-green-200"
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : MoreHorizontal;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] px-4 md:px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <Card className="rounded-2xl border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                SOIC – Quick Tap
              </CardTitle>
              <p className="text-muted-foreground">Registre seus gastos em menos de 5 segundos</p>
            </CardHeader>
          </Card>

          {/* Formulário Principal */}
          <Card className="rounded-2xl border bg-card shadow-sm">
            <CardContent className="p-6 space-y-6">
              
              {/* Campo Descrição */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descrição</label>
                <Input
                  placeholder="Ex: Almoço no restaurante..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="h-12 text-base"
                />
                {categoriaSugerida && (
                  <p className="text-sm text-muted-foreground">
                    Sugestão automática: <span className="text-primary font-medium">{categoriaSugerida}</span>
                  </p>
                )}
              </div>

              {/* Botões Rápidos */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Atalhos Rápidos</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickButtons.map((button, index) => {
                    const IconComponent = button.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex flex-col gap-2 p-3 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        onClick={() => handleQuickButton(button)}
                      >
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs font-medium">{button.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Campo Valor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valor</label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="h-12 text-base"
                  step="0.01"
                />
              </div>

              {/* Chips de Categoria */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = categoriaSelecionada === category.name;
                    
                    return (
                      <Badge
                        key={category.name}
                        variant={isSelected ? "default" : "secondary"}
                        className={`cursor-pointer px-3 py-2 rounded-lg border transition-all hover:scale-105 ${
                          isSelected 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-background hover:bg-muted border-border"
                        }`}
                        onClick={() => setCategoriaSelecionada(category.name)}
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {category.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Botão Salvar */}
              <Button
                onClick={handleSalvar}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all"
                disabled={!descricao || !valor || !categoriaSelecionada}
              >
                Salvar Lançamento
              </Button>
            </CardContent>
          </Card>

          {/* Lançamentos Recentes */}
          {lancamentos.length > 0 && (
            <Card className="rounded-2xl border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Lançamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lancamentos.map((lancamento) => {
                  const IconComponent = getCategoryIcon(lancamento.categoria);
                  return (
                    <div
                      key={lancamento.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lancamento.descricao}</p>
                          <p className="text-sm text-muted-foreground">{lancamento.categoria}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">
                          -R$ {lancamento.valor.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lancamento.data.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}