import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faChartColumn, faCalculator, faUser } from "@fortawesome/free-solid-svg-icons";
import { Tabs } from "expo-router";


export const unstable_settings = {
    initialRouteName: "Expenses",
};

function HomeLayout() {

    return (
        <Tabs>
            <Tabs.Screen name="Expenses"
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faHouse} color={color} />
                    ),
                    tabBarLabelStyle: {
                        display: "flex"
                    },
                    headerShown: false,
                }}
            />

            <Tabs.Screen name="Budget"
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faCalculator} color={color} />
                    ),
                    tabBarLabelStyle: {
                        display: "flex"
                    },
                    headerShown: false,
                }}
            />

            <Tabs.Screen name="Dashboard"
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faChartColumn} color={color} />
                    ),
                    tabBarLabelStyle: {
                        display: "flex"
                    },
                    headerShown: false,
                }}
            />

            <Tabs.Screen name="Profile"
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faUser} color={color} />
                    ),
                    tabBarLabelStyle: {
                        display: "flex"
                    },
                    headerShown: false,
                }}
            />

        </Tabs>
    );
}

export default HomeLayout; 