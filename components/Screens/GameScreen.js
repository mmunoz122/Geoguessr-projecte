// Importem de les  llibreries i components necessaris
import React, { useEffect, useState } from 'react';// Importem les funcionalitats bàsiques de React.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';//  Importem un component bàsic de React Native.
import MapView, { Marker, Polyline } from 'react-native-maps'; // Importem els mapes i elements relacionats.
import haversine from 'haversine'; // Importem la llibreria per calcular distàncies entre coordenades.
import { useNavigation } from '@react-navigation/native'; // Importem un component per gestionar la navegació.
import { db } from '../../utils/firebaseConfig'; // Importem la configuració de Firebase.
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Importem les operacions de Firestore.

  // Creem el component principal de la pantalla del joc
  const GameScreen = ({ route }) => {
  const navigation = useNavigation(); // Creem el 'Hook' per gestionar la navegació entre pantalles.
  const { userName } = route.params; // Creem el nom d'usuari que s'ha introduït com a paràmetre des de la pantalla anterior.

  // Creem els estats del component per gestionar diferents aspectes del joc
  const [questionsData, setQuestionsData] = useState([]); // Creem les dades de les preguntes.
  const [score, setScore] = useState(0); // Creem la puntuació actual.
  const [displayedScore, setDisplayedScore] = useState(0); // Creem la puntuació que es mostra a l'usuari.
  const [questionNumber, setQuestionNumber] = useState(0); // Creem el número de pregunta actual.
  const [totalQuestions, setTotalQuestions] = useState(0); // Creem el total de preguntes disponibles.
  const [markerCoords, setMarkerCoords] = useState(null); // Creem les coordenades del marcador seleccionat per l'usuari.
  const [distance, setDistance] = useState(null); // Creem la distància calculada entre les coordenades seleccionades i les de l'objectiu.
  const [showMarker, setShowMarker] = useState(false); // Creem el control per mostrar el marcador de l'objectiu
  const [nextButton, setNextButton] = useState(false); // Creem la visibilitat del botó "Següent".
  const [exitButton, setExitButton] = useState(false); // Creem la visibilitat del botó "Sortir".
  const [checkButtonTrigger, setCheckButtonTrigger] = useState(true); // Creem el control de l'habilitació del botó "Comprovar".
  const [targetCoords, setTargetCoords] = useState(null); // Creem les coordenades de l'objectiu osigui la pregunta actual.
  const [region, setRegion] = useState({ // Creem la regió actual del mapa osigui la posició on es trobara en un principi
    // Indiquem la regió inicial del mapa.
    latitude: 41.7282,
    longitude: 1.8236,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  // Crem un "UseEffect" per carregar les dades inicials del joc
  useEffect(() => {
    fetchData(); // Carreguem les dades de les preguntes.
  }, []);

  // Creem la funció per gestionar el botó "Comprovar"
  const handleCheckPress = () => {
    if (markerCoords && targetCoords) {
      const calculatedDistance = haversine(markerCoords, targetCoords, { unit: 'meter' }); // Calculem la distància.
      setShowMarker(true); // Mostrem el marcador de l'objectiu.
      setDistance(calculatedDistance); // Desem la distància calculada.
      setCheckButtonTrigger(false); // Desactivem el botó "Comprovar".
      setNextButton(true); // Activem el botó "Següent".
      setExitButton(true); // Activem el botó "Sortir".

      // Calculem l'increment de puntuació segons la distància
      const scoreIncrease = Math.max(1000 - calculatedDistance / 10, 0);
      setScore((prevScore) => prevScore + scoreIncrease);

      // Actualitzem de forma animada la puntuació mostrada
      let currentScore = displayedScore;
      const increment = scoreIncrease / 50;
      const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score + scoreIncrease) {
          clearInterval(interval);
          setDisplayedScore(score + scoreIncrease);
        } else {
          setDisplayedScore(currentScore);
        }
      }, 20);

      // Ajustem el mapa perquè inclogui les coordenades seleccionades i les de l'objectiu
      setRegion({
        latitude: (markerCoords.latitude + targetCoords.latitude) / 2,
        longitude: (markerCoords.longitude + targetCoords.longitude) / 2,
        latitudeDelta: Math.abs(markerCoords.latitude - targetCoords.latitude) * 2,
        longitudeDelta: Math.abs(markerCoords.longitude - targetCoords.longitude) * 2,
      });
    } else {
      console.debug('markerCoords o targetCoords són null o indefinits.');
    }
  };

  // Creem la funció per gestionar el botó "Sortir"
  const handleExitButtonPress = () => {
    navigation.navigate('Home'); // Indiquem que volem tornar a la pantalla principal
    setExitButton(false);
  };

  // Creem la funció per gestionar la selecció de coordenades al mapa
  const handleMapPress = (event) => {
    if (!checkButtonTrigger) {
      // Bloqueja la interacció si el botó "Comprovar" ja s'ha prement
      console.debug('La interacció amb el mapa està bloquejada fins que avancis.');
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate; // Coordenades seleccionades
    if (latitude && longitude) {
      setMarkerCoords({ latitude, longitude }); // Desa les coordenades al marcador
    }
  };

  // Creem la funció per passar a la següent pregunta
  const handleNextButtonPress = () => {
    setCheckButtonTrigger(true); // Habilita la interacció amb el mapa
    setExitButton(false);
    setNextButton(false);
    setShowMarker(false);

    const nextQuestion = questionNumber + 1; // Incrementa el número de pregunta

    if (nextQuestion < questionsData.length) {
      setQuestionNumber(nextQuestion); // Passa a la següent pregunta
      setTargetCoords(questionsData[nextQuestion]?.loc || null);
    } else {
      goToScoreScreen(); // Finalitza el joc si no queden preguntes
    }

    setMarkerCoords(null);
  };

  // Creem la funció per navegar a la pantalla de puntuació i desar els resultats
  const goToScoreScreen = async () => {
    try {
      await addDoc(collection(db, 'Usuaris'), {
        name: userName, // Nom de l'usuari
        bestScore: score, // Millor puntuació
      });
    } catch (error) {
      console.error('Error en obtenir les puntuacions: ', error);
    }
    navigation.navigate('Score', { score }); // Navega a la pantalla de puntuació
  };

  // Creem la funció per obtenir les dades de Firestore
  const fetchData = async () => {
    try {
      const questionsCollection = collection(db, 'Preguntes'); // Referència a la col·lecció de preguntes
      const snapshot = await getDocs(questionsCollection);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const location = docData.Geolocation; // Coordenades de la pregunta
        return {
          id: doc.id,
          pregunta: docData.Title, // Títol de la pregunta
          loc: location ? { latitude: location.latitude, longitude: location.longitude } : null,
        };
      });
      setQuestionsData(data); // Desa les dades al component
      setTotalQuestions(data.length); // Estableix el nombre total de preguntes

      if (data.length > 0) {
        setTargetCoords(data[0].loc); // Estableix la primera pregunta com a objectiu inicial
      }
    } catch (error) {
      console.error('Error en obtenir les dades de Firestore: ', error);
    }
  };

  // Retornem l'interfície de la pantalla
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.progress}>
        {questionNumber + 1}/{totalQuestions}
      </Text>

      <MapView
        style={styles.map}
        mapType="satellite"
        initialRegion={region}
        region={region}
        onPress={handleMapPress}
      >
        {showMarker && targetCoords && (
          <Marker coordinate={targetCoords} pinColor="green" />
        )}
        {markerCoords && (
          <Marker coordinate={markerCoords} pinColor="red" />
        )}
        {showMarker && targetCoords && markerCoords && (
          <Polyline
            coordinates={[targetCoords, markerCoords]}
            strokeColor="#32CD32"
            strokeWidth={2}
          />
        )}
      </MapView>

      {questionsData[questionNumber]?.pregunta ? (
        <Text style={styles.question}>
          {questionsData[questionNumber]?.pregunta}
        </Text>
      ) : (
        <Text style={styles.loadingText}>Carregant pregunta...</Text>
      )}

      {distance && !checkButtonTrigger && (
        <Text style={styles.distanceText}>
          La ubicació es troba a {Math.round(distance)} metres.
        </Text>
      )}
      <Text style={styles.score}>Score: {Math.round(displayedScore)}</Text><Text></Text>
      <View style={styles.buttonsRow}>
        {exitButton && (
          <TouchableOpacity style={styles.exitButton} onPress={handleExitButtonPress}>
            <Text style={styles.exitButtonText}>Sortir</Text>
          </TouchableOpacity>
        )}
        {checkButtonTrigger && (
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckPress}>
            <Text style={styles.checkButtonText}>Comprovar</Text>
          </TouchableOpacity>
        )}
        {nextButton && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextButtonPress}>
            <Text style={styles.nextButtonText}>Següent</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  };

  //  Estils de la pantalla
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000033', // Blau fosc
      alignItems: 'center',
      paddingVertical: 20,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '80%',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#696969', // Gris clar
      marginTop: 20,
    },
    progress: {
      fontSize: 17,
      color: '#D3D3D3', // Gris clar
      marginBottom: 20,
    },
    map: {
      width: '80%',
      height: '50%',
      borderRadius: 10,
      marginBottom: 20,
    },
    question: {
      fontSize: 18,
      color: '#D3D3D3', // Gris clar
      marginVertical: 10,
    },
    exitButton: {
      backgroundColor: '#FF0000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    exitButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    checkButton: {
      backgroundColor: '#808080',
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 8,
      marginTop: 10,
    },
    checkButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    nextButton: {
      backgroundColor: '#32CD32',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    nextButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    distanceText: {
      fontSize: 16,
      color: '#D3D3D3', // Gris clar
      marginTop: 10,
    },
    score: {
      fontSize: 16,
      color: '#D3D3D3', // Gris clar
      marginTop: 50,
      marginLeft: -175,
    },
    loadingText: {
      fontSize: 18,
      color: '#D3D3D3', // Gris clar
      marginVertical: 10,
    },
  });

  export default GameScreen;
