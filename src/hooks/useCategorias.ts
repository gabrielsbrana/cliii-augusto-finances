import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  categoria_pai_id?: string;
  cor: string;
  icone: string;
  ativa: boolean;
  subcategorias?: Categoria[];
}

export const useCategorias = (tipo?: 'receita' | 'despesa') => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    try {
      let query = supabase
        .from('categorias')
        .select('*')
        .eq('ativa', true)
        .order('nome');

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Organizar em hierarquia
      const categoriasMap = new Map();
      const categoriasRaiz: Categoria[] = [];

      data?.forEach(cat => {
        categoriasMap.set(cat.id, { ...cat, subcategorias: [] });
      });

      data?.forEach(cat => {
        if (cat.categoria_pai_id) {
          const pai = categoriasMap.get(cat.categoria_pai_id);
          if (pai) {
            pai.subcategorias.push(categoriasMap.get(cat.id));
          }
        } else {
          categoriasRaiz.push(categoriasMap.get(cat.id));
        }
      });

      setCategorias(categoriasRaiz);
    } catch (error: any) {
      toast.error('Erro ao carregar categorias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const criarCategoria = async (categoria: Omit<Categoria, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('categorias')
        .insert([{ ...categoria, user_id: user.id }]);

      if (error) throw error;

      toast.success('Categoria criada com sucesso!');
      fetchCategorias();
    } catch (error: any) {
      toast.error('Erro ao criar categoria: ' + error.message);
    }
  };

  const editarCategoria = async (id: string, categoria: Partial<Categoria>) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .update(categoria)
        .eq('id', id);

      if (error) throw error;

      toast.success('Categoria atualizada com sucesso!');
      fetchCategorias();
    } catch (error: any) {
      toast.error('Erro ao atualizar categoria: ' + error.message);
    }
  };

  const excluirCategoria = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .update({ ativa: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Categoria excluída com sucesso!');
      fetchCategorias();
    } catch (error: any) {
      toast.error('Erro ao excluir categoria: ' + error.message);
    }
  };

  const getCategoriasFlatList = () => {
    const flatList: Array<Categoria & { nivel: number; nomeCompleto: string }> = [];
    
    const adicionarRecursivo = (cats: Categoria[], nivel = 0, prefixo = '') => {
      cats.forEach(cat => {
        const nomeCompleto = prefixo + cat.nome;
        flatList.push({ ...cat, nivel, nomeCompleto });
        if (cat.subcategorias && cat.subcategorias.length > 0) {
          adicionarRecursivo(cat.subcategorias, nivel + 1, nomeCompleto + ' > ');
        }
      });
    };

    adicionarRecursivo(categorias);
    return flatList;
  };

  useEffect(() => {
    fetchCategorias();
  }, [tipo]);

  return {
    categorias,
    loading,
    criarCategoria,
    editarCategoria,
    excluirCategoria,
    fetchCategorias,
    getCategoriasFlatList
  };
};