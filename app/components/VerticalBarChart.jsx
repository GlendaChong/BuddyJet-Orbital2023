import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, View, Text, Image } from 'react-native';

const Legend = () => {
	return (
		<View style={styles.legendContainer}>
			<View style={styles.moneyInLegendItem}>
				<View style={styles.moneyInColor} />
				<Text style={styles.legendText}>Money In</Text>
        	</View>
			<View style={styles.moneyOutLegendItem}>
				<View style={styles.moneyOutColor} />
				<Text style={styles.legendText}>Money Out</Text>
			</View>
      	</View>
	);
};
  

const VerticalBarChart = ({ lastSixMonths, sixMonthsMoneyInSum, sixMonthsExpensesSum }) => {

    // Check if all values are zero
    if (lastSixMonths.length === 0 || sixMonthsExpensesSum.length === 0 || sixMonthsMoneyInSum.length === 0 ) {
		// Page is stil generating bar chart
		return (
			<View style={styles.chartContainer}>
				<View style={styles.noDataContainer}>
					<Image style={styles.image} source={require('../../assets/noBarChart.jpg')} />
					<Text style={styles.noDataText}>Generating bar chart...</Text>
				</View>
			</View>
		); 	
    } else if (sixMonthsExpensesSum.every((sum) => sum === 0) && sixMonthsMoneyInSum.every((sum) => sum === 0)) {
		// No data for the past 6 months
        return (
			<View style={styles.chartContainer}>
				<View style={styles.noDataContainer}>
					<Image style={styles.image} source={require('../../assets/noBarChart.jpg')} />
					<Text style={styles.noBarChartText}>No bar chart generated!</Text>
					<Text style={styles.noDataText}>No expenses and income added for the last 6 months</Text>
				</View>
			</View>
		);
	}
    

  const data = [];

  for (let index = 0; index < lastSixMonths.length; index++) {
    const month = lastSixMonths[index].substring(0, 3); // Extract first 3 characters of the label
    const moneyInSum = sixMonthsMoneyInSum[index];
    const expensesSum = sixMonthsExpensesSum[index];

    const moneyInData = {
      value: moneyInSum,
      label: month,
      spacing: 2,
      labelWidth: 30, 
      frontColor: '#32D74B',
    };

    const expensesData = {
      value: expensesSum,
      frontColor: '#FF453A',
    };

    data.push(moneyInData, expensesData);
  }

  return (
    <View style={styles.chartContainer}>
        <Legend />
        <BarChart
            data={data}
            barWidth={12}
            spacing={20}
            roundedTop
            roundedBottom
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={4}
        />
    </View>

  );
};

const styles = StyleSheet.create({
	chartContainer: {
		backgroundColor: '#fff',
		paddingVertical: 20, 
		paddingHorizontal: 10, 
		marginTop: 10,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 30,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 3, 
	},

	legendContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	moneyInLegendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 20,
	},
	moneyOutLegendItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	moneyInColor: {
		height: 12,
		width: 12,
		borderRadius: 6,
		backgroundColor: '#32D74B',
		marginRight: 5,
	},
	legendText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
	},
	moneyOutColor: {
		height: 12,
		width: 12,
		borderRadius: 6,
		backgroundColor: '#FF453A',
		marginRight: 5,
	},
	image: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		alignSelf: 'center',
	},
	noDataContainer: {
		alignItems: 'center',
		alignSelf: 'center', 
		width: 300, 
	},
	noBarChartText: {
		justifyContent: 'center', 
		fontFamily: 'Poppins-SemiBold',
		fontSize: 18,
		color: 'red', 
	},
	noDataText: {
		textAlign: 'center',
		fontSize: 16,
		paddingTop: 5,
		fontFamily: 'Poppins-Medium',
	},
	image: {
		width: 300,
		height: 200,
		resizeMode: 'contain'
	},
});

export default VerticalBarChart;
