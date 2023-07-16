import {  ProgressBar } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

const BudgetProgressBar = ({ expenses, income } ) => {
    const [monthlyExpenses, setMonthlyExpenses] = useState(0); 
    const [progressValue, setProgressValue] = useState(0);
    const [balance, setBalance] = useState(0); 

    useEffect(() => {
      const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0); 
      setMonthlyExpenses(totalMonthlyExpenses); 
      
      if (income === 0) {
        setProgressValue(0);
        setBalance(0); 
      } else {
        setProgressValue(monthlyExpenses / income);
        setBalance(income - monthlyExpenses);
      }
    }, [expenses, income]);

    
    // Determine the colours of progress bar
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
        <Text style={styles.expensesText}>S${monthlyExpenses}</Text>
        <View style={styles.container}>
          <View style={styles.wordsContainer}>
            <View>
              <Text style={styles.wordText}>Balance</Text>
              <Text style={styles.moneyText}>S$ {balance}</Text>
            </View>
            <View>
              <Text style={styles.wordText}>Monthly Budget</Text>
              <Text style={styles.moneyText}>S$ {income}</Text>
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
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
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
