import { Text, StyleSheet,  View } from "react-native";
import { React } from "react"; 
import { FlatList } from "react-native-gesture-handler";
import IndividualExpenseBox from "../../components/ExpensesBox";

function SortExpensesByDate({ expenses }) {

    const groupExpensesByDate = (expenses) => {
        const groupedExpenses = {};

        if (!expenses) {
          return groupedExpenses;
        }
      
        for (const expense of expenses) {
            const expenseDate = new Date(expense.date);
            const formattedDate = expenseDate.toLocaleDateString("en-GB");
            if (groupedExpenses[formattedDate]) {
            // Exists an expenses with the same date, so the group is already created
            groupedExpenses[formattedDate].push(expense);
            } else {
            groupedExpenses[formattedDate] = [expense];
            }
        }
        return groupedExpenses;
    };

    const renderExpenseSection = ({ item }) => {
        const currentDate = new Date().toDateString();
        const { sectionDate, sectionExpenses } = item;

        return (
            <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>
                {sectionDate === currentDate
                ? "Today"
                : sectionDate === new Date().setDate(new Date().getDate() - 1)
                ? "Yesterday"
                : sectionDate}
            </Text>
            {sectionExpenses.map((expense) => (
                <IndividualExpenseBox key={expense.id} expense={expense} />
            ))}
            </View>
        );
    };

    const groupedExpenses = groupExpensesByDate(expenses);
    const expenseSections = Object.keys(groupedExpenses).map((date) => ({
      sectionDate: date,
      sectionExpenses: groupedExpenses[date],
    }));

    
    return (
        <FlatList
        data={expenseSections}
        renderItem={renderExpenseSection}
        keyExtractor={(item) => item.sectionDate}
      />
    ); 
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      fontSize: 18,
      marginBottom: 10,
      color: '#100D40', 
      fontFamily: 'Poppins-SemiBold',
    },
  }); 


export default SortExpensesByDate; 
