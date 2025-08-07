import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Alimentação", value: 1200, color: "hsl(220, 100%, 60%)" },
  { name: "Transporte", value: 800, color: "hsl(45, 100%, 65%)" },
  { name: "Saúde", value: 600, color: "hsl(120, 60%, 50%)" },
  { name: "Lazer", value: 400, color: "hsl(280, 60%, 60%)" },
  { name: "Outros", value: 300, color: "hsl(15, 80%, 60%)" },
];

export function ExpenseChart() {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-card-foreground">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Valor"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))"
              }}
            />
            <Legend 
              wrapperStyle={{ color: "hsl(var(--card-foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}