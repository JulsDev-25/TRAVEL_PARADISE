import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Exemple d'icônes
import { useNavigation } from '@react-navigation/native';
import useLogout from '../components/useLogout';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const handleLogout = useLogout(); // Utiliser le hook de déconnexion

  // Informations de l'utilisateur (vous devrez les charger depuis votre API)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Passionné de voyages et de découverte de nouvelles cultures.',
    profilePicture: 'https://via.placeholder.com/150', // Remplacez par l'URL de l'image de profil réelle
    guidesCreated: 15,
    tripsTaken: 30,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Section de l'en-tête du profil */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIcon}>
              <MaterialIcons name="edit" size={wp(5)} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
        </View>

        {/* Section des statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.guidesCreated}</Text>
            <Text style={styles.statLabel}>Guides Créés</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.tripsTaken}</Text>
            <Text style={styles.statLabel}>Voyages Effectués</Text>
          </View>
        </View>

        {/* Section des options/paramètres */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="person-outline" size={wp(6)} color="#003366" />
            <Text style={styles.optionText}>Modifier le profil</Text>
            <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="settings-outline" size={wp(6)} color="#003366" />
            <Text style={styles.optionText}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome5 name="book-open" size={wp(5)} color="#003366" />
            <Text style={styles.optionText}>Mes Guides</Text>
            <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
          </TouchableOpacity>

          {/* Bouton de déconnexion */}
          <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={wp(6)} color="#d9534f" />
            <Text style={[styles.optionText, { color: '#d9534f' }]}>Déconnexion</Text>
            <View style={{ width: wp(5) }} /> {/* Espace pour aligner */}
          </TouchableOpacity>
        </View>

        {/* Vous pouvez ajouter d'autres sections ici */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Couleur de fond légère
  },
  scrollViewContent: {
    paddingBottom: hp(3), // Espace en bas pour le défilement
  },
  header: {
    backgroundColor: '#003366', // Couleur d'en-tête
    paddingVertical: hp(4),
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: hp(2),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: hp(2),
  },
  profileImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15), // Pour une image ronde
    borderWidth: 3,
    borderColor: '#fff', // Bordure blanche autour de l'image
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6', // Couleur du bouton d'édition
    borderRadius: wp(3),
    padding: wp(1.5),
  },
  userName: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.5),
  },
  userBio: {
    fontSize: wp(4),
    color: '#eee',
    textAlign: 'center',
    paddingHorizontal: wp(5),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: 10,
    shadowColor: '#000', // Ombre pour un effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Ombre pour Android
    marginTop: -hp(4), // Remonte légèrement sur l'en-tête
    marginBottom: hp(2),
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#003366',
  },
  statLabel: {
    fontSize: wp(3.5),
    color: '#666',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: wp(5),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    flex: 1, // Prend l'espace restant
    fontSize: wp(4),
    color: '#333',
    marginLeft: wp(3),
  },
});