import { Text, StyleSheet,  View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { React } from "react";
import IndividualExpenseBox from "../../components/ExpensesBox";

function SortExpensesByCategories({ expenses }) {

    const groupExpensesByCategories = (expenses) => {
        const groupedCategories = {};

        if (!expenses) {
            return groupedCategories;
        }
        
        for (const expense of expenses) {
            const category = expense.category; 
            if (groupedCategories[category]) {
                groupedCategories[category].push(expense);
            } else {
                groupedCategories[category] = [expense];
            }
        }
        return groupedCategories;
    };

    const renderExpenseSection = ({ item }) => {
        const { sectionCategory, sectionExpenses } = item;

        return (
            <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>
                {sectionCategory}
            </Text>
            {sectionExpenses.map((expense) => (
                <IndividualExpenseBox key={expense.id} expense={expense} />
            ))}
            </View>
        );
    };

    const groupedCategories = groupExpensesByCategories(expenses);
    const expenseSections = Object.keys(groupedCategories).map((category) => ({
    sectionCategory: category,
    sectionExpenses: groupedCategories[category],
    }));

    return (
        <FlatList
            data={expenseSections}
            renderItem={renderExpenseSection}
            keyExtractor={(item) => item.sectionCategory}
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


export default SortExpensesByCategories; 
