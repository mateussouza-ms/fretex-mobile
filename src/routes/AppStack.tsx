import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import CadastroUsuario from '../pages/CadastroUsuario'
import SelecaoPerfil from '../pages/SelecaoPerfil';
import CadastroVeiculo from '../pages/CadastroVeiculo';
import Login from '../pages/Login';
import Inicial from '../pages/Inicial';
import SolicitacaoFrete from '../pages/SolicitacaoFrete';
import ListaSolicitacoes from '../pages/ListaSolicitacoes';
import DetalhesCarga from '../pages/DetalhesCarga';
import DetalhesNegociacao from '../pages/DetalhesNegociacao';
import CadastroProposta from '../pages/CadastroProposta';
import Pagamento from '../pages/Pagamento';
import NegociacaoFinalizada from '../pages/NegociacaoFinalizada';

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
                <Screen name="Inicial" component={Inicial} />
                <Screen name="SolicitacaoFrete" component={SolicitacaoFrete} />
                <Screen name="ListaSolicitacoes" component={ListaSolicitacoes} />
                <Screen name="DetalhesCarga" component={DetalhesCarga} />
                <Screen name="DetalhesNegociacao" component={DetalhesNegociacao} />
                <Screen name="CadastroProposta" component={CadastroProposta} />
                <Screen name="Pagamento" component={Pagamento} />
                <Screen name="NegociacaoFinalizada" component={NegociacaoFinalizada} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;