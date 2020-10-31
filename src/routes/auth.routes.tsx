import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';
import RecuperacaoSenha from '../pages/RecuperacaoSenha';
import RedefinicaoSenha from '../pages/RedefinicaoSenha';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="CadastroUsuario" component={CadastroUsuario} />
    <AuthStack.Screen name="RecuperacaoSenha" component={RecuperacaoSenha} />
    <AuthStack.Screen name="RedefinicaoSenha" component={RedefinicaoSenha} />
  </AuthStack.Navigator>
);

export default AuthRoutes;
