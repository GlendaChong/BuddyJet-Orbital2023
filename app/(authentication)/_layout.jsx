import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "OnboardingScreen",
};

function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="OnboardingScreen" />
    );
}

export default AuthLayout; 