import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import Landing from '../pages/Landing';
import GiveClasses from '../pages/GiveClasses';
import StudyTabs from './StudyTabs';
import CadastroUsuario from '../pages/CadastroUsuario'
import SelecaoPerfil from '../pages/SelecaoPerfil';
import CadastroVeiculo from '../pages/CadastroVeiculo';
import Login from '../pages/Login';

const { Navigator, Screen } = createStackNavigator();

function AppStack() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Login" component={Login} />
                <Screen name="CadastroUsuario" component={CadastroUsuario} />
                <Screen 
                    name="SelecaoPerfil" 
                    component={SelecaoPerfil} 
                    options={
                        {
                            gestureEnabled: true,
                            gestureDirection: "horizontal", 
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                        }
                    }
                />
                <Screen 
                    name="CadastroVeiculo" 
                    component={CadastroVeiculo}
                    options={
                        {
                            gestureEnabled: true,
                            gestureDirection: "horizontal", 
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                        }
                    }
                />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;