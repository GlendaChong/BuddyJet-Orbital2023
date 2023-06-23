import { Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, FlatList } from "react-native-gesture-handler";
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
  ); 
}; 

const IndividualExpenseBox = ({ expense }) => {
  return (
    <View style={styles.expenseBox}>
      <View style={styles.columnDirection}>
          <Text key={expense.id} style={styles.expenseDescription}>
            {expense.description}
          </Text>
          <Text style={styles.expenseCategory}>{expense.category}</Text>
      </View>
      <View style={styles.columnDirection}>
        <Text style={styles.expenseAmount}>SGD {expense.amount}</Text>
      </View>
    </View>
  ); 
}; 

function Expenses() {
  const [expenses, setExpenses] = useState([]); 
  const [refreshing, setRefreshing] = useState(false);

  // Fetch expenses from backend
  async function fetchExpenses() {
      setRefreshing(true);
      let { data } = await supabase.from('expenses').select('*').order("date", { ascending: false });
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

  const groupExpensesByDate = (expenses) => {
    const groupedExpenses = {};
    for (const expense of expenses) {
      const expenseDate = new Date(expense.date);
      const formattedDate = expenseDate.toLocaleDateString("en-GB");
      if (groupedExpenses[formattedDate]) {
        // Exists an expenses with the same date, so the group is already created
        groupedExpenses[formattedDate].push(expense);
      } else {
        groupedExpenses[formattedDate] = [expense];
      }
    }
    return groupedExpenses;
  };

  
  const renderExpenseSection = ({ item }) => {
    const currentDate = new Date().toDateString();
    const { sectionDate, sectionExpenses } = item;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>
          {sectionDate === currentDate
            ? "Today"
            : sectionDate === new Date().setDate(new Date().getDate() - 1)
            ? "Yesterday"
            : sectionDate}
        </Text>
        {sectionExpenses.map((expense) => (
          <IndividualExpenseBox key={expense.id} expense={expense} />
        ))}
      </View>
    );
  };

  const groupedExpenses = groupExpensesByDate(expenses);
  const expenseSections = Object.keys(groupedExpenses).map((date) => ({
    sectionDate: date,
    sectionExpenses: groupedExpenses[date],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenseSections}
        renderItem={renderExpenseSection}
        keyExtractor={(item) => item.sectionDate}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchExpenses} />
        }
      />
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
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '100D40', 
    fontFamily: 'Poppins-SemiBold',
  },
  expenseText: {
    fontSize: 16,
    marginBottom: 5,
  },
  expenseBox: {
    backgroundColor: '#F3F6FA',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  columnDirection: {
    backgroundColor: '#F3F6FA',
    padding: 16,
    flexDirection: 'column',
  },
  expenseDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold'
  },
}); 

export default Expenses; 