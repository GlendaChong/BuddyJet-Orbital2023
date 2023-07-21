import { Stack, Screen } from "expo-router";
// import OnboardingScreen from "./index"
// import Login from "./Login"



export const unstable_settings = {
    initialRouteName: "OnboardingScreen",
};


function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="OnboardingScreen" />
    );
}

export default AuthLayout;

// function AuthLayout() {
//     return (
//         <Stack>
//             <Screen name="OnboardingScreen" component={OnboardingScreen} />
//             <Screen name="Login" component={Login} />
//             {/* Add more screens here */}
//         </Stack>
//     );
// }

// export default AuthLayout;