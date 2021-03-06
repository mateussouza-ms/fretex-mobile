export interface UsuarioLogado {
  id: number;
  nome: string;
  email?: string;
  perfis: Perfil[];
  perfilSelecionado?: Perfil;
}

export interface Perfil {
  id: number;
  perfil: string;
}
