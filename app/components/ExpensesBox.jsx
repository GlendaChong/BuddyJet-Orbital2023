import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

const IndividualExpenseBox = ({ expense }) => {
  const router = useRouter();
  const expensesId = expense.id;

  const handleDeleteExpense = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { data, error } = await supabase
                .from("expenses")
                .delete()
                .eq("id", expense.id);

            } catch (error) {
              console.error("Error deleting expense:", error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditExpense = async () => {
    router.push({
      pathname: "../(home)/Expenses/ExpenseDetail",
      params: { expensesId },
    });
  }

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
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteExpense}>
            <FontAwesomeIcon
              icon={faTrash}
              size={15}
              color="red"
            />
          </TouchableOpacity>
          <View style={styles.rightIconContainer}>
            <Text style={styles.expenseAmount}>SGD {expense.amount}</Text>
            <TouchableOpacity onPress={handleEditExpense}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={15}
              />
            </TouchableOpacity>
          </View>
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
    justifyContent: "space-between"
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
    marginRight: 20,
  },
  deleteButton: {
    justifyContent: "flex-end"
  },
  rightIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default IndividualExpenseBox;