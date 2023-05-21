import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-paper'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import  StartScreen from 'orbital-app/components/StartScreen/StartScreen.jsx';
import { useFonts } from 'expo-font'; 


export default function App() {
  const [loaded] = useFonts({
    'Poppins-Regular': require('orbital-app/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('orbital-app/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('orbital-app/assets/fonts/Poppins-Medium.ttf'), 
  });
  
  if (!loaded) {
    return null;
  }
  
  return (
      <StartScreen />
    );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
