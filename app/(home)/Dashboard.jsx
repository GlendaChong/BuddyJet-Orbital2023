import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image, Text } from 'react-native';
import { useState, useEffect, useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { PieChart, BarChart } from 'react-native-chart-kit';
import { GetCurrentFixedIncome, GetMoneyIn, GetMonthlyExpensesSortedByDate } from "./GetBackendData"; 
import MonthYearPicker from "../components/MonthYearPicker";

function Dashboard() {
    const [monthlyExpensesList, setMonthlyExpensesList] = useState([]); 
    const [monthlyExpensesSum, setMonthlyExpensesSum] = useState(0);
    const [fixedIncome, setFixedIncome] = useState(0); 
    const [moneyIn, setMoneyin] = useState(0); 

    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
    // Fetch monthly expenses from backend
    const fetchData = useCallback(async () => {
        
        const expenses = await GetMonthlyExpensesSortedByDate(selectedMonth, selectedYear); 
        const expensesSum = expenses.reduce((sum, expense) => sum + expense.amount, 0); 

        const currentFixedIncome = await GetCurrentFixedIncome(selectedMonth, selectedYear);
        const moneyIn = await GetMoneyIn(currentFixedIncome); 
  
        setMonthlyExpensesList(expenses); 
        setMonthlyExpensesSum(expensesSum);         
        setFixedIncome(currentFixedIncome); 
        setMoneyin(moneyIn); 
        
    }, [selectedYear, selectedMonth, monthlyExpensesList, fixedIncome, moneyIn]); 

    useEffect(() => {
        fetchData();
      }, [fetchData]);


    // Generate expenses pie chart
    const getLegendColor = (index) => {
        const colors = ['#0A84FF', '#32D74B', '#FF453A', '#FF9F0A', '#FFD60A', '#64D2FF', '#BF5AF2'];
        return colors[index % colors.length];
    };

    const chartData = monthlyExpensesList.map((expense, index) => ({
        name: expense.category,
        amount: expense.amount,
        color: getLegendColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    const ExpensesPieChart = () => {
        const [mergedChartData, setMergedChartData] = useState([]);
        const [loading, setLoading] = useState(true);
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              // Merge chart data with the same category
              const mergedData = [];
              chartData.forEach((data) => {
                const existingData = mergedData.find((item) => item.name === data.name);
                if (existingData) {
                  existingData.amount += data.amount;
                } else {
                  mergedData.push(data);
                }
              });
              setMergedChartData(mergedData);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching expenses:', error);
              setLoading(false);
            }
          };
      
          fetchData();
        }, [selectedMonth, selectedYear]);
      
        return (
          <View style={styles.pieChartContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontFamily: 'Poppins-Medium', marginTop: 20, marginBottom: 20 }}>
                Total Expenses: ${monthlyExpensesSum}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent:'flex-end' }}>
              {loading ? (
                <Text>Loading...</Text>
              ) : monthlyExpensesSum === 0 ? (
                <Text>No expenses for this month!</Text>
              ) : (
                <PieChart
                    data={mergedChartData}
                    width={350}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                        propsForLabels: {
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 100,  
                        },
                        
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                />
              )}
            </View>
          </View>
        );
      };
 

    //Bar chart code
    const BarCharts = () => {
        const chartConfig = {
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 100) => `rgba(44, 38, 70, ${opacity})`,
            style: {
                borderRadius: 16,
            },
            barPercentage: 0.6,
            categoryPercentage: 0.6,
        };

        return (
            <View style={{ marginTop: 30 }}>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, left: 30 }}>Money Flow</Text>
                <View style={{ alignItems: 'center', marginTop: 5 }}>
                    <BarChart
                        data={{
                            labels: ['Money In', 'Money Out'],
                            datasets: [
                                {
                                    data: [moneyIn, monthlyExpensesSum],
                                },
                            ],
                        }}
                        width={340}
                        height={200}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        fromZero={true}
                    />
                </View>
            </View>
        );
    };

    const handleDateSelect = (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <View style={styles.topContainer}>
                <MonthYearPicker onSelect={handleDateSelect}/>
                <Text style={styles.headerText}>Dashboard</Text>
            </ View>
            <ScrollView>
                <ExpensesPieChart />
                <BarCharts />
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
        textAlign:"center", 
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