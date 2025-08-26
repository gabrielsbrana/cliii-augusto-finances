-- Criar tabela de categorias hierárquicas
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria_pai_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
  cor TEXT DEFAULT '#3B82F6',
  icone TEXT DEFAULT 'folder',
  ativa BOOLEAN DEFAULT true,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias
CREATE POLICY "Users can view their own categorias" 
ON public.categorias 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categorias" 
ON public.categorias 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias" 
ON public.categorias 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias" 
ON public.categorias 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar tabela de receitas melhorada
CREATE TABLE public.receitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor_bruto DECIMAL(15,2) NOT NULL,
  valor_liquido DECIMAL(15,2) NOT NULL,
  descontos DECIMAL(15,2) DEFAULT 0,
  tipo TEXT NOT NULL CHECK (tipo IN ('fixa', 'variavel')),
  periodicidade TEXT NOT NULL CHECK (periodicidade IN ('mensal', 'quinzenal', 'anual', 'unica')),
  data_recebimento DATE NOT NULL,
  proxima_data DATE,
  observacoes TEXT,
  comprovante_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para receitas
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;

-- Políticas para receitas
CREATE POLICY "Users can view their own receitas" 
ON public.receitas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receitas" 
ON public.receitas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receitas" 
ON public.receitas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receitas" 
ON public.receitas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar tabela de despesas melhorada
CREATE TABLE public.despesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('fixa', 'variavel')),
  periodicidade TEXT NOT NULL CHECK (periodicidade IN ('mensal', 'quinzenal', 'anual', 'unica')),
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  proxima_data DATE,
  recorrente BOOLEAN DEFAULT false,
  observacoes TEXT,
  comprovante_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para despesas
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

-- Políticas para despesas
CREATE POLICY "Users can view their own despesas" 
ON public.despesas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own despesas" 
ON public.despesas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own despesas" 
ON public.despesas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own despesas" 
ON public.despesas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar buckets para armazenamento de comprovantes
INSERT INTO storage.buckets (id, name, public) VALUES ('comprovantes', 'comprovantes', false);

-- Políticas de storage para comprovantes
CREATE POLICY "Users can view their own comprovantes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'comprovantes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own comprovantes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'comprovantes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own comprovantes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'comprovantes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own comprovantes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'comprovantes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receitas_updated_at
  BEFORE UPDATE ON public.receitas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_despesas_updated_at
  BEFORE UPDATE ON public.despesas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir categorias padrão
INSERT INTO public.categorias (nome, tipo, user_id) VALUES 
  ('Salário', 'receita', '00000000-0000-0000-0000-000000000000'),
  ('Freelance', 'receita', '00000000-0000-0000-0000-000000000000'),
  ('Investimentos', 'receita', '00000000-0000-0000-0000-000000000000'),
  ('Moradia', 'despesa', '00000000-0000-0000-0000-000000000000'),
  ('Alimentação', 'despesa', '00000000-0000-0000-0000-000000000000'),
  ('Transporte', 'despesa', '00000000-0000-0000-0000-000000000000'),
  ('Saúde', 'despesa', '00000000-0000-0000-0000-000000000000'),
  ('Lazer', 'despesa', '00000000-0000-0000-0000-000000000000'),
  ('Educação', 'despesa', '00000000-0000-0000-0000-000000000000');

-- Índices para performance
CREATE INDEX idx_categorias_user_tipo ON public.categorias(user_id, tipo);
CREATE INDEX idx_receitas_user_data ON public.receitas(user_id, data_recebimento);
CREATE INDEX idx_despesas_user_data ON public.despesas(user_id, data_vencimento);
CREATE INDEX idx_receitas_categoria ON public.receitas(categoria_id);
CREATE INDEX idx_despesas_categoria ON public.despesas(categoria_id);