import { View, Text } from "react-native";
import { Stack, useRouter } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Detail Screen" }} />
      <Text>Hello. This is the home page. </Text>
    </View>
  );
}

//https://fonts.google.com/specimen/Encode+Sans+Semi+Condensed