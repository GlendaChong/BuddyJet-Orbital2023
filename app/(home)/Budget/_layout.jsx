import { Stack } from "expo-router";
import { AuthProvider } from "../../../contexts/auth";


function BudgetLayout() {
    return (

        <Stack screenOptions={{ headerShown: false }} initialRouteName="Budget" />

    );
}

export default BudgetLayout; 