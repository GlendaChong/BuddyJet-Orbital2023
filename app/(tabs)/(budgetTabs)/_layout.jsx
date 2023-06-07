import { Stack } from "expo-router";
import { Router, Route } from 'expo-router';
import Budget from "./Budget";
import CreateBudget from "./CreateBudget";


export const unstable_settings = {
    initialRouteName: "Budget",
};

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="Budget" />
    );
}




  