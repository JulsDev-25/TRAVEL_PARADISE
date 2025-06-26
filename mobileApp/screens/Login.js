import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 


const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('AsyncStorage vidé avec succès.');
    } catch (error) {
      console.error('Erreur lors du vidage de AsyncStorage:', error);
    }
  };


  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Utilisation d'axios pour la requête POST
      const response = await axios.post('https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/login_check', {
        email: email,
        password: password,
      });

      // Axios gère automatiquement la réponse JSON et les statuts HTTP
      // Si la réponse n'est pas dans la plage 2xx, axios lance une erreur
      const token = response.data.token; // Accéder aux données de la réponse via response.data
      console.log('Token reçu :', token);
      clearAsyncStorage(); // Vider AsyncStorage avant de stocker le nouveau token
      await AsyncStorage.setItem('userToken', token);
      console.log('Token stocké :', token);
      navigation.navigate('BottomTabNavigator');

    } catch (error) {
      console.error('Erreur lors de la connexion :', error);

      // Gérer les erreurs d'axios
      if (axios.isAxiosError(error)) {
        // Erreur provenant de l'API (statut non 2xx)
        if (error.response) {
          // La requête a été faite et le serveur a répondu avec un statut > 2xx
          setError(error.response.data.message || 'Erreur de connexion');
          Alert.alert('Erreur de connexion', error.response.data.message || 'Une erreur est survenue lors de la connexion.');
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          setError('Erreur réseau');
          Alert.alert('Erreur', 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
        } else {
          // Quelque chose s'est passé lors de la configuration de la requête qui a déclenché une erreur
          setError('Erreur interne');
          Alert.alert('Erreur', 'Une erreur interne est survenue.');
        }
      } else {
        // Erreur non liée à axios
        setError('Une erreur inattendue est survenue');
        Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <View style={styles.form}>
          <FontAwesome5 name="user-alt" style={{ margin: "auto", marginTop: 20 }} size={wp(30)} color="#003366" />
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenue 👋</Text>
            <Text style={styles.subtitle}>Connecte-toi à ton compte,</Text>
          </View>

          <TextInput
            placeholder="Adresse email"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: hp(4),
  },
  title: {
    fontSize: wp(7),
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 50,
  },
  subtitle: {
    fontSize: wp(4),
    color: '#6B7280',
    marginTop: hp(0.5),
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(5),
    width: wp(90),
    gap: hp(2),
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    fontSize: wp(4),
    color: '#111827',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: hp(1),
  },
  forgotText: {
    color: '#3B82F6',
    fontSize: wp(3.5),
  },
  button: {
    backgroundColor: '#003366',
    borderRadius: 10,
    paddingVertical: hp(1.7),
    marginTop: hp(5),
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  registerContainer: {
    marginTop: hp(3),
    alignItems: 'center',
  },
  registerText: {
    fontSize: wp(3.8),
    color: '#6B7280',
  },
  link: {
    color: '#2563EB',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: hp(1),
  }
});