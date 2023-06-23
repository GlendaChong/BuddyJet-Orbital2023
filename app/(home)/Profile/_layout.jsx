import { Stack } from "expo-router";


function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="Profile" />

    );
}
export default ProfileLayout; 