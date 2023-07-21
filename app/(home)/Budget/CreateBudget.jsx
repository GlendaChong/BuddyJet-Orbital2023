import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useState, } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from 'expo-router';
import TextFieldInput from "./TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";
import { supabase } from "../../../lib/supabase";
import { GetCurrentBudget } from "../../components/GetBackendData";
import SampleBudget from "../../components/SampleBudget";


function CreateBudget() {
  const [income, setIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const { selectedMonth, selectedYear, monthIndex } = useLocalSearchParams();
  const budgetStartDate = `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`;

  const updateData = async ({ categories }) => {
    // Obtain the user_id from the profile database 
    let { data: profiles } = await supabase
      .from('profiles')
      .select('id');

    const selectedID = profiles[0]?.id;

    setLoading(true);

    try {
      // Insert new budget into backend
      const updates = {
        income: income,
        user_id: selectedID,
        created_at: budgetStartDate,
      };

      await supabase.from('budget').insert([updates]);

      // Get the current budget of the month
      const budget = await GetCurrentBudget(selectedMonth, selectedYear);

      // Insert data into category table based on the categories array
      await Promise.all(
        categories.map(async (category) => {
          await supabase.from('categories').insert({
            created_at: budgetStartDate,
            user_id: selectedID,
            budget_id: budget.budget_id,
            category: category.categoryName,
            spending: parseInt(category.percentage) / 100,
            color: category.color,
          });
        })
      );

      console.log('Can insert budget');
      setLoading(false);

    } catch (error) {
      console.log('Error in inserting data');
    }
  }

  // Handle the submission for budget
  const handleSubmit = async (categories) => {
    if (income == '') {
      Alert.alert(
        "Missing Information",
        "Please remember to key in your fixed income",
        [
          {
            text: "Okay",
            style: "okay",
          },
        ]
      );
      return;
    }

    if (isNaN(parseInt(income))) {
      Alert.alert(
        "Invalid Information",
        "Please key in a valid fixed income",
        [
          {
            text: "Okay",
            style: "okay",
          },
        ]
      );
      return;
    }

    updateData(categories);
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <BackButton />
        <Text style={styles.createBudgetText}>Create A Budget</Text>
        <TextFieldInput label='Fixed Income' value={income} onChangeText={setIncome} />
        <SampleBudget
          index={1}
          budgetType="50/30/20 Budget Rule"
          categories={[
            { categoryName: 'Needs', percentage: '50', color: '#0A84FF' },
            { categoryName: 'Wants', percentage: '30', color: '#32D74B' },
            { categoryName: 'Savings', percentage: '20', color: '#F46040' },
          ]}
          handleSubmit={() => handleSubmit({
            categories: [
              { categoryName: 'Needs', percentage: '50', color: '#0A84FF' },
              { categoryName: 'Wants', percentage: '30', color: '#32D74B' },
              { categoryName: 'Savings', percentage: '20', color: '#F46040' },
            ],
          })}
        />
        <SampleBudget
          index={2}
          budgetType="70/20/10 Budget Rule"
          categories={[
            { categoryName: 'Expenses', percentage: '70', color: '#0A84FF' },
            { categoryName: 'Debt/Savings', percentage: '20', color: '#32D74B' },
            { categoryName: 'Wants', percentage: '10', color: '#F46040' },
          ]}
          handleSubmit={() => handleSubmit({
            categories: [
              { categoryName: 'Expenses', percentage: '70', color: '#0A84FF' },
              { categoryName: 'Debt/Savings', percentage: '20', color: '#32D74B' },
              { categoryName: 'Wants', percentage: '10', color: '#F46040' },
            ],
          })}
        />
        <SampleBudget
          index={3}
          budgetType="Specific Budget"
          categories={[
            { categoryName: 'Savings', percentage: '20', color: '#64D2FF' },
            { categoryName: 'Food', percentage: '25', color: '#BF5AF2' },
            { categoryName: 'Transportation', percentage: '15', color: '#0A84FF' },
            { categoryName: 'Bills', percentage: '10', color: '#32D74B' },
            { categoryName: 'Others', percentage: '30', color: '#F46040' },
          ]}
          handleSubmit={() => handleSubmit({
            categories: [
              { categoryName: 'Savings', percentage: '20', color: '#64D2FF' },
              { categoryName: 'Food', percentage: '25', color: '#BF5AF2' },
              { categoryName: 'Transportation', percentage: '15', color: '#0A84FF' },
              { categoryName: 'Bills', percentage: '10', color: '#32D74B' },
              { categoryName: 'Others', percentage: '30', color: '#F46040' },
            ],
          })}
        />
      </ScrollView>
      {loading && <ActivityIndicator />}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createBudgetText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 35,
    marginTop: 45,
    left: 30,
    alignContent: 'center',
    color: '#100D40',
  },
  DescriptionText: {
    position: 'absolute',
    fontFamily: 'Poppins-Regular',
    fontWeight: 600,
    fontSize: 17,
    lineHeight: 52,
    width: 289,
    marginTop: 85,
    left: 34,
    alignContent: 'center',
    color: '#100D40',
  },
  roundedRect: {
    width: 311,
    height: 260,
    backgroundColor: '#F3F6FA',
    borderRadius: 18,
    top: 20,
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  MakeBudgetButton: {
    backgroundColor: '#3D70FF',
    borderRadius: 40,
    width: 327,
    height: 56,
    left: 30,
    bottom: 130
  },
  MakeBudgetText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 35,
    textAlign: 'center',
  },
});

export default CreateBudget; 
