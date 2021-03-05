import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as auth from "../services/auth";
import api from "../services/api";
import { UsuarioLogado } from "../types/UsuarioLogado";

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

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  async function signIn(credenciais: auth.Credenciais, lembrar: boolean) {
    const response = await auth.signIn(credenciais);
    setUsuarioLogado(response.usuarioLogado);

    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    if (lembrar) {
      await AsyncStorage.setItem(
        "@Fretex:usuarioLogado",
        JSON.stringify(response.usuarioLogado)
      );
      await AsyncStorage.setItem("@Fretex:token", response.token);
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUsuarioLogado(null);
    api.defaults.headers.Authorization = null;
  }

  async function alterarPerfil(perfil: string) {
    if (usuarioLogado) {
      const usuario = {
        id: usuarioLogado.id,
        nome: usuarioLogado.nome,
        email: usuarioLogado.email,
        perfis: usuarioLogado.perfis,
        perfilSelecionado: perfil,
      };
      setUsuarioLogado(usuario);
      await AsyncStorage.setItem(
        "@Fretex:usuarioLogado",
        JSON.stringify(usuario)
      );
    }
  }

  async function adicionarPerfil(perfil: string) {
    if (usuarioLogado) {
      const usuario = {
        id: usuarioLogado.id,
        nome: usuarioLogado.nome,
        email: usuarioLogado.email,
        perfis: [...usuarioLogado.perfis, perfil],
        perfilSelecionado: perfil,
      };
      setUsuarioLogado(usuario);
      await AsyncStorage.setItem(
        "@Fretex:usuarioLogado",
        JSON.stringify(usuario)
      );
    }
  }

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          signOut();
        }
        return Promise.reject(error);
      }
    );

    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem("@Fretex:usuarioLogado");
      const storagedToken = await AsyncStorage.getItem("@Fretex:token");

      if (storagedUser && storagedToken && !usuarioLogado) {
        if (await auth.validarToken(storagedToken)) {
          // console.log("token valido: " + storagedToken);
          setUsuarioLogado(JSON.parse(storagedUser));
          api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        } else {
          signOut();
        }
      }

      setLoading(false);
    }

    loadStorageData();
  });

  return (
    <AuthContext.Provider
      value={{
        signed: !!usuarioLogado,
        usuarioLogado,
        loading,
        signIn,
        signOut,
        alterarPerfil,
        adicionarPerfil,
        setUsuarioLogado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };
