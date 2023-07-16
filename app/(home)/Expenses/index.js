import { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FAB, SegmentedButtons } from "react-native-paper";
import SortExpensesByDate from "./SortExpensesByDate";
import SortExpensesByCategories from "./SortExpensesByCategories";
import MonthYearPicker from "../../components/MonthYearPicker";
import BudgetProgressBar from "../../components/BudgetProgressBar";
import {
  GetMonthlyExpensesSortedByCat,
  GetMonthlyExpensesSortedByDate,
  GetMoneyIn,
} from "../../components/GetBackendData";
import ProfilePic from "../../components/ProfilePic";

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
  const [value, setValue] = useState("Date");

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
        { value: "Date", label: "Date" },
        {
          value: "Categories",
          label: "Categories",
          testID: "categories-button",
        },
      ]}
    />
  );
};

function Expenses() {
  const [sortingOrder, setSortingOrder] = useState("Date");
  const [refreshing, setRefreshing] = useState(false);
  const [expensesSortedByCat, setExpensesSortedByCat] = useState([]);
  const [expensesSortedByDate, setExpensesSortedByDate] = useState([]);
  const [currentIncome, setCurrentIncome] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Handle sorting order between list as dates or categories
  const handleSortingOrderToggle = (selectedOrder) => {
    setSortingOrder(selectedOrder);
  };

  // Handle updating of data based on month and year
  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Fetch monthly expenses from backend
  const fetchExpenses = useCallback(async () => {
    setRefreshing(true);
    const expensesSortedByCat = await GetMonthlyExpensesSortedByCat(
      selectedMonth,
      selectedYear
    );
    const expensesSortedByDate = await GetMonthlyExpensesSortedByDate(
      selectedMonth,
      selectedYear
    );
    const moneyIn = await GetMoneyIn(selectedMonth, selectedYear);
    setExpensesSortedByCat(expensesSortedByCat);
    setExpensesSortedByDate(expensesSortedByDate);
    setCurrentIncome(moneyIn);
    setRefreshing(false);
  }, [selectedYear, selectedMonth, expensesSortedByDate, currentIncome]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={{ marginBottom: -45 }}>
          <ProfilePic />
        </View>
        <MonthYearPicker onSelect={handleDateSelect} />

        <View>
          <BudgetProgressBar
            expenses={expensesSortedByDate}
            income={currentIncome}
          />
        </View>
        <SelectSortingOrder onToggle={handleSortingOrderToggle} />
      </View>
      {refreshing && <ActivityIndicator />}
      {sortingOrder === "Date" ? (
        <SortExpensesByDate
          expenses={expensesSortedByDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      ) : (
        <SortExpensesByCategories
          expenses={expensesSortedByCat}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      <AddExpensesButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 7,
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
  },
});

export default Expenses;
