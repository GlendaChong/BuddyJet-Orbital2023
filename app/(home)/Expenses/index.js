import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { useRouter, useSearchParams } from "expo-router";
import { FAB } from "react-native-paper";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const AddExpensesButton = () => {
  const router = useRouter(); 

  return (
    <FAB
      icon="plus"
      style={styles.addExpensesButton}
      onPress={() => router.push("./Expenses/AddExpenses")}
    />
  )
}; 

function Expenses() {
  const [expenses, setExpenses] = useState([]); 
  const [refreshing, setRefreshing] = useState(false);

  async function fetchExpenses() {
      setRefreshing(true);
      let { data } = await supabase.from('expenses').select('*');
      setRefreshing(false);
      setExpenses(data);
  }

  useEffect(() => {
      fetchExpenses();
  }, []);

  useEffect(() => {
      if (refreshing) {
          fetchExpenses();
          setRefreshing(false);
      }
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchExpenses} />
        }
      >
        {expenses.map((expense) => (
          <Text key={expense.id}>{expense.description}</Text>
        ))}
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
    color: "#FFFFFF", 
  },
}); 

export default Expenses; 