import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useCategorias } from "@/hooks/useCategorias";
import { supabase } from "@/integrations/supabase/client";

const Receitas = () => {
  const { categorias, getCategoriasFlatList } = useCategorias('receita');
  const [formData, setFormData] = useState({
    descricao: "",
    valor_bruto: "",
    valor_liquido: "",
    descontos: "",
    tipo: "",
    periodicidade: "",
    data_recebimento: "",
    categoria_id: "",
    observacoes: "",
    comprovante: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor_bruto || !formData.data_recebimento || !formData.categoria_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      let comprovante_url = null;
      if (formData.comprovante) {
        const fileExt = formData.comprovante.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('comprovantes')
          .upload(fileName, formData.comprovante);

        if (uploadError) throw uploadError;
        comprovante_url = fileName;
      }

      const { error } = await supabase.from('receitas').insert([{
        user_id: user.id,
        descricao: formData.descricao,
        valor_bruto: parseFloat(formData.valor_bruto),
        valor_liquido: parseFloat(formData.valor_liquido),
        descontos: parseFloat(formData.descontos) || 0,
        tipo: formData.tipo,
        periodicidade: formData.periodicidade,
        data_recebimento: formData.data_recebimento,
        categoria_id: formData.categoria_id,
        observacoes: formData.observacoes,
        comprovante_url
      }]);

      if (error) throw error;
      
      toast.success("Receita adicionada com sucesso!");
      setFormData({
        descricao: "",
        valor_bruto: "",
        valor_liquido: "",
        descontos: "",
        tipo: "",
        periodicidade: "",
        data_recebimento: "",
        categoria_id: "",
        observacoes: "",
        comprovante: null
      });
    } catch (error: any) {
      toast.error("Erro ao salvar receita: " + error.message);
    }
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