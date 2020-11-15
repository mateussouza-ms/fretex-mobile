import { UsuarioLogado } from "../contexts/auth";
import api from "./api";
import { encode as btoa } from 'base-64';

interface Response {
  token: string;
  usuarioLogado: UsuarioLogado;
}

export interface Credenciais {
  email_cnp: string,
  senha: string,
}

export async function signIn(credenciais: Credenciais): Promise<Response> {

  var formdata = new FormData();
  formdata.append('grant_type', 'password');
  formdata.append('username', credenciais.email_cnp);
  formdata.append('password', credenciais.senha);

  var username = 'fretex-mobile';
  var password = '123';
  var basicAuth = 'Basic ' + btoa(username + ':' + password);

  const responseAuthorization = await api.post(
    'oauth/token',
    formdata,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': basicAuth
      }
    }
  ).catch(error => {
    throw new Error(JSON.stringify(error?.response?.data));
  });

  console.log(JSON.stringify("Resposta do token request: " + JSON.stringify(responseAuthorization.data)));

  if (!responseAuthorization) {
    throw new Error("Problema ao obter token.");
  }

  const { access_token } = responseAuthorization.data;

  const responseUserAuth = await api.get(
    'user-auth',
    {
      headers: { Authorization: 'Bearer ' + access_token }
    }
  ).catch((error) => {
    throw new Error("Erro ao obter dados do usuário: " + JSON.stringify(error?.response?.data));
  });

  console.log(JSON.stringify("Resposta dos dados do usuário: " + JSON.stringify(responseUserAuth.data)));


  const { usuarioId, usuarioNome, usuarioEmail, authorities} = responseUserAuth.data;

  var perfisUsuario: string[] = [];

  authorities.forEach((authoritie: {authority: string}) => {
    perfisUsuario = [...perfisUsuario, authoritie.authority]
  });


  const response: Response = {
    token: access_token,
    usuarioLogado: {
      id: usuarioId,
      nome: usuarioNome,
      email: usuarioEmail,
      perfis: perfisUsuario,
      perfilSelecionado: null,
    }
  };

  return response;
}

export async function validarToken(token: string): Promise<boolean> {
  //console.log('validarToken()');
  return api.get(
    'user-auth',
    {
      headers: { Authorization: 'Bearer ' + token }
    }
  ).then(response => {
    //console.log('response: '+ JSON.stringify(response.data));
    return true;
  }).catch(error => {
    //console.log('error: '+ JSON.stringify(error.response.data));
    return false;
  });
  
}
