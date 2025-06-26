import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Si vous appelez cette fonction depuis un composant de navigation

const useLogout = () => {
  const navigation = useNavigation(); // Obtenir l'objet navigation

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Supprimer le token
      console.log('Token supprimé');
      // Assurez-vous que 'Login' est le nom de votre écran de connexion dans votre navigateur
      navigation.reset({
        index: 0,
        routes: [{ name: 'homeScreen' }],
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      // Gérer l'erreur si nécessaire (par exemple, afficher un message à l'utilisateur)
    }
  };

  return handleLogout; // Retourner la fonction de déconnexion
};

export default useLogout;