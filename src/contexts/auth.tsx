import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

export interface UsuarioLogado {
  id: number,
  nome: string,
  perfis: [{perfil: string, selecionado: boolean}],
}

interface AuthContextData {
  signed: boolean;
  usuarioLogado: UsuarioLogado | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@RNAuth:usuarioLogado');
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

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

  async function signIn() {
    const response = await auth.signIn();
    setUsuarioLogado(response.usuarioLogado);

    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem('@RNAuth:usuarioLogado', JSON.stringify(response.usuarioLogado));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUsuarioLogado(null);
  }

  return (
    <AuthContext.Provider
      value={{signed: !!usuarioLogado, usuarioLogado, loading, signIn, signOut}}>
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

export {AuthProvider, useAuth};
