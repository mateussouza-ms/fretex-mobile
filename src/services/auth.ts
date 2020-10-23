import { UsuarioLogado } from "../contexts/auth";
import api from "./api";
import { encode as btoa } from 'base-64';

interface Response {
  token: string;
  usuarioLogado: UsuarioLogado;
}

export async function signIn(): Promise<Response> {
  console.log('signIn()');

  var formdata = new FormData();
  formdata.append('grant_type', 'password');
  formdata.append('username', 'mateus@gmail.com');
  formdata.append('password', 'mateus');

  var username = 'insomnia';
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
    throw new Error("Erro ao obter token: " + JSON.stringify(error.response.data));
  });

  console.log(JSON.stringify("Resposta do token request: " + JSON.stringify(responseAuthorization.data)));

  if (!responseAuthorization) {
    throw new Error("Problema ao obter token.")
  }

  const { access_token } = responseAuthorization.data;

  const responseUserAuth = await api.get(
    'user-auth',
    {
      headers: { Authorization: 'Bearer ' + access_token }
    }
  ).catch((error) => {
    throw new Error("Erro ao obter dados do usuário: " + JSON.stringify(error.response.data));
  });

  console.log(JSON.stringify("Resposta dos dados do usuário: " + JSON.stringify(responseAuthorization.data)));


  const { usuarioId, usuarioNome, authorities} = responseUserAuth.data;

  var usuarioLogado = {
    id: usuarioId,
    nome: usuarioNome,
    perfis: [],
  };



  const perfisUsuario: [{ perfil: string; selecionado: false; }] = JSON.parse(JSON.stringify(authorities).replace('authority', 'perfil'));
  
  perfisUsuario.forEach(perfil => {
    console.log('perfil: ' + perfil.perfil + '| selecionado: ' + perfil.selecionado);
    perfil.selecionado = false;
  });

  console.log(JSON.stringify(perfisUsuario));

  const response: Response = {
    token: access_token,
    usuarioLogado: {
      id: usuarioId,
      nome: usuarioNome,
      perfis: perfisUsuario,
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
