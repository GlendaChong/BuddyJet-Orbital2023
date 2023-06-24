import {  ProgressBar } from "react-native-paper";
import { useEffect, useState} from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Text } from "react-native";

const BudgetProgressBar = ({ selectedMonth, selectedYear } ) => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [budget, setBudget] = useState(0);
    const [loading, setLoading] = useState(true); 
    const [progressValue, setProgressValue] = useState(0);
  
    useEffect(() => {
      const fetchData = async () => {
        // Get existing income from backend
        let { data: budgetIncome, error: budgetError } = await supabase
          .from('budget')
          .select('income')
          .eq('in_use', true);
  
        if (budgetError) {
          console.error('Error fetching income', budgetError);
          return;
        }
  
        const currentIncome = parseInt(budgetIncome[0]?.income);
        setBudget(currentIncome);
  
        // Get total monthly expenses from backend
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
  
        const monthIndex = monthNames.indexOf(selectedMonth) + 1;
  
        let { data: amount, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
          .lt('date', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);
  
        if (expensesError) {
          console.error('Error fetching expenses', amount);
          return;
        }
  
        const totalMonthlyExpenses = amount.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(totalMonthlyExpenses);
        setLoading(false);
      };
  
      fetchData();
    }, [selectedMonth, selectedYear]);
  
    useEffect(() => {
      if (loading || budget === 0) {
        setProgressValue(0);
      } else {
        setProgressValue(totalExpenses / budget);
      }
    }, [loading, budget, totalExpenses]);
  
  
    let color = '#32D74B'; 
    
    if (progressValue >= 0.75) {
      color = '#FF453A'
    } else if (progressValue >= 0.5) {
      color = '#FF9F0A'
    } else if (progressValue >= 0.25) {
      color = '#FFD60A'
    }
  
    return (
      <View>
        <Text style={styles.expensesText}>S${totalExpenses}</Text>
        <View style={styles.container}>
          <View style={styles.wordsContainer}>
            <View>
              <Text style={styles.wordText}>Balance</Text>
              <Text style={styles.moneyText}>S$ {budget - totalExpenses}</Text>
            </View>
            <View>
              <Text style={styles.wordText}>Monthly Budget</Text>
              <Text style={styles.moneyText}>S$ {budget}</Text>
            </View>
          </View>
          <ProgressBar progress={progressValue} color={color} style={styles.progressBar} />
        </View> 
      </View>
     
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', 
    backgroundColor: '#000E90', 
    borderRadius: 20, 
    height: 100, 
    justifyContent: 'center', 
    marginTop: 10, 
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5, 
  },
  wordsContainer: {
    justifyContent: 'space-between', 
    flexDirection: 'row', 
  }, 
  expensesText: {
    color: '#100D40', 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 48, 
    textAlign: 'center',  
  }, 
  wordText: {
    color: "#FFFFFF", 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 14, 
    paddingHorizontal: 25, 
  }, 
  moneyText: {
    color: "#FFFFFF", 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 16, 
    paddingHorizontal: 25,   
  }, 
  progressBar: {
    marginTop: 15, 
    marginBottom: 10, 
    marginLeft: 25,  
    height: 10,
    borderRadius: 10,
    width: 300, 
  }, 
})
export default BudgetProgressBar; 
