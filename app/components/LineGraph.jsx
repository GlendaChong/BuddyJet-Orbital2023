import { LineChart } from "react-native-gifted-charts";
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

const LineGraph = ({ lastYearMonths, pastYearMoneyIn, pastYearExpenses }) => {
	// Check if all values are zero
	if (lastYearMonths.length === 0 || pastYearMoneyIn.length === 0 || pastYearExpenses.length === 0) {
		// Page is stil generating bar chart
		return (
			<View style={styles.chartContainer}>
				<View style={styles.noDataContainer}>
					<Image style={styles.image} source={require('../../assets/noBarChart.jpg')} />
					<Text style={styles.noDataText}>Generating line graph...</Text>
				</View>
			</View>
		);
	} else if (pastYearExpenses.every((sum) => sum === 0) && pastYearMoneyIn.every((sum) => sum === 0)) {
		// No data for the past 6 months
		return (
			<View style={styles.chartContainer}>
				<View style={styles.noDataContainer}>
					<Image style={styles.image} source={require('../../assets/noBarChart.jpg')} />
					<Text style={styles.noBarChartText}>No line graph generated!</Text>
					<Text style={styles.noDataText}>No expenses and income added for the past year</Text>
				</View>
			</View>
		);
	}

	const moneyInLine = [];
	const expensesLine = [];

	for (let index = 0; index < lastYearMonths.length; index++) {
		const month = lastYearMonths[index].substring(0, 3); // Extract first 3 characters of the label
		const moneyInSum = pastYearMoneyIn[index];
		const expensesSum = pastYearExpenses[index];

		const moneyInData = {
			value: moneyInSum,
			dataPointText: moneyInSum.toString(),
			label: month,
		};

		const expensesData = {
			value: expensesSum,
			dataPointText: expensesSum.toString(),
			label: month
		};

		moneyInLine.push(moneyInData);
		expensesLine.push(expensesData);
	}

	return (
		<View style={styles.chartContainer}>
			<Legend />
			<View testID="line-graph">
				<LineChart
					data={moneyInLine}
					data2={expensesLine}
					spacing={40}
					color1="#32D74B"
					color2="#FF453A"
					dataPointsHeight={6}
					dataPointsWidth={6}
					noOfSections={4}
					thickness={2.5}
					textShiftX={-8}
					textShiftY={-1}
					width={270}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	chartContainer: {
		backgroundColor: '#fff',
		paddingTop: 20,
		paddingHorizontal: 10,
		paddingBottom: 30,
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

export default LineGraph; 