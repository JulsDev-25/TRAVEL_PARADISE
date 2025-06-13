import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

// Obtenir la largeur et hauteur de l'écran
const { width, height } = Dimensions.get('window');

// Fonctions utilitaires pour rendre responsive
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Shadow distance={10} startColor={'#A69D9D30'}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Shadow>
        <Text style={styles.title}>TRAVEL PARADISE</Text>
        <View style={styles.footer}>
          <Text style={styles.terms}>
            En appuyant sur continuer, tu confirmes que tu acceptes les{' '}
            <Text style={styles.link}>termes & conditions</Text> d’utilisation,
            ainsi que la <Text style={styles.link}>politique de confidentialité</Text>.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('connexion')}
          >
            <Text style={styles.buttonText}>continuer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="light" />
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    padding: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp(6),
  },
  logo: {
    height: 126,
    width: 126,
    marginBottom: hp(2),
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(2),
  },
  footer: {
    position: 'absolute',
    bottom: hp(5),
  },
  terms: {
    fontSize: wp(3.5),
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp(20.5),
  },

  link: {
    textDecorationLine: 'underline',
    color: '#00BFFF',
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: hp(1.8),
    marginHorizontal: wp(15),
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
