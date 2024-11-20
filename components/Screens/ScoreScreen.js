// Importa les llibreries i funcions necessàries
import React, { useEffect, useState } from 'react'; // React i hooks per la funcionalitat
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'; // Components de React Native
import { useNavigation, useRoute } from '@react-navigation/native'; // Hooks per navegar i obtenir rutes
import { db } from '../../utils/firebaseConfig'; // Configuració de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Funcions per interactuar amb Firestore

const ScoreScreen = () => {
  const navigation = useNavigation(); // Hook per navegar entre pantalles
  const route = useRoute(); // Hook per obtenir dades de les rutes
  const { score = 0 } = route.params || {}; // Paràmetre de puntuació (assigna 0 si no està definit)

  // Estat per emmagatzemar la puntuació calculada segons la distància
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Estat per guardar la llista de puntuacions dels usuaris
  const [allScores, setAllScores] = useState([]);

  // Calcula la puntuació basada en la distància
  useEffect(() => {
    const calculateScore = (distance) => {
      if (distance < 3000000) return 100; // Puntuació màxima
      if (distance < 4000000) return 50;  // Puntuació mitjana
      if (distance < 7000000) return 25;  // Puntuació baixa
      return 10;                         // Puntuació mínima
    };

    // Actualitza la puntuació calculada
    setCalculatedScore(calculateScore(score));
  }, [score]); // Executa quan la puntuació canvia

  // Obté la llista de puntuacions des de Firestore
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'Usuaris'); // Accedeix a la col·lecció 'Usuaris'
        const snapshot = await getDocs(scoresCollection); // Obté els documents de la col·lecció
        const scoresList = snapshot.docs.map((doc) => doc.data()); // Converteix els documents en un array

        // Ordena les puntuacions de menor a major
        const sortedScores = scoresList.sort((a, b) => a.bestScore - b.bestScore);
        setAllScores(sortedScores); // Actualitza l'estat amb les puntuacions ordenades
      } catch (error) {
        console.error("Error fetching scores: ", error); // Mostra errors a la consola
      }
    };

    fetchScores(); // Crida la funció per obtenir les dades
  }, []); // Només es carrega al muntatge del component

  // Navega a la pantalla d'inici
  const handleStartPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.description}>La seva puntuació es de:</Text>
      <Text style={styles.scoretext}>{score.toFixed(0)} punts</Text>

      <Text style={styles.allScoresTitle}>Ranking</Text>
      <FlatList
        data={allScores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.scoreItem}>{item.name}: {item.bestScore.toFixed(0)} punts</Text>
        )}
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
        <Text style={styles.startButtonText}>Exit</Text>
      
      </TouchableOpacity>
    </View>

    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000033', // Blau fosc
    padding: 50,
  },
  title: {
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#696969', // Gris clar
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 0,
    marginHorizontal: 50,
  },
  allScoresTitle: {
    fontSize: 18,
    color: '#D3D3D3',
    marginTop: 20,
    marginBottom: 10,
  },
  scoreItem: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  scoretext: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 50,
  },
  startButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 100,
    marginTop: 10,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;
