import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDebts, CreateDebtData, Debt } from '@/hooks/useDebts';
import { useDebtPayments } from '@/hooks/useDebtPayments';
import { DebtPaymentForm } from '@/components/Dashboard/DebtPaymentForm';
import { Plus, CreditCard, Building, FileText, DollarSign, Check, X, Eye, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dividas() {
  const { debts, isLoading, createDebt, markAsQuitado } = useDebts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);
  const [formData, setFormData] = useState<CreateDebtData>({
    instituicao: '',
    tipo: 'cartao',
    juros_a_mensal: 0,
    parcelas_totais: 1,
    valor_contratado: 0,
    valor_parcela: 0,
    observacoes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDebt.mutateAsync(formData);
    setIsFormOpen(false);
    setFormData({
      instituicao: '',
      tipo: 'cartao',
      juros_a_mensal: 0,
      parcelas_totais: 1,
      valor_contratado: 0,
      valor_parcela: 0,
      observacoes: '',
    });
  };

  const handleMarkAsQuitado = async (id: string) => {
    await markAsQuitado.mutateAsync(id);
  };

  const handleOpenPaymentForm = (debt: Debt) => {
    setSelectedDebtForPayment(debt);
    setIsPaymentFormOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDebtTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'cartao':
        return <CreditCard className="h-4 w-4" />;
      case 'financiamento':
        return <Building className="h-4 w-4" />;
      case 'consignado':
        return <FileText className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getDebtTypeLabel = (tipo: string) => {
    const labels = {
      cartao: 'Cartão de Crédito',
      financiamento: 'Financiamento',
      consignado: 'Consignado',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const calculateDebtSummary = () => {
    const activeDebts = debts.filter(debt => debt.status === 'ativo');
    const totalContracted = activeDebts.reduce((sum, debt) => sum + debt.valor_contratado, 0);
    const totalMonthlyPayment = activeDebts.reduce((sum, debt) => sum + debt.valor_parcela, 0);
    
    return {
      totalDebts: activeDebts.length,
      totalContracted,
      totalMonthlyPayment,
    };
  };

  const summary = calculateDebtSummary();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Dívidas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie suas dívidas</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Dívida
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dívidas Ativas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalDebts}</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contratado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(summary.totalContracted)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamento Mensal</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {formatCurrency(summary.totalMonthlyPayment)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Dívidas</CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma dívida cadastrada ainda.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor Contratado</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Juros a.m.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">{debt.instituicao}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDebtTypeIcon(debt.tipo)}
                          {getDebtTypeLabel(debt.tipo)}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(debt.valor_contratado)}</TableCell>
                      <TableCell>{formatCurrency(debt.valor_parcela)}</TableCell>
                      <TableCell>{debt.juros_a_mensal}%</TableCell>
                      <TableCell>
                        <Badge variant={debt.status === 'ativo' ? 'destructive' : 'default'}>
                          {debt.status === 'ativo' ? 'Ativo' : 'Quitado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDebt(debt.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {debt.status === 'ativo' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenPaymentForm(debt)}
                              >
                                <Calculator className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsQuitado(debt.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Debt Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Dívida</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituicao">Instituição</Label>
                  <Input
                    id="instituicao"
                    value={formData.instituicao}
                    onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: 'consignado' | 'financiamento' | 'cartao') =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="financiamento">Financiamento</SelectItem>
                      <SelectItem value="consignado">Consignado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_contratado">Valor Contratado</Label>
                  <Input
                    id="valor_contratado"
                    type="number"
                    step="0.01"
                    value={formData.valor_contratado}
                    onChange={(e) => setFormData({ ...formData, valor_contratado: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor_parcela">Valor da Parcela</Label>
                  <Input
                    id="valor_parcela"
                    type="number"
                    step="0.01"
                    value={formData.valor_parcela}
                    onChange={(e) => setFormData({ ...formData, valor_parcela: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parcelas_totais">Número de Parcelas</Label>
                  <Input
                    id="parcelas_totais"
                    type="number"
                    value={formData.parcelas_totais}
                    onChange={(e) => setFormData({ ...formData, parcelas_totais: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="juros_a_mensal">Juros a.m. (%)</Label>
                  <Input
                    id="juros_a_mensal"
                    type="number"
                    step="0.01"
                    value={formData.juros_a_mensal}
                    onChange={(e) => setFormData({ ...formData, juros_a_mensal: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createDebt.isPending}>
                  {createDebt.isPending ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payment Form Dialog */}
        {selectedDebtForPayment && (
          <DebtPaymentForm
            isOpen={isPaymentFormOpen}
            onClose={() => {
              setIsPaymentFormOpen(false);
              setSelectedDebtForPayment(null);
            }}
            debtId={selectedDebtForPayment.id}
            debtInfo={{
              instituicao: selectedDebtForPayment.instituicao,
              valor_parcela: selectedDebtForPayment.valor_parcela,
            }}
          />
        )}
      </div>
    </Layout>
  );
}