import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Edit, Camera, TrendingUp, Target, Award } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Perfil = () => {
  const [editMode, setEditMode] = useState(false);
  const [perfilData, setPerfilData] = useState({
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    profissao: "Engenheiro",
    renda: "8500",
    objetivos: "Comprar casa própria e criar reserva de emergência",
    foto: ""
  });

  const progressoMensal = {
    economia: 75,
    gastos: 60,
    investimentos: 40,
    metas: 85
  };

  const conquistas = [
    { titulo: "Primeira Meta Alcançada", descricao: "Parabéns por concluir sua primeira meta!", data: "Jan 2024" },
    { titulo: "Economia Consistente", descricao: "3 meses consecutivos economizando", data: "Fev 2024" },
    { titulo: "Controle de Gastos", descricao: "Reduziu gastos desnecessários em 30%", data: "Mar 2024" }
  ];

  const comentariosConsultor = [
    {
      data: "15/01/2024",
      comentario: "Excelente progresso na organização financeira! Continue focado nas metas de curto prazo.",
      consultor: "Ana Paula - Consultora"
    },
    {
      data: "01/02/2024", 
      comentario: "Sugiro aumentar o valor destinado à reserva de emergência para 25% da renda.",
      consultor: "Ana Paula - Consultora"
    }
  ];

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
    setEditMode(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setPerfilData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e mantenha seus dados atualizados
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-gradient animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <Button
                    variant={editMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className="button-hover"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editMode ? "Salvar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto e Nome */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={perfilData.foto} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {perfilData.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {editMode ? (
                      <Input
                        value={perfilData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        className="text-xl font-semibold bg-input border-border"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-card-foreground">{perfilData.nome}</h2>
                    )}
                    <p className="text-muted-foreground">{perfilData.profissao}</p>
                  </div>
                </div>

                {/* Campos */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">E-mail</Label>
                    {editMode ? (
                      <Input
                        type="email"
                        value={perfilData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-input border-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">{perfilData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Telefone</Label>
                    {editMode ? (
                      <Input
                        value={perfilData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                        className="bg-input border-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">{perfilData.telefone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Profissão</Label>
                    {editMode ? (
                      <Input
                        value={perfilData.profissao}
                        onChange={(e) => handleInputChange("profissao", e.target.value)}
                        className="bg-input border-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">{perfilData.profissao}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Renda Mensal</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={perfilData.renda}
                        onChange={(e) => handleInputChange("renda", e.target.value)}
                        className="bg-input border-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">R$ {Number(perfilData.renda).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Objetivos Financeiros</Label>
                  {editMode ? (
                    <Textarea
                      value={perfilData.objetivos}
                      onChange={(e) => handleInputChange("objetivos", e.target.value)}
                      className="bg-input border-border min-h-[80px]"
                      placeholder="Descreva seus objetivos financeiros..."
                    />
                  ) : (
                    <p className="text-muted-foreground">{perfilData.objetivos}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comentários do Consultor */}
            <Card className="card-gradient animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground">Consultor Recomenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comentariosConsultor.map((comentario, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-muted-foreground">{comentario.consultor}</span>
                      <span className="text-xs text-muted-foreground">{comentario.data}</span>
                    </div>
                    <p className="text-card-foreground text-sm">{comentario.comentario}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Progresso e Conquistas */}
          <div className="space-y-6">
            {/* Progresso Mensal */}
            <Card className="card-gradient animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progresso Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Economia</span>
                      <span className="text-card-foreground">{progressoMensal.economia}%</span>
                    </div>
                    <Progress value={progressoMensal.economia} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Controle de Gastos</span>
                      <span className="text-card-foreground">{progressoMensal.gastos}%</span>
                    </div>
                    <Progress value={progressoMensal.gastos} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Investimentos</span>
                      <span className="text-card-foreground">{progressoMensal.investimentos}%</span>
                    </div>
                    <Progress value={progressoMensal.investimentos} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Metas</span>
                      <span className="text-card-foreground">{progressoMensal.metas}%</span>
                    </div>
                    <Progress value={progressoMensal.metas} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conquistas */}
            <Card className="card-gradient animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {conquistas.map((conquista, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                    <Target className="h-5 w-5 text-secondary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground text-sm">{conquista.titulo}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{conquista.descricao}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {conquista.data}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;