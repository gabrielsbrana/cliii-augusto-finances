import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Utensils,
  Building,
  Bus,
  Heart,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoriesData = [
  { 
    name: "Alimentação", 
    icon: Utensils, 
    subcategories: ["Mercado", "Restaurante", "Água", "Delivery"],
    meta: 800,
    expanded: true
  },
  { 
    name: "Moradia", 
    icon: Building, 
    subcategories: ["Aluguel", "Condomínio", "Energia", "Água/Esgoto"],
    meta: 1500,
    expanded: true
  },
  { 
    name: "Transporte", 
    icon: Bus, 
    subcategories: ["Combustível", "Uber/Taxi", "Transporte Público", "Manutenção"],
    meta: 400,
    expanded: false
  },
  { 
    name: "Saúde", 
    icon: Heart, 
    subcategories: ["Farmácia", "Médico", "Plano de Saúde", "Exames"],
    meta: 300,
    expanded: false
  },
  { 
    name: "Lazer", 
    icon: Gamepad2, 
    subcategories: ["Cinema", "Streaming", "Restaurantes", "Viagens"],
    meta: 250,
    expanded: false
  }
];

interface ExpenseEntry {
  id: string;
  category: string;
  subcategory: string;
  value: number;
  date: Date;
}

export default function SoicQuickTap() {
  const [timeFilter, setTimeFilter] = useState("2weeks");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [categories, setCategories] = useState(categoriesData);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const { toast } = useToast();

  // Generate days for the spreadsheet
  const getDaysArray = () => {
    const days = [];
    const start = new Date(currentWeekStart);
    const daysToShow = timeFilter === "week" ? 7 : 14;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = getDaysArray();

  // Calculate total spent for a category/subcategory on a specific day
  const getDayTotal = (category: string, subcategory: string, date: Date) => {
    return expenses
      .filter(expense => 
        expense.category === category &&
        expense.subcategory === subcategory &&
        expense.date.toDateString() === date.toDateString()
      )
      .reduce((sum, expense) => sum + expense.value, 0);
  };

  // Calculate category totals and percentages
  const getCategoryStats = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return { total: 0, percentage: 0, status: 'ok' };

    const total = expenses
      .filter(expense => expense.category === categoryName)
      .reduce((sum, expense) => sum + expense.value, 0);

    const percentage = (total / category.meta) * 100;
    
    let status = 'ok';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 80) status = 'warning';

    return { total, percentage, status };
  };

  // Handle expense input
  const handleExpenseInput = (category: string, subcategory: string, date: Date, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue <= 0) return;

    const newExpense: ExpenseEntry = {
      id: Date.now().toString(),
      category,
      subcategory,
      value: numValue,
      date: new Date(date)
    };

    setExpenses(prev => [...prev, newExpense]);
    
    toast({
      title: "Despesa registrada",
      description: `${subcategory}: R$ ${numValue.toFixed(2)}`,
      className: "bg-green-50 border-green-200"
    });
  };

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setCategories(prev => prev.map(cat => 
      cat.name === categoryName 
        ? { ...cat, expanded: !cat.expanded }
        : cat
    ));
  };

  // Navigation functions
  const navigateWeek = (direction: 'prev' | 'next') => {
    const daysToMove = timeFilter === "week" ? 7 : 14;
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? daysToMove : -daysToMove));
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <Card className="rounded-2xl border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                SOIC – Sistema Orçamentário Inteligente ClIII
              </CardTitle>
              <p className="text-muted-foreground">Controle de gastos em formato de planilha financeira</p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Spreadsheet Area */}
            <div className="lg:col-span-3">
              <Card className="rounded-2xl border bg-card shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    {/* Time Filter Controls */}
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="2weeks">2 semanas</SelectItem>
                          <SelectItem value="month">Mês atual</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Filtrar categorias</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <div className="min-w-[800px]">
                      
                      {/* Table Header */}
                      <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] border-b bg-muted/30">
                        <div className="p-3 font-medium text-sm">Categoria / Subcategoria</div>
                        {days.map((day, index) => (
                          <div key={index} className="p-3 text-center font-medium text-sm border-l">
                            {formatDate(day)}
                          </div>
                        ))}
                      </div>

                      {/* Table Body */}
                      {categories.map((category) => (
                        <div key={category.name}>
                          
                          {/* Category Row */}
                          <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] border-b hover:bg-muted/20">
                            <div 
                              className="p-3 flex items-center gap-2 cursor-pointer font-medium bg-muted/50"
                              onClick={() => toggleCategory(category.name)}
                            >
                              <category.icon className="w-4 h-4" />
                              <span>{category.name}</span>
                              {category.expanded ? 
                                <ChevronUp className="w-4 h-4 ml-auto" /> : 
                                <ChevronDown className="w-4 h-4 ml-auto" />
                              }
                            </div>
                            {days.map((day, index) => {
                              const dayTotal = category.subcategories.reduce((sum, sub) => 
                                sum + getDayTotal(category.name, sub, day), 0);
                              return (
                                <div key={index} className="p-3 text-center border-l bg-muted/50">
                                  {dayTotal > 0 && (
                                    <span className="text-sm font-medium">
                                      R$ {dayTotal.toFixed(0)}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Subcategory Rows */}
                          {category.expanded && category.subcategories.map((subcategory) => (
                            <div key={subcategory} className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] border-b hover:bg-muted/10">
                              <div className="p-3 pl-8 text-sm text-muted-foreground">
                                {subcategory}
                              </div>
                              {days.map((day, index) => {
                                const dayTotal = getDayTotal(category.name, subcategory, day);
                                return (
                                  <div key={index} className="p-2 border-l">
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="h-8 text-center text-sm"
                                      onBlur={(e) => {
                                        if (e.target.value) {
                                          handleExpenseInput(category.name, subcategory, day, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          const target = e.target as HTMLInputElement;
                                          if (target.value) {
                                            handleExpenseInput(category.name, subcategory, day, target.value);
                                            target.value = '';
                                          }
                                        }
                                      }}
                                    />
                                    {dayTotal > 0 && (
                                      <div className="text-xs text-center mt-1 text-muted-foreground">
                                        R$ {dayTotal.toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border bg-card shadow-sm sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Resumo por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category) => {
                    const stats = getCategoryStats(category.name);
                    return (
                      <div key={category.name} className="p-4 rounded-lg border bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{category.name}</span>
                          </div>
                          {getStatusIcon(stats.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Gasto:</span>
                            <span className="font-medium">R$ {stats.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Meta:</span>
                            <span>R$ {category.meta.toFixed(2)}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                stats.status === 'danger' ? 'bg-red-500' :
                                stats.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span>{stats.percentage.toFixed(1)}% usado</span>
                            <span className="font-medium">
                              R$ {(category.meta - stats.total).toFixed(2)} restante
                            </span>
                          </div>
                          
                          {stats.status !== 'ok' && (
                            <p className={`text-xs ${
                              stats.status === 'danger' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {stats.status === 'danger' 
                                ? '⚠️ Meta ultrapassada!' 
                                : '⚠️ Atenção: 80% da meta atingida'
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}