import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebtPayments, CreateDebtPaymentData } from '@/hooks/useDebtPayments';
import { format } from 'date-fns';

interface DebtPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  debtId: string;
  debtInfo: {
    instituicao: string;
    valor_parcela: number;
  };
}

export function DebtPaymentForm({ isOpen, onClose, debtId, debtInfo }: DebtPaymentFormProps) {
  const { createPayment } = useDebtPayments();
  const [formData, setFormData] = useState<CreateDebtPaymentData>({
    debt_id: debtId,
    data_pagamento: format(new Date(), 'yyyy-MM-dd'),
    valor_pago: debtInfo.valor_parcela,
    status: 'em_dia',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPayment.mutateAsync(formData);
    onClose();
    setFormData({
      debt_id: debtId,
      data_pagamento: format(new Date(), 'yyyy-MM-dd'),
      valor_pago: debtInfo.valor_parcela,
      status: 'em_dia',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Pagamento - {debtInfo.instituicao}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data_pagamento">Data do Pagamento</Label>
            <Input
              id="data_pagamento"
              type="date"
              value={formData.data_pagamento}
              onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_pago">Valor Pago</Label>
            <Input
              id="valor_pago"
              type="number"
              step="0.01"
              value={formData.valor_pago}
              onChange={(e) => setFormData({ ...formData, valor_pago: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'em_dia' | 'atraso') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em_dia">Em Dia</SelectItem>
                <SelectItem value="atraso">Atraso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createPayment.isPending}>
              {createPayment.isPending ? 'Registrando...' : 'Registrar Pagamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}