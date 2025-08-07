import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const Receitas = () => {
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
    toast.success("Receita adicionada com sucesso!");
    
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
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Nova Receita
          </h1>
          <p className="text-muted-foreground">
            Adicione uma nova receita ao seu controle financeiro
          </p>
        </div>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-card-foreground">Dados da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-card-foreground">
                    Valor *
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => handleInputChange("valor", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data" className="text-card-foreground">
                    Data *
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange("data", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">
                  Categoria *
                </Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => handleInputChange("categoria", value)}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salario">Salário</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                    <SelectItem value="bonus">Bônus</SelectItem>
                    <SelectItem value="extra">Renda Extra</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-card-foreground">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição opcional da receita"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  className="bg-input border-border min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="financial-gradient text-black font-semibold hover:opacity-90"
                >
                  Adicionar Receita
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setFormData({ valor: "", data: "", categoria: "", descricao: "" })}
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

export default Receitas;