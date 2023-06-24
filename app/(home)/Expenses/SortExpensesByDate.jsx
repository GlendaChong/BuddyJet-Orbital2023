import { Text, StyleSheet,  View } from "react-native";
import { RefreshControl, FlatList } from "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import IndividualExpenseBox from "../../components/ExpensesBox";

function SortExpensesByDate({ selectedMonth, selectedYear }) {
    const [expenses, setExpenses] = useState([]); 
    const [refreshing, setRefreshing] = useState(false);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(selectedMonth) + 1;

    // Fetch monthly expenses from backend
    const fetchExpenses = useCallback(async () => {
        setRefreshing(true);
        let { data } = await supabase
          .from('expenses')
          .select('*')
          .order("date", { ascending: false })
          .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
          .lt('date', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);
              
        setRefreshing(false);
        setExpenses(data);
      }, [selectedYear, monthIndex]); 
      
      useEffect(() => {
        fetchExpenses();
      }, [fetchExpenses]);

    const groupExpensesByDate = (expenses) => {
        const groupedExpenses = {};

        if (!expenses) {
          return groupedExpenses;
        }
      
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

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchExpenses();
        setRefreshing(false);
      }, [fetchExpenses]);
    
    return (
        <FlatList
        data={expenseSections}
        renderItem={renderExpenseSection}
        keyExtractor={(item) => item.sectionDate}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    ); 
}


const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      fontSize: 18,
      marginBottom: 10,
      color: '#100D40', 
      fontFamily: 'Poppins-SemiBold',
    },
  }); 


export default SortExpensesByDate; 
