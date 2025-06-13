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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from 'react-native-vector-icons'
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function LoginScreen() {
  const navigation = useNavigation();

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
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BottomTabNavigator')}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
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
});