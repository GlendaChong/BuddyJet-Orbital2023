import { View, Text, StyleSheet } from "react-native";

const IndividualExpenseBox = ({ expense }) => {
  return (
    <View style={styles.expenseBox}>
      <View style={styles.rowDirectionBox}>
        <View style={styles.leftColumnBox}>
          <Text key={expense.id} style={styles.expenseDescription}>
            {expense.description}
          </Text>
          <Text style={styles.expenseCategory}>{expense.category}</Text>
        </View>
        <View style={styles.rightColumnBox}>
          <Text style={styles.expenseAmount}>SGD {expense.amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseBox: {
    backgroundColor: "#EEF5FF",
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5, 
  },
  rowDirectionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  leftColumnBox: {
    flexDirection: "column",
    marginRight: 16,
  },
  rightColumnBox: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: 'center'
  },
  expenseDescription: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});

export default IndividualExpenseBox;