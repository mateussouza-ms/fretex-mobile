import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

export interface UsuarioLogado {
  id: number,
  nome: string,
  perfis: string[],
  perfilSelecionado: string | null,
}

interface AuthContextData {
  signed: boolean;
  usuarioLogado: UsuarioLogado | null;
  loading: boolean;
  signIn(credenciais: auth.Credenciais, lembrar: boolean): Promise<void>;
  signOut(): void;
  alterarPerfil(perfil: string): void;
  adicionarPerfil(perfil: string): void;
  setUsuarioLogado(usuarioLogado: UsuarioLogado): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        if (error.response.status == 401) {
          signOut();
        }
        return Promise.reject(error);
      }
    );

    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@Fretex:usuarioLogado');
      const storagedToken = await AsyncStorage.getItem('@Fretex:token');
      const storagedPerfilSelecionado = await AsyncStorage.getItem('@Fretex:perfilSelecionado');

      if (storagedUser && storagedToken && !usuarioLogado) {
        if (await auth.validarToken(storagedToken)) {
          //console.log("token valido: " + storagedToken);
          setUsuarioLogado(JSON.parse(storagedUser));
          api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        } else {
          console.log("token invalido: " + storagedToken);
          signOut();
        }

      }

      setLoading(false);
    }

    loadStorageData();
  });

  async function signIn(credenciais: auth.Credenciais, lembrar: boolean) {
    const response = await auth.signIn(credenciais);
    setUsuarioLogado(response.usuarioLogado);

    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    if (lembrar) {
      await AsyncStorage.setItem('@Fretex:usuarioLogado', JSON.stringify(response.usuarioLogado));
      await AsyncStorage.setItem('@Fretex:token', response.token);
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUsuarioLogado(null);
    api.defaults.headers.Authorization = null;
  }

  async function alterarPerfil(perfil: string) {
    if (usuarioLogado) {
      var usuario = {
        id: usuarioLogado.id,
        nome: usuarioLogado.nome,
        perfis: usuarioLogado.perfis,
        perfilSelecionado: perfil,
      };
      setUsuarioLogado(usuario);
      await AsyncStorage.setItem('@Fretex:usuarioLogado', JSON.stringify(usuario));
    }
  }

  async function adicionarPerfil(perfil: string) {
    if (usuarioLogado) {
      var usuario = {
        id: usuarioLogado.id,
        nome: usuarioLogado.nome,
        perfis: [...usuarioLogado.perfis, perfil],
        perfilSelecionado: perfil,
      };
      setUsuarioLogado(usuario);
      await AsyncStorage.setItem('@Fretex:usuarioLogado', JSON.stringify(usuario));
    }
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!usuarioLogado, usuarioLogado, loading, signIn, signOut, alterarPerfil, adicionarPerfil, setUsuarioLogado }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}



export { AuthProvider, useAuth };
