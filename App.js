import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [idade, setIdade] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [ehCadastro, setEhCadastro] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessao(session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) buscarUsuarios();
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const buscarUsuarios = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsuarios(data);
    }
  };

  const cadastrarUsuario = async () => {
    if (primeiroNome && sobrenome && idade) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ primeiro_nome: primeiroNome, sobrenome: sobrenome, idade: parseInt(idade, 10) }]);

      if (error) {
        console.error(error);
      } else {
        setPrimeiroNome('');
        setSobrenome('');
        setIdade('');
        buscarUsuarios();
      }
    }
  };

  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) alert(error.message);
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) alert(error.message);
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Bem-vindo ao App de Cadastro de Usuários</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Email"
         placeholderTextColor="#D3D3D3"
          value={email}
          onChangeText={setEmail}
          //  color='#fff'
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Senha"
          value={senha}
           placeholderTextColor="#D3D3D3"
          onChangeText={setSenha}
          secureTextEntry
          //  color='#fff'
        />
        {ehCadastro ? (
          <>
            <TouchableOpacity style={estilos.botao} onPress={cadastrarComEmail}>
              <Text style={estilos.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(false)} style={estilos.ligacao}>Já tem uma conta? Entrar</Text>
          </>
        ) : (
          <>
            <TouchableOpacity style={estilos.botao} onPress={entrarComEmail}>
              <Text style={estilos.textoBotao}>Entrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(true)} style={estilos.ligacao}>Não tem uma conta? Cadastre-se</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.entrada}
        placeholder="Primeiro Nome"
        value={primeiroNome}
        onChangeText={setPrimeiroNome}
        // color='#fff'
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
        //  color='#fff'
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        //  color='#fff'
      />
      <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuario}>
        <Text style={estilos.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.usuario}>
            <Text style={estilos.textoUsuario}>Nome: {item.primeiro_nome} {item.sobrenome}</Text>
            <Text style={estilos.textoUsuario}>Idade: {item.idade}</Text>
          </View>
        )}
        style={estilos.listaUsuarios}
      />
      <TouchableOpacity style={estilos.botao} onPress={sair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:  '#1D438A',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
     color: '#fff',
  },
  entrada: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#F9A826',
    borderRadius: 5,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ligacao: {
    color: '#DcDcDc',
    marginTop: 10,
  },
  listaUsuarios: {
    width: '100%',
    marginTop: 20,
  },
  usuario: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textoUsuario: {
    fontSize: 16,
     color:'#fff',
  },
});
