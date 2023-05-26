import "expo-router/entry";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./app";
import Login from "./app/(authentication)/Login";
import CreateAccount from "./app/(authentication)/CreateAccount";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding Screen" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create Account" component={CreateAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}