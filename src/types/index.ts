export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  hora?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  dinheiroMensal: number;
  avatar?: string;
}

export interface MetaGasto {
  id: string;
  categoria: string;
  valorLimite: number;
  valorGasto: number;
  mes: string;
}

export interface MetaOrcamento {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  dataInicio: string;
  dataFim: string;
}
