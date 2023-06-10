import React from "react";
import Budget from "./(budgetTabs)/Budget";
import CreateBudget from "./(budgetTabs)/CreateBudget";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const BudgetScreenNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Budget"
                component={Budget}
                />
            <Stack.Screen
            name="CreateBudget"
            component={CreateBudget}
            />
        </Stack.Navigator>
    );
}
export {BudgetScreenNavigator}; 