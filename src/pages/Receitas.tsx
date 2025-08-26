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
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-card-foreground">
                  Descrição *
                </Label>
                <Input
                  id="descricao"
                  placeholder="Descrição da receita"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="valor_bruto" className="text-card-foreground">
                    Valor Bruto *
                  </Label>
                  <Input
                    id="valor_bruto"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valor_bruto}
                    onChange={(e) => handleInputChange("valor_bruto", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descontos" className="text-card-foreground">
                    Descontos
                  </Label>
                  <Input
                    id="descontos"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.descontos}
                    onChange={(e) => handleInputChange("descontos", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_liquido" className="text-card-foreground">
                    Valor Líquido *
                  </Label>
                  <Input
                    id="valor_liquido"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valor_liquido}
                    onChange={(e) => handleInputChange("valor_liquido", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-card-foreground">
                    Tipo *
                  </Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => handleInputChange("tipo", value)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixa">Fixa</SelectItem>
                      <SelectItem value="variavel">Variável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">
                    Periodicidade *
                  </Label>
                  <Select 
                    value={formData.periodicidade} 
                    onValueChange={(value) => handleInputChange("periodicidade", value)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Selecione a periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unica">Única</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data_recebimento" className="text-card-foreground">
                    Data de Recebimento *
                  </Label>
                  <Input
                    id="data_recebimento"
                    type="date"
                    value={formData.data_recebimento}
                    onChange={(e) => handleInputChange("data_recebimento", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">
                    Categoria *
                  </Label>
                  <Select 
                    value={formData.categoria_id} 
                    onValueChange={(value) => handleInputChange("categoria_id", value)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoriasFlatList().map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {"  ".repeat(categoria.nivel) + categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comprovante" className="text-card-foreground">
                  Comprovante
                </Label>
                <Input
                  id="comprovante"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData(prev => ({ ...prev, comprovante: file }));
                  }}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-card-foreground">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
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
                  onClick={() => setFormData({ 
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
                  })}
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