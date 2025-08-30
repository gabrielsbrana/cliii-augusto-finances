import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const Despesas = () => {
  const [formData, setFormData] = useState({
    valor: "",
    data: "",
    categoria: "",
    descricao: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || !formData.data || !formData.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Here you would save to database
    toast.success("Despesa adicionada com sucesso!");
    
    // Reset form
    setFormData({
      valor: "",
      data: "",
      categoria: "",
      descricao: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Nova Despesa
          </h1>
          <p className="text-muted-foreground">
            Adicione uma nova despesa ao seu controle financeiro
          </p>
        </div>

        <Card className="card-gradient min-h-[calc(100vh-16rem)] border-border/50 shadow-card">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-card-foreground">Dados da Despesa</CardTitle>
          </CardHeader>
          <CardContent className="relative h-full p-8">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              {/* Grid principal - 2 colunas em desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Coluna esquerda - Valor e Data */}
                <div className="space-y-6 border-r-0 lg:border-r border-border/30 pr-0 lg:pr-8">
                  <div className="space-y-3">
                    <Label htmlFor="valor" className="text-card-foreground font-medium text-base">
                      Valor *
                    </Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.valor}
                      onChange={(e) => handleInputChange("valor", e.target.value)}
                      className="bg-input border-border h-12 text-lg font-mono"
                    />
                  </div>

                  <div className="space-y-3 pb-6 border-b border-border/20">
                    <Label htmlFor="data" className="text-card-foreground font-medium text-base">
                      Data *
                    </Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => handleInputChange("data", e.target.value)}
                      className="bg-input border-border h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-card-foreground font-medium text-base">
                      Categoria *
                    </Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => handleInputChange("categoria", value)}
                    >
                      <SelectTrigger className="bg-input border-border h-12">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="lazer">Lazer</SelectItem>
                        <SelectItem value="moradia">Moradia</SelectItem>
                        <SelectItem value="vestuario">Vestuário</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Coluna direita - Descrição expandida */}
                <div className="space-y-3 flex flex-col">
                  <Label htmlFor="descricao" className="text-card-foreground font-medium text-base">
                    Descrição
                  </Label>
                  <Textarea
                    id="descricao"
                    placeholder="Adicione uma descrição detalhada da despesa, como local, motivo, ou qualquer observação relevante..."
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    className="bg-input border-border flex-1 min-h-[300px] lg:min-h-[400px] resize-none"
                  />
                </div>
              </div>

              {/* Área de botões - fixada na parte inferior */}
              <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-border/30">
                <Button 
                  type="submit" 
                  className="financial-gradient text-black font-semibold hover:opacity-90 h-12 flex-1 sm:flex-none sm:ml-auto sm:min-w-[200px]"
                >
                  Adicionar Despesa
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setFormData({ valor: "", data: "", categoria: "", descricao: "" })}
                  className="h-12 sm:min-w-[120px]"
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

export default Despesas;