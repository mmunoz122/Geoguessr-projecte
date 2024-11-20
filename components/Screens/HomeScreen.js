import React, { useState } from 'react'; // Importem les funcionalitats bàsiques de React.
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'; // Importem els components de React Native.
import { useNavigation } from '@react-navigation/native'; // Importem el hook de navegació.

const HomeScreen = () => {
  const navigation = useNavigation(); // Creem el Hook per a la navegació entre pantalles.
  const [name, setName] = useState(''); // Creem l'estat per emmagatzemar el nom del jugador introduït pel usuari.

  const handleStartPress = () => {

    // Creem la funció que es crida quan es prem el botó 'Start'
    if (name.trim()) { // Comprovem si el nom no està buit o només té espais
      navigation.navigate('Game', { userName: name }); // Introuïm el nom a la pantalla del joc
    } else {
      alert("Si us plau, introdueix el teu nom"); // Mostrem una alerta si no s'ha introduït un nom.
    }
  };

  // Retornem l'interfície de la pantalla d'inici
  return (
    <View style={styles.container}> 
      <Text style={styles.title}>GeoGuessr</Text> {/* Títol de la pantalla */}

      <Image
        source={require('../../assets/logo.png')} 
        style={styles.logo} 
      />
      
      <Text style={styles.description2}>
        Posa el teu nom per començar: {/* Descripció que indica què ha de fer l'usuari */}
      </Text>
      
      <TextInput
        style={styles.input} 
        placeholder="El teu nom" // Crem el text de mostra quan el camp està buit
        placeholderTextColor="#aaa" // Creem el color del text del placeholder
        value={name} // Creem el valor del camp de text es vincula a l'estat 'name'
        onChangeText={setName} // Actualitzem l'estat 'name' cada vegada que l'usuari escriu alguna cosa
      />

      {/* Botó que inicia el joc quan es prem */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
        <Text style={styles.startButtonText}>Start</Text> {/* Text del botó */}
      </TouchableOpacity>
    </View>
  );
};

  //  Estils de la pantalla
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000033', // Blau fosc
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#696969', // Gris clar
      marginTop: 20,
    },
    logo: {
      width: 200, 
      height: 200,
      marginBottom: 20,
    },
    description2: {
      fontSize: 15,
      color: '#D3D3D3', 
      textAlign: 'center',
      lineHeight: 26,
      marginHorizontal: 40,
      marginBottom: 10,
    },
    input: {
      width: '80%',
      padding: 10,
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 5,
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
    },
    startButton: {
      backgroundColor: '#808080', 
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 8,
      marginTop: 20,
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8, 
    },
    startButtonText: {
      color: '#000',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  export default HomeScreen;
