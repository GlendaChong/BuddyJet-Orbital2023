import { Text, StyleSheet,  View } from "react-native";
import { RefreshControl, FlatList } from "react-native-gesture-handler";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import IndividualExpenseBox from "../../components/ExpensesBox";

function SortExpensesByCategories({ selectedMonth, selectedYear }) {
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
          .order("category")
          .order("date", { ascending: false })
          .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
          .lt('date', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);
              
        setRefreshing(false);
        setExpenses(data);
      }, [selectedYear, monthIndex]); 
      
      useEffect(() => {
        fetchExpenses();
      }, [fetchExpenses]);

  
    const groupExpensesByCategories = (expenses) => {
        const groupedCategories = {};

        if (!expenses) {
            return groupedCategories;
        }
        
        for (const expense of expenses) {
            const category = expense.category; 
            if (groupedCategories[category]) {
                groupedCategories[category].push(expense);
            } else {
                groupedCategories[category] = [expense];
            }
        }
        return groupedCategories;
    };


    const renderExpenseSection = ({ item }) => {
        const { sectionCategory, sectionExpenses } = item;

        return (
            <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>
                {sectionCategory}
            </Text>
            {sectionExpenses.map((expense) => (
                <IndividualExpenseBox key={expense.id} expense={expense} />
            ))}
            </View>
        );
    };

    const groupedCategories = groupExpensesByCategories(expenses);
    const expenseSections = Object.keys(groupedCategories).map((category) => ({
    sectionCategory: category,
    sectionExpenses: groupedCategories[category],
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
            keyExtractor={(item) => item.sectionCategory}
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


export default SortExpensesByCategories; 
