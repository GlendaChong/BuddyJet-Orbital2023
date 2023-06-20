import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "react-native-paper";

const AddExpensesButton = () => {
  const router = useRouter(); 
  
  return (
      <IconButton
        mode="contained"
        containerColor="#3D70FF"
        icon="plus"
        iconColor={"white"}
        size={30}
        onPress={() => router.push("./Expenses/AddExpenses")} 
        style={styles.addExpensesButton}
      />
  )
}; 


function Expenses() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>This is the home page. Work in progress!</Text>
      </ScrollView>
      <AddExpensesButton />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white', 
  }, 
  circle: {
    borderBottomColor: "red"
  },
  addExpensesButton: {
    width: 65,
    height: 65, 
    backgroundColor: "#3D70FF", 
    borderRadius: 100, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20, 
    bottom: 10,
  },
}); 

export default Expenses; 