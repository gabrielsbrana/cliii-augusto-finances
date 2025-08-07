import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", receitas: 5000, despesas: 3200, saldo: 1800 },
  { month: "Fev", receitas: 5500, despesas: 3400, saldo: 2100 },
  { month: "Mar", receitas: 5200, despesas: 3800, saldo: 1400 },
  { month: "Abr", receitas: 5800, despesas: 3600, saldo: 2200 },
  { month: "Mai", receitas: 6000, despesas: 3900, saldo: 2100 },
  { month: "Jun", receitas: 5900, despesas: 4100, saldo: 1800 },
];

export function FinancialChart() {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-card-foreground">Evolução Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `R$ ${value.toLocaleString()}`,
                name === "receitas" ? "Receitas" : 
                name === "despesas" ? "Despesas" : "Saldo"
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="receitas" 
              stroke="hsl(var(--success))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--success))" }}
            />
            <Line 
              type="monotone" 
              dataKey="despesas" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--destructive))" }}
            />
            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}