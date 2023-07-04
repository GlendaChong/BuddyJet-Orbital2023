import { Stack } from "expo-router";
import React  from 'react';

function ExpensesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="Expenses" />
    );
}

export default ExpensesLayout; 
