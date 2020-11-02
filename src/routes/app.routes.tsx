import 'react-native-gesture-handler';
import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import SelecaoPerfil from '../pages/SelecaoPerfil';
import CadastroVeiculo from '../pages/CadastroVeiculo';
import Inicial from '../pages/Inicial';
import SolicitacaoFrete from '../pages/SolicitacaoFrete';
import ListaSolicitacoes from '../pages/ListaSolicitacoes';
import DetalhesCarga from '../pages/DetalhesCarga';
import DetalhesNegociacao from '../pages/DetalhesNegociacao';
import CadastroProposta from '../pages/CadastroProposta';
import Pagamento from '../pages/Pagamento';
import NegociacaoFinalizada from '../pages/NegociacaoFinalizada';
import { useAuth } from '../contexts/auth';
import AlteracaoSenha from '../pages/AlteracaoSenha';

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => {
  const { usuarioLogado } = useAuth();
  return (
    <AppStack.Navigator 
      initialRouteName={!usuarioLogado?.perfilSelecionado ? 'SelecaoPerfil' : 'Inicial'} 
      screenOptions={{ headerShown: false }}
    >
      <AppStack.Screen
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
      <AppStack.Screen
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
      <AppStack.Screen name="Inicial" component={Inicial} />
      <AppStack.Screen name="SolicitacaoFrete" component={SolicitacaoFrete} />
      <AppStack.Screen name="ListaSolicitacoes" component={ListaSolicitacoes} />
      <AppStack.Screen name="DetalhesCarga" component={DetalhesCarga} />
      <AppStack.Screen name="DetalhesNegociacao" component={DetalhesNegociacao} />
      <AppStack.Screen name="CadastroProposta" component={CadastroProposta} />
      <AppStack.Screen name="Pagamento" component={Pagamento} />
      <AppStack.Screen name="NegociacaoFinalizada" component={NegociacaoFinalizada} />
      <AppStack.Screen name="AlteracaoSenha" component={AlteracaoSenha} />
    </AppStack.Navigator>
  );
}




export default AppRoutes;
