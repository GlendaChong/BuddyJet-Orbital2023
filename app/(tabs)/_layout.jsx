import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faChartColumn, faCalculator, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Budget from "./Budget";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

const CustomTabBarButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity 
            style={{
                top: -30, 
                justifyContent: 'center', 
                alignItems: 'center', 
            }}
            onPress={onPress}
        > 
            <View style={styles.addExpensesButton}>
                {children}
            </View>
        </TouchableOpacity>
    )
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