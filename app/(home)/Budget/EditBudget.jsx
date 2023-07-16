import { Text, View, TextInput, StyleSheet, Button, KeyboardAvoidingView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../../lib/supabase";
import { useState, useEffect } from 'react';
import { GetCategoryDetails, GetCurrentBudget, GetSideHustles } from "../../components/GetBackendData";
import { useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import BackButton from "../../components/BackButton";

function EditBudget() {

  const [budgetId, setBudgetId] = useState(0); 
  const [userId, setUserId] = useState(''); 
  const [category, setCategory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [oldIncome, setOldIncome] = useState(0);
  const [sideHustles, setSideHustles] = useState([]);
  const [sideHustlesChanged, setSideHustlesChanged] = useState(false); // State variable to track changes in side hustles
  const { selectedMonth, selectedYear } = useLocalSearchParams(); 

  // Fetch backend data 
  const fetchBudgetData = async () => {
    const budget = await GetCurrentBudget(selectedMonth, selectedYear);
    setUserId(budget.user_id); 
    setBudgetId(budget.budget_id); 
    setOldIncome(budget.income);
  }

  const fetchCategoryDetail = async () => {
    const categories = await GetCategoryDetails(selectedMonth, selectedYear);
    setCategory(categories); 
  };

  // Fetch the side hustles from Supabase
  const fetchSideHustles = async () => {
    const sideHustles = await GetSideHustles(selectedMonth, selectedYear); 
    setSideHustles(sideHustles); 
  };

  useEffect(() => {
    fetchBudgetData(); 
  }, []);

  useEffect(() => {
    fetchCategoryDetail();
  }, [budgetId]); 

  useEffect(() => {
    fetchSideHustles();
  }, [sideHustlesChanged]);


  // Income component 
  const Income = () => {
    const [newIncome, setNewIncome] = useState(0);

    // Update income in backend
    const updateIncome = async () => {
      try {
        await supabase
          .from('budget')
          .update({ income: newIncome, in_use: true })
          .eq('budget_id', budgetId)
          .eq('user_id', userId)
          .gte('created_at', `${selectedYear}-${selectedMonth}-01`)
          .lte('created_at', `${selectedYear}-${selectedMonth}-31`);

        console.log('Income updated successfully');
      } catch (error) {
        console.error('Error updating income:', error.message);
      }
    };

    const handleEdit = () => {
      setEditing(true);
    };

    const handleSave = () => {
      setOldIncome(newIncome); 
      updateIncome();
      setEditing(false);
    };
 
    if (editing) {
      return (
        <View style={styles.container}>
          <View style={styles.editIncomeContainer}>
            <Text style={styles.labelText}>New Income:</Text>
            <TextInput
              value={newIncome.toString()}
              onChangeText={setNewIncome}
              keyboardType="numeric"
              style={styles.input}
              autoFocus
            />
            <Text style={{ marginTop: -30, left: 70 }} onPress={handleSave}>Save</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.displayIncomeContainer}>
          <Text style={{ color: '#2C2646', fontFamily: 'Poppins-Medium', fontWeight: '600', fontSize: 18, lineHeight: 20, textAlign: 'center' }}>Fixed Income:</Text>
          <Text style={{ color: '#2C2646', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 24, lineHeight: 26, textAlign: 'center', marginTop: 15 }}>${oldIncome}</Text>
        </View>
        <Text onPress={handleEdit} style={styles.editText}>Edit</Text>
      </View>
    );
  };


  // Update category in backend
  const updateCategory = async (updatedCategories) => {
    try {
      await Promise.all(
        updatedCategories.map((category) =>
          supabase
            .from('categories')
            .update({ category: category.category, spending: category.spending })
            .eq('budget_id', budgetId)
            .eq('user_id', userId)
            .eq('category_id', category.category_id)
            .eq('in_use', true)
            .gte('created_at', `${selectedYear}-${selectedMonth}-01`)
            .lte('created_at', `${selectedYear}-${selectedMonth}-31`)
        )
      );
      console.log('Categories updated successfully');
      
    } catch (error) {
      console.error('Error updating categories:', error.message);
    }
  };

  
  // Category box component 
  const SpendingBox = () => {
    const [percentages, setPercentages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Initialize the percentages array with default values based on the category data
    useEffect(() => {
      const initialPercentages = category.map((item) => ({
        ...item, 
        spending: parseInt(item.spending * 100),
      }));
      setPercentages(initialPercentages);
    }, []);

    // Update the percentage value for a specific category
    const handlePercentageChange = (category, value) => {
      const updatedPercentages = percentages.map((item) =>
        (item.category == category) ? { ...item, spending: value } : item
      );
      setPercentages(updatedPercentages);
    };

    const handleSave = async () => {
      // Calculate the total sum of percentages
      const totalPercentage = percentages.reduce((sum, item) => sum + parseFloat(item.spending || 0), 0);

      // Perform the validation
      if (totalPercentage != 100) {
        setErrorMessage('Percentage sum is not equal to 100.');
        return;
      }

      const updatedCategories = category.map((item, index) => ({
        ...item,
        category: percentages[index]?.category || item.category,
        spending: parseInt(percentages[index]?.spending) / 100 || item.spending,
      }));

      setCategory(updatedCategories); 
      setErrorMessage('');
      updateCategory(updatedCategories);       
    };

    return (
      <View style={{ marginTop: 30, flex: 1, paddingHorizontal: 30 }}>
        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, marginBottom: 15 }}> Categories:</Text>
        <View style={styles.categoryOuterContainer}>
          {category.map((item, index) => (
            <View key={index} style={styles.categoryInnerContainer}>
              <View style={{ width: 10, height: 10, borderRadius: 10, marginRight: 20, backgroundColor: item.color }} />
              <Text style={styles.categoryText}>{item.category}</Text>
              <TextInput
                value={percentages.find((p) => p.category == item.category)?.spending.toString()}
                onChangeText={(value) => handlePercentageChange(item.category, value)}
                keyboardType="numeric"
                style={styles.percentageText}
              />
              <Text style={styles.percentageText}>%</Text>
            </View>
          ))}
        </View>
        <Text
          onPress={handleSave}
          style={styles.saveText}
        >
          Save
        </Text>
        {errorMessage !='' && <Text style={{ color: 'red', width: 250, top: -20 }}>{errorMessage}</Text>}
      </View>
    );
  };


  // Money in component 
  const MoneyIn = () => {
    const [newSideHustle, setNewSideHustle] = useState('');
    const [newSideHustleAmount, setNewSideHustleAmount] = useState('');

    // Add money in into backend
    const addSideHustle = async () => {
      try {
        await supabase
          .from('moneyIn')
          .insert([{ 
            created_at: `${selectedYear}-${selectedMonth}-01`, 
            user_id: userId, 
            name: newSideHustle, 
            amount: newSideHustleAmount 
          }]); 
        

      } catch (error) {
        console.error('Error adding side hustle:', error.message);

      } finally {
        fetchSideHustles(); 
        setNewSideHustle(''); 
        setNewSideHustleAmount(''); 
      }
    };

    // Delete money in from backend
    const handleDeleteSideHustle = (moneyInId) => {
      return async () => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this money in?",
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
                  const { data } = await supabase
                    .from("moneyIn")
                    .delete()
                    .eq("id", moneyInId);

                  setSideHustlesChanged(!sideHustlesChanged); // Toggle sideHustlesChanged state to trigger re-render

    
                } catch (error) {
                  console.error("Error deleting expense:", error.message);
                }
              },
            },
          ]
        );
      };
    };

    return (
      <View style={styles.moneyInOuterContainer}>
        <Text style={styles.moneyInText}>Money In:</Text>
        <View style={styles.moneyInInnerContainer}>
          {sideHustles.map((sideHustle) => (
            <View key={sideHustle.name} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={styles.sideHustleNameText}>{sideHustle.name}</Text>
              <Text style={styles.sideHustleAmountText}>${sideHustle.amount}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSideHustle(sideHustle.id)}>
                <FontAwesomeIcon
                    icon={faTrash}
                    size={15}
                    color="red"
                />
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              value={newSideHustle}
              onChangeText={setNewSideHustle}
              placeholder="Money in"
              style={styles.sideHustleNameText}
            />
            <TextInput
              value={newSideHustleAmount}
              onChangeText={setNewSideHustleAmount}
              placeholder="Amount"
              style={styles.sideHustleAmountText}
            />
          </View>
          <View style={{ marginTop: 30 }}>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#8E8E93', opacity: 0.7, paddingHorizontal: 5  }} />
            <Button title="Add" onPress={addSideHustle} />
          </View>
        </View>
      </View>
    );
  };


  // Main overall page
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: 'white' }}>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })} // Adjust this value as per your requirement
      >
        <ScrollView>
          <BackButton />
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 35, marginTop: 40, marginHorizontal: 30 }}>Edit</Text>
          <Income />
          <SpendingBox />
          <MoneyIn />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 30,
    
  },
  displayIncomeContainer: {
   backgroundColor: "#F3F6FA", 
   borderRadius: 20, 
   width: 280, 
   height: 90, 
   justifyContent: 'center', 
   alignItems: 'center', 
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.4,
   shadowRadius: 5, 
  }, 
  editIncomeContainer: {
    backgroundColor: '#F3F6FA',
    borderRadius: 20,
    width: 280,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5, 
  }, 
  labelText: {
    color: '#2C2646',
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: -8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2646',
    borderRadius: 5,
    width: 200,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  editText: {
    bottom: 42, 
    left: 100, 
    fontFamily: 'Poppins-Regular', 
  }, 
  categoryOuterContainer: {
    backgroundColor: '#F3F6FA',
    borderRadius: 18,
    paddingTop: 20,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5, 
  }, 
  categoryInnerContainer: { 
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 15, 
    justifyContent: 'space-between',  
    paddingHorizontal: 30
  }, 
  categoryColor: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 20 
  }, 
  categoryText: {
    fontFamily: 'Poppins-SemiBold', 
    width: 120, 
    color: '#2C2646', 
    fontSize: 16, 
  }, 
  percentageText: {
    fontFamily: 'Poppins-Medium', 
    width: 30, 
    color: '#2C2646', 
    fontSize: 16, 
  }, 
  saveText: { 
    fontFamily: 'Poppins-Medium', 
    fontSize: 15, 
    color: '#2C2646', 
    marginTop: 10, 
    textAlign: 'right', 
    right: 10
  }, 
  moneyInText: { 
    fontFamily: 'Poppins-Medium', 
    fontSize: 18, 
    marginBottom: 8, 
    left: 5 
  }, 
  moneyInOuterContainer: { 
    marginTop: 30,
    paddingHorizontal: 30, 
    alignContent: 'center', 
    paddingBottom: 20, 
  }, 
  moneyInInnerContainer: { 
    backgroundColor: '#F3F6FA', 
    borderRadius: 18, 
    paddingHorizontal: 30, 
    paddingTop: 20, 
    marginTop: 10, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5, 
  }, 
  sideHustleNameText: { 
    fontFamily: 'Poppins-Medium',
    fontSize: 17, 
  }, 
  sideHustleAmountText: {
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 18,
    marginLeft: 'auto', 
    right: 30
  }, 
  deleteButton: {
    justifyContent: 'center'
  }
});


export default EditBudget; 