import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "OnboardingScreen",
};

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="OnboardingScreen" />
    );
}