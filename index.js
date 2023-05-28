import "expo-router/entry";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./app";
import Login from "./app/(authentication)/Login";
import CreateAccount from "./app/(authentication)/CreateAccount";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeLayout from "./app/(tabs)/_layout";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView>
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="Onboarding Screen" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Create Account" component={CreateAccount} />
              <Stack.Screen name="Home" component={HomeLayout} />
            </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
   
  ); 
}