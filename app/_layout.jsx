import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider } from "../contexts/auth";

export default function Root() {
  // Load custom fonts into app 
  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    // Setup the auth context and render our layout inside of it.
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
