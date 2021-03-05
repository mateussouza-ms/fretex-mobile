import { encode as btoa } from "base-64";
import { UsuarioLogado } from "../types/UsuarioLogado";
import api from "./api";

interface Response {
  token: string;
  usuarioLogado: UsuarioLogado;
}

export interface Credenciais {
  usuario: string;
  senha: string;
}

export async function signIn(credenciais: Credenciais): Promise<Response> {
  const formdata = new FormData();
  formdata.append("grant_type", "password");
  formdata.append("username", credenciais.usuario);
  formdata.append("password", credenciais.senha);

  const username = "fretex-mobile";
  const password = "123";
  const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

  const responseAuthorization = await api
    .post("oauth/token", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: basicAuth,
      },
    })
    .catch((error) => {
      throw new Error(JSON.stringify(error?.response?.data));
    });

  if (!responseAuthorization) {
    throw new Error("Problema ao obter token.");
  }

  const { access_token } = responseAuthorization.data;
  const responseUserAuth = await api
    .get("user-auth", {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .catch((error) => {
      throw new Error(
        `Erro ao obter dados do usuário: ${JSON.stringify(
          error?.response?.data
        )}`
      );
    });

  const {
    usuarioId,
    usuarioNome,
    usuarioEmail,
    authorities,
  } = responseUserAuth.data;

  let perfisUsuario: string[] = [];

  authorities.forEach((authoritie: { authority: string }) => {
    perfisUsuario = [...perfisUsuario, authoritie.authority];
  });

  const response: Response = {
    token: access_token,
    usuarioLogado: {
      id: usuarioId,
      nome: usuarioNome,
      email: usuarioEmail,
      perfis: perfisUsuario,
      perfilSelecionado: null,
    },
  };

  return response;
}

export async function validarToken(token: string): Promise<boolean> {
  return api
    .get("user-auth", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
