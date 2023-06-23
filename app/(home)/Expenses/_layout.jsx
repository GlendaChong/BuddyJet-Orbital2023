import { Stack } from "expo-router";


function ExpensesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="Expenses" />
    );
}

export default ExpensesLayout; 
