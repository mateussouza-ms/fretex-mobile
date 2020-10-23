import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="CadastroUsuario" component={CadastroUsuario} />
  </AuthStack.Navigator>
);

export default AuthRoutes;
