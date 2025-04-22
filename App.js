import { StatusBar } from 'expo-status-bar'; //barra de status
// componentes React Native utilizados
import { StyleSheet, Text, View, Image, Button, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react'; //React e hooks de estado e efeito
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; //hook de fontes e a fonte escolhida
import { Feather } from '@expo/vector-icons'; //utilizado para o icone de pesquisa
import * as Location from 'expo-location'; //biblioteca para ver o clima com base na localização da pessoa

const API_KEY = "5093f0b29ec7451a84f231853252104".trim();//chave da api com trim para impedir espaços em branco

export default function App() {

  const [ fontsLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold
  }); //carrega as fontes que serão utilizadas

  const [city, setCity] = useState(''); //hook de estado no nome da cidade
  const [loading, setLoading] = useState(false) //hook de estado de carregamento 
  const [loadLocation, setLoadLocation] = useState(false) //hook de estado de carregamento para o botão de localização
  const [weatherData, setWeatherData] = useState(null); //hook de estado do JSON com os dados da cidade
  const [errorMsg, setErrorMsg] = useState(null); //hook de estado para a mensagem de erro

  async function fetchApi(city) {
      // se o estado com o nome da cidade estiver vazio, pede para preencher
      if(!city.trim()){
        setErrorMsg("Digite o nome de uma cidade.");
        return;
      }
      
      setLoading(true); //ativa o estado de carregamento para a requisição de api
      setErrorMsg(null); //mensagem de erro vazia

      // faz a requisição da API, a API utilizada foi a WeatherAPI
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no&lang=pt`)
        const result = await res.json(); //transforma em json
        //console.log para ver se funcionou a requisição e selecionar as informações que serão mostradas
        console.log('Resultado da API: ', result); 
        // mensagem de erro caso não consiga extrair os dados da API
        if(result?.error) {
          setErrorMsg(result.error.message || "Erro ao buscar dados, tente novamente.");
          setWeatherData(null) //variável fica nula
        } else{
          setWeatherData(result); //recebe os dados caso consiga puxar os dados
        }
      } catch (error) {
        setErrorMsg("Erro na conexão. Tente novamente.");
      } finally {
        setLoading(false); //desativa o estado de carregamento
      }
  };

  useEffect(() =>{
      fetchApi(city);
  }, [])

  if (!fontsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ffff00" />
        </View>
      ) // se a fonte não for carregada, coloca uma tela de carregamento
  }
  return (
    // tela principal
    <View style={styles.container}>
      <Image source={require('./assets/img/logo.png')} style={styles.image}/>
      <Text style={styles.title}>Bem-vindo ao Solari!</Text>
      <Text style={styles.label}>Digite o nome de uma cidade:</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#222222',
        borderColor: '#f9a825', 
        paddingHorizontal: 15,
        height: 50
      }}>
        <TextInput 
          style={styles.input}
          placeholder='Ex: Barueri'
          value={city}
          onChangeText={setCity}
        />
        <Feather name='search' color="#d9d9d9" size={24}/>
        
      </View>
      <TouchableOpacity style={styles.button} onPress={() => fetchApi(city)}>
        {loading ? (
            <ActivityIndicator size={10} color=" #4169e1"/>
         ) : (
            <Text style={styles.buttonText}> Ver clima</Text>
        )}
      </TouchableOpacity>

      {/* Campo de texto para a mensagem de erro */}
      {errorMsg && <Text style={{ color: 'red', marginTop: 20 }}>{errorMsg}</Text>}

      {/* View com as informações requisitadas */}
      {weatherData && (
        <View
          style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#111111"
          }}
        >
            <Text style={styles.resultTitle}>Local: 
              <Text style={styles.resultText}> {weatherData.location.name}, {weatherData.location.country}</Text>
            </Text>
            <Text style={styles.resultTitle}>Temperatura: 
              <Text style={styles.resultText}> {weatherData.current.temp_c}°C</Text>
            </Text>
            <Text style={styles.resultTitle}> Sensação térmica: 
              <Text style={styles.resultText}> {weatherData.current.feelslike_c}°C</Text>
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.resultTitle}>Clima: 
                <Text style={styles.resultText}> {weatherData.current.condition.text}</Text>
              </Text>
              <Image 
                style={{width: 32, height: 32}} 
                source={{ uri: 'https:' + weatherData.current.condition.icon}}
              />
            </View>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

// estilização do app
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#111111"
  }, 
  title: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 40,
      color: "#ffff00",
      marginBottom: 15
  },
  label: {
      fontSize: 20,
      fontFamily: 'Poppins_400Regular',
      color: '#fff',
      marginBottom: 20
  },
  image: {
      width: 200,
      height: 200
  },
  input: {
      fontSize: 16,
      backgroundColor: '#222222',
      color: '#d9d9d9',
      borderColor: '#ffff00',
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#f9a825',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#111',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  resultTitle: {
    color: '#ffff00',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold'
  },
  resultText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16
  }
});
