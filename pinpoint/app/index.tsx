import { Image, StyleSheet, Text, View } from "react-native";
import '../global.css'
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter()

  return (
    <View style={styles.bg}>
      <Text style={styles.name}>PinPoint</Text>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <View style={styles.btnList}>
        <Text style={styles.btn} onPress={() => router.push('/login')}>Login</Text>
        <Text style={styles.btn} onPress={() => router.push('/signup')}>Sign Up</Text>
        <Text style={styles.btn} onPress={() => router.push('/home')}>Home</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#FF7600',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 40,
    color: '#fff',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 126.5,
    marginBottom: 36,
  },
  btnList: {
    gap: 16,
  },
  btn: {
    textAlign: 'center',
    backgroundColor: '#fff',
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    color: '#092568',
    width: 240,
    padding: 18,
    borderRadius: 24,
  }
})
