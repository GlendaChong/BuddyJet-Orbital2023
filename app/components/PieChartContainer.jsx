import { StyleSheet, View, Text, Image } from 'react-native';
import { useState, useEffect } from "react";
import { PieChart } from 'react-native-chart-kit';
  

// Assign each expenses category to a color
const getLegendColor = (index) => {
    const colors = ['#0A84FF', '#32D74B', '#FF453A', '#FF9F0A', '#FFD60A', '#64D2FF', '#BF5AF2'];
    return colors[index % colors.length];
};

// Pie Chart Component
const PieChartContainer = ({ monthlyExpensesList, monthlyExpensesSum }) => {
    const [mergedChartData, setMergedChartData] = useState([]);
    
    useEffect(() => {
        if (monthlyExpensesList.length === 0) {
            return;
        }

        try {
            // Merge chart data with the same category
            const mergedData = [];
            monthlyExpensesList.forEach((expense, index) => {
                const existingData = mergedData.find((data) => data.name === expense.category);
                if (existingData) {
                    existingData.amount += expense.amount;
                } else {
                    mergedData.push({
                        name: expense.category,
                        amount: expense.amount,
                        color: getLegendColor(index),
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 12,
                    });
                }
            });
            setMergedChartData(mergedData);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [monthlyExpensesList]);

    return (
        <View style={styles.pieChartContainer}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.totalExpensesText}>
                    Total Monthly Expenses: ${monthlyExpensesSum}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {monthlyExpensesSum === 0 ? (
                    <View style={styles.noExpensesContainer}>
                        <Image style={styles.image} source={require('../../assets/noPieChart.jpg')} />
                        <Text style={styles.noPieChartText}>No pie chart generated!</Text>
                        <Text style={styles.noExpensesText}>No expenses added for this month</Text>
                    </View>
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


const styles = StyleSheet.create({
    pieChartContainer: {
        backgroundColor: "#fff",
        paddingVertical: 10, 
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 30,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    totalExpensesText: { 
        fontSize: 20, 
        fontFamily: 'Poppins-Medium', 
        paddingVertical: 10, 
    }, 
    noExpensesContainer: {
        alignItems: 'center',
        width: 300, 
    },
    noPieChartText: {
        justifyContent: 'center', 
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'red', 
    },
    noExpensesText: {
        justifyContent: 'center', 
        fontFamily: 'Poppins-Medium',
        fontSize: 16, 
        paddingVertical: 5 
    }, 
    image: {
        width: 300,
        height: 200,
        resizeMode: 'contain'
    },
});

export default PieChartContainer; 