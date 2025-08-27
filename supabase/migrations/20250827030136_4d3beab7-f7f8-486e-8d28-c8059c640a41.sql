-- Create debts table for debt management
CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  instituicao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('consignado', 'financiamento', 'cartao')),
  juros_a_mensal NUMERIC(5,2) NOT NULL DEFAULT 0,
  parcelas_totais INTEGER NOT NULL,
  valor_contratado NUMERIC(12,2) NOT NULL,
  valor_parcela NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'quitado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create debt_payments table for tracking payments
CREATE TABLE public.debt_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  data_pagamento DATE NOT NULL,
  valor_pago NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_dia' CHECK (status IN ('em_dia', 'atraso')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for debts
CREATE POLICY "Users can view their own debts" 
ON public.debts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debts" 
ON public.debts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts" 
ON public.debts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts" 
ON public.debts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for debt_payments
CREATE POLICY "Users can view their own debt payments" 
ON public.debt_payments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.debts 
  WHERE debts.id = debt_payments.debt_id 
  AND debts.user_id = auth.uid()
));

CREATE POLICY "Users can create their own debt payments" 
ON public.debt_payments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.debts 
  WHERE debts.id = debt_payments.debt_id 
  AND debts.user_id = auth.uid()
));

CREATE POLICY "Users can update their own debt payments" 
ON public.debt_payments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.debts 
  WHERE debts.id = debt_payments.debt_id 
  AND debts.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own debt payments" 
ON public.debt_payments 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.debts 
  WHERE debts.id = debt_payments.debt_id 
  AND debts.user_id = auth.uid()
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debt_payments_updated_at
BEFORE UPDATE ON public.debt_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_debts_user_id ON public.debts(user_id);
CREATE INDEX idx_debts_status ON public.debts(status);
CREATE INDEX idx_debt_payments_debt_id ON public.debt_payments(debt_id);
CREATE INDEX idx_debt_payments_data_pagamento ON public.debt_payments(data_pagamento);