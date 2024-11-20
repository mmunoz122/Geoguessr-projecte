// Importem els components necessaris de React Native per crear la interfície d'usuari
import { StyleSheet, View, Pressable, Text } from 'react-native';

// Importem els icons que utilitzarem al botó, FontAwesome i MaterialCommunityIcons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Creem el component del botó 
export default function Button({ label, theme, onPress }) {
  
  // Si el tema és "primary", renderitzem aquest estil de botó
  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
        <Pressable style={[styles.button, { backgroundColor: "#fff" }]} onPress={onPress}>
          {/* Icon per al tema primari */}
          <MaterialCommunityIcons name="tortoise" size={24} color="#1ecc09" style={styles.buttonIcon} />
          {/* Etiqueta del botó amb el color de text adequat */}
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  
  // Si el tema és "secondary", renderitzem aquest estil de botó
  if (theme === "secondary") {
    return (
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#002eff", borderRadius: 18 }]}>
        <Pressable style={[styles.button, { backgroundColor: "#fff" }]} onPress={onPress}>
          {/* Icon per al tema secundari */}
          <MaterialCommunityIcons name="turtle" size={50} color="#1ecc09" style={styles.buttonIcon} />
          {/* Etiqueta del botó amb el color de text adequat */}
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  // Si no es passa un tema, renderitzem un botó per defecte
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        {/* Text per defecte per al botó */}
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    backgroundColor: "#fff", 
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#25292e', 
    fontSize: 16,
  },
});
