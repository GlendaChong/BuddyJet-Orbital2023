
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Budget from "./(budgetTabs)/Budget";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import {BudgetScreenNavigator} from './CustomNavigation'
import CreateBudget from "./(budgetTabs)/CreateBudget";
import { NavigationContainer } from "@react-navigation/native";


export const unstable_settings = {
    initialRouteName: "Home",
};

const HomeLayout = () => {
    const Tab = createBottomTabNavigator(); 

    return (
        <>
        <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Budget" component={Budget}/>
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
        </NavigationContainer>
        </>

    );
}

export default HomeLayout;