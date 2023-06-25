import { StyleSheet, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FAB, SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import SortExpensesByDate from "./SortExpensesByDate";
import SortExpensesByCategories from "./SortExpensesByCategories";
import MonthYearPicker from "../../components/MonthYearPicker";
import BudgetProgressBar from "../../components/BudgetProgressBar";

const AddExpensesButton = () => {
  const router = useRouter(); 
  return (
    <FAB
      icon="plus"
      style={styles.addExpensesButton}
      onPress={() => router.push("./Expenses/AddExpenses")}
      color="white"
    />
  ); 
}; 

const SelectSortingOrder = ({ onToggle }) => {
  const [value, setValue] = useState('Date');

  const handleToggle = (selectedValue) => {
    setValue(selectedValue);
    onToggle(selectedValue);
  };

  return (
    <SegmentedButtons
      style={styles.segmentedButtonContainer}
    
      value={value}
      onValueChange={handleToggle}
      buttons={[
        { value: 'Date', label: 'Date' },
        { value: 'Categories', label: 'Categories' },
      ]}
    />
  ); 
}

function Expenses() {
  const [sortingOrder, setSortingOrder] = useState("Date");

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [refreshed, setRefreshed] = useState(false); 


  const handleSortingOrderToggle = (selectedOrder) => {
    setSortingOrder(selectedOrder);
  };

  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <MonthYearPicker onSelect={handleDateSelect}/>
        <View>
          <BudgetProgressBar 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear}
            />
        </View>
        <SelectSortingOrder onToggle={handleSortingOrderToggle}/>
      </View>
      {sortingOrder === "Date" ? (
        <SortExpensesByDate selectedMonth={selectedMonth} selectedYear={selectedYear} />
      ) : (
        <SortExpensesByCategories selectedMonth={selectedMonth} selectedYear={selectedYear} />
      )}

      <AddExpensesButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white', 
  }, 
  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  segmentedButtonContainer: {
    marginTop: 20,
  }, 
  SegmentedButtons: {
    fontSize: 15, 
  }
}); 

export default Expenses; 