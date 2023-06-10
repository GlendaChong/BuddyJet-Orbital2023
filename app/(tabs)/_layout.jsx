import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faChartColumn, faCalculator, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";


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
                    } 
                }} 
            />

            <Tabs.Screen name="Budget" 
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faCalculator} color={color} />   
                    ), 
                    tabBarLabelStyle: {
                        display: "flex"
                    }
                }} 
            />

            <Tabs.Screen name="AddExpenses"
                options={{
                    tabBarIcon: () => (
                        <FontAwesomeIcon icon={faPlus} color={"white"} size={30} />
                    ), 
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ), 
                    tabBarLabelStyle: {
                        display: "none"
                    } 
                }}
            
            />
            <Tabs.Screen name="Dashboard" 
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon icon={faChartColumn} color={color} />
                    ), 
                    tabBarLabelStyle: {
                        display: "flex"
                    }
                }}
            />

            <Tabs.Screen name="Profile" 
              options={{
                tabBarIcon: ({ color }) => (
                    <FontAwesomeIcon icon={faUser} color={color} />
                ), 
                tabBarLabelStyle: {
                    display: "flex"
                }
            }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    addExpensesButton: {
        width: 65,
        height: 65, 
        backgroundColor: "#3D70FF", 
        borderRadius: 100, 
    }, 

}); 

export default HomeLayout; 
