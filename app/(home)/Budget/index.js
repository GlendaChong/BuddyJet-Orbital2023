import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  CheckMonthlyBudgetExist, 
  GetCategoryDetails, 
  GetMoneyIn 
} from "../GetBackendData";
import MonthYearPicker from "../../components/MonthYearPicker";


// Case when user has not created any monthly budget for current month
const CreateBudgetDesign = () => {
  return (
    <View styles={{ paddingTop: 200, }}>
      <Image style={styles.image} source={require('../../../assets/budget.jpeg')} />
      <Text style={styles.mainText}>No Monthly Budget</Text>
      <Text style={styles.descriptionText}>You have not created this month's budget</Text>
    </View>
  ); 
}


// Case when user did not create any budget for previous months
const NoBudgetDesign = () => {
  return (
    <View styles={{ paddingTop: 200, }}>
      <Image style={styles.image} source={require('../../../assets/budget.jpeg')} />
      <Text style={styles.mainText}>No Monthly Budget</Text>
      <Text style={styles.descriptionText}>You did not create any budget for this month</Text>
    </View>
  ); 
}


// Financial tip for users with monthly budget
const FinancialTip = () => {
  return (
    <View style={styles.financialTipContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 10 }}>
          <FontAwesomeIcon icon={faLightbulb} size={30} style={{ color: "#FF9F1A" }} />
        </View>
        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>Financial Tip!</Text>
      </View>
      <Text style={styles.financialTipText}>
        Save regularly: Make saving a priority by setting aside a portion of your income each month. 
        Start with a small amount and gradually increase it over time.
      </Text>
    </View>
  );
}

export default function Budget() {
  const router = useRouter();
  const [monthlyBudgetExist, setMonthlyBudgetExist] = useState(false);
  const [categories, setCategories] = useState([]);
  const [monthlyBudgetIncome, setMonthlyBudgetIncome] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Retrieve the selected months and year 
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Convert the selectedMonth to numerical value
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  // Get data from backend
  const fetchData = useCallback(async () => {
    setRefreshing(true); 

    const checkBudget = await CheckMonthlyBudgetExist(selectedMonth, selectedYear); 
    const categories = await GetCategoryDetails(selectedMonth, selectedYear);
    const moneyIn = await GetMoneyIn(selectedMonth, selectedYear); 

    setMonthlyBudgetExist(checkBudget); 
    setCategories(categories); 
    setMonthlyBudgetIncome(moneyIn); 
    setRefreshing(false); 
    
  }, [selectedMonth, selectedYear, monthlyBudgetExist, categories, monthlyBudgetIncome]); 

  useEffect(() => {
    fetchData(); 
  }, [fetchData]); 


  // Case when user has created a monthly budget
  const BudgetBox = () => {
    const router = useRouter(); 

    return (
      <View>
        <Text 
          style={styles.editText}
          onPress={()=> {
            router.push({
              pathname: '../Budget/EditBudget',
              params: { selectedMonth, selectedYear }
            });
          }} 
        > 
          Edit
        </Text> 
        <View style={styles.budgetBoxContainer}>
          {categories.map((item, index) => (
            <View key={index} style={styles.categoryContainer} >
                <View style={[styles.categoryColor, { backgroundColor: item.color }] }/>
                <Text style={styles.categoryNormalText}>{item.category}</Text>
                <Text style={styles.categoryBoldText}>${(monthlyBudgetIncome * item.spending).toFixed(0)}</Text>
                <Text style={styles.categoryNormalText}>{`${(item.spending * 100).toFixed(0)}%`}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      {refreshing && <ActivityIndicator />}
      <View style={styles.topContainer}>
          <MonthYearPicker onSelect={handleDateSelect}/>
      </View>

      {(selectedYear == new Date().getFullYear() && (monthIndex < new Date().getMonth() + 1)) || 
          selectedYear < new Date().getFullYear()
      ? (
        <View style={{ marginTop: 110 }}>
          <NoBudgetDesign />
        </View>
      ) 
      : monthlyBudgetExist ? (
        <View style={styles.topContainer}>
          <Text style={{fontFamily:'Poppins-Regular', color:'#2C2646', fontSize: 18, textAlign: 'center'}}>Monthly Budget</Text>
          <Text style={{fontFamily:'Poppins-SemiBold', color:'#2C2646', fontSize: 48, textAlign: 'center'}}>${monthlyBudgetIncome}</Text>
          <BudgetBox />
          <FinancialTip />
        </View>
      ) : (
        <View style={{ marginTop: 110 }}>
          <CreateBudgetDesign />
          <Button
            mode="contained" 
            style={styles.createBudgetButton}
            labelStyle={styles.createBudgetText}
            onPress={() => {
              router.push({
                pathname: './Budget/CreateBudget', 
                params: { selectedMonth, selectedYear, monthIndex }
              }); 
            }}
          >
            Create a budget
          </Button>
        </View>
      )}
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
  },
  image: {
    width: 254,
    height: 280,
    alignSelf: 'center', 
  }, 
  mainText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
    lineHeight: 52,
    color: '#100D40',
    textAlign: 'center',
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    opacity: 0.65,
    lineHeight: 24,
    color: '#100D40',
    textAlign: 'center',
  },
  createBudgetButton: {
    height: 56, 
    marginTop: 50, 
    width: 250,
    backgroundColor: '#3D70FF',
    borderRadius: 40, 
    justifyContent: 'center', 
    alignSelf: 'center'
  }, 
  createBudgetText: {
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 18, 
    lineHeight: 30, 
    textAlign: 'center',
    color: '#FFFFFF'
  },
  editText: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 15, 
    left: 315, 
    marginBottom: 10, 
  }, 
  budgetBoxContainer: {
    backgroundColor: '#000E90', 
    borderRadius: 18, 
    paddingHorizontal: 30, 
    paddingTop: 15, 
    paddingBottom: 8, 
  }, 
  categoryContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
  }, 
  categoryColor: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 20 
  },
  categoryBoldText: { 
    fontFamily: 'Poppins-SemiBold', 
    fontSize:18, 
    width: 85, 
    color:'#FFFFFF', 
  }, 
  categoryNormalText: { 
    fontFamily: 'Poppins-Medium',
    width: 120, 
    fontSize: 16, 
    color:'#FFFFFF', 
  }, 
  financialTipContainer: {
    paddingHorizontal: 10, 
    paddingTop: 35, 
  }, 
  financialTipText: { 
    fontFamily: 'Poppins-Regular', 
    fontSize: 14,
    marginBottom: 4, 
    width: 350, 
    marginTop: 20, 
    paddingHorizontal: 10, 
    lineHeight: 28, 
  }, 
});  