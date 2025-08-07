import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend = "neutral", className }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`card-gradient hover:glow-effect transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground/80">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${getTrendColor()}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getTrendColor()}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}