export interface UsuarioLogado {
  id: number;
  nome: string;
  email?: string;
  perfis: string[];
  perfilSelecionado: string | null;
}
