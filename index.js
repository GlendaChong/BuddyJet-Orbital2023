import "expo-router/entry";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import HomeLayout from "./app/(home)/_layout";
import AuthLayout from "./app/(authentication)/_layout";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";


function App() {
  const Stack = createNativeStackNavigator();
  
  return (
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Onboarding Screen" component={AuthLayout} />
              <Stack.Screen name="Home" component={HomeLayout} />
            </Stack.Navigator>
        </NavigationContainer>
    </QueryClientProvider>
   
  ); 
}

export default App; 

