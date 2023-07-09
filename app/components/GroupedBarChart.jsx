// import { View, Text } from "react-native"; 
// import { BarChart } from "react-native-chart-kit";

// const GroupedBarChart = ({ sixMonthsMoneyIn, sixMonthsMoneyOut }) => {
//     // Set the chart configuration
//     const chartConfig = {
//       backgroundColor: '#fff',
//       backgroundGradientFrom: '#fff',
//       backgroundGradientTo: '#fff',
//       decimalPlaces: 2,
//       color: (opacity = 100) => `rgba(44, 38, 70, ${opacity})`,
//       style: {
//         borderRadius: 16,
//       },
//       barPercentage: 0.6,
//       categoryPercentage: 0.6,
//     };
  
//     // Set the data for the grouped bar chart
//     const data = {
//       labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
//       datasets: [
//         {
//           data: sixMonthsMoneyIn,
//           color: (opacity = 100) => `rgba(54, 162, 235, ${opacity})`,
//           label: 'Money In',
//         },
//         {
//           data: sixMonthsMoneyOut,
//           color: (opacity = 100) => `rgba(255, 99, 132, ${opacity})`,
//           label: 'Money Out',
//         },
//       ],
//     };
  
//     return (
//       <View style={{ marginTop: 30 }}>
//         <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, marginLeft: 30 }}>Money Flow</Text>
//         <View style={{ alignItems: 'center', marginTop: 5 }}>
//           <BarChart
//             data={data}
//             width={340}
//             height={200}
//             chartConfig={chartConfig}
//             style={{
//               marginVertical: 8,
//               borderRadius: 16,
//             }}
//             fromZero={true}
//           />
//         </View>
//       </View>
//     );
//   };
  
//   export default GroupedBarChart;
  