import "expo-router/entry";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import HomeLayout from "./app/(tabs)/_layout";
import AuthLayout from "./app/(authentication)/_layout";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Onboarding Screen" component={AuthLayout} />
            <Stack.Screen name="Home" component={HomeLayout} />
          </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
   
  ); 
}

// ios: 269503627700-78cs6nkpjjbfvckl3s46m4smlvf6tkcl.apps.googleusercontent.com