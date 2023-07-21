import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import MonthYearPicker from "../components/MonthYearPicker";
import { 
  GetLastYearMonths, 
  GetMonthlyExpensesSortedByDate, 
  GetPastYearExpensesSum,
  GetPastYearMoneyIn, 
  GetProfilePic
} from "../components/GetBackendData"; 
import VerticalBarChart from "../components/VerticalBarChart";
import PieChartContainer from "../components/PieChartContainer";
import { ActivityIndicator } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import LineGraph from "../components/LineGraph";
import ProfilePic from "../components/ProfilePic";


function Dashboard() {
  const [monthlyExpensesList, setMonthlyExpensesList] = useState([]); 
  const [sixMonthsExpensesSum, setSixMonthsExpensesSum] = useState([]); 
  const [pastYearExpensesSum, setPastYearExpensesSum] = useState([]); 
  const [monthlyExpensesSum, setMonthlyExpensesSum] = useState(0);
  const [sixMonthsMoneyInSum, setSixMonthsMoneyInSum] = useState([]); 
  const [pastYearMoneyInSum, setPastYearMoneyInSum] = useState([]); 
  const [profilePicture, setProfilePicture] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lastSixMonths, setLastSixMonths] = useState([]); 
  const [lastYearMonths, setLastYearMonths] = useState([]); 

  const isFocused = useIsFocused();

  // Fetch expenses and money in for the past year
  const fetchData = async () => {
    // Get data
    setLoading(true); 
    const expenses = await GetMonthlyExpensesSortedByDate(selectedMonth, selectedYear); 
    const lastYearExpensesSum = await GetPastYearExpensesSum(selectedMonth, selectedYear);  
    const lastYearMoneyInSum = await GetPastYearMoneyIn(selectedMonth, selectedYear);

    // Update states
    setMonthlyExpensesList(expenses);  
    setMonthlyExpensesSum(lastYearExpensesSum[lastYearExpensesSum.length - 1]); 
    setSixMonthsExpensesSum(lastYearExpensesSum.slice(6, lastYearExpensesSum.length)); 
    setPastYearExpensesSum(lastYearExpensesSum); 
    setSixMonthsMoneyInSum(lastYearMoneyInSum.slice(6, lastYearMoneyInSum.length)); 
    setPastYearMoneyInSum(lastYearMoneyInSum);    
    setLoading(false); 
  }

  useEffect(() => {
    // Fetch data again if user navigates back to dashboard page
    if (isFocused) {
      fetchData(); 
    }
  }, [selectedYear, selectedMonth, isFocused]); 

    // Fetch profile picture from backend
    const fetchProfilePic = async () => {
      const profilePic = await GetProfilePic(); 
      setProfilePicture(profilePic); 
    }; 

    useEffect(() => {
      fetchProfilePic();
    }, [fetchProfilePic]);


  // Fetch the necessary months for the charts
  const fetchMonths = async () => {
    const pastYearMonths = await GetLastYearMonths(selectedMonth, selectedYear); 
    setLastSixMonths(pastYearMonths.slice(6, pastYearMonths.length)); 
    setLastYearMonths(pastYearMonths); 
  }; 

  useEffect(() => {
    fetchMonths(); 
  }, [selectedMonth, selectedYear]); 

  
  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA" }}>
      <View style={styles.topContainer}>
        <View style={{ marginBottom: -45 }}>
          <ProfilePic profilePicture={profilePicture} />
        </View>
        <MonthYearPicker onSelect={handleDateSelect} />
        <Text style={styles.headerText}>Dashboard</Text>
      </ View>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} scrollEventThrottle={16}>
        {loading && <ActivityIndicator />}
        <PieChartContainer 
          monthlyExpensesList={monthlyExpensesList}
          monthlyExpensesSum={monthlyExpensesSum}
        />
        <VerticalBarChart 
          lastSixMonths={lastSixMonths}
          sixMonthsMoneyInSum={sixMonthsMoneyInSum}
          sixMonthsExpensesSum={sixMonthsExpensesSum}  
        />
        <LineGraph 
          lastYearMonths={lastYearMonths}
          pastYearMoneyIn={pastYearMoneyInSum}
          pastYearExpenses={pastYearExpensesSum}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 35,
    textAlign: "center",
    marginTop: 20,
  },
  pieChartContainer: {
    backgroundColor: "#EEF5FF",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});


export default Dashboard; 