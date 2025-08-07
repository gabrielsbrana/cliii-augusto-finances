import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Clock, Star, TrendingUp } from "lucide-react";

const dicasFinanceiras = [
  {
    id: 1,
    titulo: "Regra dos 50-30-20",
    categoria: "Orçamento",
    tempo: "5 min",
    nivel: "Iniciante",
    descricao: "Aprenda a dividir sua renda: 50% necessidades, 30% desejos, 20% poupança e investimentos.",
    conteudo: `
      A regra 50-30-20 é uma das formas mais simples de organizar seu orçamento:
      
      • 50% para NECESSIDADES: moradia, alimentação, transporte, saúde
      • 30% para DESEJOS: lazer, restaurantes, compras não essenciais
      • 20% para FUTURO: poupança, investimentos, aposentadoria
      
      Exemplo prático:
      Renda de R$ 5.000:
      - R$ 2.500 para necessidades
      - R$ 1.500 para desejos
      - R$ 1.000 para poupança/investimentos
    `,
    dicas: [
      "Comece classificando todos seus gastos nas 3 categorias",
      "Se os gastos estão desequilibrados, corte primeiro os 'desejos'",
      "Automatize a poupança para garantir os 20%"
    ]
  },
  {
    id: 2,
    titulo: "Eliminar Dívidas do Cartão",
    categoria: "Dívidas",
    tempo: "7 min",
    nivel: "Intermediário",
    descricao: "Estratégias eficazes para sair do vermelho e evitar juros altos do cartão de crédito.",
    conteudo: `
      Dívidas de cartão são as mais caras! Juros podem passar de 400% ao ano.
      
      PLANO DE AÇÃO:
      1. PARE de usar o cartão imediatamente
      2. Negocie com o banco (parcelamento, desconto à vista)
      3. Concentre toda renda extra no pagamento
      4. Use o método "bola de neve": quite primeiro as menores dívidas
      
      DICA DE OURO: Pague sempre mais que o mínimo!
    `,
    dicas: [
      "Negocie sempre - bancos preferem receber menos a não receber",
      "Considere empréstimo pessoal para quitar cartão (juros menores)",
      "Use débito automático para nunca atrasar parcelas"
    ]
  },
  {
    id: 3,
    titulo: "Começar a Investir",
    categoria: "Investimentos",
    tempo: "10 min",
    nivel: "Iniciante",
    descricao: "Primeiros passos no mundo dos investimentos, do Tesouro Direto aos fundos de investimento.",
    conteudo: `
      ANTES DE INVESTIR:
      1. Tenha uma reserva de emergência (6 meses de gastos)
      2. Quite dívidas com juros altos
      3. Defina seus objetivos e prazo
      
      INVESTIMENTOS PARA INICIANTES:
      • Poupança: Só para emergência (baixo rendimento)
      • Tesouro Direto: Renda fixa, garantido pelo governo
      • CDB: Renda fixa de bancos, alguns garantidos pelo FGC
      • Fundos DI: Diversificação automática em renda fixa
      
      REGRA BÁSICA: Comece conservador e vá aprendendo!
    `,
    dicas: [
      "Abra conta em corretora com taxa zero",
      "Comece com R$ 100 no Tesouro Direto",
      "Estude 30 min por semana sobre investimentos"
    ]
  },
  {
    id: 4,
    titulo: "Reserva de Emergência",
    categoria: "Planejamento",
    tempo: "6 min",
    nivel: "Iniciante",
    descricao: "Como e por que construir uma reserva financeira para imprevistos.",
    conteudo: `
      A reserva de emergência é SUA PRIORIDADE NÚMERO 1!
      
      QUANTO GUARDAR:
      • Funcionário CLT: 6 meses de gastos
      • Autônomo/Freelancer: 12 meses de gastos
      • Dependentes: +3 meses por dependente
      
      ONDE INVESTIR A RESERVA:
      • Precisa de liquidez imediata
      • Poupança, Tesouro Selic, CDB com liquidez diária
      • NÃO invista em ações ou fundos de ações
      
      COMO FORMAR:
      Automatize! Separe 20% da renda mensalmente.
    `,
    dicas: [
      "Use conta separada só para emergência",
      "Considere 'emergência' só: desemprego, doença, emergência familiar",
      "Reponha sempre que usar"
    ]
  }
];

const Dicas = () => {
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Iniciante": return "bg-success/20 text-success";
      case "Intermediário": return "bg-warning/20 text-warning";
      case "Avançado": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "Orçamento": return <TrendingUp className="h-4 w-4" />;
      case "Dívidas": return <Star className="h-4 w-4" />;
      case "Investimentos": return <TrendingUp className="h-4 w-4" />;
      case "Planejamento": return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dicas Financeiras
          </h1>
          <p className="text-muted-foreground">
            Aprenda conceitos fundamentais para uma vida financeira saudável
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {dicasFinanceiras.map((dica, index) => (
            <Card key={dica.id} className="card-gradient animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoriaIcon(dica.categoria)}
                    <Badge variant="outline" className="text-xs">
                      {dica.categoria}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getNivelColor(dica.nivel)}>
                      {dica.nivel}
                    </Badge>
                  </div>
                </div>
                
                <CardTitle className="text-xl text-card-foreground mb-2">
                  {dica.titulo}
                </CardTitle>
                
                <p className="text-muted-foreground text-sm mb-3">
                  {dica.descricao}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {dica.tempo}
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    Leitura
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <div className="text-card-foreground whitespace-pre-line text-sm leading-relaxed">
                    {dica.conteudo}
                  </div>
                </div>
                
                {dica.dicas && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-card-foreground text-sm">Dicas Práticas:</h4>
                    <ul className="space-y-1">
                      {dica.dicas.map((dicaPratica, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{dicaPratica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Card de Sugestão */}
        <Card className="card-gradient animate-slide-up">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <BookOpen className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Quer aprender mais?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Converse com seu consultor financeiro para dicas personalizadas baseadas no seu perfil e objetivos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dicas;