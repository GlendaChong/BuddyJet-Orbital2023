
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./Home";
import Budget from "./(budgetTabs)/Budget";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import CreateBudget from "./(budgetTabs)/CreateBudget";


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
            {/* <Tab.Screen name ="CreateBudget" component={CreateBudget}/> */}
        </Tab.Navigator>

    );
}

const BudgetStackNavigator = createStackNavigator();

function BudgetStack() {
  return (
    <BudgetStackNavigator.Navigator>
      <BudgetStackNavigator.Screen name="CreateBudget" component={CreateBudget} />
    </BudgetStackNavigator.Navigator>
  );
}

