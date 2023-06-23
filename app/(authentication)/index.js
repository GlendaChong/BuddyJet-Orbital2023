import { StyleSheet, View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

function OnboardingScreen() {
  const router = useRouter();

  const CreateAccountButton = () => {
    return (
      <Button
      mode="contained" 
      style={styles.createAccountButton}
      labelStyle={styles.createAccountText}
      onPress={() => router.push('./CreateAccount')}
      >
        Create Acount
      </Button>
    ); 
  };
   
  const LoginButton = () => {
    return (
      <Button 
      mode="outlined" 
      style={styles.loginButton}
      labelStyle={styles.loginText}
      onPress={() => router.push("./Login")}
      > 
        Login Now
      </Button>       
    ); 
  }

  const Design = () => {
    return (
      <View>
        <Image style={styles.image} source={require('../../assets/onboarding.jpg')}/>
        <Text style={styles.mainText}>BuddyJet</Text>
        <Text style={styles.descriptionText}>A buddy to help with your budget!</Text>
      </View>
    ); 
  }

  return (
    <View style={{ flex:1, backgroundColor: '#fff' }}>
      <Design />
      <CreateAccountButton /> 
      <LoginButton />
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  image: {
    position: 'absolute', 
    width: 325,
    height: 237,
    alignSelf: 'center',  
    top: 168, 
  }, 
  
  mainText: {
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 35, 
    lineHeight: 52, 
    top: 454,
    color: '#100D40',
    textAlign: 'center', 
  },

  descriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    opacity: 0.65, 
    lineHeight: 24, 
    top: 470, 
    color: '#100D40',
    textAlign: 'center', 
  }, 

  createAccountButton: {
    position: 'absolute', 
    left: '8.5%', 
    right: '8.5%', 
    top: 600, 
    backgroundColor: '#3D70FF',
    borderRadius: 40, 
  }, 

  loginButton: {
    position: 'absolute', 
    left: '8.5%', 
    right: '8.5%', 
    top: 675, 
    borderColor: '#100D40',
    borderRadius: 40, 
  }, 

  createAccountText: {
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 18, 
    lineHeight: 40, 
    textAlign: 'center'
  },

  loginText: {
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 18, 
    lineHeight: 40, 
    color: '#100D40',
    textAlign: 'center',
  }
});  

export default OnboardingScreen; 