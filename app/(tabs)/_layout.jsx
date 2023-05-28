
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Budget from "./Budget";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export const unstable_settings = {
    initialRouteName: "Home",
};

export default function HomeLayout() {
    const Tab = createBottomTabNavigator(); 

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Budget" component={Budget}/>
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>

    );
}