import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const CategoryRow = ({ categoryName, percentage, color }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <FontAwesomeIcon
            icon={faCircle}
            style={{ color: color, left: 29 }}
            size={15}
            />
            <Text style={styles.rowText}>
                {categoryName}: {percentage}%
            </Text>
      </View>
    ); 
}; 

const BudgetDesc = ({ categories, handleSubmit }) => {
    const router = useRouter(); 
  
    return (
        <View style={{ flexDirection: 'row',  }}>
            <View style={styles.roundedRect}>
                {categories.map((category) => (
                <CategoryRow 
                    key={category.categoryName} 
                    categoryName={category.categoryName} 
                    percentage={category.percentage} 
                    color={category.color}
                />
                ))}
            </View>

            <View style={{ top: 40, right: 45 }}>
                <TouchableOpacity onPress={() => {
                    handleSubmit();
                    router.push('./');
                }}>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    size={25}
                />
                </TouchableOpacity>
            </View>
        </View>
    );
};
  
  
const SampleBudget = ({ index, budgetType, categories, handleSubmit }) => {
    return (
        <View style={{ padding: 33 }}>
            <Text style={styles.budgetNumberText}>Sample Budget {index}</Text>
            <Text style={styles.budgetTypeText}>{budgetType}</Text>
            <BudgetDesc categories={categories} handleSubmit={handleSubmit}/>
        </View>
    );
};


const styles = StyleSheet.create({
    roundedRect: {
        width: 327,
        height: 180,
        backgroundColor: '#F3F6FA',
        borderRadius: 18,
        top: 25,
        paddingVertical: 18, 
        paddingBottom: 10, 
        justifyContent: 'space-between', 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5, 
    },
    rowText: { 
        fontFamily: 'Poppins-SemiBold', 
        color: '#2C2646',  
        fontSize: 17, 
        left: 70, 
        bottom: 5 
    },
    budgetNumberText: { 
        fontFamily: 'Poppins-SemiBold', 
        color: '#2C2646', 
        fontSize: 18 
    }, 
    budgetTypeText: { 
        fontFamily: 'Poppins-Regular',
        color: '#2C2646', 
        fontSize: 13,
        top: 10 
    }
})


export default SampleBudget; 