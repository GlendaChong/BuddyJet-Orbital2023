import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image, Text } from 'react-native';
import { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { PieChart, BarChart } from 'react-native-chart-kit';
import { ScreenWidth } from "react-native-elements/dist/helpers";

function Dashboard() {
    const [userId, setUserId] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [Income, setIncome] = useState(0)
    const [moneyIn, setMoneyin] = useState(0)

    const refreshes = () => {
        fetchUserId();
        fetchExpenses();
        fetchIncome();
        fetchMoneyIn();
    }

    const fetchUserId = async () => {
        try {
            let { data: profiles } = await supabase
                .from('profiles')
                .select('id');

            const UserID = profiles[0]?.id;
            setUserId(UserID);
        } catch (error) {
            console.error('Error fetching userId', error);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const fetchExpenses = async () => {
        try {
            let { data: expenses } = await supabase
                .from('expenses')
                .select('description, amount, category');

            console.log(expenses);

            const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            setTotalExpenses(total);
            setExpenses(expenses);
        } catch (error) {
            console.error('Error fetching expenses data', error);
        }
    };

    const fetchIncome = async () => {
        try {
            let { data: budget } = await supabase
                .from('budget')
                .select('income')
                .eq('in_use', true);

            const income = budget[0]?.income
            setIncome(income);

        } catch (error) {
            console.error('Error fetching income data', error);
        }


    };

    const fetchMoneyIn = async () => {
        try {
            let { data: moneyIn } = await supabase
                .from('moneyIn')
                .select('name, amount');

            console.log('money in', moneyIn);

            const totalIn = parseInt(moneyIn.reduce((sum, item) => sum + item.amount, 0));
            const total = totalIn + parseInt(Income)
            console.log("income", Income);
            setMoneyin(total);
            console.log("total money in", total);
        } catch (error) {
            console.error('Error fetching money in data', error);
        }
    };

    useEffect(() => {
        fetchIncome();
        fetchExpenses();
    }, []);


    useEffect(() => {
        fetchMoneyIn();
    }, [Income]);



    const getLegendColor = (index) => {
        const colors = ['#0A84FF', '#32D74B', '#FF453A', '#FF9F0A', '#FFD60A', '#64D2FF', '#BF5AF2'];
        return colors[index % colors.length];
    };

    const chartData = expenses.map((expense, index) => ({
        name: expense.category,
        amount: expense.amount,
        color: getLegendColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    //Pie chart code 
    const ExpensesChart = () => {
        // Merge chart data with the same category
        const mergedChartData = [];
        chartData.forEach((data) => {
            const existingData = mergedChartData.find((item) => item.name === data.name);
            if (existingData) {
                existingData.amount += data.amount;
            } else {
                mergedChartData.push(data);
            }
        });

        return (
            <View style={{ marginTop: 20 }}>
                <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Poppins-Medium', marginTop: 20, marginBottom: 20 }}>
                        Total Expenses: ${totalExpenses}
                    </Text>
                </View>
                <View style={{ alignItems: 'center', right: 50 }}>
                    <PieChart
                        data={mergedChartData}

                        width={500}
                        height={210}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                        }}
                        accessor="amount"
                        backgroundColor="white"
                        paddingLeft="50"
                        style={{ borderRadius: 18 }}
                        center={[40, 0]}
                    />
                </View>
            </View>
        );
    };

    //Bar chart code
    const BarCharts = () => {
        console.log("money in final   ", moneyIn);
        console.log("money out  final  ", totalExpenses);

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
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, left: 30 }}>Money Flow:</Text>
                <View style={{ alignItems: 'center', marginTop: 5 }}>
                    <BarChart
                        data={{
                            labels: ['Money In', 'Money Out'],
                            datasets: [
                                {
                                    data: [moneyIn, totalExpenses],
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA" }}>
            <ScrollView
                refreshControl={
                    <RefreshControl onRefresh={refreshes} />
                }>
                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 35, marginLeft: 40, marginTop: 20, }}>Dashboard</Text>
                <ExpensesChart />
                <BarCharts />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    legendContainer: {
        marginTop: 20,
        maxHeight: 60,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    },
});



export default Dashboard; 