// import { StatusBar } from 'expo-status-bar';
import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

/* CORPO DO PROJETO */
class Login extends Component {
  render(){
      return(
        <KeyboardAvoidingView behavior="position" style={styles.container}>
        <Text style={styles.title}>Fretex</Text>
        
        <TextInput
        style={styles.input}
        valeu={user}
        onChangeText={(user) => setUser(user)}
        placeholder="Usuário"
        />
        
        <TextInput
        style={styles.input}
        valeu={password}
        onChangeText={(password) => setPassword(password)}
        placeholder="Senha"
        />
        
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Perfil')}>
        <Text style={styles.buttonText} >Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Cadastro')}
>
        <Text style={styles.buttonText} >Não possuo cadastro</Text>
        </TouchableOpacity>
          </KeyboardAvoidingView>


      );
      const [user, setUser] = useState('');
      const [password, setPassword] = useState('');
  }
}

class Cadastro extends Component {
  render(){
      return(
        <KeyboardAvoidingView behavior="position" style={styles.body}> 
        <Text style={styles.nome}>Nome completo:</Text>
        <TextInput 
            style={styles.input}
            valeu={nome}
            onChangeText={(nome) => setNome(nome)}
            placeholder="Nome"
        />
        <Text style={styles.nome}>E-mail:</Text>
        <TextInput 
            style={styles.input}
            valeu={email}
            onChangeText={(email) => setEmail(email)}
            placeholder="E-mail"
        />
        <Text style={styles.nome}>CPF/CNPJ:</Text>
        <TextInput 
            style={styles.input}
            valeu={cpf}
            onChangeText={(cpf) => setCpf(cpf)}
            placeholder="CPF/CNPJ"
        />
        <Text style={styles.nome}>Telefone:</Text>
        <TextInput 
            style={styles.input}
            valeu={telefone}
            onChangeText={(telefone) => setTelefone(telefone)}
            placeholder="Telefone"
        />
        <Text style={styles.nome}>Senha:</Text>
        <TextInput 
            style={styles.input}
            valeu={senha}
            onChangeText={(senha) => setSenha(email)}
            placeholder="Senha"
        />
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')}
>
        <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      );
      const [nome, setNome] = useState('');
      const [email, setEmail] = useState('');
      const [cpf, setcpf] = useState('');
      const [telefone, setTelefone] = useState('');
      const [senha, setSenha] = useState('');
  }
}

class Perfil extends Component {
  render(){
    return(
      <View style={styles.body}>
        <Text style={styles.titlePerfil}>Escolha qual perfil deseja utilizar</Text>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Perfil')}
>
        <Text style={styles.buttonText}>Prestador de serviços</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Perfil')}
>
        <Text style={styles.buttonText}>Cliente</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


/* NAVEGAÇÃO */
const AppNavigator = createStackNavigator(
  {
      Login: {
        screen: Login
      },
      Cadastro:{
        screen: Cadastro
      },
      Perfil:{
        screen: Perfil
      }
  },
      {
      initialRouteName: 'Login'
      }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component{
  render(){
    return <AppContainer/>
      
  }
}


/* ESTILO */
const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#171d31',
  },
  title: {
  textAlign: 'center',
  marginTop: 200,
  fontSize: 40,
  color: '#FA9435'
  },
  input: {
  backgroundColor: '#e6e6fa',
  borderRadius: 10,
  margin: 10,
  padding: 10,
  color: '#000',
  fontSize: 20
  },
  button: {
  justifyContent: 'center',
  alignItems: 'center',
  margin: 15,
  backgroundColor: '#005ca3',
  padding:10,
  borderRadius: 20
  }, 
  buttonText: {
  fontSize: 20
  }, 
  body: {
  marginTop: 15,
  },
  nome: {
  marginLeft: 10,
  fontSize: 15,
  },
  titlePerfil: {
  textAlign: 'center',
  marginTop: 100,
  fontSize: 25,
  color: '#000'
  }
  });
