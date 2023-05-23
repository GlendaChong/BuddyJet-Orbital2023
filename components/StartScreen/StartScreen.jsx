import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';

function CreateAccount() {
    return (
      <Button 
        mode="contained" 
        onPress={() => console.log('Create Account button pressed')} 
        style={styles.createAccountButton}
        labelStyle={styles.createAccountText}
      >
        Create Acount
      </Button>
    ); 
}

function Login() {
    return (
      <Button 
        mode="outlined" 
        onPress={() => console.log('Login button pressed')} 
        style={styles.loginButton}
        labelStyle={styles.loginText}
      >
        Login Now
        </Button>
    ); 
}

function StartScreen() {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('orbital-app/assets/onboarding.jpg')}/>
      <Text style={styles.mainText}>BuddyJet</Text>
      <Text style={styles.descriptionText}>A buddy to help with your budget!</Text>
      <CreateAccount />
      <Login />
      <StatusBar style="auto" />
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  createAccountButton: {
    position: 'absolute', 
    left: '8.5%', 
    right: '8.5%', 
    top: '72.65%', 
    bottom: '19.95%', 
    backgroundColor: '#3D70FF',
    borderRadius: 40, 
  }, 

  loginButton: {
    position: 'absolute', 
    left: '8.5%', 
    right: '8.5%', 
    top: '82.63%', 
    bottom: '10.21%', 
    borderColor: '#100D40',
    borderRadius: 40, 
  }, 

  image: {
    position: 'absolute', 
    width: 325,
    height: 237, 
    left: 33, 
    top: 168, 
  }, 
  
  mainText: {
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 35, 
    lineHeight: 52, 
    position: 'absolute', 
    width: 170,
    height: 53,
    left: 110,
    top: 454,
    color: '#100D40',
    textAlign: 'center', 
  },

  descriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    opacity: 0.65, 
    lineHeight: 24, 
    position: 'absolute', 
    width: 347, 
    height: 24, 
    left: 23, 
    top: 525, 
    color: '#100D40',
    textAlign: 'center', 
  }, 

  createAccountText: {
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 18, 
    lineHeight: 40, 
  },

  loginText: {
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 18, 
    lineHeight: 40, 
    color: '#100D40',
  }
});  

export default StartScreen; 